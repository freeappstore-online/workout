/** Lightweight Canvas chart drawing helpers. No external deps. */

export interface ChartPoint {
  label: string;
  value: number;
}

function getColors(): { ink: string; muted: string; accent: string; line: string; paper: string } {
  const style = getComputedStyle(document.documentElement);
  return {
    ink: style.getPropertyValue("--ink").trim() || "#1a1a1a",
    muted: style.getPropertyValue("--muted").trim() || "#6b7280",
    accent: style.getPropertyValue("--accent").trim() || "#2563eb",
    line: style.getPropertyValue("--line").trim() || "#e5e7eb",
    paper: style.getPropertyValue("--paper").trim() || "#ffffff",
  };
}

function setupCanvas(canvas: HTMLCanvasElement): CanvasRenderingContext2D | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
  return ctx;
}

export function drawLineChart(canvas: HTMLCanvasElement, data: ChartPoint[]): void {
  const ctx = setupCanvas(canvas);
  if (!ctx || data.length === 0) return;
  const c = getColors();
  const rect = canvas.getBoundingClientRect();
  const W = rect.width;
  const H = rect.height;
  const pad = { top: 20, right: 20, bottom: 40, left: 50 };

  ctx.clearRect(0, 0, W, H);

  const values = data.map((d) => d.value);
  const minV = Math.min(...values) * 0.9;
  const maxV = Math.max(...values) * 1.1 || 1;

  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;

  // Grid lines
  ctx.strokeStyle = c.line;
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(W - pad.right, y);
    ctx.stroke();

    const val = maxV - ((maxV - minV) / 4) * i;
    ctx.fillStyle = c.muted;
    ctx.font = "10px Manrope, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(Math.round(val).toString(), pad.left - 8, y + 3);
  }

  // Line
  ctx.strokeStyle = c.accent;
  ctx.lineWidth = 2;
  ctx.lineJoin = "round";
  ctx.beginPath();

  const points: [number, number][] = [];
  data.forEach((d, i) => {
    const x = pad.left + (chartW / Math.max(data.length - 1, 1)) * i;
    const y = pad.top + chartH - ((d.value - minV) / (maxV - minV)) * chartH;
    points.push([x, y]);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Dots
  points.forEach(([x, y]) => {
    ctx.fillStyle = c.accent;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  });

  // X labels
  ctx.fillStyle = c.muted;
  ctx.font = "9px Manrope, sans-serif";
  ctx.textAlign = "center";
  const labelStep = Math.max(1, Math.floor(data.length / 6));
  data.forEach((d, i) => {
    if (i % labelStep === 0 || i === data.length - 1) {
      const x = pad.left + (chartW / Math.max(data.length - 1, 1)) * i;
      ctx.fillText(d.label, x, H - pad.bottom + 15);
    }
  });
}

export function drawBarChart(canvas: HTMLCanvasElement, data: ChartPoint[]): void {
  const ctx = setupCanvas(canvas);
  if (!ctx || data.length === 0) return;
  const c = getColors();
  const rect = canvas.getBoundingClientRect();
  const W = rect.width;
  const H = rect.height;
  const pad = { top: 20, right: 20, bottom: 40, left: 50 };

  ctx.clearRect(0, 0, W, H);

  const maxV = Math.max(...data.map((d) => d.value)) * 1.1 || 1;
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;

  // Grid
  ctx.strokeStyle = c.line;
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(W - pad.right, y);
    ctx.stroke();

    const val = maxV - (maxV / 4) * i;
    ctx.fillStyle = c.muted;
    ctx.font = "10px Manrope, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(Math.round(val).toString(), pad.left - 8, y + 3);
  }

  // Bars
  const barWidth = Math.min(30, chartW / data.length - 4);
  const gap = (chartW - barWidth * data.length) / (data.length + 1);

  data.forEach((d, i) => {
    const x = pad.left + gap + (barWidth + gap) * i;
    const barH = (d.value / maxV) * chartH;
    const y = pad.top + chartH - barH;

    ctx.fillStyle = c.accent;
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, barH, [4, 4, 0, 0]);
    ctx.fill();

    ctx.fillStyle = c.muted;
    ctx.font = "9px Manrope, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(d.label, x + barWidth / 2, H - pad.bottom + 15);
  });
}

export interface PieSlice {
  label: string;
  value: number;
  color: string;
}

const PIE_COLORS = [
  "#2563eb", "#16a34a", "#d97706", "#dc2626", "#8b5cf6", "#ec4899", "#06b6d4",
];

export function getPieColors(): string[] {
  return PIE_COLORS;
}

export function drawDonutChart(canvas: HTMLCanvasElement, slices: PieSlice[]): void {
  const ctx = setupCanvas(canvas);
  if (!ctx || slices.length === 0) return;
  const c = getColors();
  const rect = canvas.getBoundingClientRect();
  const W = rect.width;
  const H = rect.height;

  ctx.clearRect(0, 0, W, H);

  const total = slices.reduce((s, d) => s + d.value, 0);
  if (total === 0) return;

  const cx = W / 2;
  const cy = H / 2 - 10;
  const radius = Math.min(cx, cy) - 20;
  const innerRadius = radius * 0.55;

  let startAngle = -Math.PI / 2;

  slices.forEach((slice) => {
    const sliceAngle = (slice.value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(
      cx + innerRadius * Math.cos(startAngle),
      cy + innerRadius * Math.sin(startAngle),
    );
    ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
    ctx.arc(cx, cy, innerRadius, startAngle + sliceAngle, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = slice.color;
    ctx.fill();
    startAngle += sliceAngle;
  });

  // Center text
  ctx.fillStyle = c.ink;
  ctx.font = "bold 16px Manrope, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(total.toString(), cx, cy - 6);
  ctx.fillStyle = c.muted;
  ctx.font = "10px Manrope, sans-serif";
  ctx.fillText("exercises", cx, cy + 10);

  // Legend
  const legendY = cy + radius + 20;
  const legendCols = Math.min(slices.length, 4);
  const colWidth = W / legendCols;

  slices.forEach((slice, i) => {
    const col = i % legendCols;
    const row = Math.floor(i / legendCols);
    const x = col * colWidth + 10;
    const y = legendY + row * 16;

    ctx.fillStyle = slice.color;
    ctx.fillRect(x, y - 4, 8, 8);

    ctx.fillStyle = c.muted;
    ctx.font = "9px Manrope, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`${slice.label} (${slice.value})`, x + 12, y + 2);
  });
}
