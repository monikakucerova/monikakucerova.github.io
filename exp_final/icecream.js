var custom_css = `
<style>
  .no-border-button {
    border: none;
    background: none;
    padding: 0px;
    }
    .highlighted {
      background-color: yellow;
  }
</style>
`;

document.head.insertAdjacentHTML('beforeend', custom_css);

var experimentStartTime = new Date().toISOString();
var formattedStartTime = experimentStartTime.replace(/:/g, '-').replace(/\..+/, ''); // Replace colons and remove milliseconds


// Initialize jsPsych
var jsPsych = initJsPsych({
  on_finish: function() {

    var experimentEndTime = new Date().toISOString();
    jsPsych.data.addProperties({
      experiment_start_time: experimentStartTime,
      experiment_end_time: experimentEndTime
    });

    // Get participant_id and seq
    var participant_id = jsPsych.data.get().values()[0].participant_id; // get ppt id
    var participant_seq = seq.find(s => s.id === participant_id); // get id's seq
    
    // Create the filename
    var filename = `${participant_id}_${participant_seq.progress}_${formattedStartTime}.csv`; // results file will be saved with id and progress (videos watched) in the filename

    // Save the data as CSV
    jsPsych.data.get().localSave('csv', filename);

    // Display the results in a textarea
    var allData = jsPsych.data.get().csv();
    var csvDisplay = '<textarea rows="20" cols="80">' + allData + '</textarea>';
    jsPsych.endExperiment(csvDisplay);

  }
});

// helper function: is number even?
function isEven(number) {
  return number % 2 === 0;
}

// FULLSCREEN TRIAL
var fullscreen_trial = {
  type: jsPsychFullscreen,
  fullscreen_mode: true,
  post_trial_gap: 500
};

var password_trial = {
  type: jsPsychSurvey,
  pages: [[
    {
      type: 'text',
      prompt: "Zadejte heslo:", 
      name: "pass" ,
      required: true}
  ]],
  on_finish: function(data) {
    console.log(data.response); // Log to confirm the structure
    var responses = data.response; // Access the first page's response
    var password = responses.pass; // Access the first question's response on the page
    if (password == "prvniVideo") {
      jsPsych.data.addProperties({ progress: 0 });
      console.log('Progress set to 0');
    } else if (password == "druheVideo") {
      jsPsych.data.addProperties({ progress: 1 });
      console.log('Progress set to 1');
    } else if (password == "tretiVideo") {
      jsPsych.data.addProperties({ progress: 2 });
      console.log('Progress set to 2');
    } else if (password == "posledniTrenovaci") {
      jsPsych.data.addProperties({ progress: 3 });
      console.log('Progress set to 3');
    } else if (password == "testovaci") {
      jsPsych.data.addProperties({ progress: 4 });
      console.log('Progress set to 4');
    }
    
    else {
      alert("Nespravne heslo. Zkuste to znovu.");
      jsPsych.endExperiment("Heslo nebylo spravne. Obnovte stranku a zkuste zadat heslo znovu."); // Ends the experiment if the password is wrong
    }
  }
};

// GET ID SURVEY TRIAL
var get_id = {
  type: jsPsychSurvey,
  post_trial_gap: 500, // reqired, when not positive, exp doesnt work
  
  pages: [
    [
      {
        type: 'text',
        prompt: "Zadejte ID a pote kliknete na tlacitko `Finish`. Sve ID naleznete v instrukcich z e-mailu.",
        name: 'ID',
        required: true,
      }
    ]
  ],
  on_finish: function(data) {
    var responses = data.response;
    var participant_id = parseInt(responses.ID, 10); // parse response as int to get ID
    jsPsych.data.addProperties({
      participant_id: participant_id,
      device: navigator.userAgent
    });

    // get seq, cond, progress, first_speaker and second_speaker based on input ID
    var participant_seq = seq.find(s => s.id === participant_id);
    var cond = participant_seq ? participant_seq.cond : null;
    //var progress = participant_seq ? participant_seq.progress : null;
    var progress = jsPsych.data.get().values()[0].progress; 
    var first_speaker = participant_seq ? participant_seq.first_speaker : null;
    var second_speaker = participant_seq ? participant_seq.second_speaker : null;
    
    // reassign first_speaker and second_speaker: for prog = 1 and 3, they switch. for prog = 0 and 2, they are as given in seq
    if (!isEven(progress)) {
        first_speaker = participant_seq.second_speaker, 
        second_speaker = participant_seq.first_speaker
      }
    
    // get progress index from sequence
    var seq_str = participant_seq.seq;
    var seq_parts = seq_str.split('_');
    var extracted_seq = seq_parts[progress];

    
    console.log("cond:", cond);
    console.log("progress:", progress);
    console.log("first_speaker:", first_speaker);
    console.log("vid:", extracted_seq);
    

    // reassign cond to "test" if seq is mouse
    if (extracted_seq == "mouse") {
      cond = "test";
    }

    // assign first_speaker and second_speaker based on ID
      // even ID = s5 first, odd = s6 first
    if (extracted_seq == "mouse" ) {
      if (isEven(participant_id)) {
        first_speaker = "s5";
        second_speaker = "s6"
      } else if (!isEven(participant_id)) {
        first_speaker = "s6";
        second_speaker = "s5"
      }
    }

    // only include those observation images that are marked with the "vid" value that agrees with the current seq index
    // filter out empty img values, those would throw errors
    var matching_obs = vid_obs.filter(v => v.vid === extracted_seq && v.img !== "");

    // make a trial for each image
    var obs_trials = [];
    matching_obs.forEach(v => {
      var trials = obs_trial_screen(v.img, first_speaker, second_speaker);
      obs_trials.push(...trials);
    });

    // repeat trial for each word four times
    var replicated_obs_trials = [];
    obs_trials.forEach(trial => {
      for (var i = 0; i < 4; i++) {
        replicated_obs_trials.push(trial);
      }
    });

    // filter vid_obs, use all rows with the given vid
    var matching_vid_obs = vid_obs.filter(v => v.vid === extracted_seq);

    // make vid trials in the vid_obs-matching time intervals
    var vid_trials = matching_vid_obs.map(v => video_obs_trial(v.tStart, v.tEnd, extracted_seq, cond, first_speaker, second_speaker));

    // build interleaved trials
    var interleaved_trials = [];
    var obs_index = 0;
    var vid_index = 0;

    while (obs_index < obs_trials.length || vid_index < vid_trials.length) {
      if (vid_index < vid_trials.length) {
        interleaved_trials.push(vid_trials[vid_index]);
        vid_index++;
      } 
      
      // push four imgs between vid intervals
      if (obs_index < obs_trials.length) {
        for (var i = 0; i < 4; i++) {
          interleaved_trials.push(obs_trials[obs_index]);
          obs_index++;
        }
      }
    }

    // filter soundSel: use only those pairs that are in the current vid
    var relevant_sound_sels = soundSel.filter(sel => sel.vid === extracted_seq);

    // Organize the soundSel trials
    var organizedSoundSel = organizeSoundSelTrials(relevant_sound_sels, extracted_seq, seq_parts, progress);

    // filter soundsel according to progress
    var sound_selection_trials = organizedSoundSel.map(sel => make_sound_selection_trial(sel, first_speaker, second_speaker, progress, cond));

    // construct initial timeline
    var full_timeline = [
      get_id,
      arrow,
      ...interleaved_trials,
      //...sound_selection_trials,
    ];

    // datasaving trial for sending to OSF
    const save_data = {
      type: jsPsychPipe,
      action: "save",
      experiment_id: "xWwrvLoBIDyL",
      filename: () => {
        var participant_id = jsPsych.data.get().values()[0].participant_id; // Ensure this is accessible
        var participant_seq = seq.find(s => s.id === participant_id); // Ensure seq is accessible
        return `${participant_id}_${participant_seq.progress}.csv`;
      },
      data_string: () => jsPsych.data.get().csv()
    };

    var speaker = null;

    // boundary trials happen after the fourth and fifth vid
    if (progress == 3 || progress == 4) {
      
      // boundary trials always use berry sounds
      var sound_category = "berry";

      // cond uni1, always get s4 as boundary 
      if ((first_speaker === 's3' && second_speaker === 's4') || (first_speaker === 's4' && second_speaker === 's3')) {
        speaker = 's4';

      // cond uni2 get s1 as boundary if their ID is odd, s2 if even  
    } else if (cond == 'uni2') {
      if (isEven(participant_id)) {
        speaker = "s2"
      } else if (!isEven(participant_id)) {
        speaker = "s1"
      }
      // bi children get the two category one that they heard in previous videos
    } else if (first_speaker === 's1' || second_speaker === 's1') {
        speaker = 's1';
    } else if (first_speaker === 's2' || second_speaker === 's2') {
        speaker = 's2';
    } else {
      speaker = 's5'
    }
      
    // shuffle array of 2*2 unique endpoints for randomized presentation at boundary familiarization
    var familiarisation_sounds = jsPsych.randomization.shuffle([51, 1, 51, 1]);

    // create boundary familiarisation timeline by mapping the four sounds onto the createBoundaryFam function
    var familiarisation_timeline = familiarisation_sounds.map(function(sound) {
      return createBoundaryFam(sound, cond, first_speaker, second_speaker, sound_category, speaker);
    });

    // create boundary test timeline
    var test_timeline = [];
      for (var i = 0; i < max_trials; i++) {
        test_timeline.push(createBoundaryTrial(cond, first_speaker, second_speaker, sound_category));
      }

      // concatenate familiarization timeline with test timeline, add both to full timeline.
      full_timeline = full_timeline.concat(familiarisation_timeline).concat(test_timeline);
    }

    // add datasaving trial to timeline
    full_timeline.push(save_data);

    // run timeline
    jsPsych.run(full_timeline);
  }
};

