import { formatDuration } from "../utils";

interface RestTimerProps {
  remaining: number;
  isRunning: boolean;
  defaultSeconds: number;
  onStart: (seconds?: number) => void;
  onStop: () => void;
  onChangeDefault: (seconds: number) => void;
}

const PRESET_TIMES = [30, 60, 90, 120, 180, 300];

export default function RestTimer({
  remaining,
  isRunning,
  defaultSeconds,
  onStart,
  onStop,
  onChangeDefault,
}: RestTimerProps) {
  return (
    <div
      className="rounded-xl p-4"
      style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm" style={{ color: "var(--ink)" }}>
          Rest Timer
        </h3>
        {isRunning && (
          <span
            className="text-2xl font-bold tabular-nums"
            style={{ color: "var(--accent)" }}
          >
            {formatDuration(remaining)}
          </span>
        )}
      </div>

      {isRunning ? (
        <button
          onClick={onStop}
          className="w-full py-2 rounded-lg font-medium text-sm cursor-pointer"
          style={{
            background: "var(--error)",
            color: "#fff",
            border: "none",
          }}
        >
          Stop Timer
        </button>
      ) : (
        <>
          <div className="flex gap-2 flex-wrap mb-3">
            {PRESET_TIMES.map((sec) => (
              <button
                key={sec}
                onClick={() => onStart(sec)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors"
                style={{
                  background:
                    sec === defaultSeconds ? "var(--accent)" : "var(--paper)",
                  color: sec === defaultSeconds ? "#fff" : "var(--ink)",
                  border: "1px solid var(--line)",
                }}
              >
                {sec >= 60 ? `${sec / 60}m` : `${sec}s`}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onStart()}
              className="flex-1 py-2 rounded-lg font-medium text-sm cursor-pointer"
              style={{
                background: "var(--accent)",
                color: "#fff",
                border: "none",
              }}
            >
              Start ({defaultSeconds >= 60 ? `${defaultSeconds / 60}m` : `${defaultSeconds}s`})
            </button>
            <select
              value={defaultSeconds}
              onChange={(e) => onChangeDefault(Number(e.target.value))}
              className="rounded-lg px-2 text-sm cursor-pointer"
              style={{
                background: "var(--paper)",
                color: "var(--ink)",
                border: "1px solid var(--line)",
              }}
            >
              {PRESET_TIMES.map((sec) => (
                <option key={sec} value={sec}>
                  Default: {sec >= 60 ? `${sec / 60}m` : `${sec}s`}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
    </div>
  );
}
