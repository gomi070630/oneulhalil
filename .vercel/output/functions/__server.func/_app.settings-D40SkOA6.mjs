import { j as jsxRuntimeExports } from "./_libs/react.mjs";
import { B as Button } from "./_ssr/button-DjOZMqFS.mjs";
import "./_libs/radix-ui__react-slot.mjs";
import "./_libs/radix-ui__react-compose-refs.mjs";
import "./_libs/class-variance-authority.mjs";
import "./_libs/clsx.mjs";
import "./_libs/tailwind-merge.mjs";
function SettingsPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pt-8 max-w-lg", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold mb-4", children: "설정" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-3xl bg-muted/70 p-4 ring-1 ring-black/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "이 설정은 더 이상 사용되지 않습니다. 대시보드에서 남은 학습 목표와 하루 권장 진도를 확인하세요." }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => {
        if (typeof window !== "undefined") window.location.href = "/dashboard";
      }, children: "대시보드로 이동" })
    ] })
  ] });
}
export {
  SettingsPage as component
};