// hooray trial to signal end of experiment when aborted
var hooray_trial = {
  type: jsPsychImageButtonResponse,
  stimulus: 'img/hooray.png', 
  choices: ['Show results'],
  button_html: '<button class="jspsych-btn">%choice%</button>',
  prompt: '<p></p>',
};

// arrow trial after ID to allow child to start experiment
var arrow = {
  type: jsPsychHtmlButtonResponse,
  stimulus: "\u2003", // whitespace
  choices: ['<img src="img/arrow.png" alt="arrow" style="width:200px; height:200px;">'],
};

// Define relative size of screen where vid is shown so that vid fits on all devices
var containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100vw',
  height: '100vh',
  position: 'relative'
};

///////////////////////////////////////////////////////////////////////////////////////
// MAKE IMAGE OBSERVATION TRIAL                                                      //
// MAKE IMAGE OBSERVATION TRIAL                                                      //
// MAKE IMAGE OBSERVATION TRIAL                                                      //
///////////////////////////////////////////////////////////////////////////////////////
function obs_trial_screen(word, first_speaker, second_speaker) {
  // console.log("obs_trial_screen called with word:", word);
  
  var img_filename = "img/" + word + ".png";

  // four images get shown, the word is produced twice by each speaker
  var audio_files = [
    "snd/words/" + word + "_" + first_speaker + ".wav",
    "snd/words/" + word + "2_" + first_speaker + ".wav",
    "snd/words/" + word + "_" + second_speaker + ".wav",
    "snd/words/" + word + "2_" + second_speaker + ".wav"
  ];

  // shuffle audio files for random order
  var shuffled_audio_files = jsPsych.randomization.shuffle(audio_files);

  var trials = [];

  // define corner positions using vw and vh units for responsive positioning of imgs
  var corner_positions = [
    { top: '2vh', left: '2vw' },     // upper-left corner
    { top: '2vh', right: '2vw' },    // upper-right corner
    { bottom: '2vh', left: '2vw' },  // lower-left corner
    { bottom: '2vh', right: '2vw' }  // lower-right corner
  ];

  // shuffle positions so that images show up at random corner of screen
  var shuffled_positions = jsPsych.randomization.shuffle(corner_positions);

  // construct four observation img trials
  for (let i = 0; i < 4; i++) { 
    
    var snd_filename = shuffled_audio_files[i];
    console.log(snd_filename);
    
    trials.push({
      type: jsPsychAudioButtonResponse,
      stimulus: snd_filename,
      choices: [img_filename],
      button_html: function() {
        var position = shuffled_positions.pop();
        var style = `position: absolute; display: inline-block; width: 250px;`;

        // Dynamically add positioning (top, left, bottom, right) based on corner position
        if (position.top) style += ` top: ${position.top};`;
        if (position.bottom) style += ` bottom: ${position.bottom};`;
        if (position.left) style += ` left: ${position.left};`;
        if (position.right) style += ` right: ${position.right};`;

        var buttonHtml = `<div id="prompt-container" style="${style}">`;
        buttonHtml += `<img id="target-img" src="${img_filename}" width="250px;">`;

        // Show tap prompt only when i == 0 (first image)
        if (i === 0) {
          buttonHtml += `<img id="prompt-img" src="img/tap.png" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 200px; animation: circle 5s linear infinite;">`;
        }

        buttonHtml += '</div>';
        return buttonHtml;
      },

      // after 15 seconds of inaction, move to next iteration
      trial_duration: 15000,
      post_trial_gap: 500,
      data: { block: "img_obs" },
      response_allowed_while_playing: false,

      // Ensure the tap timeout only applies when i == 0
      on_start: function() {
        if (i === 0) {  
          setTimeout(function() {
            var promptImg = document.getElementById('prompt-img');
            if (promptImg) {
              promptImg.style.display = 'none';
            }
          }, 1000); // set tap img timeout to 1 s
        }
      },
      on_finish: function(data) {
        data.reaction_time = data.rt; // Store reaction time
      }
    });
  }

  return trials;
}

