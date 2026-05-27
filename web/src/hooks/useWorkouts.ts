import { useState, useCallback } from "react";
import type { Workout } from "../types";
import { loadWorkouts, saveWorkouts } from "../storage";

export function useWorkouts() {
  const [workouts, setWorkouts] = useState<Workout[]>(() => loadWorkouts());

  const addWorkout = useCallback((workout: Workout) => {
    setWorkouts((prev) => {
      const next = [workout, ...prev];
      saveWorkouts(next);
      return next;
    });
  }, []);

  const deleteWorkout = useCallback((id: string) => {
    setWorkouts((prev) => {
      const next = prev.filter((w) => w.id !== id);
      saveWorkouts(next);
      return next;
    });
  }, []);

  return { workouts, addWorkout, deleteWorkout };
}
