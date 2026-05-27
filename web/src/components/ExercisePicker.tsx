import { useState } from "react";
import type { Exercise, MuscleGroup } from "../types";
import { exercises, muscleGroups } from "../data/exercises";

interface ExercisePickerProps {
  onSelect: (exercise: Exercise) => void;
  onClose: () => void;
}

const groupLabels: Record<MuscleGroup, string> = {
  chest: "Chest",
  back: "Back",
  shoulders: "Shoulders",
  arms: "Arms",
  legs: "Legs",
  core: "Core",
  cardio: "Cardio",
};

export default function ExercisePicker({ onSelect, onClose }: ExercisePickerProps) {
  const [search, setSearch] = useState("");
  const [filterGroup, setFilterGroup] = useState<MuscleGroup | "all">("all");

  const filtered = exercises.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
    const matchesGroup = filterGroup === "all" || ex.muscleGroup === filterGroup;
    return matchesSearch && matchesGroup;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.5)" }}
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-md max-h-[80vh] rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col"
        style={{ background: "var(--paper)" }}
      >
        <div className="p-4 border-b" style={{ borderColor: "var(--line)" }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-lg">Add Exercise</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer"
              style={{ background: "var(--panel)", border: "none", color: "var(--ink)" }}
            >
              X
            </button>
          </div>

          <input
            type="text"
            placeholder="Search exercises..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm mb-3"
            style={{
              background: "var(--panel)",
              border: "1px solid var(--line)",
              color: "var(--ink)",
              outline: "none",
            }}
          />

          <div className="flex gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => setFilterGroup("all")}
              className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap cursor-pointer"
              style={{
                background: filterGroup === "all" ? "var(--accent)" : "var(--panel)",
                color: filterGroup === "all" ? "#fff" : "var(--muted)",
                border: "1px solid var(--line)",
              }}
            >
              All
            </button>
            {muscleGroups.map((g) => (
              <button
                key={g}
                onClick={() => setFilterGroup(g)}
                className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap cursor-pointer"
                style={{
                  background: filterGroup === g ? "var(--accent)" : "var(--panel)",
                  color: filterGroup === g ? "#fff" : "var(--muted)",
                  border: "1px solid var(--line)",
                }}
              >
                {groupLabels[g]}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-y-auto flex-1 p-2">
          {filtered.length === 0 && (
            <p className="text-center py-8 text-sm" style={{ color: "var(--muted)" }}>
              No exercises found
            </p>
          )}
          {filtered.map((ex) => (
            <button
              key={ex.id}
              onClick={() => onSelect(ex)}
              className="w-full text-left px-3 py-3 rounded-lg mb-1 cursor-pointer transition-colors"
              style={{
                background: "transparent",
                border: "none",
                color: "var(--ink)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--panel)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">{ex.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                    {ex.description}
                  </div>
                </div>
                <span
                  className="text-xs px-2 py-0.5 rounded-full ml-2 shrink-0"
                  style={{
                    background: "var(--panel)",
                    color: "var(--muted)",
                    border: "1px solid var(--line)",
                  }}
                >
                  {groupLabels[ex.muscleGroup]}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
