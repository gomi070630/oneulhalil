import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useMockStore } from "./mock-store-CRbYeCLj.mjs";
import { D as Dialog, e as DialogTrigger, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-C4n16bfk.mjs";
import { B as Button, c as cn } from "./button-DjOZMqFS.mjs";
import { L as Label, I as Input } from "./label-BJaHSwYl.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CUSP6kj8.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { P as Plus, a as Trash2 } from "../_libs/lucide-react.mjs";
const Textarea = reactExports.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "textarea",
      {
        className: cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Textarea.displayName = "Textarea";
function todayISO() {
  const d = /* @__PURE__ */ new Date();
  return toISO(d);
}
function toISO(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function parseISO(s) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function daysBetween(a, b) {
  const ms = b.getTime() - a.getTime();
  return Math.round(ms / 864e5);
}
function dDayLabel(dueISO) {
  const dueDay = parseISO(dueISO);
  dueDay.setHours(23, 59, 59, 999);
  const now = /* @__PURE__ */ new Date();
  const ms = dueDay.getTime() - now.getTime();
  if (ms < 0) return { text: "마감", tone: "red" };
  const oneDay = 24 * 60 * 60 * 1e3;
  if (ms < oneDay) {
    const hours = Math.ceil(ms / (60 * 60 * 1e3));
    return { text: `${hours}시간 남음`, tone: "red" };
  }
  const days = Math.ceil(ms / oneDay);
  if (days <= 3) return { text: `D-${days}`, tone: "amber" };
  return { text: `D-${days}`, tone: "blue" };
}
function monthDays(year, month) {
  const first = new Date(year, month, 1);
  const startDow = first.getDay();
  const start = new Date(year, month, 1 - startDow);
  const days = [];
  for (let i = 0; i < 42; i++) {
    days.push(new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
  }
  return days;
}
function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function isWithin(d, startISO, endISO) {
  const s = parseISO(startISO);
  const e = parseISO(endISO);
  s.setHours(0, 0, 0, 0);
  e.setHours(0, 0, 0, 0);
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.getTime() >= s.getTime() && x.getTime() <= e.getTime();
}
function TaskFormDialog({ children, task, open, onOpenChange }) {
  const [internalOpen, setInternalOpen] = reactExports.useState(false);
  const isControlled = open !== void 0;
  const o = isControlled ? open : internalOpen;
  const setO = isControlled ? onOpenChange ?? (() => {
  }) : setInternalOpen;
  const { categories, setTasks } = useMockStore();
  function getInitialForm(task2) {
    return {
      title: task2?.title ?? "",
      description: task2?.description ?? "",
      category_id: task2?.category_id ?? (categories[0]?.id ?? ""),
      start_date: task2?.start_date ?? todayISO(),
      due_date: task2?.due_date ?? todayISO(),
      estimated_minutes: task2?.estimated_minutes ?? 60,
      progress: task2?.progress ?? 0,
      checklist: task2?.checklist ?? []
    };
  }
  const [form, setForm] = reactExports.useState(() => getInitialForm(task));
  const [initialForm, setInitialForm] = reactExports.useState(() => getInitialForm(task));
  const [error, setError] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (o) {
      const initial = getInitialForm(task);
      setForm(initial);
      setInitialForm(initial);
      setError(null);
    }
  }, [o, task]);
  function handleSave() {
    if (!form.title.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }
    const payload = {
      title: form.title.trim(),
      description: form.description || null,
      category_id: form.category_id || null,
      start_date: form.start_date,
      due_date: form.due_date,
      estimated_minutes: Number(form.estimated_minutes),
      checklist: form.checklist
    };
    const progress = form.checklist && form.checklist.length > 0 ? Math.round(form.checklist.filter((i) => i.completed).length / form.checklist.length * 100) : 0;
    const completed = progress === 100;
    if (task?.id) {
      setTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, ...payload, progress, checklist: form.checklist, completed } : t));
      toast.success("수정되었습니다");
    } else {
      const newTask = {
        id: "task-" + Math.random().toString(36).slice(2, 9),
        ...payload,
        progress,
        checklist: form.checklist,
        completed,
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      setTasks((prev) => [...prev, newTask]);
      toast.success("할 일이 추가되었습니다");
    }
    setO(false);
  }
  function handleDialogOpenChange(open2) {
    setO(open2);
  }
  function addChecklistItem() {
    const it = { id: "chk-" + Math.random().toString(36).slice(2, 9), text: "", completed: false };
    setForm((f) => ({ ...f, checklist: [...f.checklist, it] }));
  }
  function updateChecklistItem(id, patch) {
    setForm((f) => {
      const next = f.checklist.map((i) => i.id === id ? { ...i, ...patch } : i);
      const progress = next.length > 0 ? Math.round(next.filter((i) => i.completed).length / next.length * 100) : f.progress;
      return { ...f, checklist: next, progress };
    });
  }
  function removeChecklistItem(id) {
    setForm((f) => {
      const next = f.checklist.filter((i) => i.id !== id);
      const progress = next.length > 0 ? Math.round(next.filter((i) => i.completed).length / next.length * 100) : 0;
      return { ...f, checklist: next, progress };
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: o, onOpenChange: handleDialogOpenChange, children: [
    children && /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: task?.id ? "할 일 수정" : "새 할 일" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "제목" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.title, onChange: (e) => {
            setForm({ ...form, title: e.target.value });
            setError(null);
          }, placeholder: "수학 수행평가 준비" }),
          error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: error })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "설명" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: form.description ?? "", onChange: (e) => setForm({ ...form, description: e.target.value }), rows: 2 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "과목" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: form.category_id ?? "", onValueChange: (v) => setForm({ ...form, category_id: v }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "과목 선택" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c.id, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-2 rounded-full", style: { background: c.color } }),
              c.name
            ] }) }, c.id)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "시작일" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: form.start_date, onChange: (e) => setForm({ ...form, start_date: e.target.value }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "마감일" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: form.due_date, onChange: (e) => setForm({ ...form, due_date: e.target.value }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "예상 소요 (분)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: 5, max: 1e4, value: form.estimated_minutes, onChange: (e) => setForm({ ...form, estimated_minutes: Number(e.target.value) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "체크리스트" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: addChecklistItem, className: "text-sm text-foreground inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
              " 추가"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            form.checklist.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "체크리스트가 없습니다" }),
            form.checklist.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: it.completed, onChange: (e) => updateChecklistItem(it.id, { completed: e.target.checked }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: it.text, onChange: (e) => updateChecklistItem(it.id, { text: e.target.value }), placeholder: "항목 내용" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => removeChecklistItem(it.id), className: "text-muted-foreground p-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
            ] }, it.id))
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleSave, disabled: !form.title, children: "저장" }) })
    ] })
  ] });
}
export {
  TaskFormDialog as T,
  daysBetween as a,
  dDayLabel as d,
  isWithin as i,
  monthDays as m,
  parseISO as p,
  sameDay as s
};
