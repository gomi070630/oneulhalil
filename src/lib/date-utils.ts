// Shared date helpers
export function todayISO(): string {
  const d = new Date();
  return toISO(d);
}

export function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseISO(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function daysBetween(a: Date, b: Date): number {
  const ms = (b.getTime() - a.getTime());
  return Math.round(ms / 86400000);
}

export function dDayLabel(dueISO: string): { text: string; tone: "red" | "amber" | "blue" | "muted" } {
  const due = parseISO(dueISO);
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  const diff = daysBetween(t, due);
  if (diff < 0) return { text: `D+${-diff}`, tone: "red" };
  if (diff === 0) return { text: "D-Day", tone: "red" };
  if (diff === 1) return { text: "D-1", tone: "red" };
  if (diff <= 3) return { text: `D-${diff}`, tone: "amber" };
  return { text: `D-${diff}`, tone: "blue" };
}

export function monthDays(year: number, month: number): Date[] {
  // month: 0-indexed; returns 6 weeks * 7 days starting Sunday
  const first = new Date(year, month, 1);
  const startDow = first.getDay();
  const start = new Date(year, month, 1 - startDow);
  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    days.push(new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
  }
  return days;
}

export function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function isWithin(d: Date, startISO: string, endISO: string): boolean {
  const s = parseISO(startISO);
  const e = parseISO(endISO);
  s.setHours(0,0,0,0); e.setHours(0,0,0,0);
  const x = new Date(d); x.setHours(0,0,0,0);
  return x.getTime() >= s.getTime() && x.getTime() <= e.getTime();
}
