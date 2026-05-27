import type { Exercise } from "../types";

export const exercises: Exercise[] = [
  // Chest
  { id: "bench-press", name: "Bench Press", muscleGroup: "chest", type: "strength", description: "Flat barbell bench press targeting the pectorals" },
  { id: "incline-press", name: "Incline Press", muscleGroup: "chest", type: "strength", description: "Incline barbell or dumbbell press for upper chest" },
  { id: "push-ups", name: "Push-Ups", muscleGroup: "chest", type: "strength", description: "Bodyweight push-ups targeting chest and triceps" },
  { id: "chest-fly", name: "Chest Fly", muscleGroup: "chest", type: "strength", description: "Dumbbell or cable fly isolating the pectorals" },
  { id: "dips", name: "Dips", muscleGroup: "chest", type: "strength", description: "Parallel bar dips for chest and triceps" },

  // Back
  { id: "pull-ups", name: "Pull-Ups", muscleGroup: "back", type: "strength", description: "Bodyweight pull-ups targeting lats and biceps" },
  { id: "barbell-row", name: "Barbell Row", muscleGroup: "back", type: "strength", description: "Bent-over barbell row for back thickness" },
  { id: "deadlift", name: "Deadlift", muscleGroup: "back", type: "strength", description: "Conventional deadlift targeting posterior chain" },
  { id: "lat-pulldown", name: "Lat Pulldown", muscleGroup: "back", type: "strength", description: "Cable lat pulldown for lat width" },
  { id: "seated-row", name: "Seated Row", muscleGroup: "back", type: "strength", description: "Cable seated row for mid-back" },

  // Shoulders
  { id: "overhead-press", name: "Overhead Press", muscleGroup: "shoulders", type: "strength", description: "Standing barbell or dumbbell overhead press" },
  { id: "lateral-raise", name: "Lateral Raise", muscleGroup: "shoulders", type: "strength", description: "Dumbbell lateral raise for side delts" },
  { id: "front-raise", name: "Front Raise", muscleGroup: "shoulders", type: "strength", description: "Dumbbell front raise for anterior delts" },
  { id: "face-pull", name: "Face Pull", muscleGroup: "shoulders", type: "strength", description: "Cable face pull for rear delts and rotator cuff" },
  { id: "shrugs", name: "Shrugs", muscleGroup: "shoulders", type: "strength", description: "Barbell or dumbbell shrugs for trapezius" },

  // Arms
  { id: "bicep-curl", name: "Bicep Curl", muscleGroup: "arms", type: "strength", description: "Dumbbell or barbell bicep curl" },
  { id: "tricep-pushdown", name: "Tricep Pushdown", muscleGroup: "arms", type: "strength", description: "Cable tricep pushdown" },
  { id: "hammer-curl", name: "Hammer Curl", muscleGroup: "arms", type: "strength", description: "Dumbbell hammer curl for brachialis" },
  { id: "skull-crusher", name: "Skull Crusher", muscleGroup: "arms", type: "strength", description: "Lying tricep extension with barbell or dumbbells" },
  { id: "preacher-curl", name: "Preacher Curl", muscleGroup: "arms", type: "strength", description: "Preacher bench bicep curl for isolation" },

  // Legs
  { id: "squat", name: "Squat", muscleGroup: "legs", type: "strength", description: "Barbell back squat targeting quads and glutes" },
  { id: "leg-press", name: "Leg Press", muscleGroup: "legs", type: "strength", description: "Machine leg press for quads and glutes" },
  { id: "lunges", name: "Lunges", muscleGroup: "legs", type: "strength", description: "Walking or stationary lunges" },
  { id: "leg-curl", name: "Leg Curl", muscleGroup: "legs", type: "strength", description: "Machine leg curl for hamstrings" },
  { id: "leg-extension", name: "Leg Extension", muscleGroup: "legs", type: "strength", description: "Machine leg extension for quads" },
  { id: "calf-raise", name: "Calf Raise", muscleGroup: "legs", type: "strength", description: "Standing or seated calf raise" },
  { id: "romanian-deadlift", name: "Romanian Deadlift", muscleGroup: "legs", type: "strength", description: "Romanian deadlift targeting hamstrings and glutes" },

  // Core
  { id: "plank", name: "Plank", muscleGroup: "core", type: "strength", description: "Isometric plank hold for core stability" },
  { id: "crunches", name: "Crunches", muscleGroup: "core", type: "strength", description: "Standard crunches for rectus abdominis" },
  { id: "russian-twist", name: "Russian Twist", muscleGroup: "core", type: "strength", description: "Seated twist with or without weight for obliques" },
  { id: "leg-raise", name: "Leg Raise", muscleGroup: "core", type: "strength", description: "Hanging or lying leg raise for lower abs" },
  { id: "ab-wheel", name: "Ab Wheel", muscleGroup: "core", type: "strength", description: "Ab wheel rollout for full core engagement" },

  // Cardio
  { id: "running", name: "Running", muscleGroup: "cardio", type: "cardio", description: "Outdoor or treadmill running" },
  { id: "cycling", name: "Cycling", muscleGroup: "cardio", type: "cardio", description: "Outdoor or stationary bike cycling" },
  { id: "jump-rope", name: "Jump Rope", muscleGroup: "cardio", type: "cardio", description: "Skipping rope for cardio and coordination" },
  { id: "rowing", name: "Rowing", muscleGroup: "cardio", type: "cardio", description: "Rowing machine for full-body cardio" },
  { id: "swimming", name: "Swimming", muscleGroup: "cardio", type: "cardio", description: "Pool swimming for low-impact full-body cardio" },
];

export const muscleGroups = [
  "chest",
  "back",
  "shoulders",
  "arms",
  "legs",
  "core",
  "cardio",
] as const;

export function getExerciseById(id: string): Exercise | undefined {
  return exercises.find((e) => e.id === id);
}

export function getExercisesByMuscleGroup(group: string): Exercise[] {
  return exercises.filter((e) => e.muscleGroup === group);
}
