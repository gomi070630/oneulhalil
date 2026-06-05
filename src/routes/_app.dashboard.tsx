import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMockStore } from "@/lib/mock-store";
import { MonthCalendar, type CalendarBar } from "@/components/month-calendar";
import { TaskFormDialog } from "@/components/task-form-dialog";
import { dDayLabel, isWithin, parseISO } from "@/lib/date-utils";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "대시보드 — StudyMate" }] }),
  component: Dashboard,
});

function Dashboard() {
  const [selected, setSelected] = useState<Date>(new Date());
  const [filter, setFilter] = useState<string>("all");
  const { categories, tasks, routines, setTasks } = useMockStore();

  const catMap = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c])), [categories]);

  const bars: CalendarBar[] = useMemo(() =>
    tasks
      .filter((t) => filter === "all" || t.category_id === filter)
      .map((t) => ({
        id: t.id,
        startISO: t.start_date,
        endISO: t.due_date,
        color: catMap[t.category_id ?? ""]?.color ?? "#94a3b8",
        title: t.title,
      })), [tasks, catMap, filter]);

  const dayTasks = useMemo(() =>
    tasks.filter((t) => (filter === "all" || t.category_id === filter) && isWithin(selected, t.start_date, t.due_date)),
    [tasks, selected, filter]);

  const dayRoutines = useMemo(() => {
    const dow = selected.getDay();
    return routines.filter((r) => {
      if (!r.active) return false;
      if (r.repeat_type === "daily") return true;
      if (r.repeat_type === "weekday") return dow >= 1 && dow <= 5;
      if (r.repeat_type === "weekend") return dow === 0 || dow === 6;
      return (r.repeat_days as number[]).includes(dow);
    });
  }, [routines, selected]);

  const monthLabel = `${selected.getMonth() + 1}월 학습 리포트`;
  const dayLabel = `${selected.getMonth() + 1}월 ${selected.getDate()}일 ${["일","월","화","수","목","금","토"][selected.getDay()]}요일`;

  return (
    <div className="px-5 pt-8">
      <header className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{monthLabel}</h1>
          <p className="text-sm text-muted-foreground">반가워요!</p>
        </div>
        <Button size="sm" className="rounded-full" disabled>
          <Sparkles className="size-4 mr-1" /> AI 분석
        </Button>
      </header>

      <section className="mb-6">
        <MonthCalendar bars={bars} selected={selected} onSelect={setSelected} />
      </section>

      <nav className="flex gap-2 mb-6 overflow-x-auto no-scrollbar -mx-1 px-1">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")} label="전체" />
        {categories.map((c) => (
          <FilterChip key={c.id} active={filter === c.id} onClick={() => setFilter(c.id)} label={c.name} color={c.color} />
        ))}
      </nav>

      <section className="mb-8">
        <div className="flex justify-between items-end mb-3">
          <h2 className="text-lg font-semibold">할 일</h2>
          <span className="text-xs text-muted-foreground">{dayLabel}</span>
        </div>
        <div className="space-y-2.5">
          {dayTasks.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">이 날 할 일이 없어요</p>
          )}
          {dayTasks.map((t) => {
            const c = catMap[t.category_id ?? ""];
            const dday = dDayLabel(t.due_date);
            return (
              <div key={t.id} className={cn("p-4 bg-card rounded-2xl ring-1 ring-black/5 flex items-center gap-3", t.completed && "opacity-50")}>
                <button
                  onClick={() => {
                    setTasks(prev => prev.map(pt => pt.id === t.id ? { ...pt, completed: !pt.completed, progress: !pt.completed ? 100 : pt.progress } : pt));
                  }}
                  className={cn("size-5 rounded-full border-2 flex items-center justify-center shrink-0",
                    t.completed ? "bg-foreground border-foreground text-background" : "border-muted-foreground/40")}>
                  {t.completed && <Check className="size-3" />}
                </button>
                <TaskFormDialog task={t}>
                  <div className="flex-1 min-w-0 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full" style={{ background: c?.color ?? "#94a3b8" }} />
                      <h3 className={cn("text-sm font-medium truncate", t.completed && "line-through")}>{t.title}</h3>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 ml-4">
                      <div className="h-1 w-20 bg-muted rounded-full overflow-hidden">
                        <div className="h-full" style={{ width: `${t.progress}%`, background: c?.color ?? "#94a3b8" }} />
                      </div>
                      <span className="text-[10px] text-muted-foreground font-medium">{t.progress}%</span>
                    </div>
                  </div>
                </TaskFormDialog>
                <DDayChip tone={dday.tone} text={dday.text} />
              </div>
            );
          })}
        </div>
      </section>

      {dayRoutines.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">학습 루틴</h2>
          <div className="grid grid-cols-2 gap-2.5">
            {dayRoutines.map((r) => {
              const c = catMap[r.category_id ?? ""];
              return (
                <div key={r.id} className="p-3 bg-muted/40 rounded-2xl ring-1 ring-black/5">
                  <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    {{ daily: "매일", weekday: "평일", weekend: "주말", custom: "사용자" }[r.repeat_type as string]}
                  </div>
                  <div className="flex items-center gap-2">
                    {c && <span className="size-2 rounded-full" style={{ background: c.color }} />}
                    <p className="text-sm font-medium truncate">{r.title}</p>
                  </div>
                  {r.start_time && <p className="text-[10px] text-muted-foreground mt-1">{r.start_time}</p>}
                </div>
              );
            })}
          </div>
        </section>
      )}

      <TaskFormDialog>
        <button className="fixed bottom-20 right-5 size-14 bg-foreground text-background rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition">
          <Plus className="size-6" />
        </button>
      </TaskFormDialog>
    </div>
  );
}

function FilterChip({ active, onClick, label, color }: { active: boolean; onClick: () => void; label: string; color?: string }) {
  return (
    <button onClick={onClick} className={cn(
      "px-4 py-1.5 rounded-full text-sm whitespace-nowrap font-medium transition-colors shrink-0",
      active ? "bg-foreground text-background" : "bg-muted/60 text-foreground ring-1 ring-black/5 hover:bg-muted",
    )}>
      <span className="inline-flex items-center gap-1.5">
        {color && <span className="size-2 rounded-full" style={{ background: color }} />}
        {label}
      </span>
    </button>
  );
}

function DDayChip({ tone, text }: { tone: "red" | "amber" | "blue" | "muted"; text: string }) {
  const cls = {
    red: "bg-rose-50 text-rose-600 ring-rose-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    blue: "bg-blue-50 text-blue-600 ring-blue-100",
    muted: "bg-muted text-muted-foreground ring-black/5",
  }[tone];
  return <span className={cn("px-2 py-1 text-[11px] font-semibold rounded ring-1", cls)}>{text}</span>;
}
