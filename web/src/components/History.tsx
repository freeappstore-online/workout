import { useState, useMemo } from "react";
import type { Workout, WeightUnit } from "../types";
import { formatDate, workoutTotalVolume, formatWeight } from "../utils";
import Calendar from "./Calendar";
import WorkoutDetail from "./WorkoutDetail";

interface HistoryProps {
  workouts: Workout[];
  weightUnit: WeightUnit;
  onDelete: (id: string) => void;
}

export default function History({ workouts, weightUnit, onDelete }: HistoryProps) {
  const now = new Date();
  const [calMonth, setCalMonth] = useState(now.getMonth());
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [detailWorkout, setDetailWorkout] = useState<Workout | null>(null);

  const workoutDates = useMemo(
    () => new Set(workouts.map((w) => w.date)),
    [workouts],
  );

  const filteredWorkouts = useMemo(() => {
    if (selectedDate) {
      return workouts.filter((w) => w.date === selectedDate);
    }
    return [...workouts].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [workouts, selectedDate]);

  const handlePrevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear((y) => y - 1);
    } else {
      setCalMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear((y) => y + 1);
    } else {
      setCalMonth((m) => m + 1);
    }
  };

  return (
    <div className="pb-20 px-4 pt-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Workout History</h1>

      <div className="mb-4">
        <Calendar
          workoutDates={workoutDates}
          selectedDate={selectedDate}
          onSelectDate={(d) => setSelectedDate(d === selectedDate ? null : d)}
          month={calMonth}
          year={calYear}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />
      </div>

      {selectedDate && (
        <button
          onClick={() => setSelectedDate(null)}
          className="mb-3 px-3 py-1 rounded-full text-xs font-medium cursor-pointer"
          style={{
            background: "var(--accent)",
            color: "#fff",
            border: "none",
          }}
        >
          Showing: {formatDate(selectedDate)} &times; Clear
        </button>
      )}

      {filteredWorkouts.length === 0 && (
        <p className="text-center py-8 text-sm" style={{ color: "var(--muted)" }}>
          {selectedDate
            ? "No workouts on this day"
            : "No workouts logged yet. Start your first workout!"}
        </p>
      )}

      <div className="space-y-2">
        {filteredWorkouts.map((workout) => (
          <button
            key={workout.id}
            onClick={() => setDetailWorkout(workout)}
            className="w-full text-left p-4 rounded-xl cursor-pointer transition-colors"
            style={{
              background: "var(--panel)",
              border: "1px solid var(--line)",
              color: "var(--ink)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm">
                  {formatDate(workout.date)}
                </div>
                <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                  {workout.exercises.length} exercise
                  {workout.exercises.length !== 1 ? "s" : ""}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">
                  {formatWeight(workoutTotalVolume(workout), weightUnit)}
                </div>
                <div className="text-xs" style={{ color: "var(--muted)" }}>
                  total volume
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {detailWorkout && (
        <WorkoutDetail
          workout={detailWorkout}
          weightUnit={weightUnit}
          onDelete={onDelete}
          onClose={() => setDetailWorkout(null)}
        />
      )}
    </div>
  );
}
