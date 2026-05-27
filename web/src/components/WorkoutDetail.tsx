import type { Workout, WeightUnit } from "../types";
import { getExerciseById } from "../data/exercises";
import { formatDate, formatWeight, totalVolume } from "../utils";

interface WorkoutDetailProps {
  workout: Workout;
  weightUnit: WeightUnit;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export default function WorkoutDetail({
  workout,
  weightUnit,
  onDelete,
  onClose,
}: WorkoutDetailProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.5)" }}
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-md max-h-[85vh] rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col"
        style={{ background: "var(--paper)" }}
      >
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: "var(--line)" }}>
          <div>
            <h2 className="font-bold text-lg">{formatDate(workout.date)}</h2>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              {workout.exercises.length} exercise{workout.exercises.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onDelete(workout.id);
                onClose();
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
              style={{
                background: "transparent",
                border: "1px solid var(--error)",
                color: "var(--error)",
              }}
            >
              Delete
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer"
              style={{ background: "var(--panel)", border: "none", color: "var(--ink)" }}
            >
              X
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-3">
          {workout.exercises.map((entry, idx) => {
            const exercise = getExerciseById(entry.exerciseId);
            if (!exercise) return null;
            const isCardio = exercise.type === "cardio";

            return (
              <div
                key={idx}
                className="rounded-xl p-3"
                style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
              >
                <h3 className="font-semibold text-sm mb-2">{exercise.name}</h3>

                {isCardio ? (
                  <div className="text-sm" style={{ color: "var(--muted)" }}>
                    {entry.duration ? `${entry.duration} min` : ""}
                    {entry.duration && entry.distance ? " / " : ""}
                    {entry.distance ? `${entry.distance} km` : ""}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {entry.sets.map((set, si) => (
                      <div
                        key={si}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span
                          className="w-6 text-xs font-medium"
                          style={{ color: "var(--muted)" }}
                        >
                          {si + 1}.
                        </span>
                        <span>{set.reps} reps</span>
                        <span style={{ color: "var(--muted)" }}>x</span>
                        <span className="font-medium">
                          {formatWeight(set.weight, weightUnit)}
                        </span>
                      </div>
                    ))}
                    <div
                      className="text-xs mt-1 pt-1 border-t"
                      style={{ color: "var(--muted)", borderColor: "var(--line)" }}
                    >
                      Volume: {formatWeight(totalVolume(entry), weightUnit)}
                    </div>
                  </div>
                )}

                {entry.notes && (
                  <p className="text-xs mt-2 italic" style={{ color: "var(--muted)" }}>
                    {entry.notes}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
