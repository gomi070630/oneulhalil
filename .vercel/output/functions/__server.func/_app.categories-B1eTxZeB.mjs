import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { u as useMockStore } from "./_ssr/mock-store-CRbYeCLj.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./_ssr/dialog-C4n16bfk.mjs";
import { B as Button, c as cn } from "./_ssr/button-DjOZMqFS.mjs";
import { L as Label, I as Input } from "./_ssr/label-BJaHSwYl.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { b as Pen, a as Trash2, P as Plus } from "./_libs/lucide-react.mjs";
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
const PALETTE = ["#fda4af", "#93c5fd", "#fde047", "#fdba74", "#86efac", "#fca5a5", "#c4b5fd", "#d4d4d8", "#67e8f9", "#f0abfc", "#fcd34d", "#a3e635"];
function CategoriesPage() {
  const {
    categories,
    setCategories,
    setTasks,
    setRoutines
  } = useMockStore();
  const [editing, setEditing] = reactExports.useState(null);
  const [originalEditing, setOriginalEditing] = reactExports.useState(null);
  const [error, setError] = reactExports.useState(null);
  function save() {
    if (!editing || !editing.name.trim()) {
      setError("과목 이름은 필수입니다.");
      return;
    }
    const trimmed = editing.name.trim();
    if (editing.id) {
      setCategories((prev) => prev.map((c) => c.id === editing.id ? {
        ...c,
        name: trimmed,
        color: editing.color
      } : c));
    } else {
      const newCat = {
        id: "cat-" + Math.random().toString(36).slice(2, 9),
        name: trimmed,
        color: editing.color,
        is_default: false
      };
      setCategories((prev) => [...prev, newCat]);
    }
    setEditing(null);
    setError(null);
    toast.success("저장됨");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pt-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold mb-4", children: "과목" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 mb-4", children: categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-card rounded-2xl ring-1 ring-black/5 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-4 rounded-full", style: {
        background: c.color
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 font-medium text-sm", children: c.name }),
      c.is_default && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "기본" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
        const initial = {
          id: c.id,
          name: c.name,
          color: c.color
        };
        setEditing(initial);
        setOriginalEditing(initial);
        setError(null);
      }, className: "p-1.5 text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "size-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
        if (!confirm("삭제할까요?")) return;
        setCategories((prev) => prev.filter((x) => x.id !== c.id));
        setTasks((prev) => prev.filter((t) => t.category_id !== c.id));
        setRoutines((prev) => prev.filter((r) => r.category_id !== c.id));
      }, className: "p-1.5 text-muted-foreground hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
    ] }, c.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => {
      const initial = {
        name: "",
        color: PALETTE[0]
      };
      setEditing(initial);
      setOriginalEditing(initial);
      setError(null);
    }, className: "w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4 mr-1" }),
      " 과목 추가"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!editing, onOpenChange: (v) => {
      if (!v) {
        setEditing(null);
        setOriginalEditing(null);
        setError(null);
      }
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editing?.id ? "과목 수정" : "새 과목" }) }),
      editing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "이름" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: editing.name, onChange: (e) => {
            setEditing({
              ...editing,
              name: e.target.value
            });
            setError(null);
          } }),
          error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: error })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "색상" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: PALETTE.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEditing({
            ...editing,
            color: p
          }), className: cn("size-8 rounded-full ring-2", editing.color === p ? "ring-foreground" : "ring-transparent"), style: {
            background: p
          } }, p)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: save, disabled: !editing?.name, children: "저장" }) })
    ] }) })
  ] });
}
export {
  CategoriesPage as component
};
