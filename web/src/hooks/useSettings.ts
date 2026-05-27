import { useState, useCallback } from "react";
import type { AppSettings } from "../types";
import { loadSettings, saveSettings } from "../storage";

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      saveSettings(next);
      return next;
    });
  }, []);

  return { settings, updateSettings };
}
