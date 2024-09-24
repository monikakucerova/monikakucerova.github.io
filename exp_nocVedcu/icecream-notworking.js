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

// Initialize jsPsych
var jsPsych = initJsPsych({
  on_finish: function() {
    var participant_id = jsPsych.data.get().values()[0].participant_id; // get ppt id
    var participant_seq = seq.find(s => s.id === participant_id); // get id's seq
    var filename = `${participant_id}_${participant_seq.progress}.csv`; // results file will be saved with id and progress (videos watched) in the filename
    jsPsych.data.get().localSave('csv', filename); // save as csv
    var allData = jsPsych.data.get().csv();
    var csvDisplay = '<textarea rows="20" cols="80">' + allData + '</textarea>'; // results also get displayed in a text box at the end
    jsPsych.endExperiment(csvDisplay);
  }
});

function isEven(number) {
  return number % 2 === 0;
}

var speakers = {
  bi: ["s1", "s3"],
  uni2: ["s1", "s2"],
  uni1: ["s3", "s4"],
  test: ["s5", "s6"]
};

var fullscreen_trial = {
  type: jsPsychFullscreen,
  fullscreen_mode: true
};

// Input participant ID
var get_id = {
  type: jsPsychSurvey,
  post_trial_gap: 1, // reqired, when not positive, exp doesnt work
  pages: [
    [
      {
        type: 'text',
        prompt: "Enter ID",
        name: 'ID',
        required: true,
      }
    ]
  ],
  on_finish: function(data) {
    var responses = data.response;
    var participant_id = parseInt(responses.ID, 10);
    jsPsych.data.addProperties({
      participant_id: participant_id
    });

    var participant_seq = seq.find(s => s.id === participant_id);
    var condition = participant_seq ? participant_seq.cond : null;
    var progress = participant_seq ? participant_seq.progress : null;
    var first_speaker = participant_seq ? participant_seq.first_speaker : null;
    
    if (isEven(progress) && condition in speakers) {
      var speakerPair = speakers[condition]; // Get the speaker pair for the current condition
      if (first_speaker === speakerPair[0]) {
        first_speaker = speakerPair[1];
      } else if (first_speaker === speakerPair[1]) {
        first_speaker = speakerPair[0];
      }
    }
    
    var seq_str = participant_seq.seq;
    var seq_parts = seq_str.split('_');
    var extracted_seq = seq_parts[progress];
    console.log("cond:", condition);
    console.log("progress:", progress);
    console.log("first_speaker:", first_speaker);
    console.log("vid:", extracted_seq);

    if (extracted_seq == "mouse") {
      condition = "test";
    }

    if (extracted_seq == "mouse") {
      first_speaker = Math.random() < 0.5 ? "s5" : "s6";;
    }

    var matching_obs = obs.filter(o => o.vid === extracted_seq);

    var obs_trials = [];
    matching_obs.forEach(o => {
      var trials = obs_trial_screen(o.img, condition);
      obs_trials.push(...trials);
    });

    // Replicate trials for each word four times
    var replicated_obs_trials = [];
    obs_trials.forEach(trial => {
      for (var i = 0; i < 4; i++) {
        replicated_obs_trials.push(trial);
      }
    });

    var matching_vid_obs = vid_obs.filter(v => v.vid === extracted_seq);
    var vid_trials = matching_vid_obs.map(v => video_obs_trial(v.tStart, v.tEnd, extracted_seq, condition, first_speaker));

    var interleaved_trials = [];
    var obs_index = 0;
    var vid_index = 0;
    while (obs_index < obs_trials.length || vid_index < vid_trials.length) {
      if (vid_index < vid_trials.length) {
        interleaved_trials.push(vid_trials[vid_index]);
        vid_index++;
      }
      if (obs_index < obs_trials.length) {
        for (var i = 0; i < 4; i++) {
          interleaved_trials.push(obs_trials[obs_index]);
          obs_index++;
        }
      }
    }

    var relevant_sound_sels = soundSel.filter(sel => sel.vid === extracted_seq && sel.cond === condition);

    // Organize the soundSel trials
    var organizedSoundSel = organizeSoundSelTrials(relevant_sound_sels, extracted_seq, condition, seq_parts, progress);
    console.log('Organized SoundSel:', organizedSoundSel);

    var sound_selection_trials = organizedSoundSel.map(sel => make_sound_selection_trial(sel));

    var full_timeline = [
      // fullscreen_trial,
      //get_id,
      arrow,
      ...interleaved_trials, // DO NOT REMOVE THIS LINE
      ...sound_selection_trials,  // DO NOT REMOVE THIS LINE
    ];

    if (progress == 3 || progress == 4) {
      var sound_category = progress === 3 ? "berry" : "jen";
      var familiarisation_sounds = jsPsych.randomization.shuffle([50, 0, 50, 0]);

    // Create familiarisation timeline
    var familiarisation_timeline = familiarisation_sounds.map(function(sound) {
      return createBoundaryFam(sound, condition, sound_category);
    });

    var test_timeline = [];
      for (var i = 0; i < max_trials; i++) {
        test_timeline.push(createBoundaryTrial(condition, sound_category));
      }

      full_timeline = full_timeline.concat(familiarisation_timeline).concat(test_timeline);
    }
    
    full_timeline.push(hooray_trial);

    console.log('Full Timeline:', full_timeline);

    jsPsych.run(full_timeline);
  }
};

