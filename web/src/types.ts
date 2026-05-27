export type MuscleGroup =
  | "chest"
  | "back"
  | "shoulders"
  | "arms"
  | "legs"
  | "core"
  | "cardio";

export type ExerciseType = "strength" | "cardio";

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  type: ExerciseType;
  description: string;
}

export interface StrengthSet {
  reps: number;
  weight: number;
}

export interface ExerciseEntry {
  exerciseId: string;
  sets: StrengthSet[];
  duration?: number; // minutes, for cardio
  distance?: number; // km, for cardio
  notes: string;
}

export interface Workout {
  id: string;
  date: string; // YYYY-MM-DD
  exercises: ExerciseEntry[];
  createdAt: string; // ISO
}

export type WeightUnit = "kg" | "lbs";

export interface AppSettings {
  weightUnit: WeightUnit;
  restTimerSeconds: number;
}

export type Tab = "log" | "history" | "progress" | "dashboard";

export interface PresetRoutine {
  name: string;
  exerciseIds: string[];
}