///////////////////////////////////////////////////////////////////////////////////////
// MAKE VIDEO OBSERVATION TRIAL                                                      //
// MAKE VIDEO OBSERVATION TRIAL                                                      //
// MAKE VIDEO OBSERVATION TRIAL                                                      //
///////////////////////////////////////////////////////////////////////////////////////

function video_obs_trial(tStart, tEnd, vid, cond, first_speaker, second_speaker) {
  var video_filename = "vid/" + vid +"_" + cond + "_" + first_speaker + "_" + second_speaker + ".mp4"
  
  return {
    type: jsPsychVideoButtonResponse,
    stimulus: [video_filename],
    choices: [],
    trial_ends_after_video: true,
    start: tStart,
    stop: tEnd,
    css_classes: ['responsive-video'],  // Apply custom CSS class
    data: { block: "vid_obs", video_filename: video_filename },
    on_finish: function(data) {
      data.reaction_time = data.rt; // Store reaction time
    },
    on_load: function() {
      
      // Add an event listener to stop the video when "k" is pressed
      document.addEventListener('keydown', function(event) {
        var videoElement = document.querySelector('video');
        if (videoElement) {
          switch (event.key) {
            case 'k':
            case 'K':
              if (!videoElement.paused) {
                videoElement.pause(); // Pause the video
              } else {
                videoElement.play(); // Resume the video if paused
              }
              break;

            case 'j':
            case 'J':
              videoElement.currentTime = Math.max(0, videoElement.currentTime - 10); // Move 10 seconds back
              break;

            case 'l':
            case 'L':
              videoElement.currentTime = Math.min(videoElement.duration, videoElement.currentTime + 10); // Move 10 seconds forward
              break;
          }
        }
      });
    }
  };
}

// Function to check if a prereq value meets the requirement for showing soundsel pairs from pevious vids
function prereqMet(prereq, seq_parts, progress) {
  if (!prereq) return true; // for no-prereq pairs requirement is always met
  const prereqParts = prereq.split('_'); // if there is more than one prereq

  // Check each part of the prereq
  for (let part of prereqParts) {
    const prereqIndex = seq_parts.indexOf(part);
    if (prereqIndex === -1 || prereqIndex >= progress) {
      return false; // Prereq not met
    }
  }
  return true; // All prereqs met
}

// Function to organize the sound selection trials
function organizeSoundSelTrials(soundSels, extracted_seq, seq_parts, progress) {

  // Filter soundSel pairs based on prereq
  let filteredSoundSels = soundSels.filter(sel => {
    return prereqMet(sel.prereq, seq_parts, progress);
  });

  // Find and extract the fam trial
  let famTrialIndex = filteredSoundSels.findIndex(sel => sel.status === 'fam' && sel.vid === extracted_seq);
  let famTrial = null;
  if (famTrialIndex !== -1) {
    famTrial = filteredSoundSels.splice(famTrialIndex, 1)[0]; // Remove fam trial from array
  }

  /*
  // Shuffle trials
  filteredSoundSels = jsPsych.randomization.shuffle(filteredSoundSels);
  console.log("filtered sound sels", filteredSoundSels)

  // Place the fam trial at the beginning 
  if (famTrial) {
    filteredSoundSels.unshift(famTrial);
  }

  */

  let reordered = false;
  while (!reordered) {
    // console.log("in while loop")
    filteredSoundSels = jsPsych.randomization.shuffle(filteredSoundSels);
    reordered = true;

    for (let i = 0; i < filteredSoundSels.length - 1; i++) {
      const [partA1, partA2] = filteredSoundSels[i].pair.split("-");
      const [partB1, partB2] = filteredSoundSels[i + 1].pair.split("-");
      // console.log(partA1, partA2, partB1, partB2)

      // Check if consecutive pairs have any matching parts
      if (partA1 === partB1 || partA1 === partB2 || partA2 === partB1 || partA2 === partB2) {
        reordered = false;

        // Try to find a non-conflicting item further down to swap with
        for (let j = i + 2; j < filteredSoundSels.length; j++) {
          const [partC1, partC2] = filteredSoundSels[j].pair.split("-");

          // Check if swapping avoids conflicts
          if (partA1 !== partC1 && partA1 !== partC2 && partA2 !== partC1 && partA2 !== partC2) {
            [filteredSoundSels[i + 1], filteredSoundSels[j]] = [filteredSoundSels[j], filteredSoundSels[i + 1]];
            reordered = true;
            break;
          }
        }

        // If no valid swap was found, reshuffle and try again
        if (!reordered) break;
      }
    }
  }

  // Place the fam trial at the beginning 
  if (famTrial) {
    filteredSoundSels.unshift(famTrial);
  }

  return filteredSoundSels;
}

// Initialize the last selected carrier globally to keep track of it across trials
let lastSelectedCarrier = null;
let carrierPool = []; // This will hold the shuffled carriers

// select random carrier for soundsel pair item
function selectRandomCarrierPhrase(word, status, progress) {

  if (status == "mp" && progress > 1) { // for mps, use only carriers usable with any word

    var carriersByIndefArt = {
      pl: [ "the_word_is", "i_m_going_to_say"],
      y: [ "the_word_is", "i_m_going_to_say"],
      y_an: [ "the_word_is", "i_m_going_to_say"],
      n: [ "the_word_is", "i_m_going_to_say"]
    };

  } else {
 
    // Define carrier phrase groups based on the value of indefArt
    var carriersByIndefArt = {
      pl: ["i_bet_those_are", "im_guessing_those_are", "those_might_be"],
      y: ["i_bet_thats_a", "i_m_going_to_say", "im_guessing_its_a", "that_might_be_a", "the_word_is"],
      y_an: ["i_bet_thats_an", "im_guessing_its_an", "that_might_be_an"],
      n: ["i_bet_thats", "im_guessing_its", "the_word_is", "i_m_going_to_say"]
    };
  }

  // Find entry in the arts array that matches the word
  var artEntry = arts.find(art => art.word === word);

  // If artEntry exists, select carriers based on `indefArt`, otherwise return a default set
  let carriers = artEntry ? carriersByIndefArt[artEntry.indefArt] : carriersByIndefArt['n'];

  // Always reset carrierPool to contain only the relevant carriers
  carrierPool = shuffleArray([...carriers]);

  // Select the last carrier from the shuffled pool
  const selectedCarrier = carrierPool.pop();

  // Store the selected carrier in lastSelectedCarrier if needed
  lastSelectedCarrier = selectedCarrier;

  // Return the selected carrier phrase
  return selectedCarrier;
}

// Helper function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}

let lastPlayedSound = null; // Track the last played sound
let clickData = []; // Array to store click data

///////////////////////////////////////////////////////////////////////////////////////
// SOUND SELECTION TRIAL                                                      //
// SOUND SELECTION TRIAL                                                      //
// SOUND SELECTION TRIAL                                                      //
///////////////////////////////////////////////////////////////////////////////////////