var hooray_trial = {
  type: jsPsychImageButtonResponse,
  stimulus: 'img/hooray.png', 
  choices: ['Show results'],
  button_html: '<button class="jspsych-btn">%choice%</button>',
  prompt: '<p></p>',
};





// Arrow
var arrow = {
  type: jsPsychHtmlButtonResponse,
  stimulus: "\u2003",
  choices: ['<img src="img/arrow.png" alt="arrow" style="width:200px; height:200px;">'],
};

// Define possible positions for images
var containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100vw',
  height: '100vh',
  position: 'relative'
};

var positions = [
  { top: '75%', left: '25%', transform: 'translate(-50%, -50%)', position: 'absolute' },
  { top: '25%', left: '25%', transform: 'translate(-50%, -50%)', position: 'absolute' },
  { top: '75%', left: '75%', transform: 'translate(-50%, -50%)', position: 'absolute' },
  { top: '25%', left: '75%', transform: 'translate(-50%, -50%)', position: 'absolute' }
];
// Image screen observation
function obs_trial_screen(word, condition) {
    console.log("obs_trial_screen called with word:", word, "and condition:", condition);
    
    var img_filename = "img/" + word + ".png";
  
    // Validate condition
    if (!speakers.hasOwnProperty(condition)) {
      console.error("Invalid condition: ", condition);
      return [];
    }
  
    var selected_speakers = speakers[condition];
    if (!selected_speakers || selected_speakers.length < 2) {
      console.error("Selected speakers array is invalid: ", selected_speakers);
      return [];
    }
  
    var speaker1 = selected_speakers[0];
    var speaker2 = selected_speakers[1];
  
    var shuffled_speakers = jsPsych.randomization.shuffle([speaker1, speaker1, speaker2, speaker2]);
    var trials = [];
  
    var shuffled_positions = jsPsych.randomization.shuffle(positions.slice());
  
    for (let i = 0; i < 4; i++) {
      var tokenNumber = Math.random() < 0.5 ? "2" : "";  // Initially try with or without "2"
      var snd_filename = "snd/" + word + tokenNumber + "_" + shuffled_speakers[i] + ".wav";
      var fallback_snd_filename = "snd/" + word + "_" + shuffled_speakers[i] + ".wav";  // Fallback sound file without tokenNumber
  
      var shuffled_positions = jsPsych.randomization.shuffle(positions.slice());
  
      trials.push({
        type: jsPsychAudioButtonResponse,
        stimulus: snd_filename,  // Initially attempt with tokenNumber version
        choices: [img_filename],
        button_html: function() {
          var position = shuffled_positions.pop();
          var buttonHtml = '<div id="prompt-container" style="position: absolute; display: inline-block; top: ' + position.top + '; left: ' + position.left + ';">';
          buttonHtml += '<img id="target-img" src="' + img_filename + '" width="250px;">';
  
          // Show tap prompt only when i === 0 (first image)
          if (i === 0) {
            buttonHtml += '<img id="prompt-img" src="img/tap.png" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 200px; animation: circle 5s linear infinite;">';
          }
  
          buttonHtml += '</div>';
          return buttonHtml;
        },
        trial_duration: 15000,
        post_trial_gap: 500,
        data: { block: "train_obs" },
        response_allowed_while_playing: false,
        on_start: function(trial) {
          // Fallback logic if the primary sound file doesn't exist
          var audio = new Audio(snd_filename);
          audio.onerror = function() {
            trial.stimulus = fallback_snd_filename;  // If the primary sound fails, use the fallback
            var fallback_audio = new Audio(fallback_snd_filename);
            fallback_audio.play();
          };
          audio.play();
  
          if (i === 0) {  // Ensure the timeout only applies when i === 0
            setTimeout(function() {
              var promptImg = document.getElementById('prompt-img');
              if (promptImg) {
                promptImg.style.display = 'none';
              }
            }, 800);
          }
        },
        on_finish: function(data) {
          data.reaction_time = data.rt; // Store reaction time
        }
      });
    }
  
    return trials;
  }

