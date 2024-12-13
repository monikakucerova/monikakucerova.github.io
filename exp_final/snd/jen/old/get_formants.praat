clearinfo

Read from file: "C:\Users\monik\OneDrive - Univerzita Karlova\tidyDt\exp_final\snd\jen\jen2_s4_eq.TextGrid"

intStart = Get start time of interval: 1, 2
intEnd = Get end time of interval: 1, 2

intDur = intEnd - intStart
intThird = intDur / 3
intPoint = intStart + intThird

Read from file: "C:\Users\monik\OneDrive - Univerzita Karlova\tidyDt\exp_final\snd\jen\jen2_s4_eq.wav"

To Formant (burg): 0, 5, 5500, 0.025, 50

f1ThirdE = Get value at time: 1, intPoint, "hertz", "linear"
f2ThirdE = Get value at time: 2, intPoint, "hertz", "linear"
f3ThirdE = Get value at time: 3, intPoint, "hertz", "linear"

;; A
Read from file: "C:\Users\monik\OneDrive - Univerzita Karlova\tidyDt\exp_final\snd\jen\jan2_s1.TextGrid"

intStart = Get start time of interval: 1, 2
intEnd = Get end time of interval: 1, 2

intDur = intEnd - intStart
intThird = intDur / 3
intPoint = intStart + intThird

Read from file: "C:\Users\monik\OneDrive - Univerzita Karlova\tidyDt\exp_final\snd\jen\jan2_s1.wav"

To Formant (burg): 0, 5, 5500, 0.025, 50

f1ThirdA = Get value at time: 1, intPoint, "hertz", "linear"
f2ThirdA = Get value at time: 2, intPoint, "hertz", "linear"
f3ThirdA = Get value at time: 3, intPoint, "hertz", "linear"

;;formants

lowestF1 = hertzToErb(f1ThirdE) ; E; startF1
highestF2 = hertzToErb(f2ThirdE) ; E
highestF3 = hertzToErb(f3ThirdE) ; E

highestF1 = hertzToErb(f1ThirdA) ; A
lowestF2 = hertzToErb(f2ThirdA) ; A
lowestF3 = hertzToErb(f3ThirdA) ; A

printline S1 [a] F1 lowestF1 ['f1ThirdA'], F2 highestF2 ['f2ThirdA'], F3 highestF3 ['f3ThirdA']. 
printline S4 [e] F1 highestF1 ['f1ThirdE'], F2 lowestF2 ['f2ThirdE'], F3 lowestF3 ['f3ThirdE']

