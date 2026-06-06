import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { u as useMockStore } from "./_ssr/mock-store-CRbYeCLj.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./_ssr/dialog-C4n16bfk.mjs";
import { B as Button, c as cn } from "./_ssr/button-DjOZMqFS.mjs";
import { L as Label, I as Input } from "./_ssr/label-BJaHSwYl.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./_ssr/select-CUSP6kj8.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { C as Check, b as Pen, a as Trash2, P as Plus } from "./_libs/lucide-react.mjs";
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
import "./_libs/class-variance-authority.mjs";
import "./_libs/clsx.mjs";
import "./_libs/tailwind-merge.mjs";
import "./_libs/radix-ui__react-label.mjs";
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
const DOW = ["일", "월", "화", "수", "목", "금", "토"];
const getTodayISO = () => {
  const now = /* @__PURE__ */ new Date();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${m}-${d}`;
};
function routineAppliesOnDate(r, date) {
  if (!r.active) return false;
  const day = date.getDay();
  if (r.repeat_type === "daily") return true;
  if (r.repeat_type === "weekday") return day >= 1 && day <= 5;
  if (r.repeat_type === "weekend") return day === 0 || day === 6;
  if (r.repeat_type === "custom") return r.repeat_days.includes(day);
  return false;
}
function RoutinesPage() {
  const {
    categories,
    routines,
    setRoutines
  } = useMockStore();
  const today = getTodayISO();
  const [editing, setEditing] = reactExports.useState(null);
  const [originalEditing, setOriginalEditing] = reactExports.useState(null);
  const [error, setError] = reactExports.useState(null);
  function newRoutine() {
    const initial = {
      title: "",
      category_id: categories[0]?.id ?? null,
      repeat_type: "daily",
      repeat_days: [],
      start_time: "",
      active: true,
      completed_dates: []
    };
    setEditing(initial);
    setOriginalEditing(initial);
    setError(null);
  }
  function save() {
    if (!editing?.title?.trim()) {
      setError("제목은 필수입니다.");
      return;
    }
    const payload = {
      title: editing.title.trim(),
      category_id: editing.category_id || null,
      repeat_type: editing.repeat_type,
      repeat_days: editing.repeat_days,
      start_time: editing.start_time || null,
      active: editing.active
    };
    if (editing.id) {
      setRoutines((prev) => prev.map((r) => r.id === editing.id ? {
        ...r,
        ...payload
      } : r));
    } else {
      setRoutines((prev) => [...prev, {
        id: "routine-" + Math.random().toString(36).slice(2, 9),
        ...payload,
        completed_dates: [],
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      }]);
    }
    setEditing(null);
    setOriginalEditing(null);
    setError(null);
    toast.success("저장됨");
  }
  const visibleRoutines = routines.filter((r) => {
    const completedToday = r.completed_dates?.includes(today);
    return routineAppliesOnDate(r, new Date(today)) && !completedToday;
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pt-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold mb-4", children: "루틴" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 mb-4", children: [
      visibleRoutines.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center py-8", children: "오늘 완료할 루틴이 없어요" }),
      visibleRoutines.map((r) => {
        const c = categories.find((x) => x.id === r.category_id);
        const repeatLabel = {
          daily: "매일",
          weekday: "평일",
          weekend: "주말",
          custom: r.repeat_days.map((d) => DOW[d]).join(", ")
        }[r.repeat_type];
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-card rounded-2xl ring-1 ring-black/5 flex items-center gap-3", children: [
          c && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-3 rounded-full shrink-0", style: {
            background: c.color
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm truncate", children: r.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground", children: [
              repeatLabel,
              r.start_time ? ` · ${r.start_time}` : ""
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
            setRoutines((prev) => prev.map((item) => item.id === r.id ? {
              ...item,
              completed_dates: [...item.completed_dates ?? [], today]
            } : item));
            toast.success("오늘 루틴 완료됨");
          }, className: "p-2 rounded-lg bg-emerald-500 text-background hover:bg-emerald-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
            const initial = {
              ...r
            };
            setEditing(initial);
            setOriginalEditing(initial);
            setError(null);
          }, className: "p-1.5 text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "size-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
            if (!confirm("삭제할까요?")) return;
            setRoutines((prev) => prev.filter((x) => x.id !== r.id));
          }, className: "p-1.5 text-muted-foreground hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
        ] }, r.id);
      })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: newRoutine, className: "w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4 mr-1" }),
      " 루틴 추가"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!editing, onOpenChange: (v) => {
      if (!v) {
        setEditing(null);
        setOriginalEditing(null);
        setError(null);
      }
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editing?.id ? "루틴 수정" : "새 루틴" }) }),
      editing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "제목" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: editing.title, onChange: (e) => {
            setEditing({
              ...editing,
              title: e.target.value
            });
            setError(null);
          }, placeholder: "영단어 50개 암기" }),
          error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: error })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "과목 (선택)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: editing.category_id ?? "", onValueChange: (v) => setEditing({
            ...editing,
            category_id: v
          }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "선택" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c.id, children: c.name }, c.id)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "반복 방식" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: editing.repeat_type, onValueChange: (v) => setEditing({
            ...editing,
            repeat_type: v,
            repeat_days: v === "custom" ? editing.repeat_days : []
          }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "daily", children: "매일" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "weekday", children: "평일" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "weekend", children: "주말" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "custom", children: "특정 요일" })
            ] })
          ] })
        ] }),
        editing.repeat_type === "custom" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "요일 선택" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: DOW.map((d, i) => {
            const active = editing.repeat_days.includes(i);
            return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setEditing({
              ...editing,
              repeat_days: active ? editing.repeat_days.filter((x) => x !== i) : [...editing.repeat_days, i]
            }), className: cn("flex-1 h-9 rounded-lg text-xs font-medium", active ? "bg-foreground text-background" : "bg-muted text-muted-foreground"), children: d }, i);
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "시작 시간 (선택)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "time", value: editing.start_time ?? "", onChange: (e) => setEditing({
            ...editing,
            start_time: e.target.value
          }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: save, disabled: !editing?.title, children: "저장" }) })
    ] }) })
  ] });
}
export {
  RoutinesPage as component
};
