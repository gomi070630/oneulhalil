import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "설정 — StudyMate" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [key, setKey] = useState("");
  const [url, setUrl] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setKey(window.localStorage.getItem('gemini_api_key') ?? '');
    setUrl(window.localStorage.getItem('gemini_api_url') ?? '');
  }, []);

  function save() {
    if (typeof window === 'undefined') return;
    if (key && key.trim()) window.localStorage.setItem('gemini_api_key', key.trim());
    else window.localStorage.removeItem('gemini_api_key');
    if (url && url.trim()) window.localStorage.setItem('gemini_api_url', url.trim());
    else window.localStorage.removeItem('gemini_api_url');
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div className="px-5 pt-8 max-w-lg">
      <h1 className="text-xl font-semibold mb-4">설정</h1>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label>Gemini API Key (개인용)</Label>
          <Input type="password" value={key} onChange={(e) => setKey(e.target.value)} placeholder="AQ... (Google) 또는 sk-... (OpenAI)" />
          <p className="text-xs text-muted-foreground">이 키는 브라우저의 localStorage에 저장됩니다. 개인용 앱에서만 사용하세요.</p>
        </div>
        <div className="space-y-1.5">
          <Label>Gemini API URL (선택)</Label>
          <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent" />
          <p className="text-xs text-muted-foreground">기본 Gemini generateContent 엔드포인트를 사용하려면 비워두세요.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={save}>저장</Button>
          <Button onClick={() => { window.location.href = '/_app/dashboard'; }} variant="ghost">대시보드로</Button>
        </div>
        {saved && <p className="text-sm text-emerald-600">저장되었습니다</p>}
      </div>
    </div>
  );
}