// Video observation trial
function video_obs_trial(tStart, tEnd, vid, cond, first_speaker) {
  var video_filename = "vid/" + vid +"_" + cond + "_" + first_speaker + ".mkv";
  return {
    type: jsPsychVideoButtonResponse,
    stimulus: [video_filename],
    choices: [],
    trial_ends_after_video: true,
    start: tStart,
    stop: tEnd,
    data: { block: "train_vid_obs", video_filename: video_filename },
    on_finish: function(data) {
      data.reaction_time = data.rt; // Store reaction time
    }
  };
}

// Function to check if a prereq value meets the condition
function prereqMet(prereq, seq_parts, progress) {
  if (!prereq) return true; // No prereq, always met
  const prereqParts = prereq.split('_');

  // Check each part of the prereq
  for (let part of prereqParts) {
    const prereqIndex = seq_parts.indexOf(part);
    if (prereqIndex === -1 || prereqIndex >= progress) { // but oe thi salso recognise the prereqs with index smaller than -1?
      return false; // Prereq not met
    }
  }
  return true; // All prereqs met
}

// Function to organize the sound selection trials
function organizeSoundSelTrials(soundSels, extracted_seq, condition, seq_parts, progress) {
  // Filter soundSels based on prereq
  let filteredSoundSels = soundSels.filter(sel => {
    return prereqMet(sel.prereq, seq_parts, progress);
  });

  // Find and extract the fam trial
  let famTrialIndex = filteredSoundSels.findIndex(sel => sel.status === 'fam' && sel.vid === extracted_seq);
  let famTrial = null;
  if (famTrialIndex !== -1) {
    famTrial = filteredSoundSels.splice(famTrialIndex, 1)[0]; // Remove fam trial from array
  }

  // Shuffle remaining trials
  filteredSoundSels = jsPsych.randomization.shuffle(filteredSoundSels);

  // Place the fam trial at the beginning if it exists
  if (famTrial) {
    filteredSoundSels.unshift(famTrial);
  }

  return filteredSoundSels;
}

// Function to assign speakers based on the condition
function assign_varieties(cond) {
  let acc1, acc2;
  if (cond === "uni1") {
    acc1 = "s3";
    acc2 = "s4";
  } else if (cond === "uni2") {
    acc1 = "s1";
    acc2 = "s2";
  } else if (cond === "bi") {
    acc1 = "s1"; 
    acc2 = "s3";
  } else if (cond === "test") {
    acc1 = "s5";
    acc2 = "s6";
  }
  console.log("assign_varieties - cond:", cond, "acc1:", acc1, "acc2:", acc2); // Log the assigned values
  return { acc1, acc2 };
}

// Initialize the last selected carrier globally to keep track of it across trials
let lastSelectedCarrier = null;
let carrierPool = []; // This will hold the shuffled carriers
//let lastPlayedSound = null; // This will hold the last played sound

