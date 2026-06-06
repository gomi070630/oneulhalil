import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { u as useMockStore } from "./_ssr/mock-store-CRbYeCLj.mjs";
import { i as isWithin, a as daysBetween, p as parseISO, d as dDayLabel, T as TaskFormDialog, m as monthDays, s as sameDay } from "./_ssr/task-form-dialog-BglxWZmk.mjs";
import { c as cn } from "./_ssr/button-DjOZMqFS.mjs";
import "./_libs/sonner.mjs";
import { C as Check, P as Plus, c as ChevronLeft, d as ChevronRight } from "./_libs/lucide-react.mjs";
import "./_ssr/dialog-C4n16bfk.mjs";
import "./_libs/radix-ui__react-dialog.mjs";
import "./_libs/radix-ui__primitive.mjs";
import "./_libs/radix-ui__react-compose-refs.mjs";
import "./_libs/radix-ui__react-context.mjs";
import "./_libs/radix-ui__react-id.mjs";
import "./_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "./_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "./_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "./_libs/radix-ui__react-primitive.mjs";
import "./_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./_libs/radix-ui__react-slot.mjs";
import "./_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "./_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "./_libs/radix-ui__react-focus-scope.mjs";
import "./_libs/radix-ui__react-portal.mjs";
import "./_libs/radix-ui__react-presence.mjs";
import "./_libs/radix-ui__react-focus-guards.mjs";
import "./_libs/react-remove-scroll.mjs";
import "tslib";
import "./_libs/react-remove-scroll-bar.mjs";
import "./_libs/react-style-singleton.mjs";
import "./_libs/get-nonce.mjs";
import "./_libs/use-sidecar.mjs";
import "./_libs/use-callback-ref.mjs";
import "./_libs/aria-hidden.mjs";
import "./_ssr/label-BJaHSwYl.mjs";
import "./_libs/radix-ui__react-label.mjs";
import "./_libs/class-variance-authority.mjs";
import "./_libs/clsx.mjs";
import "./_ssr/select-CUSP6kj8.mjs";
import "./_libs/radix-ui__react-select.mjs";
import "./_libs/radix-ui__number.mjs";
import "./_libs/radix-ui__react-collection.mjs";
import "./_libs/radix-ui__react-direction.mjs";
import "./_libs/radix-ui__react-popper.mjs";
import "./_libs/floating-ui__react-dom.mjs";
import "./_libs/floating-ui__dom.mjs";
import "./_libs/floating-ui__core.mjs";
import "./_libs/floating-ui__utils.mjs";
import "./_libs/radix-ui__react-arrow.mjs";
import "./_libs/radix-ui__react-use-size.mjs";
import "./_libs/radix-ui__react-use-previous.mjs";
import "./_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "./_libs/tailwind-merge.mjs";
function MonthCalendar({ bars, selected, onSelect }) {
  const [cursor, setCursor] = reactExports.useState(() => new Date(selected.getFullYear(), selected.getMonth(), 1));
  const days = reactExports.useMemo(() => monthDays(cursor.getFullYear(), cursor.getMonth()), [cursor]);
  const weeks = [];
  for (let i = 0; i < 6; i++) weeks.push(days.slice(i * 7, i * 7 + 7));
  const today = selected;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/50 rounded-[20px] p-4 ring-1 ring-black/5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-3 px-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-sm", children: [
        cursor.getFullYear(),
        "년 ",
        cursor.getMonth() + 1,
        "월"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "p-1 hover:bg-background rounded", onClick: () => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1)), children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "size-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "p-1 hover:bg-background rounded", onClick: () => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)), children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-4" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 text-center text-[10px] text-muted-foreground mb-1", children: ["일", "월", "화", "수", "목", "금", "토"].map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: d }, d)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-0.5", children: weeks.map((week, wi) => /* @__PURE__ */ jsxRuntimeExports.jsx(WeekRow, { week, bars, selected, onSelect, today, cursorMonth: cursor.getMonth() }, wi)) })
  ] });
}
function WeekRow({ week, bars, selected, onSelect, today, cursorMonth }) {
  const weekStart = week[0];
  const weekEnd = week[6];
  const overlap = bars.filter((b) => {
    const s = parseISO(b.startISO), e = parseISO(b.endISO);
    return e >= weekStart && s <= weekEnd;
  });
  const lanes = [];
  for (const b of overlap) {
    const s = parseISO(b.startISO), e = parseISO(b.endISO);
    const startCol = Math.max(0, Math.round((s.getTime() - weekStart.getTime()) / 864e5));
    const endCol = Math.min(6, Math.round((e.getTime() - weekStart.getTime()) / 864e5));
    const seg = { id: b.id, startCol, endCol, color: b.color, title: b.title };
    let placed = false;
    for (const lane of lanes) {
      if (lane.every((s2) => seg.endCol < s2.startCol || seg.startCol > s2.endCol)) {
        lane.push(seg);
        placed = true;
        break;
      }
    }
    if (!placed) lanes.push([seg]);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 gap-px", children: week.map((d, i) => {
      const isToday = sameDay(d, today);
      const isSelected = sameDay(d, selected);
      const isOtherMonth = d.getMonth() !== cursorMonth;
      return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onSelect(d), className: cn(
        "h-8 flex items-center justify-center text-xs rounded-md transition-colors",
        isOtherMonth && "text-muted-foreground/40",
        !isOtherMonth && !isSelected && "hover:bg-background/60",
        isSelected && "bg-foreground text-background font-semibold",
        isToday && !isSelected && "font-bold text-foreground"
      ), children: d.getDate() }, i);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", style: { height: lanes.length ? lanes.length * 6 + 2 : 4 }, children: lanes.map((lane, li) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 grid grid-cols-7 gap-px", style: { top: li * 6 }, children: lane.map((seg) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        title: seg.title,
        className: "h-1.5 rounded-full",
        style: {
          gridColumnStart: seg.startCol + 1,
          gridColumnEnd: seg.endCol + 2,
          backgroundColor: seg.color,
          opacity: 0.7
        }
      },
      seg.id + li
    )) }, li)) })
  ] });
}
function Dashboard() {
  const fixedDate = new Date(2026, 5, 6);
  const [selected, setSelected] = reactExports.useState(fixedDate);
  const [filter, setFilter] = reactExports.useState("all");
  const {
    categories,
    tasks,
    routines,
    setTasks,
    setRoutines
  } = useMockStore();
  const catMap = reactExports.useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c])), [categories]);
  const bars = reactExports.useMemo(() => tasks.filter((t) => filter === "all" || t.category_id === filter).map((t) => ({
    id: t.id,
    startISO: t.start_date,
    endISO: t.due_date,
    color: catMap[t.category_id ?? ""]?.color ?? "#94a3b8",
    title: t.title
  })), [tasks, catMap, filter]);
  const dayTasks = reactExports.useMemo(() => tasks.filter((t) => (filter === "all" || t.category_id === filter) && isWithin(selected, t.start_date, t.due_date)), [tasks, selected, filter]);
  const dayRoutines = reactExports.useMemo(() => {
    const dow = selected.getDay();
    return routines.filter((r) => {
      if (!r.active) return false;
      if (r.repeat_type === "daily") return true;
      if (r.repeat_type === "weekday") return dow >= 1 && dow <= 5;
      if (r.repeat_type === "weekend") return dow === 0 || dow === 6;
      return r.repeat_days.includes(dow);
    });
  }, [routines, selected]);
  const selectedISO = reactExports.useMemo(() => {
    const y = selected.getFullYear();
    const m = String(selected.getMonth() + 1).padStart(2, "0");
    const d = String(selected.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }, [selected]);
  const activeTasks = reactExports.useMemo(() => tasks.filter((t) => !t.completed), [tasks]);
  const overdueTasks = reactExports.useMemo(() => activeTasks.filter((t) => daysBetween(selected, parseISO(t.due_date)) < 0), [activeTasks, selected]);
  const dueSoonTasks = reactExports.useMemo(() => activeTasks.filter((t) => {
    const daysLeft = Math.max(0, daysBetween(selected, parseISO(t.due_date)));
    return daysLeft > 0 && daysLeft <= 3;
  }), [activeTasks, selected]);
  const totalRemainingPercent = reactExports.useMemo(() => activeTasks.reduce((sum, t) => sum + Math.max(0, 100 - t.progress), 0), [activeTasks]);
  const totalDailyTarget = reactExports.useMemo(() => Math.ceil(activeTasks.reduce((sum, t) => {
    const remaining = Math.max(0, 100 - t.progress);
    const daysLeft = Math.max(0, daysBetween(selected, parseISO(t.due_date)));
    return sum + remaining / Math.max(daysLeft, 1);
  }, 0)), [activeTasks, selected]);
  const summaryTone = overdueTasks.length > 0 ? "red" : dueSoonTasks.length > 0 ? "amber" : "blue";
  const summaryText = overdueTasks.length > 0 ? "지금 바로 조치가 필요해요" : dueSoonTasks.length > 0 ? "다음 3일 이내 마감 과제가 있어요" : "계획대로 잘 진행 중이에요";
  const incompleteRoutines = reactExports.useMemo(() => dayRoutines.filter((r) => !(r.completed_dates ?? []).includes(selectedISO)), [dayRoutines, selectedISO]);
  const completedRoutines = reactExports.useMemo(() => dayRoutines.filter((r) => (r.completed_dates ?? []).includes(selectedISO)), [dayRoutines, selectedISO]);
  const [showCompleted, setShowCompleted] = reactExports.useState(false);
  const monthLabel = `${selected.getMonth() + 1}월 학습 리포트`;
  const dayLabel = `${selected.getMonth() + 1}월 ${selected.getDate()}일 ${["일", "월", "화", "수", "목", "금", "토"][selected.getDay()]}요일`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pt-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex justify-between items-center mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight", children: monthLabel }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "반가워요!" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right text-xs text-muted-foreground", children: "오늘의 계획을 빠르게 확인해보세요." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl bg-muted/70 ring-1 ring-black/5 p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "진행 리포트" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "남은 과제 확인" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DDayChip, { tone: summaryTone, text: summaryText })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3 mt-4 text-[11px] text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-background/75 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-foreground", children: "미완료 과제" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-xl font-semibold text-foreground", children: [
            activeTasks.length,
            "개"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-background/75 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-foreground", children: "마감 임박" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-xl font-semibold text-foreground", children: [
            dueSoonTasks.length,
            "개"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-background/75 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-foreground", children: "하루 최소 목표" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-xl font-semibold text-foreground", children: [
            totalDailyTarget,
            "%"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-4 text-sm text-muted-foreground", children: [
        "전체 남은 진도 ",
        totalRemainingPercent,
        "%를 마감 일정에 맞추려면 오늘 ",
        totalDailyTarget,
        "% 이상 진도를 유지하세요."
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MonthCalendar, { bars, selected, onSelect: setSelected }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex gap-2 mb-6 overflow-x-auto no-scrollbar -mx-1 px-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FilterChip, { active: filter === "all", onClick: () => setFilter("all"), label: "전체" }),
      categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(FilterChip, { active: filter === c.id, onClick: () => setFilter(c.id), label: c.name, color: c.color }, c.id))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-end mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "할 일" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: dayLabel })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2.5", children: [
        dayTasks.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center py-8", children: "이 날 할 일이 없어요" }),
        dayTasks.map((t) => {
          const c = catMap[t.category_id ?? ""];
          const dday = dDayLabel(t.due_date);
          const dueDate = parseISO(t.due_date);
          const daysLeft = Math.max(0, daysBetween(selected, dueDate));
          const remainingPercent = Math.max(0, 100 - t.progress);
          const dailyTargetPercent = Math.ceil(remainingPercent / Math.max(daysLeft, 1));
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("p-4 bg-card rounded-2xl ring-1 ring-black/5 flex flex-col gap-3", t.completed && "opacity-50"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
                setTasks((prev) => prev.map((pt) => pt.id === t.id ? {
                  ...pt,
                  completed: !pt.completed,
                  progress: !pt.completed ? 100 : pt.progress
                } : pt));
              }, className: cn("size-5 rounded-full border-2 flex items-center justify-center shrink-0", t.completed ? "bg-foreground border-foreground text-background" : "border-muted-foreground/40"), children: t.completed && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TaskFormDialog, { task: t, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 cursor-pointer", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-2 rounded-full", style: {
                    background: c?.color ?? "#94a3b8"
                  } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: cn("text-sm font-medium truncate", t.completed && "line-through"), children: t.title })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1.5 ml-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 w-20 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full", style: {
                    width: `${t.progress}%`,
                    background: c?.color ?? "#94a3b8"
                  } }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground font-medium", children: [
                    t.progress,
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 ml-4 grid grid-cols-3 gap-2 text-[10px] text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-muted/60 p-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-[11px] text-foreground", children: "남은 진행률" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      remainingPercent,
                      "%"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-muted/60 p-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-[11px] text-foreground", children: "남은 일수" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      daysLeft,
                      "일 (",
                      dueDate.getMonth() + 1,
                      "월 ",
                      dueDate.getDate(),
                      "일까지)"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-muted/60 p-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-[11px] text-foreground", children: "하루 권장" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      dailyTargetPercent,
                      "%"
                    ] })
                  ] })
                ] })
              ] }) })
            ] }),
            !t.completed && /* @__PURE__ */ jsxRuntimeExports.jsx(DDayChip, { tone: dday.tone, text: dday.text })
          ] }, t.id);
        })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-end mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "학습 루틴" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: dayLabel })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2.5 mb-4", children: [
        incompleteRoutines.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center py-8 col-span-2", children: "오늘 완료할 루틴이 없어요" }),
        incompleteRoutines.map((r) => {
          const c = catMap[r.category_id ?? ""];
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-muted/40 rounded-2xl ring-1 ring-black/5 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1", children: {
                daily: "매일",
                weekday: "평일",
                weekend: "주말",
                custom: "사용자"
              }[r.repeat_type] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                c && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-2 rounded-full", style: {
                  background: c.color
                } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium truncate", children: r.title })
              ] }),
              r.start_time && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-1", children: r.start_time })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
              setRoutines((prev) => prev.map((item) => item.id === r.id ? {
                ...item,
                completed_dates: [...item.completed_dates ?? [], selectedISO]
              } : item));
            }, "aria-label": "완료", className: "w-9 h-9 rounded-full border border-muted-200 bg-transparent text-muted-foreground flex items-center justify-center hover:bg-muted/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-4 opacity-20" }) })
          ] }, r.id);
        })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: "완료된 루틴" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setShowCompleted((s) => !s), className: "text-sm text-muted-foreground", children: [
          showCompleted ? "▼" : "▶",
          " ",
          completedRoutines.length
        ] })
      ] }),
      showCompleted && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2.5", children: completedRoutines.map((r) => {
        const c = catMap[r.category_id ?? ""];
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-muted/20 rounded-2xl ring-1 ring-black/5 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1", children: {
              daily: "매일",
              weekday: "평일",
              weekend: "주말",
              custom: "사용자"
            }[r.repeat_type] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              c && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-2 rounded-full", style: {
                background: c.color
              } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium truncate", children: r.title })
            ] }),
            r.start_time && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-1", children: r.start_time })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
            setRoutines((prev) => prev.map((item) => item.id === r.id ? {
              ...item,
              completed_dates: (item.completed_dates ?? []).filter((d) => d !== selectedISO)
            } : item));
          }, "aria-label": "완료 취소", className: "w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-4" }) })
        ] }, r.id);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TaskFormDialog, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "fixed bottom-20 right-5 size-14 bg-foreground text-background rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-6" }) }) })
  ] });
}
function FilterChip({
  active,
  onClick,
  label,
  color
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick, className: cn("px-4 py-1.5 rounded-full text-sm whitespace-nowrap font-medium transition-colors shrink-0", active ? "bg-foreground text-background" : "bg-muted/60 text-foreground ring-1 ring-black/5 hover:bg-muted"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
    color && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-2 rounded-full", style: {
      background: color
    } }),
    label
  ] }) });
}
function DDayChip({
  tone,
  text
}) {
  const cls = {
    red: "bg-rose-50 text-rose-600 ring-rose-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    blue: "bg-blue-50 text-blue-600 ring-blue-100",
    muted: "bg-muted text-muted-foreground ring-black/5"
  }[tone];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("px-2 py-1 text-[11px] font-semibold rounded ring-1", cls), children: text });
}
export {
  Dashboard as component
};
