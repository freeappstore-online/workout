import type { ExerciseEntry, StrengthSet, WeightUnit, Workout } from "./types";
import { getExerciseById } from "./data/exercises";

/** Epley formula: weight * (1 + reps / 30) */
export function estimated1RM(set: StrengthSet): number {
  if (set.reps <= 0 || set.weight <= 0) return 0;
  if (set.reps === 1) return set.weight;
  return set.weight * (1 + set.reps / 30);
}

export function convertWeight(value: number, from: WeightUnit, to: WeightUnit): number {
  if (from === to) return value;
  if (from === "kg" && to === "lbs") return value * 2.20462;
  return value / 2.20462;
}

export function formatWeight(value: number, unit: WeightUnit): string {
  return `${Math.round(value * 10) / 10} ${unit}`;
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function totalVolume(entry: ExerciseEntry): number {
  return entry.sets.reduce((sum, s) => sum + s.reps * s.weight, 0);
}

export function workoutTotalVolume(workout: Workout): number {
  return workout.exercises.reduce((sum, e) => sum + totalVolume(e), 0);
}

export function bestSet(entry: ExerciseEntry): StrengthSet | null {
  let best: StrengthSet | null = null;
  let best1RM = 0;
  for (const s of entry.sets) {
    const e = estimated1RM(s);
    if (e > best1RM) {
      best1RM = e;
      best = s;
    }
  }
  return best;
}

/** Get ISO week number */
export function getWeekNumber(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

/** Count consecutive weeks with at least one workout, ending at current week */
export function calculateStreak(workouts: Workout[]): number {
  if (workouts.length === 0) return 0;
  const weekSet = new Set(workouts.map((w) => getWeekNumber(w.date)));
  const now = new Date();
  let streak = 0;
  for (let i = 0; i < 200; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i * 7);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const wk = getWeekNumber(iso);
    if (weekSet.has(wk)) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  return streak;
}

/** Personal records for a given exercise across all workouts */
export function personalRecords(
  workouts: Workout[],
  exerciseId: string,
): { heaviestSet: StrengthSet | null; mostReps: StrengthSet | null; best1RM: number } {
  let heaviestSet: StrengthSet | null = null;
  let mostReps: StrengthSet | null = null;
  let best1RMVal = 0;

  for (const w of workouts) {
    for (const entry of w.exercises) {
      if (entry.exerciseId !== exerciseId) continue;
      for (const s of entry.sets) {
        if (!heaviestSet || s.weight > heaviestSet.weight) heaviestSet = s;
        if (!mostReps || s.reps > mostReps.reps) mostReps = s;
        const e = estimated1RM(s);
        if (e > best1RMVal) best1RMVal = e;
      }
    }
  }

  return { heaviestSet, mostReps, best1RM: best1RMVal };
}

/** Get the muscle group distribution from workouts */
export function muscleGroupDistribution(
  workouts: Workout[],
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const w of workouts) {
    for (const entry of w.exercises) {
      const ex = getExerciseById(entry.exerciseId);
      if (ex) {
        counts[ex.muscleGroup] = (counts[ex.muscleGroup] ?? 0) + 1;
      }
    }
  }
  return counts;
}

export function generateId(): string {
  return crypto.randomUUID();
}
