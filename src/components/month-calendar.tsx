import { useMemo, useState } from "react";
import { monthDays, sameDay, isWithin, parseISO, toISO } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type CalendarBar = {
  id: string;
  startISO: string;
  endISO: string;
  color: string;
  title: string;
};

type Props = {
  bars: CalendarBar[];
  selected: Date;
  onSelect: (d: Date) => void;
};

export function MonthCalendar({ bars, selected, onSelect }: Props) {
  const [cursor, setCursor] = useState(() => new Date(selected.getFullYear(), selected.getMonth(), 1));

  const days = useMemo(() => monthDays(cursor.getFullYear(), cursor.getMonth()), [cursor]);
  const weeks: Date[][] = [];
  for (let i = 0; i < 6; i++) weeks.push(days.slice(i * 7, i * 7 + 7));
  const today = new Date();

  return (
    <div className="bg-muted/50 rounded-[20px] p-4 ring-1 ring-black/5">
      <div className="flex justify-between items-center mb-3 px-1">
        <span className="font-semibold text-sm">{cursor.getFullYear()}년 {cursor.getMonth() + 1}월</span>
        <div className="flex gap-1 text-muted-foreground">
          <button className="p-1 hover:bg-background rounded" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}>
            <ChevronLeft className="size-4" />
          </button>
          <button className="p-1 hover:bg-background rounded" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}>
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-center text-[10px] text-muted-foreground mb-1">
        {["일", "월", "화", "수", "목", "금", "토"].map((d) => <span key={d}>{d}</span>)}
      </div>

      <div className="space-y-0.5">
        {weeks.map((week, wi) => <WeekRow key={wi} week={week} bars={bars} selected={selected} onSelect={onSelect} today={today} cursorMonth={cursor.getMonth()} />)}
      </div>
    </div>
  );
}

function WeekRow({ week, bars, selected, onSelect, today, cursorMonth }: {
  week: Date[]; bars: CalendarBar[]; selected: Date; onSelect: (d: Date) => void; today: Date; cursorMonth: number;
}) {
  // Compute lane layout for bars overlapping this week
  const weekStart = week[0];
  const weekEnd = week[6];
  const overlap = bars.filter((b) => {
    const s = parseISO(b.startISO), e = parseISO(b.endISO);
    return e >= weekStart && s <= weekEnd;
  });

  // Greedy lane assignment
  type Lane = { id: string; startCol: number; endCol: number; color: string; title: string }[];
  const lanes: Lane[] = [];
  for (const b of overlap) {
    const s = parseISO(b.startISO), e = parseISO(b.endISO);
    const startCol = Math.max(0, Math.round((s.getTime() - weekStart.getTime()) / 86400000));
    const endCol = Math.min(6, Math.round((e.getTime() - weekStart.getTime()) / 86400000));
    const seg = { id: b.id, startCol, endCol, color: b.color, title: b.title };
    let placed = false;
    for (const lane of lanes) {
      if (lane.every((s2) => seg.endCol < s2.startCol || seg.startCol > s2.endCol)) {
        lane.push(seg); placed = true; break;
      }
    }
    if (!placed) lanes.push([seg]);
  }

  return (
    <div>
      <div className="grid grid-cols-7 gap-px">
        {week.map((d, i) => {
          const isToday = sameDay(d, today);
          const isSelected = sameDay(d, selected);
          const isOtherMonth = d.getMonth() !== cursorMonth;
          return (
            <button key={i} onClick={() => onSelect(d)} className={cn(
              "h-8 flex items-center justify-center text-xs rounded-md transition-colors",
              isOtherMonth && "text-muted-foreground/40",
              !isOtherMonth && !isSelected && "hover:bg-background/60",
              isSelected && "bg-foreground text-background font-semibold",
              isToday && !isSelected && "font-bold text-foreground",
            )}>
              {d.getDate()}
            </button>
          );
        })}
      </div>
      <div className="relative" style={{ height: lanes.length ? lanes.length * 6 + 2 : 4 }}>
        {lanes.map((lane, li) => (
          <div key={li} className="absolute inset-x-0 grid grid-cols-7 gap-px" style={{ top: li * 6 }}>
            {lane.map((seg) => (
              <div key={seg.id + li} title={seg.title} className="h-1.5 rounded-full"
                style={{
                  gridColumnStart: seg.startCol + 1,
                  gridColumnEnd: seg.endCol + 2,
                  backgroundColor: seg.color,
                  opacity: 0.7,
                }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export { toISO };