function make_sound_selection_trial(soundSel, first_speaker, second_speaker, progress, cond) {
  
  // on each trial assign acc1 and acc2 with 50% probability as first_speaker or second_speaker
  var acc1 = Math.random() < 0.5 ? first_speaker : second_speaker;

  var acc2 = acc1 == second_speaker ? first_speaker : second_speaker;

  // split value from soundsel to get the two words
  var pair = soundSel.pair.split('-');
  
  var target_img;
  var target_base_name;

  // if the status of the pair is mp, choose randomly (50%) the image
  // if the status is not mp, make the image the first element (minimal pair word)
  if (soundSel.status === "mp") {
    target_base_name = Math.random() < 0.5 ? pair[0] : pair[1];
    // target_img = "img/" + target_base_name + ".png";
  } else {
    target_base_name = pair[0];
    // target_img = "img/" + target_base_name + ".png";
  }

  // if this is the last training video and the condition is bi,
  // find out the 2cat speaker and 1cat speaker
  if (progress === 3 && cond === "bi") {
    if (first_speaker === "s1" || first_speaker === "s2") {
      var speaker_2cat = first_speaker
    } else if (first_speaker === "s3" || first_speaker === "s4"){
      var speaker_1cat = first_speaker
    }
  }
  if (progress === 3 && cond === "bi") {
    if (second_speaker === "s1" || second_speaker === "s2") {
      var speaker_2cat = second_speaker
    } else if (second_speaker === "s3" || second_speaker === "s4"){
      var speaker_1cat = second_speaker
    }
  }

  // if heard is empty, last two training videos and conds is bi and the pair is mp
  // decide randomly (50%) between these two options of accent combos
  if (soundSel.heard === "" && progress > 1 && cond === "bi" && soundSel.status("mp")) {

      Math.random() < 0.5 ? 
      // Assign sounds for "heard = 100" case for barry
      [
      acc1 = pair[0] === "barry" ? speaker_2cat : speaker_1cat, // Tamsin for Barry, Gen for BerryIce
      acc2 = pair[1] === "barry" ? speaker_2cat : speaker_1cat, // Gen for BerryIce, Tamsin for Barry
      ]
      :
      [
      acc1 = pair[0] === "barry" ? speaker_1cat : speaker_2cat, // Gen for Barry, Tamsin for BerryIce
      acc2 = pair[1] === "barry" ? speaker_1cat : speaker_2cat, // Gen for Barry, Tamsin for BerryIce
      ]
  }

  // Implement the "heard" logic for sound selection based on `heard`
  // i.e. at test
  if (soundSel.heard === 100) {
    console.log("heard 100 triggered")
    
    if (pair.includes("barry")) {
      target_base_name = "berryIce";

      // Assign sounds for "heard = 100" case for barry
      acc1 = pair[0] === "barry" ? "s5" : "s6"; // Tamsin for Barry, Gen for BerryIce
      acc2 = pair[1] === "barry" ? "s5" : "s6"; // Gen for BerryIce, Tamsin for Barry
    } else if (pair.includes("brad")) {
      target_base_name = "bread";

      // Assign sounds for "heard = 100" case for brad
      acc1 = pair[0] === "brad" ? "s5" : "s6"; // [braed] from Tamsin, [bred] from Gen
      acc2 = pair[1] === "brad" ? "s5" : "s6"; // [bred] from Gen, [braed] from Tamsin
    }
  } else if (soundSel.heard === 50) { // Testing if they remember voice
    console.log("heard 50 triggered")
    
    if (pair.includes("barry")) {
      target_base_name = "barry"; // tady potrebuju barry aby to nebylo actual 50

      // Assign reversed sounds for "heard = 50" case for barry
      acc1 = pair[0] === "barry" ? "s6" : "s5"; // Gen for Barry, Tamsin for BerryIce
      acc2 = pair[1] === "barry" ? "s6" : "s5"; // Gen for Barry, Tamsin for BerryIce
    } else if (pair.includes("brad")) {
      target_base_name = "brad";

      // Assign reversed sounds for "heard = 50" case for brad
      acc1 = pair[0] === "brad" ? "s6" : "s5"; // [bred] from Gen, [bred] from Tamsin
      acc2 = pair[1] === "brad" ? "s6" : "s5"; // [bred] from Gen, [bred] from Tamsin
    }
  }

  target_img = "img/" + target_base_name + ".png";

  var carrierPhrase1, carrierPhrase2;
  var sound_file_1, sound_file_2;

  function updateSoundFiles() {
    // Select new carrier phrases
    carrierPhrase1 = selectRandomCarrierPhrase(pair[0], soundSel.status, progress);
    carrierPhrase2 = selectRandomCarrierPhrase(pair[1], soundSel.status, progress); 

    // Randomly decide whether to use basic sound or sound with carrier phrase
    const useCarrier1 = Math.random() < 0.5;
    const useCarrier2 = Math.random() < 0.5;

    // carrier2 vs carrier and word2 vs word are both chosen with 50% probability
      sound_file_1 = useCarrier1 
      ? "snd/output_carrierPlusWord/" + carrierPhrase1 + "_" + pair[0] + (Math.random() < 0.5 ? "2" : "") + "_" + acc1 + ".wav"
      : "snd/words/" + pair[0] + (Math.random() < 0.5 ? "2" : "") + "_" + acc1 + ".wav";
    
      sound_file_2 = useCarrier2 
      ? "snd/output_carrierPlusWord/" + carrierPhrase2 + "_" + pair[1] + (Math.random() < 0.5 ? "2" : "") + "_" + acc2 + ".wav"
      : "snd/words/" + pair[1] + (Math.random() < 0.5 ? "2" : "") + "_" + acc2 + ".wav";

    // Ensure that the sound without carrier does not repeat
    if (!useCarrier1 && sound_file_1 === lastPlayedSound) {
      // Swap to a carrier version if the basic sound would repeat
      "snd/output_carrierPlusWord/" + carrierPhrase1 + "_" + pair[0] + (Math.random() < 0.5 ? "2" : "") + "_" + acc1 + ".wav";
    }
    if (!useCarrier2 && sound_file_2 === lastPlayedSound) {
      // Swap to a carrier version if the basic sound would repeat
      sound_file_2 = "snd/output_carrierPlusWord/" + carrierPhrase2 + "_" + pair[1] + (Math.random() < 0.5 ? "2" : "") + "_" + acc2 + ".wav";
    }
  }

  updateSoundFiles();  // Initial sound file update

  var word_sound_file_1 = "snd/words/" + pair[0] + (Math.random() < 0.5 ? "2": "") + "_" + acc1 + ".wav"; // bare word for the feedback
  var word_sound_file_2 = "snd/words/" + pair[1] + (Math.random() < 0.5 ? "2": "") + "_" + acc2 + ".wav"; // bare word for the feedback

  var correct_sound = (target_base_name === pair[0]) ? word_sound_file_1 : word_sound_file_2; // decide which bare word to play at feedback based on comparison

  // set button imgs
  var meg1_img = "img/meg1.png";
  var meg2_img = "img/meg2.png";
  var megGreen_img = "img/megGreen.png";
  var arrow_img = "img/arrow.png";

  // var lastPlayedSound = null;

  // Randomize button positions
  var rand_order_sound = Math.random() < 0.5;

  // define feedback trial
  var feedback_trial = function(correct) {
    var feedback_img = correct ? "img/tick.png" : "img/cross.png"; // feedback imgs
    var feedback_sound;
    if (correct) {
      var positive_feedback_sounds = ["feedback/well", "feedback/great", "feedback/perfect"];
      feedback_sound = "snd/" + positive_feedback_sounds[Math.floor(Math.random() * positive_feedback_sounds.length)] + (Math.random() <0.5 ? "2" : "") + "_" + ((target_base_name === pair[0]) ? acc1 : acc2)  + ".wav";
    } else {
      var negative_feedback_sounds = ["feedback/no", "feedback/not"];
      feedback_sound = "snd/" + negative_feedback_sounds[Math.floor(Math.random() * negative_feedback_sounds.length)] + (Math.random() <0.5 ? "2" : "") + "_" + ((target_base_name === pair[0]) ? acc1 : acc2)  + ".wav";
    }

    return {
      type: jsPsychHtmlButtonResponse,
      stimulus: '<img src="' + target_img + '" width="250px">' + 
                '<img src="' + feedback_img + '" width="180px" style="position: absolute; top: 10%; right: 10%;">',
      choices: [
        '<img src="' + megGreen_img + '" width="100px" ;">',
        '<img src="' + arrow_img + '" width="100px" style="position: absolute; bottom: 10%; right: 10%;">'
      ],
      button_html: '<button class="jspsych-btn no-border-button">%choice%</button>',
      post_trial_gap: 500,
      data: { block: "sndSel_feedback", img: target_base_name, correct: correct },
      
      on_load: function() { 
        // name buttons
        var buttons = document.querySelectorAll('.jspsych-btn');
        var soundButton = buttons[0]; // the firt button in the feedback is always the sound one
        var arrowButton = buttons[1]; // second button always arrow

        // hide arrow initially
        arrowButton.style.visibility = 'hidden';

        // play correct sound at sound button click
        soundButton.addEventListener('click', function(event) {
          event.stopPropagation();
          var audio = new Audio(correct_sound);
          audio.play();
          arrowButton.style.visibility = 'visible';
        });

        // finish trial at arrow button click
        arrowButton.addEventListener('click', function(event) {
          event.stopPropagation();
          jsPsych.finishTrial(); // End trial on arrow button click
        });
      },

      trial_duration: null, // Duration is determined by user interaction

      on_start: function() {
        var audio = new Audio(feedback_sound); //feedback sound plays at feedback trial onset
        audio.play();
        setTimeout(function() {
          var feedbackImage = document.querySelector('img[style*="top: 10%; right: 10%;"]');
          if (feedbackImage) {
            feedbackImage.style.display = 'none';
          }
        }, 1000); // feedback image is visible for 1 s
      },

      on_finish: function(data) {
        data.reaction_time = data.rt; // save rt
        data.feedback_sound = feedback_sound; // save feedback sound
      }
    };
  };

  var firstButtonImage = Math.random() < 0.5 ? meg1_img : meg2_img;
  var secondButtonImage = firstButtonImage === meg1_img ? meg2_img : meg1_img;

  var playedSounds = [];

  // sound selection trial
  return {
    timeline: [
      {
        type: jsPsychHtmlButtonResponse,
        stimulus: '<img src="' + target_img + '" width="250px">',
        choices: [
              '<img src="' + firstButtonImage + '" width="100px">',
              '<img src="' + secondButtonImage + '" width="100px">',
              '<img src="' + arrow_img + '" width="100px" style="position: absolute; bottom: 10%; right: 10%;">'
        ],
        
        button_html: '<button class="jspsych-btn no-border-button">%choice%</button>',
        post_trial_gap: 500,
        data: { block: "sndSel", 
          img: target_base_name, 
          pair: pair, 
          sound_files: [sound_file_1, sound_file_2],
          // playedSounds: playedSounds 
        }, // snd files get saved incl. carriers
        
        on_load: function() {
          var buttons = document.querySelectorAll('.jspsych-btn');
          var arrowButton = buttons[2]; // Arrow button
          var soundPlayed = false;

          var sound1Clicked = false;
          var sound2Clicked = false;

          arrowButton.style.visibility = 'hidden';
          // arrowButton.disabled = true; // Disable arrow button initially

          if (rand_order_sound) {
            buttons[0].addEventListener('click', function(event) {
              event.stopPropagation();
              updateSoundFiles(); // Select new carrier phrases and update sound files
              var audio = new Audio(sound_file_1);
              audio.play();
              lastPlayedSound = sound_file_1;
              clickData.push({
                sound_file: sound_file_1,
                timestamp: Date.now()
              });

              playedSounds.push({ sound_file: sound_file_1, timestamp: Date.now() });

              sound1Clicked = true;

              soundPlayed = true;
              
              if (sound1Clicked && sound2Clicked) {
                arrowButton.disabled = false;
                arrowButton.style.visibility = 'visible';
              }

              console.log('Played Sound:', sound_file_1);
              buttons[0].style.backgroundColor = 'yellow';
              buttons[1].style.backgroundColor = '';
            });

            buttons[1].addEventListener('click', function(event) {
              event.stopPropagation();
              updateSoundFiles(); // Select new carrier phrases and update sound files
              var audio = new Audio(sound_file_2);
              audio.play();

              playedSounds.push({ sound_file: sound_file_2, timestamp: Date.now() });
            
              lastPlayedSound = sound_file_2;
              clickData.push({
                sound_file: sound_file_2,
                timestamp: Date.now()
              });
              soundPlayed = true;

              sound2Clicked = true; 

              if (sound1Clicked && sound2Clicked) {
                arrowButton.disabled = false;
                arrowButton.style.visibility = 'visible';
              }

              console.log('Played Sound:', sound_file_2);
              buttons[0].style.backgroundColor = '';
              buttons[1].style.backgroundColor = 'yellow';
            });
          } else {
            buttons[0].addEventListener('click', function(event) {
              event.stopPropagation();
              updateSoundFiles(); // Select new carrier phrases and update sound files
              var audio = new Audio(sound_file_2);
              audio.play();

              playedSounds.push({ sound_file: sound_file_2, timestamp: Date.now() });
            
              lastPlayedSound = sound_file_2;
              clickData.push({
                sound_file: sound_file_2,
                timestamp: Date.now()
              });

              sound2Clicked = true; 

              soundPlayed = true;
              // arrowButton.disabled = false;
              // arrowButton.style.visibility = 'visible';

              console.log('Played Sound:', sound_file_2);
              buttons[0].style.backgroundColor = 'yellow';
              buttons[1].style.backgroundColor = '';

              if (sound1Clicked && sound2Clicked) {
                arrowButton.disabled = false;
                arrowButton.style.visibility = 'visible';
              }
            });

            buttons[1].addEventListener('click', function(event) {
              event.stopPropagation();
              updateSoundFiles(); // Select new carrier phrases and update sound files
              var audio = new Audio(sound_file_1);
              audio.play();

              playedSounds.push({ sound_file: sound_file_1, timestamp: Date.now() });
              
              lastPlayedSound = sound_file_1;
              clickData.push({
                sound_file: sound_file_1,
                timestamp: Date.now()
              });

              sound1Clicked = true; 

              soundPlayed = true;
              // arrowButton.disabled = false;
              // arrowButton.style.visibility = 'visible';

              if (sound1Clicked && sound2Clicked) {
                arrowButton.disabled = false;
                arrowButton.style.visibility = 'visible';
              }

              console.log('Played Sound:', sound_file_1);
              buttons[0].style.backgroundColor = '';
              buttons[1].style.backgroundColor = 'yellow';
            });
          }

          // Ensure the arrow button is initially disabled
          arrowButton.disabled = true;
          arrowButton.style.visibility = 'hidden';
        },

        on_finish: function(data) {

          data.played_sounds = playedSounds;
          playedSounds = [];

          var file_name = lastPlayedSound.split('/').pop(); // This will get the 'carrierPhrase_word_acc.wav'

          // Split by underscores and extract the word (second-to-last element)
          var split_name = file_name.split('_');
          var played_sound_base = split_name[split_name.length - 2]; // Get the second-to-last element
  
          if (played_sound_base.endsWith("2")) {
            // Remove the last character "2"
            played_sound_base = played_sound_base.slice(0, -1);
        }

          var correct = played_sound_base === target_base_name;
          
          // Determine which side (left or right) the clicked image was on
          var clicked_side = null;
          if (rand_order_sound) {
            clicked_side = (lastPlayedSound === sound_file_1) ? "left" : "right";
          } else {
            clicked_side = (lastPlayedSound === sound_file_2) ? "left" : "right";
          }

          data.selected_sound = lastPlayedSound; // Store the last played sound in the trial data
          data.correct = correct;
          data.reaction_time = data.rt; // Store reaction time
          data.clicked_side = clicked_side; // Store the side (left or right) of the clicked image
          // data.all_played_sounds = clickData;  // Add all played sounds to the trial data // not sure i need this
  
          console.log('Correct:', correct);

          clickData = []; 
        }
      },
      {
        timeline: [feedback_trial(true)],
        conditional_function: function() {
          var last_trial_data = jsPsych.data.get().last(1).values()[0];
          return last_trial_data.correct;
        }
      },
      {
        timeline: [feedback_trial(false)],
        conditional_function: function() {
          var last_trial_data = jsPsych.data.get().last(1).values()[0];
          return !last_trial_data.correct;
        }
      }
    ]
  };
}