function selectRandomCarrierPhrase(word) {
  // Array of carrier options
  const carriers = ["i_bet_thats", "i_guess_its", "i_wish_i_could_tell_if_its", "that_might_be"];

  // Shuffle carrierPool if it's empty (all carriers have been used)
  if (carrierPool.length === 0) {
    carrierPool = shuffleArray([...carriers]); // Create a new shuffled array
  }

  // Select the last carrier from the shuffled pool
  const selectedCarrier = carrierPool.pop();

  // Store the selected carrier in lastSelectedCarrier if needed
  lastSelectedCarrier = selectedCarrier;

  // Find the entry in the arts array that matches the word
  var artEntry = arts.find(art => art.word === word);
  
  // Check the `indefArt` field to determine which version of the carrier to use
  if (artEntry && (artEntry.indefArt === "y" || artEntry.indefArt === "y_an")) {
    // Append "_a" for the longer version
    return selectedCarrier + "_a";
  } else {
    // Use the shorter version
    return selectedCarrier;
  }
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

function make_sound_selection_trial(soundSel) {
  const { acc1, acc2 } = assign_varieties(soundSel.cond); // Assign random varieties here
  var pair = soundSel.pair.split('-');
  
  var target_img;
  var target_base_name;
  if (soundSel.status === "mp") {
    target_base_name = Math.random() < 0.5 ? pair[0] : pair[1];
    target_img = "img/" + target_base_name + ".png";
  } else {
    target_base_name = pair[0];
    target_img = "img/" + target_base_name + ".png";
  }

  var carrierPhrase1, carrierPhrase2;
  var sound_file_1, sound_file_2;

  function updateSoundFiles() {
    // Select new carrier phrases
    carrierPhrase1 = selectRandomCarrierPhrase(pair[0]);
    carrierPhrase2 = selectRandomCarrierPhrase(pair[1]);

    // Randomly decide whether to use basic sound or sound with carrier phrase
    const useCarrier1 = Math.random() < 0.5;
    const useCarrier2 = Math.random() < 0.5;
    
    sound_file_1 = useCarrier1 
      ? "snd/output_carrierPlusWord/" + carrierPhrase1 + "_" + pair[0] + "_" + acc1 + ".wav"
      : "snd/" + pair[0] + "_" + acc1 + ".wav";

    sound_file_2 = useCarrier2 
      ? "snd/output_carrierPlusWord/" + carrierPhrase2 + "_" + pair[1] + "_" + acc2 + ".wav"
      : "snd/" + pair[1] + "_" + acc2 + ".wav";

    // Ensure that the sound without carrier does not repeat
    if (!useCarrier1 && sound_file_1 === lastPlayedSound) {
      // Swap to a carrier version if the basic sound would repeat
      sound_file_1 = "snd/output_carrierPlusWord/" + carrierPhrase1 + "_" + pair[0] + "_" + acc1 + ".wav";
    }
    if (!useCarrier2 && sound_file_2 === lastPlayedSound) {
      // Swap to a carrier version if the basic sound would repeat
      sound_file_2 = "snd/output_carrierPlusWord/" + carrierPhrase2 + "_" + pair[1] + "_" + acc2 + ".wav";
    }
  }

  updateSoundFiles();  // Initial sound file update

  var word_sound_file_1 = "snd/" + pair[0] + "_" + acc1 + ".wav";
  var word_sound_file_2 = "snd/" + pair[1] + "_" + acc2 + ".wav";

  var correct_sound = (target_base_name === pair[0]) ? word_sound_file_1 : word_sound_file_2;

  var meg1_img = "img/meg1.png";
  var meg2_img = "img/meg2.png";
  var megGreen_img = "img/megGreen.png";
  var arrow_img = "img/arrow.png";
  var lastPlayedSound = null;

  // Randomize button positions
  var meg1_on_left = Math.random() < 0.5;

  var feedback_trial = function(correct) {
    var feedback_img = correct ? "img/tick.png" : "img/cross.png";
    var feedback_sound;
    if (correct) {
      var positive_feedback_sounds = ["well_", "great_", "perfect_"];
      feedback_sound = "snd/" + positive_feedback_sounds[Math.floor(Math.random() * positive_feedback_sounds.length)] + (Math.random() < 0.5 ? acc1 : acc2) + ".wav";
    } else {
      var negative_feedback_sounds = ["no_", "not_"];
      feedback_sound = "snd/" + negative_feedback_sounds[Math.floor(Math.random() * negative_feedback_sounds.length)] + (Math.random() < 0.5 ? acc1 : acc2) + ".wav";
    }

    return {
      type: jsPsychHtmlButtonResponse,
      stimulus: '<img src="' + target_img + '" width="250px">' + 
                '<img src="' + feedback_img + '" width="100px" style="position: absolute; top: 10%; right: 10%;">',
      choices: [
        '<img src="' + megGreen_img + '" width="100px" ;">',
        '<img src="' + arrow_img + '" width="100px" style="position: absolute; bottom: 10%; right: 10%;">'
      ],
      button_html: '<button class="jspsych-btn no-border-button">%choice%</button>',
      post_trial_gap: 500,
      data: { block: "feedback", img: target_base_name, correct: correct },
      on_load: function() { 
        var buttons = document.querySelectorAll('.jspsych-btn');
        var soundButton = buttons[0];
        var arrowButton = buttons[1];

        soundButton.addEventListener('click', function(event) {
          event.stopPropagation();
          var audio = new Audio(correct_sound);
          audio.play();
        });

        arrowButton.addEventListener('click', function(event) {
          event.stopPropagation();
          jsPsych.finishTrial(); // End trial on arrow button click
        });
      },
      trial_duration: null, // Duration is determined by user interaction
      on_start: function() {
        var audio = new Audio(feedback_sound);
        audio.play();
        setTimeout(function() {
          var feedbackImage = document.querySelector('img[style*="top: 10%; right: 10%;"]');
          if (feedbackImage) {
            feedbackImage.style.display = 'none';
          }
        }, 800);
      },
      on_finish: function(data) {
        data.reaction_time = data.rt; // Store reaction time
      }
    };
  };

  return {
    timeline: [
      {
        type: jsPsychHtmlButtonResponse,
        stimulus: '<img src="' + target_img + '" width="250px">',
        choices: meg1_on_left
          ? [
              '<img src="' + meg1_img + '" width="100px">',
              '<img src="' + meg2_img + '" width="100px">',
              '<img src="' + arrow_img + '" width="100px" style="position: absolute; bottom: 10%; right: 10%;">'
            ]
          : [
              '<img src="' + meg2_img + '" width="100px">',
              '<img src="' + meg1_img + '" width="100px">',
              '<img src="' + arrow_img + '" width="100px" style="position: absolute; bottom: 10%; right: 10%;">'
            ],
        button_html: '<button class="jspsych-btn no-border-button">%choice%</button>',
        post_trial_gap: 500,
        data: { block: "SS_trial", img: target_base_name, pair: pair, sound_files: [sound_file_1, sound_file_2] },
        on_start: function(trial) {
          console.log('Trial data on start:', trial.data);
        },
        
        on_load: function() {
          var buttons = document.querySelectorAll('.jspsych-btn');
          var arrowButton = buttons[2]; // Arrow button
          var soundPlayed = false;

          if (meg1_on_left) {
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
              soundPlayed = true;
              arrowButton.disabled = false;
              console.log('Played Sound:', sound_file_1);
              buttons[0].style.backgroundColor = 'yellow';
              buttons[1].style.backgroundColor = '';
            });

            buttons[1].addEventListener('click', function(event) {
              event.stopPropagation();
              updateSoundFiles(); // Select new carrier phrases and update sound files
              var audio = new Audio(sound_file_2);
              audio.play();
              lastPlayedSound = sound_file_2;
              clickData.push({
                sound_file: sound_file_2,
                timestamp: Date.now()
              });
              soundPlayed = true;
              arrowButton.disabled = false;
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
              lastPlayedSound = sound_file_2;
              clickData.push({
                sound_file: sound_file_2,
                timestamp: Date.now()
              });
              soundPlayed = true;
              arrowButton.disabled = false;
              console.log('Played Sound:', sound_file_2);
              buttons[0].style.backgroundColor = 'yellow';
              buttons[1].style.backgroundColor = '';
            });

            buttons[1].addEventListener('click', function(event) {
              event.stopPropagation();
              updateSoundFiles(); // Select new carrier phrases and update sound files
              var audio = new Audio(sound_file_1);
              audio.play();
              lastPlayedSound = sound_file_1;
              clickData.push({
                sound_file: sound_file_1,
                timestamp: Date.now()
              });
              soundPlayed = true;
              arrowButton.disabled = false;
              console.log('Played Sound:', sound_file_1);
              buttons[0].style.backgroundColor = '';
              buttons[1].style.backgroundColor = 'yellow';
            });
          }

          // Ensure the arrow button is initially disabled
          arrowButton.disabled = true;
        },
        on_finish: function(data) {
          var file_name = lastPlayedSound.split('/').pop(); // This will get the 'carrierPhrase_word_acc.wav'

          // Split by underscores and extract the word (second-to-last element)
          var split_name = file_name.split('_');
          var played_sound_base = split_name[split_name.length - 2]; // Get the second-to-last element
  
          var correct = played_sound_base === target_base_name;
          
          // Determine which side (left or right) the clicked image was on
          var clicked_side = null;
          if (meg1_on_left) {
            clicked_side = (lastPlayedSound === sound_file_1) ? "left" : "right";
          } else {
            clicked_side = (lastPlayedSound === sound_file_2) ? "left" : "right";
          }

          data.selected_sound = lastPlayedSound; // Store the last played sound in the trial data
          data.correct = correct;
          data.reaction_time = data.rt; // Store reaction time
          data.clicked_side = clicked_side; // Store the side (left or right) of the clicked image
          console.log('Correct:', correct);
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




var berry_on_left = Math.random() < 0.5;
var currentColorIndex = 0; // Persistent color index

// Define an array of colors
var colors = ["#ffdfba", "#ffffba", "#bae1ff", "#ffd4e5", "#eecbff", "#feffa3", "	#dbdcff", "#f2d7fb", "#d4fffc"];

function changeBackgroundColor() {
  document.body.style.backgroundColor = colors[currentColorIndex];
  currentColorIndex = (currentColorIndex + 1) % colors.length;
}

// boundary familiarisation
function createBoundaryFam(sound, condition, sound_category) {
  
  var sound_directory;

  if (sound_category === "berry") {
    if (condition === "bi" || condition === "uni2") {
      sound_directory = sound_category + "_2cat/continuum_sounds";
    } else if (condition === "uni1") {
      sound_directory = sound_category + "_1cat/continuum_sounds";
    }
  } else {
    // Default directory if the sound_category is not "berry"
    sound_directory = sound_category + "/continuum_sounds";
  }

  var berry_image = sound_category === "berry" ? "img/" + sound_category + "Hen.png" : "img/" + sound_category + ".png";
  var barry_image = sound_category === "jen" ? "img/jan.png" : "img/barry.png";
  
  var meg_image = "img/meg.png";
  var arrow_image = "img/arrow.png";
  var sound_file = "snd/" + sound_directory + "/continuum_step_" + (sound < 10 ? "0" : "") + sound + ".wav";

  /*
  // Determine speakers based on the participant's condition
  var speakers = [];
  if (condition === 'uni1') {
    speakers = ['s3', 's4'];
  } else if (condition === 'uni2') {
    speakers = ['s1', 's2'];
  } else if (condition === 'bi') {
    speakers = ['s1', 's3'];
  }

  */

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
        data: { sound: sound_file },
    
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
                }, 300); // 300 milliseconds
                
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
    
              if (berryButton.dataset.clicked === "true") {
                selected_button = 'berry-button';
                choice_position = berry_on_left ? 'left' : 'right'; // Track whether the berry was clicked on the left or right
              } else if (barryButton.dataset.clicked === "true") {
                selected_button = 'barry-button';
                choice_position = berry_on_left ? 'right' : 'left'; // Track whether the barry was clicked on the left or right
              }
    
              var correct = null;
              if ((sound === 50 && selected_button === 'berry-button') || (sound === 0 && selected_button === 'barry-button')) {
                correct = true;
              } else if ((sound === 50 && selected_button === 'barry-button') || (sound === 0 && selected_button === 'berry-button')) {
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
              var speaker = "s5";
              var feedback_sound = "";
    
              if (last_trial_data.correct) {
                var positive_feedback_sounds = ["well_", "great_", "perfect_"];
                feedback_sound = "snd/" + positive_feedback_sounds[Math.floor(Math.random() * positive_feedback_sounds.length)] + speaker + ".wav";
              } else {
                var negative_feedback_sounds = ["no_", "not_"];
                feedback_sound = "snd/" + negative_feedback_sounds[Math.floor(Math.random() * negative_feedback_sounds.length)] + speaker + ".wav";
              }
    
              var audio = new Audio(feedback_sound);
              audio.play();
            },
            // post_trial_gap: 500,
            on_finish: function() {
              // Restore the background color to default for the feedback trial
              document.body.style.backgroundColor = ''; // reset to default
            }
          }
        ]
      };
    }

