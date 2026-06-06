import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, H as HeadContent, S as Scripts, O as Outlet, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { Q as redirect } from "../_libs/tanstack__router-core.mjs";
import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { T as Toaster$1 } from "../_libs/sonner.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
const appCss = "/assets/styles-BcEW5nV3.css";
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
function registerServiceWorker() {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").then((reg) => {
      console.log("Service worker registered:", reg);
    }).catch((err) => {
      console.warn("Service worker registration failed:", err);
    });
  });
}
const Route$8 = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1" },
      { title: "StudyMate — AI 학습 플래너" },
      { name: "description", content: "학생을 위한 AI 학습 비서. 일정, 과제, 루틴을 한 곳에서." },
      { name: "theme-color", content: "#111111" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/icons/icon-192.svg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+KR:wght@400;500;600;700&display=swap"
      }
    ]
  }),
  shellComponent: ({ children }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "ko", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] }),
  component: RootComponent,
  notFoundComponent: () => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "페이지를 찾을 수 없습니다." }) }),
  errorComponent: ({ error }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-semibold", children: "오류" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "text-xs mt-2", children: String(error?.message ?? error) })
  ] })
});
function RootComponent() {
  const { queryClient } = Route$8.useRouteContext();
  reactExports.useEffect(() => {
    registerServiceWorker();
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(QueryClientProvider, { client: queryClient, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, {})
  ] });
}
const $$splitComponentImporter$7 = () => import("./auth-BhouiNT4.mjs");
const Route$7 = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [{
      title: "로그인 — StudyMate"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("../_app-DKkTe9r2.mjs");
const Route$6 = createFileRoute("/_app")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./index-BTU5dmpx.mjs");
const Route$5 = createFileRoute("/")({
  beforeLoad: async () => {
    throw redirect({
      to: "/dashboard"
    });
  },
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("../_app.tasks-Omk1PbcQ.mjs");
const Route$4 = createFileRoute("/_app/tasks")({
  head: () => ({
    meta: [{
      title: "할 일 — StudyMate"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("../_app.settings-D40SkOA6.mjs");
const Route$3 = createFileRoute("/_app/settings")({
  head: () => ({
    meta: [{
      title: "설정 — StudyMate"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("../_app.routines-gEHtOlVz.mjs");
const Route$2 = createFileRoute("/_app/routines")({
  head: () => ({
    meta: [{
      title: "루틴 — StudyMate"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("../_app.dashboard-B3LXgkNA.mjs");
const Route$1 = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [{
      title: "대시보드 — StudyMate"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("../_app.categories-B1eTxZeB.mjs");
const Route = createFileRoute("/_app/categories")({
  head: () => ({
    meta: [{
      title: "과목 관리 — StudyMate"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const AuthRoute = Route$7.update({
  id: "/auth",
  path: "/auth",
  getParentRoute: () => Route$8
});
const AppRoute = Route$6.update({
  id: "/_app",
  getParentRoute: () => Route$8
});
const IndexRoute = Route$5.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$8
});
const AppTasksRoute = Route$4.update({
  id: "/tasks",
  path: "/tasks",
  getParentRoute: () => AppRoute
});
const AppSettingsRoute = Route$3.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => AppRoute
});
const AppRoutinesRoute = Route$2.update({
  id: "/routines",
  path: "/routines",
  getParentRoute: () => AppRoute
});
const AppDashboardRoute = Route$1.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => AppRoute
});
const AppCategoriesRoute = Route.update({
  id: "/categories",
  path: "/categories",
  getParentRoute: () => AppRoute
});
const AppRouteChildren = {
  AppCategoriesRoute,
  AppDashboardRoute,
  AppRoutinesRoute,
  AppSettingsRoute,
  AppTasksRoute
};
const AppRouteWithChildren = AppRoute._addFileChildren(AppRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  AppRoute: AppRouteWithChildren,
  AuthRoute
};
const routeTree = Route$8._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router;
};
export {
  getRouter
};
