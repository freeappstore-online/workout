import { useState } from "react";
import type { Tab } from "./types";
import { useWorkouts } from "./hooks/useWorkouts";
import { useSettings } from "./hooks/useSettings";
import { useRestTimer } from "./hooks/useRestTimer";
import BottomNav from "./components/BottomNav";
import LogWorkout from "./components/LogWorkout";
import History from "./components/History";
import Progress from "./components/Progress";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("log");
  const { workouts, addWorkout, deleteWorkout } = useWorkouts();
  const { settings, updateSettings } = useSettings();
  const timer = useRestTimer(settings.restTimerSeconds);

  const lastWorkout = workouts.length > 0 ? (workouts[0] ?? null) : null;

  return (
    <div className="min-h-screen" style={{ background: "var(--paper)" }}>
      {activeTab === "log" && (
        <LogWorkout
          weightUnit={settings.weightUnit}
          restTimerSeconds={settings.restTimerSeconds}
          onSave={addWorkout}
          onChangeRestTimer={(s) => updateSettings({ restTimerSeconds: s })}
          lastWorkout={lastWorkout}
          timerRemaining={timer.remaining}
          timerRunning={timer.isRunning}
          onTimerStart={timer.start}
          onTimerStop={timer.stop}
        />
      )}

      {activeTab === "history" && (
        <History
          workouts={workouts}
          weightUnit={settings.weightUnit}
          onDelete={deleteWorkout}
        />
      )}

      {activeTab === "progress" && (
        <Progress workouts={workouts} weightUnit={settings.weightUnit} />
      )}

      {activeTab === "dashboard" && (
        <Dashboard
          workouts={workouts}
          weightUnit={settings.weightUnit}
          onToggleUnit={() =>
            updateSettings({
              weightUnit: settings.weightUnit === "kg" ? "lbs" : "kg",
            })
          }
        />
      )}

      <BottomNav active={activeTab} onNavigate={setActiveTab} />
    </div>
  );
}