// boundary test
// Initialize variables for test trials
var current_sound = Math.random() < 0.5 ? 0 : 50; // starting point 0 or 50
var reversal_thresholds = [0, 50]; // when the answer is consistent for the max number of highest steps
var increment = 10; // initial increment size
var min_increment = 1; // minimum increment size
var trial_counter = 0;
var max_trials = 20; // IF answer "E" or "A" five times from the first trial, then max_trials = 5 before reversal
var last_button = null; // track the last button clicked
var reversal_counter = 0; // track the number of reversals
var max_reversals = 7; // maximum number of reversals before termination

// Randomize the position of Berry and Barry buttons
var berry_on_left = Math.random() < 0.5;

// ==============================================================
// BOUNDARY TEST
// BOUNDARY TEST
// BOUNDARY TEST
// =============================================================

var trial_start_time;

function createBoundaryTrial(condition, sound_category) {
 
  var sound_directory;

  if (sound_category === "berry") {
    if (condition === "bi" || condition === "uni2") {
      sound_directory = sound_category + "_2cat/continuum_sounds";
    } else if (condition === "uni1") {
      sound_directory = sound_category + "_1cat/continuum_sounds";
    }
  } else {
    // Default directory if the sound_category is not "berry"
    sound_directory = sound_category + "/continuum_sounds";
  }

  var berry_image = sound_category === "berry" ? "img/" + sound_category + "Hen.png" : "img/" + sound_category + ".png";
  var barry_image = sound_category === "jen" ? "img/jan.png" : "img/barry.png";

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
          var sound_file = "snd/" + sound_directory + "/continuum_step_" + (current_sound < 10 ? "0" : "") + current_sound + ".wav";
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

          data.choice = selected_button;
          data.choice_position = choice_position; // Store whether the choice was on the left or right
          data.sound = current_sound;
          data.reaction_time = data.rt; // Store reaction time

          console.log("Reaction Time:", data.reaction_time);
          console.log("Choice:", data.choice);

          // Check for reversal
          var is_reversal = (last_button && selected_button && last_button !== selected_button);
          if (is_reversal) {
            increment = Math.max(Math.ceil(increment / 2), min_increment);
            reversal_counter++;
          }

          // Determine next sound value based on the participant's choice
          if (selected_button === 'berry-button') {
            current_sound -= increment;
          } else if (selected_button === 'barry-button') {
            current_sound += increment;
          }

          // Ensure the sound value stays within the reversal thresholds
          if (current_sound > reversal_thresholds[1]) {
            current_sound = reversal_thresholds[1];
          } else if (current_sound < reversal_thresholds[0]) {
            current_sound = reversal_thresholds[0];
          }

          // Log for debugging
          console.log(`Next current_sound: ${current_sound}`);
          console.log(`Selected button: ${selected_button}`);
          console.log(`Increment: ${increment}`);
          console.log(`Reversal counter: ${reversal_counter}`);

          // Update last button
          last_button = selected_button;

          trial_counter++;
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

var initial_timeline = [fullscreen_trial, get_id];
jsPsych.run(initial_timeline);
