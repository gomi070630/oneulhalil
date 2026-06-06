import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "설정 — StudyMate" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="px-5 pt-8 max-w-lg">
      <h1 className="text-xl font-semibold mb-4">설정</h1>
      <div className="space-y-4">
        <div className="rounded-3xl bg-muted/70 p-4 ring-1 ring-black/5">
          <p className="text-sm text-muted-foreground">
            이 설정은 더 이상 사용되지 않습니다. 대시보드에서 남은 학습 목표와 하루 권장 진도를
            확인하세요.
          </p>
        </div>
        <Button
          onClick={() => {
            if (typeof window !== "undefined") window.location.href = "/dashboard";
          }}
        >
          대시보드로 이동
        </Button>
      </div>
    </div>
  );
}