/******************************************************************************************** */
// boundary familiarisation
// boundary familiarisation
// boundary familiarisation
/******************************************************************************************** */

var berry_on_left = Math.random() < 0.5;
var currentColorIndex = 0; // Persistent color index

// Define an array of colors
var colors = ["#ffdfba", "#ffffba", "#bae1ff", "#ffd4e5", "#eecbff", "#feffa3", "	#dbdcff", "#f2d7fb", "#d4fffc"];

function changeBackgroundColor() {
  document.body.style.backgroundColor = colors[currentColorIndex];
  currentColorIndex = (currentColorIndex + 1) % colors.length;
}

function createBoundaryFam(sound, cond, first_speaker, second_speaker, sound_category, speaker) {
  // var speaker = "s1"
  var { speaker } = find_boundary_speaker(cond,first_speaker, second_speaker);
  var sound_directory = sound_category + "/" + speaker + "/continuum_sounds";

  var berry_image = "img/" + sound_category + "Hen.png";
  var barry_image = "img/barry.png";
  
  var meg_image = "img/meg.png";
  var arrow_image = "img/arrow.png";
  var sound_file = "snd/" + sound_directory + "/continuum_step_" + (sound < 10 ? 0 : "") + sound + ".wav";

  // Create button choices based on randomization
  choices = berry_on_left
  ? [
    '<img src="' + berry_image + '" id="berry-button" width="150px" style="border: 2px solid black; position: absolute; right: 20%;">',
    '<img src="' + barry_image + '" id="barry-button" width="150px" style="border: 2px solid black; position: absolute; left: 20%;">',
    '<img src="' + arrow_image + '" id="arrow-button" width="100px" style="border:none; position: absolute; bottom: 10%; right: 10%;">'
  ]
: [
    '<img src="' + barry_image + '" id="barry-button" width="150px" style="border: 2px solid black; position: absolute; right: 20%;">',
    '<img src="' + berry_image + '" id="berry-button" width="150px" style="border: 2px solid black; position: absolute; left: 20%;">',
    '<img src="' + arrow_image + '" id="arrow-button" width="100px" style="border:none; position: absolute; bottom: 10%; right: 10%;">'
  ];
      return {
        timeline: [
          {
            type: jsPsychHtmlButtonResponse,
            stimulus: '<img src="' + meg_image + '" id="play-sound" width="100px" style="border: 2px solid black; padding: 10px;">',
        choices: choices,
        button_html: '<button class="jspsych-btn no-border-button" style="border:none; padding:0; background:none;">%choice%</button>', // Removing any borders and padding
        data: { sound: sound_file,
          speaker: speaker
         },
         
            on_start: function() {
              changeBackgroundColor();
            },
    
            on_load: function() {
              trial_start_time = performance.now(); // Capture the time when the trial starts

              var buttons = document.querySelectorAll('.jspsych-btn');
              var arrowButton = buttons[2]; // Selecting the arrow button
              buttons[2].disabled = true; // Disable the arrow button initially
              var playSoundButton = document.getElementById('play-sound');
              var berryButton = document.getElementById('berry-button');
              var barryButton = document.getElementById('barry-button');
              var pictureButtons = [berryButton, barryButton];
              var audio = new Audio(sound_file);
              audio.play();
    
              pictureButtons.forEach(button => {
                button.disabled = true;
              });
    
              playSoundButton.addEventListener('click', function() {
                audio.play();
                pictureButtons.forEach(button => {
                  button.disabled = false;
                });
                playSoundButton.style.backgroundColor = '#FFFFE0'; // Light yellow
                setTimeout(function() {
                    playSoundButton.style.backgroundColor = ''; // Reset to original background color
                }, 500); // 300 milliseconds
                
              });
    
              berryButton.addEventListener('click', function(event) {
                event.stopPropagation();
                berryButton.style.backgroundColor = 'yellow';
                barryButton.style.backgroundColor = '';
                arrowButton.disabled = false; // Enable the arrow button when a berry is clicked
                berryButton.dataset.clicked = true;
                barryButton.dataset.clicked = false;
                recordReactionTime();
              });
    
              barryButton.addEventListener('click', function(event) {
                event.stopPropagation();
                barryButton.style.backgroundColor = 'yellow';
                berryButton.style.backgroundColor = '';
                arrowButton.disabled = false; // Enable the arrow button when barry is clicked
                barryButton.dataset.clicked = true;
                berryButton.dataset.clicked = false;
                recordReactionTime();
              });
    
              arrowButton.addEventListener('click', function(event) {
                event.stopPropagation();
                jsPsych.finishTrial();
                recordReactionTime();
              });
            },
            on_finish: function(data) {
              var berryButton = document.getElementById('berry-button');
              var barryButton = document.getElementById('barry-button');
              var selected_button = null;
              var choice_position = null;

              data.speaker = speaker;
    
              if (berryButton.dataset.clicked === "true") {
                selected_button = 'berry-button';
                choice_position = berry_on_left ? 'left' : 'right'; // Track whether the berry was clicked on the left or right
              } else if (barryButton.dataset.clicked === "true") {
                selected_button = 'barry-button';
                choice_position = berry_on_left ? 'right' : 'left'; // Track whether the barry was clicked on the left or right
              }
    
              var correct = null;
              if ((sound === 51 && selected_button === 'berry-button') || (sound === 1 && selected_button === 'barry-button')) {
                correct = true;
              } else if ((sound === 51 && selected_button === 'barry-button') || (sound === 1 && selected_button === 'berry-button')) {
                correct = false;
              } else {
                correct = null;
              }
    
              data.correct = correct;
              data.choice = selected_button;
              data.choice_position = choice_position; // Store whether the choice was on the left or right
              data.sound = sound;
              data.reaction_time = data.rt; // Store reaction time
            }
          },
          {
            type: jsPsychHtmlButtonResponse,
            stimulus: function() {
              var last_trial_data = jsPsych.data.get().last(1).values()[0];
              if (last_trial_data.correct === null) {
                return ''; // Return an empty string for a blank screen
              }
              var feedback_img = last_trial_data.correct ? "img/tick.png" : "img/cross.png";
              return '<img src="' + feedback_img + '" width="100px" style="border:none;">';
            },
            choices: [],
            trial_duration: function() {
              var last_trial_data = jsPsych.data.get().last(1).values()[0];
              if (last_trial_data.correct === null) {
                return 500; // Duration for the blank screen
              }
              return 1500; // Duration for the feedback image
            },
            on_start: function() {
              var last_trial_data = jsPsych.data.get().last(1).values()[0];
              var speaker = last_trial_data.speaker;  // Retrieve speaker from last trial's data
              var feedback_sound = "";
              
              if (last_trial_data.correct) {
                var positive_feedback_sounds = ["feedback/well_", "feedback/great_", "feedback/perfect_"];
                feedback_sound = "snd/" + positive_feedback_sounds[Math.floor(Math.random() * positive_feedback_sounds.length)] + speaker + ".wav";
              } else {
                var negative_feedback_sounds = ["feedback/no_", "feedback/not_"];
                feedback_sound = "snd/" + negative_feedback_sounds[Math.floor(Math.random() * negative_feedback_sounds.length)] + speaker + ".wav";
              }
          
              var audio = new Audio(feedback_sound);
              audio.play();
            },
            on_finish: function() {
              // Restore the background color to default for the feedback trial
              document.body.style.backgroundColor = ''; // reset to default
            }
          }
          
        ]
      };
    }

