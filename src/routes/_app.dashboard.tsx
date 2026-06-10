import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMockStore } from "@/lib/mock-store";
import { MonthCalendar, type CalendarBar } from "@/components/month-calendar";
import { TaskFormDialog } from "@/components/task-form-dialog";
import { dDayLabel, daysBetween, hoursBetween, formatDateTime, isWithin, parseISO } from "@/lib/date-utils";
import { Button } from "@/components/ui/button";
import { Plus, Check, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "대시보드 — StudyMate" }] }),
  component: Dashboard,
});

function Dashboard() {
  const [selected, setSelected] = useState<Date>(() => new Date());
  const [filter, setFilter] = useState<string>("all");

  const { categories, tasks, routines, setTasks, setRoutines } = useMockStore();
  const catMap = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c])), [categories]);

  const bars: CalendarBar[] = useMemo(
    () =>
      tasks
        .filter((t) => filter === "all" || t.category_id === filter)
        .map((t) => ({
          id: t.id,
          startISO: t.due_date,
          endISO: t.due_date,
          color: catMap[t.category_id ?? ""]?.color ?? "#94a3b8",
          title: t.title,
        })),
    [tasks, catMap, filter],
  );

  const dayTasks = useMemo(
  () =>
    tasks.filter(
      (t) =>
        (filter === "all" || t.category_id === filter) &&
        !t.completed &&
        selected <= parseISO(t.due_date)
    ),
  [tasks, selected, filter],
);

  const dayRoutines = useMemo(() => {
    const dow = selected.getDay();
    return routines.filter((r) => {
      if (!r.active) return false;
      if (r.repeat_type === "daily") return true;
      if (r.repeat_type === "weekday") return dow >= 1 && dow <= 5;
      if (r.repeat_type === "weekend") return dow === 0 || dow === 6;
      return (r.repeat_days ?? []).includes(dow);
    });
  }, [routines, selected]);

  const selectedISO = useMemo(() => {
    const y = selected.getFullYear();
    const m = String(selected.getMonth() + 1).padStart(2, "0");
    const d = String(selected.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }, [selected]);

  const activeTasks = useMemo(() => tasks.filter((t) => !t.completed), [tasks]);
  const overdueTasks = useMemo(
    () => activeTasks.filter((t) => {
      let d = parseISO(t.due_date);
      if (t.due_date && !t.due_date.includes("T")) {
  d.setHours(23, 59, 59);
}
      return hoursBetween(new Date(), d) < 0;
    }),
    [activeTasks],
  );
  const dueSoonTasks = useMemo(
    () =>
      activeTasks.filter((t) => {
        let d = parseISO(t.due_date);
        if (t.due_date && !t.due_date.includes("T")) {
  d.setHours(23, 59, 59);
}
        const hoursLeft = hoursBetween(new Date(), d);
        return hoursLeft > 0 && hoursLeft <= 72; // 3 days
      }),
    [activeTasks],
  );
  const totalRemainingPercent = useMemo(
    () => activeTasks.reduce((sum, t) => sum + Math.max(0, 100 - t.progress), 0),
    [activeTasks],
  );
  const totalDailyTarget = useMemo(
    () =>
      Math.ceil(
        activeTasks.reduce((sum, t) => {
          const remaining = Math.max(0, 100 - t.progress);
          let d = parseISO(t.due_date);
          if (t.due_date && !t.due_date.includes("T")) {
  d.setHours(23, 59, 59);
}
          let hoursLeft = hoursBetween(new Date(), d);
          if (hoursLeft < 0) hoursLeft = 0;
          return sum + remaining / Math.max(hoursLeft / 24, 0.1);
        }, 0),
      ),
    [activeTasks],
  );
  const summaryTone = overdueTasks.length > 0 ? "red" : dueSoonTasks.length > 0 ? "amber" : "blue";
  const summaryText =
    overdueTasks.length > 0
      ? "지금 바로 조치가 필요해요"
      : dueSoonTasks.length > 0
        ? "다음 3일 이내 마감 과제가 있어요"
        : "계획대로 잘 진행 중이에요";

  const incompleteRoutines = useMemo(
    () => dayRoutines.filter((r) => !(r.completed_dates ?? []).includes(selectedISO)),
    [dayRoutines, selectedISO],
  );
  const completedRoutines = useMemo(
    () => dayRoutines.filter((r) => (r.completed_dates ?? []).includes(selectedISO)),
    [dayRoutines, selectedISO],
  );
  const [showCompleted, setShowCompleted] = useState(false);

  const monthLabel = `${selected.getMonth() + 1}월 학습 리포트`;
  const dayLabel = `${selected.getMonth() + 1}월 ${selected.getDate()}일 ${["일", "월", "화", "수", "목", "금", "토"][selected.getDay()]}요일`;

  return (
    <div className="px-5 pt-8">
      <header className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{monthLabel}</h1>
          <p className="text-sm text-muted-foreground">반가워요!</p>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          오늘의 계획을 빠르게 확인해보세요.
        </div>
      </header>

      <section className="mb-6">
        <div className="rounded-3xl bg-muted/70 ring-1 ring-black/5 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">진행 리포트</p>
              <h2 className="text-lg font-semibold">남은 과제 확인</h2>
            </div>
            <DDayChip tone={summaryTone} text={summaryText} />
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4 text-[11px] text-muted-foreground">
            <div className="rounded-2xl bg-background/75 p-3">
              <div className="font-medium text-foreground">미완료 과제</div>
              <div className="mt-1 text-xl font-semibold text-foreground">
                {activeTasks.length}개
              </div>
            </div>
            <div className="rounded-2xl bg-background/75 p-3">
              <div className="font-medium text-foreground">마감 임박</div>
              <div className="mt-1 text-xl font-semibold text-foreground">
                {dueSoonTasks.length}개
              </div>
            </div>
            <div className="rounded-2xl bg-background/75 p-3">
              <div className="font-medium text-foreground">하루 최소 목표</div>
              <div className="mt-1 text-xl font-semibold text-foreground">{totalDailyTarget}%</div>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            전체 남은 진도 {totalRemainingPercent}%를 마감 일정에 맞추려면 오늘 {totalDailyTarget}%
            이상 진도를 유지하세요.
          </p>
        </div>
      </section>

      <section className="mb-6">
        <MonthCalendar bars={bars} selected={selected} onSelect={setSelected} />
      </section>

      <nav className="flex gap-2 mb-6 overflow-x-auto no-scrollbar -mx-1 px-1">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")} label="전체" />
        {categories.map((c) => (
          <FilterChip
            key={c.id}
            active={filter === c.id}
            onClick={() => setFilter(c.id)}
            label={c.name}
            color={c.color}
          />
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
            let dueDate = parseISO(t.due_date);
            if (t.due_date && !t.due_date.includes("T")) {
  dueDate.setHours(23, 59, 59);
}
            const hoursLeft = Math.max(0, hoursBetween(new Date(), dueDate));
            const remainingPercent = Math.max(0, 100 - t.progress);
            const dailyTargetPercent = Math.ceil(remainingPercent / Math.max(hoursLeft / 24, 0.1));
            return (
              <div
                key={t.id}
                className={cn(
                  "p-4 bg-card rounded-2xl ring-1 ring-black/5 flex flex-col gap-3 group relative",
                  t.completed && "opacity-50",
                )}
              >
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      className={cn(
                        "absolute right-3 top-3 p-2.5 text-muted-foreground hover:text-destructive hover:bg-muted/50 rounded-full transition-opacity z-10",
                        t.completed ? "opacity-0 group-hover:opacity-100 focus:opacity-100" : ""
                      )}
                      aria-label="일정 삭제"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="w-[90vw] max-w-md rounded-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>일정을 삭제할까요?</AlertDialogTitle>
                      <AlertDialogDescription>
                        삭제한 일정은 복구할 수 없습니다.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>취소</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={(e) => {
                          setTasks((prev) => prev.filter((pt) => pt.id !== t.id));
                          toast.success("일정이 삭제되었습니다.");
                        }}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        삭제
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <div className="flex items-center gap-3 pr-8">
                  <button
                    onClick={() => {
                      setTasks((prev) =>
                        prev.map((pt) =>
                          pt.id === t.id
                            ? {
                                ...pt,
                                completed: !pt.completed,
                                progress: !pt.completed ? 100 : pt.progress,
                              }
                            : pt,
                        ),
                      );
                    }}
                    className={cn(
                      "size-5 rounded-full border-2 flex items-center justify-center shrink-0",
                      t.completed
                        ? "bg-foreground border-foreground text-background"
                        : "border-muted-foreground/40",
                    )}
                  >
                    {t.completed && <Check className="size-3" />}
                  </button>
                  <TaskFormDialog task={t}>
                    <div className="flex-1 min-w-0 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span
                          className="size-2 rounded-full"
                          style={{ background: c?.color ?? "#94a3b8" }}
                        />
                        <h3
                          className={cn(
                            "text-sm font-medium truncate",
                            t.completed && "line-through",
                          )}
                        >
                          {t.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5 ml-4">
                        <div className="h-1 w-20 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full"
                            style={{ width: `${t.progress}%`, background: c?.color ?? "#94a3b8" }}
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground font-medium">
                          {t.progress}%
                        </span>
                      </div>
                      <div className="mt-2 ml-4 grid grid-cols-3 gap-2 text-[10px] text-muted-foreground">
                        <div className="rounded-xl bg-muted/60 p-2">
                          <div className="font-medium text-[11px] text-foreground">남은 진행률</div>
                          <div>{remainingPercent}%</div>
                        </div>
                        <div className="rounded-xl bg-muted/60 p-2">
                          <div className="font-medium text-[11px] text-foreground">남은 시간</div>
                          <div>
                            {Math.floor(hoursLeft)}시간 ({formatDateTime(t.due_date)})
                          </div>
                        </div>
                        <div className="rounded-xl bg-muted/60 p-2">
                          <div className="font-medium text-[11px] text-foreground">하루 권장</div>
                          <div>{dailyTargetPercent}%</div>
                        </div>
                      </div>
                    </div>
                  </TaskFormDialog>
                </div>
                {!t.completed && <DDayChip tone={dday.tone} text={dday.text} />}
              </div>
            );
          })}
        </div>
      </section>

      <section className="mb-8">
        <div className="flex justify-between items-end mb-3">
          <h2 className="text-lg font-semibold">학습 루틴</h2>
          <span className="text-xs text-muted-foreground">{dayLabel}</span>
        </div>
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          {incompleteRoutines.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8 col-span-2">
              오늘 완료할 루틴이 없어요
            </p>
          )}
          {incompleteRoutines.map((r) => {
            const c = catMap[r.category_id ?? ""];
            return (
              <div
                key={r.id}
                className="p-3 bg-muted/40 rounded-2xl ring-1 ring-black/5 flex items-center gap-2"
              >
                <div className="flex-1">
                  <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    {
                      { daily: "매일", weekday: "평일", weekend: "주말", custom: "사용자" }[
                        r.repeat_type as string
                      ]
                    }
                  </div>
                  <div className="flex items-center gap-2">
                    {c && <span className="size-2 rounded-full" style={{ background: c.color }} />}
                    <p className="text-sm font-medium truncate">{r.title}</p>
                  </div>
                  {r.start_time && (
                    <p className="text-[10px] text-muted-foreground mt-1">{r.start_time}</p>
                  )}
                </div>
                <button
                  onClick={() => {
                    setRoutines((prev) =>
                      prev.map((item) =>
                        item.id === r.id
                          ? {
                              ...item,
                              completed_dates: [...(item.completed_dates ?? []), selectedISO],
                            }
                          : item,
                      ),
                    );
                  }}
                  aria-label="완료"
                  className="w-9 h-9 rounded-full border border-muted-200 bg-transparent text-muted-foreground flex items-center justify-center hover:bg-muted/20"
                >
                  <Check className="size-4 opacity-20" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold">완료된 루틴</h3>
          <button
            onClick={() => setShowCompleted((s) => !s)}
            className="text-sm text-muted-foreground"
          >
            {showCompleted ? "▼" : "▶"} {completedRoutines.length}
          </button>
        </div>
        {showCompleted && (
          <div className="grid grid-cols-2 gap-2.5">
            {completedRoutines.map((r) => {
              const c = catMap[r.category_id ?? ""];
              return (
                <div
                  key={r.id}
                  className="p-3 bg-muted/20 rounded-2xl ring-1 ring-black/5 flex items-center gap-2"
                >
                  <div className="flex-1">
                    <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                      {
                        { daily: "매일", weekday: "평일", weekend: "주말", custom: "사용자" }[
                          r.repeat_type as string
                        ]
                      }
                    </div>
                    <div className="flex items-center gap-2">
                      {c && (
                        <span className="size-2 rounded-full" style={{ background: c.color }} />
                      )}
                      <p className="text-sm font-medium truncate">{r.title}</p>
                    </div>
                    {r.start_time && (
                      <p className="text-[10px] text-muted-foreground mt-1">{r.start_time}</p>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setRoutines((prev) =>
                        prev.map((item) =>
                          item.id === r.id
                            ? {
                                ...item,
                                completed_dates: (item.completed_dates ?? []).filter(
                                  (d) => d !== selectedISO,
                                ),
                              }
                            : item,
                        ),
                      );
                    }}
                    aria-label="완료 취소"
                    className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700"
                  >
                    <Check className="size-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <TaskFormDialog>
        <button className="fixed bottom-20 right-5 size-14 bg-foreground text-background rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition">
          <Plus className="size-6" />
        </button>
      </TaskFormDialog>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  color,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  color?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-1.5 rounded-full text-sm whitespace-nowrap font-medium transition-colors shrink-0",
        active
          ? "bg-foreground text-background"
          : "bg-muted/60 text-foreground ring-1 ring-black/5 hover:bg-muted",
      )}
    >
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
  return (
    <span className={cn("px-2 py-1 text-[11px] font-semibold rounded ring-1", cls)}>{text}</span>
  );
}
