import { j as jsxRuntimeExports } from "./_libs/react.mjs";
import { O as Outlet, L as Link } from "./_libs/tanstack__react-router.mjs";
import { M as MockProvider } from "./_ssr/mock-store-CRbYeCLj.mjs";
import { H as House, L as ListTodo, R as Repeat, T as Tag } from "./_libs/lucide-react.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./_libs/isbot.mjs";
function AppLayout() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(MockProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "max-w-md mx-auto pb-24", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "fixed bottom-0 inset-x-0 bg-background/95 backdrop-blur border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md mx-auto flex items-center justify-around py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabLink, { to: "/dashboard", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "size-5" }), label: "홈" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabLink, { to: "/tasks", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ListTodo, { className: "size-5" }), label: "할 일" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabLink, { to: "/routines", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Repeat, { className: "size-5" }), label: "루틴" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabLink, { to: "/categories", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "size-5" }), label: "과목" })
    ] }) })
  ] }) });
}
function TabLink({
  to,
  icon,
  label
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to, className: "flex flex-col items-center gap-0.5 text-muted-foreground py-1.5 px-3", activeProps: {
    className: "flex flex-col items-center gap-0.5 text-foreground py-1.5 px-3"
  }, children: [
    icon,
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-medium", children: label })
  ] });
}
export {
  AppLayout as component
};
