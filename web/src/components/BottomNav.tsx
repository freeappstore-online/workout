import type { Tab } from "../types";

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: "log", label: "Log", icon: "+" },
  { id: "history", label: "History", icon: "\u{1F4CB}" },
  { id: "progress", label: "Progress", icon: "\u{1F4C8}" },
  { id: "dashboard", label: "Stats", icon: "\u{1F3C6}" },
];

interface BottomNavProps {
  active: Tab;
  onNavigate: (tab: Tab) => void;
}

export default function BottomNav({ active, onNavigate }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 flex justify-around items-center h-16 border-t z-50"
      style={{
        background: "var(--dock)",
        borderColor: "var(--line)",
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onNavigate(tab.id)}
          className="flex flex-col items-center justify-center flex-1 h-full transition-colors cursor-pointer"
          style={{
            color: active === tab.id ? "var(--accent)" : "var(--muted)",
            background: "transparent",
            border: "none",
          }}
        >
          <span className="text-lg leading-none">{tab.icon}</span>
          <span className="text-xs mt-0.5 font-medium">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
