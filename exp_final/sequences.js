// important: "first_speaker" does not always agree to the first speaker in a given video, the first speaker is chosen randomly based on the first speaker value

var seq = [
  {
    "seq": "lion_hen_oak_ice_mouse_",
    "id": 0,
    "cond": "bi",
    "pilot": "y",
    "progress": 0,
    "first_speaker": "s1",
    "second_speaker": "s3"
  },
  {
    "seq": "lion_ice_oak_hen_mouse_",
    "id": 3,
    "cond": "bi",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s3",
    "second_speaker": "s1"
  },
  {
    "seq": "oak_hen_lion_ice_mouse_",
    "id": 6,
    "cond": "bi",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s1",
    "second_speaker": "s4"
  },
  {
    "seq": "oak_ice_lion_hen_mouse_",
    "id": 9,
    "cond": "bi",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s3",
    "second_speaker": "s2"
  },
  {
    "seq": "hen_lion_ice_oak_mouse_",
    "id": 12,
    "cond": "bi",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s1",
    "second_speaker": "s3"
  },
  {
    "seq": "hen_oak_ice_lion_mouse_",
    "id": 15,
    "cond": "bi",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s3",
    "second_speaker": "s1"
  },
  {
    "seq": "ice_lion_hen_oak_mouse_",
    "id": 18,
    "cond": "bi",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s1",
    "second_speaker": "s4"
  },
  {
    "seq": "ice_oak_hen_lion_mouse_",
    "id": 21,
    "cond": "bi",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s3",
    "second_speaker": "s2"
  },
  {
    "seq": "lion_hen_oak_ice_mouse_",
    "id": 24,
    "cond": "bi",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s1",
    "second_speaker": "s3"
  },
  {
    "seq": "lion_ice_oak_hen_mouse_",
    "id": 27,
    "cond": "bi",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s3",
    "second_speaker": "s1"
  },
  {
    "seq": "oak_hen_lion_ice_mouse_",
    "id": 30,
    "cond": "bi",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s1",
    "second_speaker": "s4"
  },
  {
    "seq": "oak_ice_lion_hen_mouse_",
    "id": 33,
    "cond": "bi",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s3",
    "second_speaker": "s2"
  },
  {
    "seq": "hen_lion_ice_oak_mouse_",
    "id": 36,
    "cond": "bi",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s1",
    "second_speaker": "s3"
  },
  {
    "seq": "hen_oak_ice_lion_mouse_",
    "id": 39,
    "cond": "bi",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s3",
    "second_speaker": "s1"
  },
  {
    "seq": "ice_lion_hen_oak_mouse_",
    "id": 42,
    "cond": "bi",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s1",
    "second_speaker": "s4"
  },
  {
    "seq": "ice_oak_hen_lion_mouse_",
    "id": 45,
    "cond": "bi",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s3",
    "second_speaker": "s2"
  },
  {
    "seq": "lion_hen_oak_ice_mouse_",
    "id": 48,
    "cond": "bi",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s1",
    "second_speaker": "s3"
  },
  {
    "seq": "lion_ice_oak_hen_mouse_",
    "id": 51,
    "cond": "bi",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s3",
    "second_speaker": "s1"
  },
  {
    "seq": "oak_hen_lion_ice_mouse_",
    "id": 54,
    "cond": "bi",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s1",
    "second_speaker": "s4"
  },
  {
    "seq": "oak_ice_lion_hen_mouse_",
    "id": 57,
    "cond": "bi",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s3",
    "second_speaker": "s2"
  },
  {
    "seq": "hen_lion_ice_oak_mouse_",
    "id": 60,
    "cond": "bi",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s1",
    "second_speaker": "s3"
  },
  {
    "seq": "hen_oak_ice_lion_mouse_",
    "id": 63,
    "cond": "bi",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s3",
    "second_speaker": "s1"
  },
  {
    "seq": "ice_lion_hen_oak_mouse_",
    "id": 66,
    "cond": "bi",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s1",
    "second_speaker": "s4"
  },
  {
    "seq": "ice_oak_hen_lion_mouse_",
    "id": 69,
    "cond": "bi",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s3",
    "second_speaker": "s2"
  },
  {
    "seq": "lion_hen_oak_ice_mouse_",
    "id": 72,
    "cond": "bi",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s1",
    "second_speaker": "s3"
  },
  {
    "seq": "lion_ice_oak_hen_mouse_",
    "id": 1,
    "cond": "uni1",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s3",
    "second_speaker": "s4"
  },
  {
    "seq": "oak_hen_lion_ice_mouse_",
    "id": 4,
    "cond": "uni1",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s4",
    "second_speaker": "s3"
  },
  {
    "seq": "oak_ice_lion_hen_mouse_",
    "id": 7,
    "cond": "uni1",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s3",
    "second_speaker": "s4"
  },
  {
    "seq": "hen_lion_ice_oak_mouse_",
    "id": 10,
    "cond": "uni1",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s4",
    "second_speaker": "s3"
  },
  {
    "seq": "hen_oak_ice_lion_mouse_",
    "id": 13,
    "cond": "uni1",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s3",
    "second_speaker": "s4"
  },
  {
    "seq": "ice_lion_hen_oak_mouse_",
    "id": 16,
    "cond": "uni1",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s4",
    "second_speaker": "s3"
  },
  {
    "seq": "ice_oak_hen_lion_mouse_",
    "id": 19,
    "cond": "uni1",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s3",
    "second_speaker": "s4"
  },
  {
    "seq": "lion_hen_oak_ice_mouse_",
    "id": 22,
    "cond": "uni1",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s4",
    "second_speaker": "s3"
  },
  {
    "seq": "lion_ice_oak_hen_mouse_",
    "id": 25,
    "cond": "uni1",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s3",
    "second_speaker": "s4"
  },
  {
    "seq": "oak_hen_lion_ice_mouse_",
    "id": 28,
    "cond": "uni1",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s4",
    "second_speaker": "s3"
  },
  {
    "seq": "oak_ice_lion_hen_mouse_",
    "id": 31,
    "cond": "uni1",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s3",
    "second_speaker": "s4"
  },
  {
    "seq": "hen_lion_ice_oak_mouse_",
    "id": 34,
    "cond": "uni1",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s4",
    "second_speaker": "s3"
  },
  {
    "seq": "hen_oak_ice_lion_mouse_",
    "id": 37,
    "cond": "uni1",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s3",
    "second_speaker": "s4"
  },
  {
    "seq": "ice_lion_hen_oak_mouse_",
    "id": 40,
    "cond": "uni1",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s4",
    "second_speaker": "s3"
  },
  {
    "seq": "ice_oak_hen_lion_mouse_",
    "id": 43,
    "cond": "uni1",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s3",
    "second_speaker": "s4"
  },
  {
    "seq": "lion_hen_oak_ice_mouse_",
    "id": 46,
    "cond": "uni1",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s4",
    "second_speaker": "s3"
  },
  {
    "seq": "lion_ice_oak_hen_mouse_",
    "id": 49,
    "cond": "uni1",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s3",
    "second_speaker": "s4"
  },
  {
    "seq": "oak_hen_lion_ice_mouse_",
    "id": 52,
    "cond": "uni1",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s4",
    "second_speaker": "s3"
  },
  {
    "seq": "oak_ice_lion_hen_mouse_",
    "id": 55,
    "cond": "uni1",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s3",
    "second_speaker": "s4"
  },
  {
    "seq": "hen_lion_ice_oak_mouse_",
    "id": 58,
    "cond": "uni1",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s4",
    "second_speaker": "s3"
  },
  {
    "seq": "hen_oak_ice_lion_mouse_",
    "id": 61,
    "cond": "uni1",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s3",
    "second_speaker": "s4"
  },
  {
    "seq": "ice_lion_hen_oak_mouse_",
    "id": 64,
    "cond": "uni1",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s4",
    "second_speaker": "s3"
  },
  {
    "seq": "ice_oak_hen_lion_mouse_",
    "id": 67,
    "cond": "uni1",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s3",
    "second_speaker": "s4"
  },
  {
    "seq": "lion_hen_oak_ice_mouse_",
    "id": 70,
    "cond": "uni1",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s4",
    "second_speaker": "s3"
  },
  {
    "seq": "lion_ice_oak_hen_mouse_",
    "id": 2,
    "cond": "uni2",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s1",
    "second_speaker": "s2"
  },
  {
    "seq": "oak_hen_lion_ice_mouse_",
    "id": 5,
    "cond": "uni2",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s2",
    "second_speaker": "s1"
  },
  {
    "seq": "oak_ice_lion_hen_mouse_",
    "id": 8,
    "cond": "uni2",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s1",
    "second_speaker": "s2"
  },
  {
    "seq": "hen_lion_ice_oak_mouse_",
    "id": 11,
    "cond": "uni2",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s2",
    "second_speaker": "s1"
  },
  {
    "seq": "hen_oak_ice_lion_mouse_",
    "id": 14,
    "cond": "uni2",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s1",
    "second_speaker": "s2"
  },
  {
    "seq": "ice_lion_hen_oak_mouse_",
    "id": 17,
    "cond": "uni2",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s2",
    "second_speaker": "s1"
  },
  {
    "seq": "ice_oak_hen_lion_mouse_",
    "id": 20,
    "cond": "uni2",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s1",
    "second_speaker": "s2"
  },
  {
    "seq": "lion_hen_oak_ice_mouse_",
    "id": 23,
    "cond": "uni2",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s2",
    "second_speaker": "s1"
  },
  {
    "seq": "lion_ice_oak_hen_mouse_",
    "id": 26,
    "cond": "uni2",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s1",
    "second_speaker": "s2"
  },
  {
    "seq": "oak_hen_lion_ice_mouse_",
    "id": 29,
    "cond": "uni2",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s2",
    "second_speaker": "s1"
  },
  {
    "seq": "oak_ice_lion_hen_mouse_",
    "id": 32,
    "cond": "uni2",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s1",
    "second_speaker": "s2"
  },
  {
    "seq": "hen_lion_ice_oak_mouse_",
    "id": 35,
    "cond": "uni2",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s2",
    "second_speaker": "s1"
  },
  {
    "seq": "hen_oak_ice_lion_mouse_",
    "id": 38,
    "cond": "uni2",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s1",
    "second_speaker": "s2"
  },
  {
    "seq": "ice_lion_hen_oak_mouse_",
    "id": 41,
    "cond": "uni2",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s2",
    "second_speaker": "s1"
  },
  {
    "seq": "ice_oak_hen_lion_mouse_",
    "id": 44,
    "cond": "uni2",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s1",
    "second_speaker": "s2"
  },
  {
    "seq": "lion_hen_oak_ice_mouse_",
    "id": 47,
    "cond": "uni2",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s2",
    "second_speaker": "s1"
  },
  {
    "seq": "lion_ice_oak_hen_mouse_",
    "id": 50,
    "cond": "uni2",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s1",
    "second_speaker": "s2"
  },
  {
    "seq": "oak_hen_lion_ice_mouse_",
    "id": 53,
    "cond": "uni2",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s2",
    "second_speaker": "s1"
  },
  {
    "seq": "oak_ice_lion_hen_mouse_",
    "id": 56,
    "cond": "uni2",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s1",
    "second_speaker": "s2"
  },
  {
    "seq": "hen_lion_ice_oak_mouse_",
    "id": 59,
    "cond": "uni2",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s2",
    "second_speaker": "s1"
  },
  {
    "seq": "hen_oak_ice_lion_mouse_",
    "id": 62,
    "cond": "uni2",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s1",
    "second_speaker": "s2"
  },
  {
    "seq": "ice_lion_hen_oak_mouse_",
    "id": 65,
    "cond": "uni2",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s2",
    "second_speaker": "s1"
  },
  {
    "seq": "ice_oak_hen_lion_mouse_",
    "id": 68,
    "cond": "uni2",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s1",
    "second_speaker": "s2"
  },
  {
    "seq": "lion_hen_oak_ice_mouse_",
    "id": 71,
    "cond": "uni2",
    "pilot": "n",
    "progress": 0,
    "first_speaker": "s2",
    "second_speaker": "s1"
  }
]