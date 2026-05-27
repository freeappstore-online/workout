import { useMemo } from "react";
import type { Workout, WeightUnit } from "../types";
import { exercises } from "../data/exercises";
import {
  workoutTotalVolume,
  calculateStreak,
  personalRecords,
  formatWeight,
  getWeekNumber,
} from "../utils";

interface DashboardProps {
  workouts: Workout[];
  weightUnit: WeightUnit;
  onToggleUnit: () => void;
}

export default function Dashboard({ workouts, weightUnit, onToggleUnit }: DashboardProps) {
  const totalWorkouts = workouts.length;

  const totalVolume = useMemo(
    () => workouts.reduce((sum, w) => sum + workoutTotalVolume(w), 0),
    [workouts],
  );

  const streak = useMemo(() => calculateStreak(workouts), [workouts]);

  // This week vs last week
  const weekComparison = useMemo(() => {
    const now = new Date();
    const thisWeek = getWeekNumber(
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`,
    );

    // Go back 7 days for last week
    const lastWeekDate = new Date(now);
    lastWeekDate.setDate(lastWeekDate.getDate() - 7);
    const lastWeek = getWeekNumber(
      `${lastWeekDate.getFullYear()}-${String(lastWeekDate.getMonth() + 1).padStart(2, "0")}-${String(lastWeekDate.getDate()).padStart(2, "0")}`,
    );

    let thisWeekCount = 0;
    let lastWeekCount = 0;
    let thisWeekVol = 0;
    let lastWeekVol = 0;

    for (const w of workouts) {
      const wk = getWeekNumber(w.date);
      if (wk === thisWeek) {
        thisWeekCount++;
        thisWeekVol += workoutTotalVolume(w);
      } else if (wk === lastWeek) {
        lastWeekCount++;
        lastWeekVol += workoutTotalVolume(w);
      }
    }

    return { thisWeekCount, lastWeekCount, thisWeekVol, lastWeekVol };
  }, [workouts]);

  // PRs for logged exercises
  const loggedExerciseIds = useMemo(() => {
    const ids = new Set<string>();
    for (const w of workouts) {
      for (const e of w.exercises) {
        ids.add(e.exerciseId);
      }
    }
    return ids;
  }, [workouts]);

  const prs = useMemo(() => {
    const result: {
      exerciseName: string;
      heaviest: string;
      mostReps: string;
      best1RM: string;
    }[] = [];

    for (const id of loggedExerciseIds) {
      const ex = exercises.find((e) => e.id === id);
      if (!ex || ex.type === "cardio") continue;
      const pr = personalRecords(workouts, id);
      if (pr.best1RM > 0) {
        result.push({
          exerciseName: ex.name,
          heaviest: pr.heaviestSet
            ? `${formatWeight(pr.heaviestSet.weight, weightUnit)} x ${pr.heaviestSet.reps}`
            : "-",
          mostReps: pr.mostReps
            ? `${pr.mostReps.reps} reps @ ${formatWeight(pr.mostReps.weight, weightUnit)}`
            : "-",
          best1RM: formatWeight(Math.round(pr.best1RM * 10) / 10, weightUnit),
        });
      }
    }

    return result.sort((a, b) => a.exerciseName.localeCompare(b.exerciseName));
  }, [workouts, loggedExerciseIds, weightUnit]);

  return (
    <div className="pb-20 px-4 pt-4 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Stats</h1>
        <button
          onClick={onToggleUnit}
          className="px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
          style={{
            background: "var(--panel)",
            border: "1px solid var(--line)",
            color: "var(--accent)",
          }}
        >
          {weightUnit === "kg" ? "Switch to lbs" : "Switch to kg"}
        </button>
      </div>

      {workouts.length === 0 ? (
        <p className="text-center py-12 text-sm" style={{ color: "var(--muted)" }}>
          Log some workouts to see your stats.
        </p>
      ) : (
        <>
          {/* Top stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <StatCard label="Workouts" value={totalWorkouts.toString()} />
            <StatCard
              label="Total Volume"
              value={formatWeight(Math.round(totalVolume), weightUnit)}
            />
            <StatCard
              label="Streak"
              value={`${streak} wk${streak !== 1 ? "s" : ""}`}
            />
          </div>

          {/* Week comparison */}
          <div
            className="rounded-xl p-4 mb-6"
            style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
          >
            <h3 className="font-semibold text-sm mb-3">This Week vs Last Week</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  This week
                </p>
                <p className="text-lg font-bold">{weekComparison.thisWeekCount} workouts</p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  {formatWeight(Math.round(weekComparison.thisWeekVol), weightUnit)} vol
                </p>
              </div>
              <div>
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  Last week
                </p>
                <p className="text-lg font-bold">{weekComparison.lastWeekCount} workouts</p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  {formatWeight(Math.round(weekComparison.lastWeekVol), weightUnit)} vol
                </p>
              </div>
            </div>
            {weekComparison.lastWeekCount > 0 && (
              <div className="mt-2 pt-2 border-t" style={{ borderColor: "var(--line)" }}>
                <p className="text-xs" style={{ color: getDeltaColor(weekComparison.thisWeekVol - weekComparison.lastWeekVol) }}>
                  {weekComparison.thisWeekVol >= weekComparison.lastWeekVol ? "+" : ""}
                  {Math.round(
                    ((weekComparison.thisWeekVol - weekComparison.lastWeekVol) /
                      weekComparison.lastWeekVol) *
                      100,
                  )}
                  % volume change
                </p>
              </div>
            )}
          </div>

          {/* Personal Records */}
          <h3 className="font-semibold text-sm mb-3">Personal Records</h3>
          {prs.length === 0 && (
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              No strength records yet.
            </p>
          )}
          <div className="space-y-2">
            {prs.map((pr) => (
              <div
                key={pr.exerciseName}
                className="rounded-xl p-3"
                style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
              >
                <h4 className="font-semibold text-sm mb-1">{pr.exerciseName}</h4>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span style={{ color: "var(--muted)" }}>Heaviest</span>
                    <p className="font-medium">{pr.heaviest}</p>
                  </div>
                  <div>
                    <span style={{ color: "var(--muted)" }}>Most Reps</span>
                    <p className="font-medium">{pr.mostReps}</p>
                  </div>
                  <div>
                    <span style={{ color: "var(--muted)" }}>Est. 1RM</span>
                    <p className="font-medium" style={{ color: "var(--accent)" }}>
                      {pr.best1RM}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-xl p-3 text-center"
      style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
    >
      <p className="text-lg font-bold">{value}</p>
      <p className="text-xs" style={{ color: "var(--muted)" }}>
        {label}
      </p>
    </div>
  );
}

function getDeltaColor(delta: number): string {
  if (delta > 0) return "var(--success)";
  if (delta < 0) return "var(--error)";
  return "var(--muted)";
}
