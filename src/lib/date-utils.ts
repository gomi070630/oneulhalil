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
  const dueDay = parseISO(dueISO);
  // treat due time as end of day
  dueDay.setHours(23, 59, 59, 999);
  const now = new Date();
  const ms = dueDay.getTime() - now.getTime();
  if (ms < 0) return { text: "마감", tone: "red" };
  const oneDay = 24 * 60 * 60 * 1000;
  if (ms < oneDay) {
    const hours = Math.ceil(ms / (60 * 60 * 1000));
    return { text: `${hours}시간 남음`, tone: "red" };
  }
  const days = Math.ceil(ms / oneDay);
  if (days <= 3) return { text: `D-${days}`, tone: "amber" };
  return { text: `D-${days}`, tone: "blue" };
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
