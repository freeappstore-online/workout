import { useMemo } from "react";

interface CalendarProps {
  workoutDates: Set<string>;
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  month: number; // 0-based
  year: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function Calendar({
  workoutDates,
  selectedDate,
  onSelectDate,
  month,
  year,
  onPrevMonth,
  onNextMonth,
}: CalendarProps) {
  const days = useMemo(() => {
    const first = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0).getDate();
    // Monday = 0
    let startDow = first.getDay() - 1;
    if (startDow < 0) startDow = 6;

    const cells: (number | null)[] = [];
    for (let i = 0; i < startDow; i++) cells.push(null);
    for (let d = 1; d <= lastDay; d++) cells.push(d);
    return cells;
  }, [month, year]);

  const monthName = MONTH_NAMES[month];

  return (
    <div
      className="rounded-xl p-4"
      style={{ background: "var(--panel)", border: "1px solid var(--line)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={onPrevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer"
          style={{ background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink)" }}
        >
          &lt;
        </button>
        <span className="font-semibold text-sm">
          {monthName} {year}
        </span>
        <button
          onClick={onNextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer"
          style={{ background: "var(--paper)", border: "1px solid var(--line)", color: "var(--ink)" }}
        >
          &gt;
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {DAY_NAMES.map((d) => (
          <div
            key={d}
            className="text-xs font-medium py-1"
            style={{ color: "var(--muted)" }}
          >
            {d}
          </div>
        ))}
        {days.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} />;
          }
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const hasWorkout = workoutDates.has(dateStr);
          const isSelected = selectedDate === dateStr;

          return (
            <button
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              className="relative w-full aspect-square flex items-center justify-center rounded-lg text-xs cursor-pointer transition-colors"
              style={{
                background: isSelected
                  ? "var(--accent)"
                  : "transparent",
                color: isSelected ? "#fff" : "var(--ink)",
                border: "none",
                fontWeight: hasWorkout ? 700 : 400,
              }}
            >
              {day}
              {hasWorkout && !isSelected && (
                <span
                  className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{ background: "var(--accent)" }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
