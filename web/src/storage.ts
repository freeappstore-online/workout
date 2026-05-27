import type { AppSettings, Workout } from "./types";

const WORKOUTS_KEY = "workout-tracker-workouts";
const SETTINGS_KEY = "workout-tracker-settings";

const defaultSettings: AppSettings = {
  weightUnit: "kg",
  restTimerSeconds: 90,
};

export function loadWorkouts(): Workout[] {
  try {
    const raw = localStorage.getItem(WORKOUTS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Workout[];
  } catch {
    return [];
  }
}

export function saveWorkouts(workouts: Workout[]): void {
  localStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return defaultSettings;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return defaultSettings;
    return { ...defaultSettings, ...(parsed as Partial<AppSettings>) };
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
