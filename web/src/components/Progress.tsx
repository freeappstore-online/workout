import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import type { Workout, WeightUnit } from "../types";
import { exercises } from "../data/exercises";
import {
  estimated1RM,
  getWeekNumber,
  workoutTotalVolume,
  muscleGroupDistribution,
} from "../utils";
import {
  drawLineChart,
  drawBarChart,
  drawDonutChart,
  getPieColors,
} from "./charts";
import type { ChartPoint, PieSlice } from "./charts";

type ChartType = "1rm" | "volume" | "frequency" | "split";

interface ProgressProps {
  workouts: Workout[];
  weightUnit: WeightUnit;
}

export default function Progress({ workouts, weightUnit }: ProgressProps) {
  const [chartType, setChartType] = useState<ChartType>("1rm");
  const [selectedExercise, setSelectedExercise] = useState(exercises[0]?.id ?? "");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Exercises that the user has actually logged
  const loggedExerciseIds = useMemo(() => {
    const ids = new Set<string>();
    for (const w of workouts) {
      for (const e of w.exercises) {
        ids.add(e.exerciseId);
      }
    }
    return ids;
  }, [workouts]);

  const loggedExercises = useMemo(
    () => exercises.filter((e) => loggedExerciseIds.has(e.id)),
    [loggedExerciseIds],
  );

  // 1RM progress data
  const oneRMData = useMemo((): ChartPoint[] => {
    const sorted = [...workouts]
      .filter((w) => w.exercises.some((e) => e.exerciseId === selectedExercise))
      .sort((a, b) => a.date.localeCompare(b.date));

    return sorted.map((w) => {
      let best = 0;
      for (const entry of w.exercises) {
        if (entry.exerciseId !== selectedExercise) continue;
        for (const s of entry.sets) {
          const e = estimated1RM(s);
          if (e > best) best = e;
        }
      }
      const label = w.date.slice(5); // MM-DD
      return { label, value: Math.round(best * 10) / 10 };
    });
  }, [workouts, selectedExercise]);

  // Weekly volume data
  const volumeData = useMemo((): ChartPoint[] => {
    const weekMap = new Map<string, number>();
    for (const w of workouts) {
      const wk = getWeekNumber(w.date);
      weekMap.set(wk, (weekMap.get(wk) ?? 0) + workoutTotalVolume(w));
    }
    const sorted = [...weekMap.entries()].sort((a, b) => a[0].localeCompare(b[0]));
    return sorted.map(([wk, vol]) => ({
      label: wk.slice(5), // W01 etc
      value: Math.round(vol),
    }));
  }, [workouts]);

  // Frequency data
  const frequencyData = useMemo((): ChartPoint[] => {
    const weekMap = new Map<string, number>();
    for (const w of workouts) {
      const wk = getWeekNumber(w.date);
      weekMap.set(wk, (weekMap.get(wk) ?? 0) + 1);
    }
    const sorted = [...weekMap.entries()].sort((a, b) => a[0].localeCompare(b[0]));
    return sorted.map(([wk, count]) => ({
      label: wk.slice(5),
      value: count,
    }));
  }, [workouts]);

  // Muscle group split
  const splitData = useMemo((): PieSlice[] => {
    const dist = muscleGroupDistribution(workouts);
    const colors = getPieColors();
    return Object.entries(dist).map(([group, count], i) => ({
      label: group.charAt(0).toUpperCase() + group.slice(1),
      value: count,
      color: colors[i % colors.length] ?? "#888",
    }));
  }, [workouts]);

  const drawChart = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    switch (chartType) {
      case "1rm":
        drawLineChart(canvas, oneRMData);
        break;
      case "volume":
        drawBarChart(canvas, volumeData);
        break;
      case "frequency":
        drawBarChart(canvas, frequencyData);
        break;
      case "split":
        drawDonutChart(canvas, splitData);
        break;
    }
  }, [chartType, oneRMData, volumeData, frequencyData, splitData]);

  useEffect(() => {
    drawChart();
    const handleResize = () => drawChart();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [drawChart]);

  const chartTabs: { id: ChartType; label: string }[] = [
    { id: "1rm", label: "Est. 1RM" },
    { id: "volume", label: "Volume" },
    { id: "frequency", label: "Frequency" },
    { id: "split", label: "Split" },
  ];

  return (
    <div className="pb-20 px-4 pt-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Progress</h1>

      {workouts.length === 0 ? (
        <p className="text-center py-12 text-sm" style={{ color: "var(--muted)" }}>
          Log some workouts to see progress charts.
        </p>
      ) : (
        <>
          {/* Chart type tabs */}
          <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
            {chartTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setChartType(tab.id)}
                className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap cursor-pointer"
                style={{
                  background: chartType === tab.id ? "var(--accent)" : "var(--panel)",
                  color: chartType === tab.id ? "#fff" : "var(--muted)",
                  border: "1px solid var(--line)",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Exercise selector for 1RM chart */}
          {chartType === "1rm" && (
            <div className="mb-4">
              <select
                value={selectedExercise}
                onChange={(e) => setSelectedExercise(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={{
                  background: "var(--panel)",
                  border: "1px solid var(--line)",
                  color: "var(--ink)",
                }}
              >
                {loggedExercises.length === 0 && (
                  <option value="">No exercises logged yet</option>
                )}
                {loggedExercises.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Chart unit label */}
          {(chartType === "1rm" || chartType === "volume") && (
            <p className="text-xs mb-2" style={{ color: "var(--muted)" }}>
              Values in {weightUnit}
            </p>
          )}

          {/* Canvas */}
          <div
            className="rounded-xl p-2"
            style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
          >
            <canvas
              ref={canvasRef}
              className="w-full"
              style={{ height: chartType === "split" ? "280px" : "220px" }}
            />
          </div>
        </>
      )}
    </div>
  );
}