// ==============================================================
// BOUNDARY TEST
// BOUNDARY TEST
// BOUNDARY TEST
// =============================================================

function find_boundary_speaker(cond, first_speaker,second_speaker) {
  let speaker;

  console.log("First speaker:", first_speaker);
console.log("Second speaker:", second_speaker);
console.log("cond:", cond);

  if (cond == "test") {
  speaker = "s5"}
  else if (cond == "uni2") {
  speaker = first_speaker }
  else if (cond == "uni1") {
  speaker = "s4" } 
  else if (cond == "bi") {
    if (first_speaker == "s1" || first_speaker == "s2") {
    speaker = first_speaker}
    else if (second_speaker == "s1" || second_speaker == "s2") {
    speaker = second_speaker};
  }
  
  console.log("found boundary speaker:", speaker);
  
  return {speaker};
  
};

// Initialize variables for test trials
var current_sound = Math.random() < 0.5 ? 1 : 51; // starting point 0 or 50
var reversal_thresholds = [1, 51]; // when the answer is consistent for the max number of highest steps
var increment = 10; // initial increment size
var min_increment = 1; // minimum increment size
var trial_counter = 0;
var max_trials = 20; // IF answer "E" or "A" five times from the first trial, then max_trials = 5 before reversal
var last_button = null; // track the last button clicked
var reversal_counter = 0; // track the number of reversals
var max_reversals = 5; // maximum number of reversals before termination

