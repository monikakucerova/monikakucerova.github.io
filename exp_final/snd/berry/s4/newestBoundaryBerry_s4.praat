; https://www.fon.hum.uva.nl/praat/manual/Source-filter_synthesis_4__Using_existing_sounds.html

lowestF1 = hertzToErb(651.0842512559101) ; bErry ; startF1
highestF2 = hertzToErb(2236.822022808029) ; bErry 

highestF1 = hertzToErb(877) ; bArry
lowestF2 = hertzToErb(1622) ; bArry

;;;;;;;;;;; frequency steps
numberOfSteps = 52

f1Step = (highestF1 - lowestF1) / numberOfSteps 
f2Step = (highestF2 - lowestF2) / numberOfSteps 

phoneTier = 1

tg = Read from file: "C:\Users\monik\OneDrive - Univerzita Karlova\tidyDt\exp_final\snd\berry\s4\berryHen2_s4_eq.TextGrid"
lab$ = Get label of interval: phoneTier, 2

t1 = Get start time of interval: phoneTier, 2 ; start time of manipulation interval
t2 = Get end time of interval: phoneTier, 2 ; end time of manipulation interval

; printline ['t1'], ['t2'] ; OK

; formant settings 
formant.ceiling = 5100 ; for female vocal tracts
n.formants = 5 ; works best for my recording

; read original input recording
orig = Read from file: "C:\Users\monik\OneDrive - Univerzita Karlova\tidyDt\exp_final\snd\berry\s4\berryHen2_s4_eq.wav"
sr = Get sampling frequency

; formant grid manipulation
formants = noprogress To Formant (burg): 0, n.formants, formant.ceiling, 0.025, 50
; the original formants:
formGrid = Down to FormantGrid

; handeditted copy of the opposite endopoint of the continuum (A) saved previously
formGrid2 = Read from file: "C:\Users\monik\OneDrive - Univerzita Karlova\tidyDt\exp_final\snd\berry\s4\man_berryHen2_s4_eq.FormantGrid"

; create source
select orig
resampled = Resample: formant.ceiling * 2, 50
int = Get intensity (dB)
lpc = noprogress To LPC (autocorrelation): n.formants * 2, 0.025, 0.005, 50
select resampled
plus lpc
source = Filter (inverse)

; sound with only the higher frequencies of the original sound
select orig
topFreq = Filter (pass Hann band): formant.ceiling, sr / 2, 20

; create the directory for saving
createFolder: "continuum_sounds"

; open log file
deleteFile("continuum_sounds/log.txt")
appendFileLine("continuum_sounds/log.txt", "Step" + tab$ + "F1 (Hz)" + tab$ + "F1 (ERB)" + tab$ + "F2 (Hz)" + tab$ + "F2 (ERB)")

manTime1 = ((t2 - t1) / 4) + t1 ; 
manTime2 = 3*((t2 - t1) / 4) + t1 ;  

; loop through each frequency step
for step from 1 to (numberOfSteps - 1)
	; calculate current formant in ERB and convert to hz
	currentF1ERB = highestF1 - (step - 1) * f1Step ; spravit
	currentF1 = erbToHertz(currentF1ERB)

	currentF2ERB = lowestF2 + (step - 1) * f2Step ; spravit
	currentF2 = erbToHertz(currentF2ERB)

	; log the frequencies
	appendFileLine("continuum_sounds/log.txt", step, tab$, currentF1, tab$, currentF1ERB, tab$, currentF2, tab$, currentF2ERB)

	; modify current F1 onset
	select formGrid2
	Remove formant points between: 1, t1, t2
	Add formant point: 1, manTime1, currentF1
	Add formant point: 1, manTime2, currentF1

	Remove formant points between: 2, t1, t2
	Add formant point: 2, manTime1, currentF2
	Add formant point: 2, manTime2, currentF2
	
	; filter source with new formants
	select source
	plus formGrid2
	preOutput = Filter
	output = Resample: sr, 50
	Scale intensity: int

	; add higher frequencies back
	select output
	plus topFreq
	preFinal = Combine to stereo
	manipulatedSound = Convert to mono

	; save the sound with zero-padded step numbers
	if step < 10
		stepString$ = "0" + string$(step)
	else
		stepString$ = string$(step)
	endif

	Save as WAV file: "continuum_sounds/continuum_step_" + stepString$ + ".wav"

	; clean up within loop
	select preOutput
	plus output
	plus preFinal
	plus manipulatedSound
	Remove

endfor

; clean up the rest
select orig
plus formants
plus formGrid
plus formGrid2
plus resampled
plus lpc
plus source
plus topFreq
Remove

; load resulting files
files$# = fileNames$#("continuum_sounds/")
for i to size(files$#)
	step'i' = Read from file: "continuum_sounds/" + files$#[i]
endfor
select step1
for i from 2 to size(files$#)-1
	plus step'i'
endfor
Concatenate recoverably
View & Edit

exitScript: "Continuum created successfully."
