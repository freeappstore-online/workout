import type { PresetRoutine } from "../types";

export const presetRoutines: PresetRoutine[] = [
  {
    name: "Push Day",
    exerciseIds: [
      "bench-press",
      "incline-press",
      "overhead-press",
      "lateral-raise",
      "tricep-pushdown",
      "skull-crusher",
    ],
  },
  {
    name: "Pull Day",
    exerciseIds: [
      "pull-ups",
      "barbell-row",
      "lat-pulldown",
      "face-pull",
      "bicep-curl",
      "hammer-curl",
    ],
  },
  {
    name: "Leg Day",
    exerciseIds: [
      "squat",
      "leg-press",
      "romanian-deadlift",
      "leg-curl",
      "leg-extension",
      "calf-raise",
    ],
  },
  {
    name: "Upper Body",
    exerciseIds: [
      "bench-press",
      "barbell-row",
      "overhead-press",
      "pull-ups",
      "bicep-curl",
      "tricep-pushdown",
    ],
  },
  {
    name: "Lower Body",
    exerciseIds: [
      "squat",
      "deadlift",
      "lunges",
      "leg-curl",
      "leg-extension",
      "calf-raise",
    ],
  },
  {
    name: "Full Body",
    exerciseIds: [
      "squat",
      "bench-press",
      "barbell-row",
      "overhead-press",
      "bicep-curl",
      "plank",
    ],
  },
];
