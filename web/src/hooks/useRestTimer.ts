import { useState, useRef, useCallback, useEffect } from "react";

export function useRestTimer(defaultSeconds: number) {
  const [remaining, setRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<AudioContext | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const playBeep = useCallback(() => {
    try {
      const ctx = audioRef.current ?? new AudioContext();
      audioRef.current = ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      gain.gain.value = 0.3;
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {
      // Audio not available
    }
  }, []);

  const start = useCallback(
    (seconds?: number) => {
      clearTimer();
      const duration = seconds ?? defaultSeconds;
      setRemaining(duration);
      setIsRunning(true);

      let left = duration;
      intervalRef.current = setInterval(() => {
        left -= 1;
        if (left <= 0) {
          clearTimer();
          setRemaining(0);
          setIsRunning(false);
          playBeep();
        } else {
          setRemaining(left);
        }
      }, 1000);
    },
    [defaultSeconds, clearTimer, playBeep],
  );

  const stop = useCallback(() => {
    clearTimer();
    setRemaining(0);
    setIsRunning(false);
  }, [clearTimer]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return { remaining, isRunning, start, stop };
}
