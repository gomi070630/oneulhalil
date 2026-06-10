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
  if (s.includes("T")) {
    return new Date(s);
  }
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function daysBetween(a: Date, b: Date): number {
  const ms = (b.getTime() - a.getTime());
  return Math.round(ms / 86400000);
}

export function hoursBetween(a: Date, b: Date): number {
  const ms = (b.getTime() - a.getTime());
  return ms / 3600000;
}

export function formatDateTime(iso: string): string {
  const d = parseISO(iso);
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const hr = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${m}월 ${day}일 ${hr}:${min}`;
}

export function dDayLabel(dueISO: string): { text: string; tone: "red" | "amber" | "blue" | "muted" } {
  let dueDay = parseISO(dueISO);
  // 만약 시간이 없는 단순 날짜 형태라면 23:59:59를 설정
  if (!dueISO.includes("T")) {
    dueDay.setHours(23, 59, 59, 999);
  }
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

export function isWithinTodayAndDue(d: Date, dueISO: string): boolean {
  const s = new Date();
  const e = parseISO(dueISO);
  s.setHours(0,0,0,0); e.setHours(0,0,0,0);
  const x = new Date(d); x.setHours(0,0,0,0);
  return x.getTime() >= s.getTime() && x.getTime() <= e.getTime();
}

export function isWithin(
  d: Date,
  startISO: string,
  dueISO: string,
): boolean {
  const start = parseISO(startISO);
  const due = parseISO(dueISO);

  start.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const x = new Date(d);
  x.setHours(0, 0, 0, 0);

  return x.getTime() >= start.getTime() && x.getTime() <= due.getTime();
}