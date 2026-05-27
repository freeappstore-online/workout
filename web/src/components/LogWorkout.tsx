import { useState, useCallback } from "react";
import type { Exercise, ExerciseEntry, StrengthSet, Workout, WeightUnit } from "../types";
import { getExerciseById } from "../data/exercises";
import { presetRoutines } from "../data/presets";
import { todayISO, generateId, formatWeight, convertWeight } from "../utils";
import ExercisePicker from "./ExercisePicker";
import RestTimer from "./RestTimer";

interface LogWorkoutProps {
  weightUnit: WeightUnit;
  restTimerSeconds: number;
  onSave: (workout: Workout) => void;
  onChangeRestTimer: (seconds: number) => void;
  lastWorkout: Workout | null;
  timerRemaining: number;
  timerRunning: boolean;
  onTimerStart: (seconds?: number) => void;
  onTimerStop: () => void;
}

function emptySet(): StrengthSet {
  return { reps: 0, weight: 0 };
}

function emptyEntry(exerciseId: string): ExerciseEntry {
  return { exerciseId, sets: [emptySet()], notes: "" };
}

export default function LogWorkout({
  weightUnit,
  restTimerSeconds,
  onSave,
  onChangeRestTimer,
  lastWorkout,
  timerRemaining,
  timerRunning,
  onTimerStart,
  onTimerStop,
}: LogWorkoutProps) {
  const [date, setDate] = useState(todayISO);
  const [entries, setEntries] = useState<ExerciseEntry[]>([]);
  const [showPicker, setShowPicker] = useState(false);

  const handleAddExercise = useCallback((exercise: Exercise) => {
    setEntries((prev) => [...prev, emptyEntry(exercise.id)]);
    setShowPicker(false);
  }, []);

  const handleRemoveEntry = useCallback((index: number) => {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleAddSet = useCallback((entryIndex: number) => {
    setEntries((prev) =>
      prev.map((entry, i) =>
        i === entryIndex
          ? { ...entry, sets: [...entry.sets, emptySet()] }
          : entry,
      ),
    );
  }, []);

  const handleRemoveSet = useCallback((entryIndex: number, setIndex: number) => {
    setEntries((prev) =>
      prev.map((entry, i) =>
        i === entryIndex
          ? { ...entry, sets: entry.sets.filter((_, si) => si !== setIndex) }
          : entry,
      ),
    );
  }, []);

  const handleSetChange = useCallback(
    (entryIndex: number, setIndex: number, field: "reps" | "weight", value: number) => {
      setEntries((prev) =>
        prev.map((entry, i) =>
          i === entryIndex
            ? {
                ...entry,
                sets: entry.sets.map((s, si) =>
                  si === setIndex ? { ...s, [field]: value } : s,
                ),
              }
            : entry,
        ),
      );
    },
    [],
  );

  const handleCardioChange = useCallback(
    (entryIndex: number, field: "duration" | "distance", value: number) => {
      setEntries((prev) =>
        prev.map((entry, i) =>
          i === entryIndex ? { ...entry, [field]: value } : entry,
        ),
      );
    },
    [],
  );

  const handleNotesChange = useCallback((entryIndex: number, notes: string) => {
    setEntries((prev) =>
      prev.map((entry, i) =>
        i === entryIndex ? { ...entry, notes } : entry,
      ),
    );
  }, []);

  const handleSave = useCallback(() => {
    if (entries.length === 0) return;
    const workout: Workout = {
      id: generateId(),
      date,
      exercises: entries,
      createdAt: new Date().toISOString(),
    };
    onSave(workout);
    setEntries([]);
    setDate(todayISO());
  }, [entries, date, onSave]);

  const handlePreset = useCallback((exerciseIds: string[]) => {
    setEntries(exerciseIds.map((id) => emptyEntry(id)));
  }, []);

  const handleRepeatLast = useCallback(() => {
    if (!lastWorkout) return;
    setEntries(
      lastWorkout.exercises.map((e) => ({
        ...e,
        sets: e.sets.map(() => emptySet()),
        notes: "",
      })),
    );
  }, [lastWorkout]);

  return (
    <div className="pb-20 px-4 pt-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Log Workout</h1>

      {/* Date picker */}
      <div className="mb-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 rounded-lg text-sm"
          style={{
            background: "var(--panel)",
            border: "1px solid var(--line)",
            color: "var(--ink)",
          }}
        />
      </div>

      {/* Quick Start */}
      {entries.length === 0 && (
        <div className="mb-4">
          <h3
            className="text-xs font-semibold uppercase tracking-wide mb-2"
            style={{ color: "var(--muted)" }}
          >
            Quick Start
          </h3>
          <div className="flex gap-2 flex-wrap mb-2">
            {presetRoutines.map((preset) => (
              <button
                key={preset.name}
                onClick={() => handlePreset(preset.exerciseIds)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
                style={{
                  background: "var(--panel)",
                  border: "1px solid var(--line)",
                  color: "var(--ink)",
                }}
              >
                {preset.name}
              </button>
            ))}
          </div>
          {lastWorkout && (
            <button
              onClick={handleRepeatLast}
              className="w-full py-2 rounded-lg text-sm font-medium cursor-pointer"
              style={{
                background: "var(--panel)",
                border: "1px solid var(--accent)",
                color: "var(--accent)",
              }}
            >
              Repeat Last Workout
            </button>
          )}
        </div>
      )}

      {/* Rest Timer */}
      <div className="mb-4">
        <RestTimer
          remaining={timerRemaining}
          isRunning={timerRunning}
          defaultSeconds={restTimerSeconds}
          onStart={onTimerStart}
          onStop={onTimerStop}
          onChangeDefault={onChangeRestTimer}
        />
      </div>

      {/* Exercise entries */}
      {entries.map((entry, entryIdx) => {
        const exercise = getExerciseById(entry.exerciseId);
        if (!exercise) return null;
        const isCardio = exercise.type === "cardio";

        return (
          <div
            key={entryIdx}
            className="mb-4 rounded-xl p-4"
            style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">{exercise.name}</h3>
              <button
                onClick={() => handleRemoveEntry(entryIdx)}
                className="text-xs px-2 py-1 rounded cursor-pointer"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--error)",
                }}
              >
                Remove
              </button>
            </div>

            {isCardio ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-xs block mb-1" style={{ color: "var(--muted)" }}>
                      Duration (min)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={entry.duration ?? ""}
                      onChange={(e) =>
                        handleCardioChange(entryIdx, "duration", Number(e.target.value))
                      }
                      className="w-full px-2 py-1.5 rounded-lg text-sm"
                      style={{
                        background: "var(--paper)",
                        border: "1px solid var(--line)",
                        color: "var(--ink)",
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs block mb-1" style={{ color: "var(--muted)" }}>
                      Distance (km)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={0.1}
                      value={entry.distance ?? ""}
                      onChange={(e) =>
                        handleCardioChange(entryIdx, "distance", Number(e.target.value))
                      }
                      className="w-full px-2 py-1.5 rounded-lg text-sm"
                      style={{
                        background: "var(--paper)",
                        border: "1px solid var(--line)",
                        color: "var(--ink)",
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-medium" style={{ color: "var(--muted)" }}>
                  <span className="w-8 text-center">Set</span>
                  <span className="flex-1 text-center">Reps</span>
                  <span className="flex-1 text-center">{weightUnit}</span>
                  <span className="w-8" />
                </div>
                {entry.sets.map((set, setIdx) => (
                  <div key={setIdx} className="flex items-center gap-2">
                    <span
                      className="w-8 text-center text-xs font-medium"
                      style={{ color: "var(--muted)" }}
                    >
                      {setIdx + 1}
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={set.reps || ""}
                      onChange={(e) =>
                        handleSetChange(entryIdx, setIdx, "reps", Number(e.target.value))
                      }
                      placeholder="Reps"
                      className="flex-1 px-2 py-1.5 rounded-lg text-sm text-center"
                      style={{
                        background: "var(--paper)",
                        border: "1px solid var(--line)",
                        color: "var(--ink)",
                      }}
                    />
                    <input
                      type="number"
                      min={0}
                      step={0.5}
                      value={set.weight || ""}
                      onChange={(e) =>
                        handleSetChange(entryIdx, setIdx, "weight", Number(e.target.value))
                      }
                      placeholder={weightUnit}
                      className="flex-1 px-2 py-1.5 rounded-lg text-sm text-center"
                      style={{
                        background: "var(--paper)",
                        border: "1px solid var(--line)",
                        color: "var(--ink)",
                      }}
                    />
                    <button
                      onClick={() => handleRemoveSet(entryIdx, setIdx)}
                      className="w-8 h-8 flex items-center justify-center rounded cursor-pointer text-xs"
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "var(--muted)",
                      }}
                      disabled={entry.sets.length <= 1}
                    >
                      -
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => handleAddSet(entryIdx)}
                  className="w-full py-1.5 rounded-lg text-xs font-medium cursor-pointer"
                  style={{
                    background: "transparent",
                    border: "1px dashed var(--line-strong)",
                    color: "var(--muted)",
                  }}
                >
                  + Add Set
                </button>
              </div>
            )}

            {/* Notes */}
            <div className="mt-2">
              <input
                type="text"
                placeholder="Notes..."
                value={entry.notes}
                onChange={(e) => handleNotesChange(entryIdx, e.target.value)}
                className="w-full px-2 py-1.5 rounded-lg text-xs"
                style={{
                  background: "var(--paper)",
                  border: "1px solid var(--line)",
                  color: "var(--ink)",
                }}
              />
            </div>

            {/* Display formatted weight for reference */}
            {!isCardio && entry.sets.some((s) => s.weight > 0) && (
              <div className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
                {entry.sets
                  .filter((s) => s.weight > 0)
                  .map(
                    (s, i) =>
                      `Set ${i + 1}: ${s.reps}x${formatWeight(
                        weightUnit === "lbs"
                          ? convertWeight(s.weight, "lbs", "kg")
                          : s.weight,
                        "kg",
                      )}`,
                  )
                  .join(" | ")}
              </div>
            )}
          </div>
        );
      })}

      {/* Add exercise button */}
      <button
        onClick={() => setShowPicker(true)}
        className="w-full py-3 rounded-xl text-sm font-medium cursor-pointer mb-4"
        style={{
          background: "var(--panel)",
          border: "2px dashed var(--line-strong)",
          color: "var(--accent)",
        }}
      >
        + Add Exercise
      </button>

      {/* Save */}
      {entries.length > 0 && (
        <button
          onClick={handleSave}
          className="w-full py-3 rounded-xl text-sm font-bold cursor-pointer"
          style={{
            background: "var(--accent)",
            border: "none",
            color: "#fff",
          }}
        >
          Save Workout
        </button>
      )}

      {showPicker && (
        <ExercisePicker
          onSelect={handleAddExercise}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}