var previous_non_int_sound = current_sound; // To track the last non-"int" sound

// Randomize the position of Berry and Barry buttons
var berry_on_left = Math.random() < 0.5;

var trial_start_time;

document.addEventListener('keydown', function(event) {
  if (event.key === 'q') {
    console.log('Q key pressed. Setting reversal counter to 5 and ending experiment.');
    
    // Set the global reversal counter to 5
    reversal_counter = 5;
    
    // Check if max reversals are reached and end experiment if true
    if (reversal_counter >= max_reversals) {
      jsPsych.endExperiment("Max reversals reached via Q key. The experiment is now complete.");
    }
  }
});

function createBoundaryTrial(cond, first_speaker, second_speaker, sound_category) {
  const { speaker } = find_boundary_speaker(cond,first_speaker, second_speaker);
  
  var sound_directory = sound_category + "/" + speaker + "/continuum_sounds";
  var berry_image = "img/berryHen.png";
  var barry_image = "img/barry.png";

  var meg_image = "img/meg.png";
  var arrow_image = "img/arrow.png";
  
  // Create button choices based on randomization
  choices = berry_on_left
  ? [
    '<img src="' + berry_image + '" id="berry-button" width="150px" style="border: 2px solid black; position: absolute; right: 20%;">',
    '<img src="' + barry_image + '" id="barry-button" width="150px" style="border: 2px solid black; position: absolute; left: 20%;">',
    '<img src="' + arrow_image + '" id="arrow-button" width="100px" style="border:none; position: absolute; bottom: 10%; right: 10%;">'
  ]
: [
    '<img src="' + barry_image + '" id="barry-button" width="150px" style="border: 2px solid black; position: absolute; right: 20%;">',
    '<img src="' + berry_image + '" id="berry-button" width="150px" style="border: 2px solid black; position: absolute; left: 20%;">',
    '<img src="' + arrow_image + '" id="arrow-button" width="100px" style="border:none; position: absolute; bottom: 10%; right: 10%;">'
  ];

  return {
    timeline: [
      {
        type: jsPsychHtmlButtonResponse,
        stimulus: '<img src="' + meg_image + '" id="play-sound" width="100px" style="border: 2px solid black; padding: 10px;">',
        choices: choices,
        button_html: '<button class="jspsych-btn no-border-button" style="border:none; padding:0; background:none;">%choice%</button>', // Removing any borders and padding
        data: {},

        on_start: function() {
          changeBackgroundColor();
        },

        on_load: function() {
          trial_start_time = performance.now(); // Capture the time when the trial starts

          var clickData = [];

          var buttons = document.querySelectorAll('.jspsych-btn');
          buttons[2].disabled = true; // this + "var arrowButton = buttons[2]" makes the arrow unclickable
          // Dynamically generate sound_file based on current_sound
          // var sound_file = "snd/" + sound_directory + "/continuum_step_" + (current_sound < 10 ? 0 : "") + current_sound + ".wav";
          var sound_file = "snd/" + sound_directory + "/continuum_step_" + String(current_sound).padStart(2, '0') + ".wav";

          // Interleave with "int1" or "int50" sound every 5th trial
          if (trial_counter > 0 && trial_counter % 5 === 0) {
            // Interleave an "int" trial every 5th trial
            current_sound = Math.random() < 0.5 ? "/continuum_step_01int" : "/continuum_step_51int";
            console.log("INTERLEAVING ENDPOINT AT", current_sound)
            sound_file = "snd/" + sound_directory + "/" + current_sound + ".wav"; // Use the int sound directly
            console.log("INTERLEAVING ENDPOINT SOUND FILE", sound_file);
          } else {
            // If not an int trial, check if last trial was an "int"
            if (String(current_sound).includes("int")) {
              // Return to the last valid non-"int" sound
              current_sound = previous_non_int_sound;
            }
            sound_file = "snd/" + sound_directory + "/continuum_step_" + String(current_sound).padStart(2, '0') + ".wav";
            previous_non_int_sound = current_sound;  // Track the last non-"int" sound
          }
          
          if (isNaN(current_sound)) {
            current_sound = previous_non_int_sound || 1; // Fallback to a valid number
          }

          var playSoundButton = document.getElementById('play-sound');
          var berryButton = document.getElementById('berry-button');
          var barryButton = document.getElementById('barry-button');
          var arrowButton = buttons[2]

          var audio = new Audio(sound_file); // Load the correct sound file
          audio.play();
          
          console.log("Arrow button initially disabled:", arrowButton.disabled);          

          playSoundButton.addEventListener('click', function() {
            audio.play();
            playSoundButton.style.backgroundColor = '#FFFFE0'; // Light yellow
            setTimeout(function() {
                playSoundButton.style.backgroundColor = ''; // Reset to original background color
            }, 300); // 300 milliseconds

        });
          berryButton.addEventListener('click', function(event) {
            event.stopPropagation();
            berryButton.style.backgroundColor = 'yellow';
            barryButton.style.backgroundColor = '';
            buttons[2].disabled = false;
            berryButton.dataset.clicked = true;
            barryButton.dataset.clicked = false;
            recordReactionTime(); 

          // Log berry button click
          logClick('berry-button', performance.now() - trial_start_time);
        });

          barryButton.addEventListener('click', function(event) {
            event.stopPropagation();
            barryButton.style.backgroundColor = 'yellow';
            berryButton.style.backgroundColor = '';
            buttons[2].disabled = false;
            barryButton.dataset.clicked = true;
            berryButton.dataset.clicked = false;
            recordReactionTime();
          
            // Log barry button click
            logClick('barry-button', performance.now() - trial_start_time);
          });

          arrowButton.addEventListener('click', function(event) {
            event.stopPropagation();
            // jsPsych.finishTrial();
            //recordReactionTime();
          
             // Only finish the trial if a valid image button was clicked
             if (berryButton.dataset.clicked === "true" || barryButton.dataset.clicked === "true") {
              jsPsych.finishTrial();
            } else {
              alert("Please make a selection first.");
            }
          });          

          arrowButton.disabled = true;

          // Function to log click data
          function logClick(button, reaction_time) {
            clickData.push({ button: button, reaction_time: reaction_time });
            console.log("Logged click:", { button: button, reaction_time: reaction_time });
          }

          // Attach the click data to the trial data when it ends
          jsPsych.data.get().addToLast({ clickData: clickData });
        },

        post_trial_gap: 500,
      
        on_finish: function(data) {
          console.log(current_sound);
          var berryButton = document.getElementById('berry-button');
          var barryButton = document.getElementById('barry-button');

          var selected_button = null;
          var choice_position = null;

          // Ensure buttons are present before accessing dataset
          if (berryButton && berryButton.dataset.clicked === "true") {
            selected_button = 'berry-button';
            choice_position = berry_on_left ? 'left' : 'right'; // Track whether the berry was clicked on the left or right
          } else if (barryButton && barryButton.dataset.clicked === "true") {
            selected_button = 'barry-button';
            choice_position = berry_on_left ? 'right' : 'left'; // Track whether the barry was clicked on the left or right
          } 

          var is_reversal = (last_button && selected_button && last_button !== selected_button);
          if (is_reversal) {
            increment = Math.max(Math.ceil(increment / 2), min_increment);
            reversal_counter++;
          }

          if (selected_button === 'berry-button') {
            current_sound -= increment;
          } else if (selected_button === 'barry-button') {
            current_sound += increment;
          }

          current_sound = Math.min(Math.max(current_sound, reversal_thresholds[0]), reversal_thresholds[1]);

          last_button = selected_button;
          trial_counter++;

          if (!String(current_sound).includes("int")) {
            previous_non_int_sound = current_sound;
          }

          console.log("Current sound: ", current_sound);
          console.log("Previous non-int sound: ", previous_non_int_sound);
        

          // Stop the experiment if the maximum number of reversals is reached
          if (reversal_counter >= max_reversals) {
            jsPsych.endExperiment("Max reversals reached. The experiment is now complete.");
          }

          data.choice = selected_button;
          data.choice_position = choice_position; // Store whether the choice was on the left or right
          data.sound = current_sound;
          data.reaction_time = data.rt; // Store reaction time

          console.log("Reaction Time:", data.reaction_time);
          console.log("Choice:", data.choice);

         
          // Log for debugging
          console.log(`Next current_sound: ${current_sound}`);
          console.log(`Selected button: ${selected_button}`);
          console.log(`Increment: ${increment}`);
          console.log(`Reversal counter: ${reversal_counter}`);

          
        }
      },
    ],
    conditional_function: function() {
      // Stop the timeline if max reversals are reached
      return reversal_counter < max_reversals;
    }
  };
}

function recordReactionTime() {
  var trial_end_time = performance.now();
  var reaction_time = trial_end_time - trial_start_time;
  jsPsych.data.get().addToLast({ reaction_time: reaction_time });
  console.log("Manually recorded Reaction Time:", reaction_time);
}

// var initial_timeline = [arrow];
var initial_timeline = [password_trial, fullscreen_trial, get_id]; //password_trial, 
jsPsych.run(initial_timeline);
