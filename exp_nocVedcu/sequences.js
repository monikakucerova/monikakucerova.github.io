// important: "first_speaker" does not always agree to the first speaker in a given video, the first speaker is chosen randomly based on the first speaker value

var seq = [
  {
    "...1": 1,
    "seq": "hen_lion_oak_ice_mouse_",
    "id": 0,
    "cond": "bi",
    "pilot": "y",
    "progress": 4,
    "first_speaker": "s1"
  },
  {
    "...1": 2,
    "seq": "hen_ice_lion_oak_mouse_",
    "id": 1,
    "cond": "uni1",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s3"
  },
  {
    "...1": 3,
    "seq": "hen_ice_oak_lion_mouse_",
    "id": 2,
    "cond": "uni2",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s1"
  },
  {
    "...1": 4,
    "seq": "hen_oak_ice_lion_mouse_",
    "id": 3,
    "cond": "bi",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s3"
  },
  {
    "...1": 5,
    "seq": "oak_hen_ice_lion_mouse_",
    "id": 4,
    "cond": "uni1",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s4"
  },
  {
    "...1": 6,
    "seq": "oak_hen_lion_ice_mouse_",
    "id": 5,
    "cond": "uni2",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s2"
  },
  {
    "...1": 7,
    "seq": "hen_oak_lion_ice_mouse_",
    "id": 6,
    "cond": "bi",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s1"
  },
  {
    "...1": 8,
    "seq": "hen_lion_oak_ice_mouse_",
    "id": 7,
    "cond": "uni1",
    "pilot": "n",
    "progress": 3,
    "first_speaker": "s3"
  },
  {
    "...1": 9,
    "seq": "hen_lion_ice_oak_mouse_",
    "id": 8,
    "cond": "uni2",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s1"
  },
  {
    "...1": 10,
    "seq": "lion_hen_ice_oak_mouse_",
    "id": 9,
    "cond": "bi",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s3"
  },
  {
    "...1": 11,
    "seq": "lion_hen_oak_ice_mouse_",
    "id": 10,
    "cond": "uni1",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s4"
  },
  {
    "...1": 12,
    "seq": "lion_oak_hen_ice_mouse_",
    "id": 11,
    "cond": "uni2",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s2"
  },
  {
    "...1": 13,
    "seq": "oak_lion_hen_ice_mouse_",
    "id": 12,
    "cond": "bi",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s1"
  },
  {
    "...1": 14,
    "seq": "oak_lion_ice_hen_mouse_",
    "id": 13,
    "cond": "uni1",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s3"
  },
  {
    "...1": 15,
    "seq": "lion_oak_ice_hen_mouse_",
    "id": 14,
    "cond": "uni2",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s1"
  },
  {
    "...1": 16,
    "seq": "lion_ice_oak_hen_mouse_",
    "id": 15,
    "cond": "bi",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s3"
  },
  {
    "...1": 17,
    "seq": "lion_ice_hen_oak_mouse_",
    "id": 16,
    "cond": "uni1",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s4"
  },
  {
    "...1": 18,
    "seq": "ice_lion_hen_oak_mouse_",
    "id": 17,
    "cond": "uni2",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s2"
  },
  {
    "...1": 19,
    "seq": "ice_lion_oak_hen_mouse_",
    "id": 18,
    "cond": "bi",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s1"
  },
  {
    "...1": 20,
    "seq": "ice_oak_lion_hen_mouse_",
    "id": 19,
    "cond": "uni1",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s3"
  },
  {
    "...1": 21,
    "seq": "oak_ice_lion_hen_mouse_",
    "id": 20,
    "cond": "uni2",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s1"
  },
  {
    "...1": 22,
    "seq": "oak_ice_hen_lion_mouse_",
    "id": 21,
    "cond": "bi",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s3"
  },
  {
    "...1": 23,
    "seq": "ice_oak_hen_lion_mouse_",
    "id": 22,
    "cond": "uni1",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s4"
  },
  {
    "...1": 24,
    "seq": "ice_hen_oak_lion_mouse_",
    "id": 23,
    "cond": "uni2",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s2"
  },
  {
    "...1": 25,
    "seq": "ice_hen_lion_oak_mouse_",
    "id": 24,
    "cond": "bi",
    "pilot": "n",
    "progress": 4,
    "first_speaker": "s1"
  },
  {
    "...1": 26,
    "seq": "hen_ice_lion_oak_mouse_",
    "id": 25,
    "cond": "uni1",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s3"
  },
  {
    "...1": 27,
    "seq": "hen_ice_oak_lion_mouse_",
    "id": 26,
    "cond": "uni2",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s1"
  },
  {
    "...1": 28,
    "seq": "hen_oak_ice_lion_mouse_",
    "id": 27,
    "cond": "bi",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s3"
  },
  {
    "...1": 29,
    "seq": "oak_hen_ice_lion_mouse_",
    "id": 28,
    "cond": "uni1",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s4"
  },
  {
    "...1": 30,
    "seq": "oak_hen_lion_ice_mouse_",
    "id": 29,
    "cond": "uni2",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s2"
  },
  {
    "...1": 31,
    "seq": "hen_oak_lion_ice_mouse_",
    "id": 30,
    "cond": "bi",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s1"
  },
  {
    "...1": 32,
    "seq": "hen_lion_oak_ice_mouse_",
    "id": 31,
    "cond": "uni1",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s3"
  },
  {
    "...1": 33,
    "seq": "hen_lion_ice_oak_mouse_",
    "id": 32,
    "cond": "uni2",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s1"
  },
  {
    "...1": 34,
    "seq": "lion_hen_ice_oak_mouse_",
    "id": 33,
    "cond": "bi",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s3"
  },
  {
    "...1": 35,
    "seq": "lion_hen_oak_ice_mouse_",
    "id": 34,
    "cond": "uni1",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s4"
  },
  {
    "...1": 36,
    "seq": "lion_oak_hen_ice_mouse_",
    "id": 35,
    "cond": "uni2",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s2"
  },
  {
    "...1": 37,
    "seq": "oak_lion_hen_ice_mouse_",
    "id": 36,
    "cond": "bi",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s1"
  },
  {
    "...1": 38,
    "seq": "oak_lion_ice_hen_mouse_",
    "id": 37,
    "cond": "uni1",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s3"
  },
  {
    "...1": 39,
    "seq": "lion_oak_ice_hen_mouse_",
    "id": 38,
    "cond": "uni2",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s1"
  },
  {
    "...1": 40,
    "seq": "lion_ice_oak_hen_mouse_",
    "id": 39,
    "cond": "bi",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s3"
  },
  {
    "...1": 41,
    "seq": "lion_ice_hen_oak_mouse_",
    "id": 40,
    "cond": "uni1",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s4"
  },
  {
    "...1": 42,
    "seq": "ice_lion_hen_oak_mouse_",
    "id": 41,
    "cond": "uni2",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s2"
  },
  {
    "...1": 43,
    "seq": "ice_lion_oak_hen_mouse_",
    "id": 42,
    "cond": "bi",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s1"
  },
  {
    "...1": 44,
    "seq": "ice_oak_lion_hen_mouse_",
    "id": 43,
    "cond": "uni1",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s3"
  },
  {
    "...1": 45,
    "seq": "oak_ice_lion_hen_mouse_",
    "id": 44,
    "cond": "uni2",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s1"
  },
  {
    "...1": 46,
    "seq": "oak_ice_hen_lion_mouse_",
    "id": 45,
    "cond": "bi",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s3"
  },
  {
    "...1": 47,
    "seq": "ice_oak_hen_lion_mouse_",
    "id": 46,
    "cond": "uni1",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s4"
  },
  {
    "...1": 48,
    "seq": "ice_hen_oak_lion_mouse_",
    "id": 47,
    "cond": "uni2",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s2"
  },
  {
    "...1": 49,
    "seq": "ice_hen_lion_oak_mouse_",
    "id": 48,
    "cond": "bi",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s1"
  },
  {
    "...1": 50,
    "seq": "hen_ice_lion_oak_mouse_",
    "id": 49,
    "cond": "uni1",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s3"
  },
  {
    "...1": 51,
    "seq": "hen_ice_oak_lion_mouse_",
    "id": 50,
    "cond": "uni2",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s1"
  },
  {
    "...1": 52,
    "seq": "hen_oak_ice_lion_mouse_",
    "id": 51,
    "cond": "bi",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s3"
  },
  {
    "...1": 53,
    "seq": "oak_hen_ice_lion_mouse_",
    "id": 52,
    "cond": "uni1",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s4"
  },
  {
    "...1": 54,
    "seq": "oak_hen_lion_ice_mouse_",
    "id": 53,
    "cond": "uni2",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s2"
  },
  {
    "...1": 55,
    "seq": "hen_oak_lion_ice_mouse_",
    "id": 54,
    "cond": "bi",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s1"
  },
  {
    "...1": 56,
    "seq": "hen_lion_oak_ice_mouse_",
    "id": 55,
    "cond": "uni1",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s3"
  },
  {
    "...1": 57,
    "seq": "hen_lion_ice_oak_mouse_",
    "id": 56,
    "cond": "uni2",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s1"
  },
  {
    "...1": 58,
    "seq": "lion_hen_ice_oak_mouse_",
    "id": 57,
    "cond": "bi",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s3"
  },
  {
    "...1": 59,
    "seq": "lion_hen_oak_ice_mouse_",
    "id": 58,
    "cond": "uni1",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s4"
  },
  {
    "...1": 60,
    "seq": "lion_oak_hen_ice_mouse_",
    "id": 59,
    "cond": "uni2",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s2"
  },
  {
    "...1": 61,
    "seq": "oak_lion_hen_ice_mouse_",
    "id": 60,
    "cond": "bi",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s1"
  },
  {
    "...1": 62,
    "seq": "oak_lion_ice_hen_mouse_",
    "id": 61,
    "cond": "uni1",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s3"
  },
  {
    "...1": 63,
    "seq": "lion_oak_ice_hen_mouse_",
    "id": 62,
    "cond": "uni2",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s1"
  },
  {
    "...1": 64,
    "seq": "lion_ice_oak_hen_mouse_",
    "id": 63,
    "cond": "bi",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s3"
  },
  {
    "...1": 65,
    "seq": "lion_ice_hen_oak_mouse_",
    "id": 64,
    "cond": "uni1",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s4"
  },
  {
    "...1": 66,
    "seq": "ice_lion_hen_oak_mouse_",
    "id": 65,
    "cond": "uni2",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s2"
  },
  {
    "...1": 67,
    "seq": "ice_lion_oak_hen_mouse_",
    "id": 66,
    "cond": "bi",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s1"
  },
  {
    "...1": 68,
    "seq": "ice_oak_lion_hen_mouse_",
    "id": 67,
    "cond": "uni1",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s3"
  },
  {
    "...1": 69,
    "seq": "oak_ice_lion_hen_mouse_",
    "id": 68,
    "cond": "uni2",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s1"
  },
  {
    "...1": 70,
    "seq": "oak_ice_hen_lion_mouse_",
    "id": 69,
    "cond": "bi",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s3"
  },
  {
    "...1": 71,
    "seq": "ice_oak_hen_lion_mouse_",
    "id": 70,
    "cond": "uni1",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s4"
  },
  {
    "...1": 72,
    "seq": "ice_hen_oak_lion_mouse_",
    "id": 71,
    "cond": "uni2",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s2"
  },
  {
    "...1": 73,
    "seq": "ice_hen_lion_oak_mouse_",
    "id": 72,
    "cond": "bi",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s1"
  },
  {
    "...1": 74,
    "seq": "control",
    "id": 73,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s5"
  },
  {
    "...1": 75,
    "seq": "control",
    "id": 74,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s6"
  },
  {
    "...1": 76,
    "seq": "control",
    "id": 75,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s5"
  },
  {
    "...1": 77,
    "seq": "control",
    "id": 76,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s6"
  },
  {
    "...1": 78,
    "seq": "control",
    "id": 77,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s5"
  },
  {
    "...1": 79,
    "seq": "control",
    "id": 78,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s6"
  },
  {
    "...1": 80,
    "seq": "control",
    "id": 79,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s5"
  },
  {
    "...1": 81,
    "seq": "control",
    "id": 80,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s6"
  },
  {
    "...1": 82,
    "seq": "control",
    "id": 81,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s5"
  },
  {
    "...1": 83,
    "seq": "control",
    "id": 82,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s6"
  },
  {
    "...1": 84,
    "seq": "control",
    "id": 83,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s5"
  },
  {
    "...1": 85,
    "seq": "control",
    "id": 84,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s6"
  },
  {
    "...1": 86,
    "seq": "control",
    "id": 85,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s5"
  },
  {
    "...1": 87,
    "seq": "control",
    "id": 86,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s6"
  },
  {
    "...1": 88,
    "seq": "control",
    "id": 87,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s5"
  },
  {
    "...1": 89,
    "seq": "control",
    "id": 88,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s6"
  },
  {
    "...1": 90,
    "seq": "control",
    "id": 89,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s5"
  },
  {
    "...1": 91,
    "seq": "control",
    "id": 90,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s6"
  },
  {
    "...1": 92,
    "seq": "control",
    "id": 91,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s5"
  },
  {
    "...1": 93,
    "seq": "control",
    "id": 92,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s6"
  },
  {
    "...1": 94,
    "seq": "control",
    "id": 93,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s5"
  },
  {
    "...1": 95,
    "seq": "control",
    "id": 94,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s6"
  },
  {
    "...1": 96,
    "seq": "control",
    "id": 95,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s5"
  },
  {
    "...1": 97,
    "seq": "control",
    "id": 96,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s6"
  },
  {
    "...1": 98,
    "seq": "control",
    "id": 97,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s5"
  },
  {
    "...1": 99,
    "seq": "control",
    "id": 98,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s6"
  },
  {
    "...1": 100,
    "seq": "control",
    "id": 99,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s5"
  },
  {
    "...1": 101,
    "seq": "control",
    "id": 100,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s6"
  },
  {
    "...1": 102,
    "seq": "control",
    "id": 101,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s5"
  },
  {
    "...1": 103,
    "seq": "control",
    "id": 102,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s6"
  },
  {
    "...1": 104,
    "seq": "control",
    "id": 103,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s5"
  },
  {
    "...1": 105,
    "seq": "control",
    "id": 104,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s6"
  },
  {
    "...1": 106,
    "seq": "control",
    "id": 105,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s5"
  },
  {
    "...1": 107,
    "seq": "control",
    "id": 106,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s6"
  },
  {
    "...1": 108,
    "seq": "control",
    "id": 107,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s5"
  },
  {
    "...1": 109,
    "seq": "control",
    "id": 108,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s6"
  },
  {
    "...1": 110,
    "seq": "control",
    "id": 109,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s5"
  },
  {
    "...1": 111,
    "seq": "control",
    "id": 110,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s6"
  },
  {
    "...1": 112,
    "seq": "control",
    "id": 111,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s5"
  },
  {
    "...1": 113,
    "seq": "control",
    "id": 112,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s6"
  },
  {
    "...1": 114,
    "seq": "control",
    "id": 113,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s5"
  },
  {
    "...1": 115,
    "seq": "control",
    "id": 114,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s6"
  },
  {
    "...1": 116,
    "seq": "control",
    "id": 115,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s5"
  },
  {
    "...1": 117,
    "seq": "control",
    "id": 116,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s6"
  },
  {
    "...1": 118,
    "seq": "control",
    "id": 117,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s5"
  },
  {
    "...1": 119,
    "seq": "control",
    "id": 118,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s6"
  },
  {
    "...1": 120,
    "seq": "control",
    "id": 119,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s5"
  },
  {
    "...1": 121,
    "seq": "control",
    "id": 120,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s6"
  },
  {
    "...1": 122,
    "seq": "control",
    "id": 121,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s5"
  },
  {
    "...1": 123,
    "seq": "control",
    "id": 122,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s6"
  },
  {
    "...1": 124,
    "seq": "control",
    "id": 123,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s5"
  },
  {
    "...1": 125,
    "seq": "control",
    "id": 124,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s6"
  },
  {
    "...1": 126,
    "seq": "control",
    "id": 125,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s5"
  },
  {
    "...1": 127,
    "seq": "control",
    "id": 126,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s6"
  },
  {
    "...1": 128,
    "seq": "control",
    "id": 127,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s5"
  },
  {
    "...1": 129,
    "seq": "control",
    "id": 128,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s6"
  },
  {
    "...1": 130,
    "seq": "control",
    "id": 129,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s5"
  },
  {
    "...1": 131,
    "seq": "control",
    "id": 130,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s6"
  },
  {
    "...1": 132,
    "seq": "control",
    "id": 131,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s5"
  },
  {
    "...1": 133,
    "seq": "control",
    "id": 132,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s6"
  },
  {
    "...1": 134,
    "seq": "control",
    "id": 133,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s5"
  },
  {
    "...1": 135,
    "seq": "control",
    "id": 134,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s6"
  },
  {
    "...1": 136,
    "seq": "control",
    "id": 135,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s5"
  },
  {
    "...1": 137,
    "seq": "control",
    "id": 136,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s6"
  },
  {
    "...1": 138,
    "seq": "control",
    "id": 137,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s5"
  },
  {
    "...1": 139,
    "seq": "control",
    "id": 138,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s6"
  },
  {
    "...1": 140,
    "seq": "control",
    "id": 139,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s5"
  },
  {
    "...1": 141,
    "seq": "control",
    "id": 140,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s6"
  },
  {
    "...1": 142,
    "seq": "control",
    "id": 141,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s5"
  },
  {
    "...1": 143,
    "seq": "control",
    "id": 142,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s6"
  },
  {
    "...1": 144,
    "seq": "control",
    "id": 143,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s5"
  },
  {
    "...1": 145,
    "seq": "control",
    "id": 144,
    "cond": "control",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s6"
  }
];