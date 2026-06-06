import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { u as useMockStore } from "./_ssr/mock-store-CRbYeCLj.mjs";
import { d as dDayLabel, T as TaskFormDialog } from "./_ssr/task-form-dialog-BglxWZmk.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./_ssr/select-CUSP6kj8.mjs";
import { c as cn } from "./_ssr/button-DjOZMqFS.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { C as Check, a as Trash2, P as Plus } from "./_libs/lucide-react.mjs";
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
function computePriority(task) {
  const now = /* @__PURE__ */ new Date();
  const due = new Date(task.due_date);
  const hoursUntilDue = Math.max(1, (due.getTime() - now.getTime()) / 36e5);
  const urgency = 1 / hoursUntilDue;
  const estimatedHours = task.estimated_minutes / 60;
  const incompletion = 1 - task.progress / 100;
  return urgency * 100 + estimatedHours * 10 + incompletion * 50;
}
function TasksPage() {
  const {
    categories,
    tasks,
    setTasks
  } = useMockStore();
  const [sort, setSort] = reactExports.useState("due_asc");
  const [filterCat, setFilterCat] = reactExports.useState("all");
  const [filterDone, setFilterDone] = reactExports.useState("all");
  const catMap = reactExports.useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c])), [categories]);
  const filtered = reactExports.useMemo(() => {
    let r = [...tasks];
    if (filterCat !== "all") r = r.filter((t) => t.category_id === filterCat);
    if (filterDone === "done") r = r.filter((t) => t.completed);
    if (filterDone === "todo") r = r.filter((t) => !t.completed);
    r.sort((a, b) => {
      if (sort === "due_asc") return a.due_date.localeCompare(b.due_date);
      if (sort === "due_desc") return b.due_date.localeCompare(a.due_date);
      if (sort === "created") return b.created_at.localeCompare(a.created_at);
      if (sort === "priority") return computePriority(b) - computePriority(a);
      return 0;
    });
    return r;
  }, [tasks, sort, filterCat, filterDone]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pt-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold mb-4", children: "할 일" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: sort, onValueChange: setSort, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "due_asc", children: "마감 빠른순" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "due_desc", children: "마감 늦은순" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "created", children: "최신순" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "priority", children: "우선순위순" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filterCat, onValueChange: setFilterCat, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "전체 과목" }),
          categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c.id, children: c.name }, c.id))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filterDone, onValueChange: setFilterDone, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "전체" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "todo", children: "미완료" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "done", children: "완료" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2.5", children: [
      filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center py-8", children: "할 일이 없어요" }),
      filtered.map((t) => {
        const c = catMap[t.category_id ?? ""];
        const dday = dDayLabel(t.due_date);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("p-4 bg-card rounded-2xl ring-1 ring-black/5 flex items-center gap-3", t.completed && "opacity-50"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
            setTasks((prev) => prev.map((pt) => pt.id === t.id ? {
              ...pt,
              completed: !pt.completed,
              progress: !pt.completed ? 100 : pt.progress
            } : pt));
          }, className: cn("size-5 rounded-full border-2 flex items-center justify-center shrink-0", t.completed ? "bg-foreground border-foreground text-background" : "border-muted-foreground/40"), children: t.completed && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TaskFormDialog, { task: t, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 cursor-pointer", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              c && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-2 rounded-full", style: {
                background: c.color
              } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: cn("text-sm font-medium truncate", t.completed && "line-through"), children: t.title })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground mt-1", children: [
              t.start_date,
              " ~ ",
              t.due_date,
              " · ",
              t.estimated_minutes,
              "분"
            ] })
          ] }) }),
          !t.completed && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-semibold text-muted-foreground mr-1", children: dday.text }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
            if (!confirm("삭제할까요?")) return;
            setTasks((prev) => prev.filter((pt) => pt.id !== t.id));
            toast.success("삭제됨");
          }, className: "text-muted-foreground hover:text-destructive p-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
        ] }, t.id);
      })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TaskFormDialog, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "fixed bottom-20 right-5 size-14 bg-foreground text-background rounded-full shadow-lg flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-6" }) }) })
  ] });
}
export {
  TasksPage as component
};
