import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMockStore, type Routine } from "@/lib/mock-store";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Edit2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/routines")({
  head: () => ({ meta: [{ title: "루틴 — StudyMate" }] }),
  component: RoutinesPage,
});

const DOW = ["일", "월", "화", "수", "목", "금", "토"];

const getTodayISO = () => {
  const now = new Date();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${m}-${d}`;
};

function routineAppliesOnDate(r: Routine, date: Date) {
  if (!r.active) return false;
  const day = date.getDay();
  if (r.repeat_type === "daily") return true;
  if (r.repeat_type === "weekday") return day >= 1 && day <= 5;
  if (r.repeat_type === "weekend") return day === 0 || day === 6;
  if (r.repeat_type === "custom") return r.repeat_days.includes(day);
  return false;
}

function RoutinesPage() {
  const { categories, routines, setRoutines } = useMockStore();
  const today = getTodayISO();
  const [editing, setEditing] = useState<any>(null);
  const [originalEditing, setOriginalEditing] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  function isModified() {
    if (!editing || !originalEditing) return false;
    return JSON.stringify(editing) !== JSON.stringify(originalEditing);
  }

  function newRoutine() {
    const initial = { title: "", category_id: categories[0]?.id ?? null, repeat_type: "daily", repeat_days: [], start_time: "", active: true, completed_dates: [] };
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
      active: editing.active,
    };
    if (editing.id) {
      setRoutines(prev => prev.map(r => r.id === editing.id ? { ...r, ...payload } : r));
    } else {
      setRoutines(prev => [...prev, { id: "routine-" + Math.random().toString(36).slice(2, 9), ...payload, completed_dates: [], created_at: new Date().toISOString() }]);
    }
    setEditing(null);
    setOriginalEditing(null);
    setError(null);
    toast.success("저장됨");
  }

  function closeEditing() {
    if (!editing) return;
    if (!isModified()) {
      setEditing(null);
      setOriginalEditing(null);
      setError(null);
      return;
    }
    if (!editing.title?.trim()) {
      setError("제목은 필수입니다.");
      return;
    }
    save();
  }

  const visibleRoutines = routines.filter((r) => {
    const completedToday = r.completed_dates?.includes(today);
    return routineAppliesOnDate(r, new Date(today)) && !completedToday;
  });

  return (
    <div className="px-5 pt-8">
      <h1 className="text-xl font-semibold mb-4">루틴</h1>
      <div className="space-y-2 mb-4">
        {visibleRoutines.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">오늘 완료할 루틴이 없어요</p>}
        {visibleRoutines.map((r) => {
          const c = categories.find((x) => x.id === r.category_id);
          const repeatLabel = { daily: "매일", weekday: "평일", weekend: "주말", custom: (r.repeat_days as number[]).map((d) => DOW[d]).join(", ") }[r.repeat_type as string];
          return (
            <div key={r.id} className="p-3 bg-card rounded-2xl ring-1 ring-black/5 flex items-center gap-3">
              {c && <span className="size-3 rounded-full shrink-0" style={{ background: c.color }} />}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{r.title}</p>
                <p className="text-[11px] text-muted-foreground">{repeatLabel}{r.start_time ? ` · ${r.start_time}` : ""}</p>
              </div>
              <button
                onClick={() => {
                  setRoutines(prev => prev.map((item) => item.id === r.id
                    ? { ...item, completed_dates: [...(item.completed_dates ?? []), today] }
                    : item
                  ));
                  toast.success("오늘 루틴 완료됨");
                }}
                className="p-2 rounded-lg bg-emerald-500 text-background hover:bg-emerald-600"
              >
                <Check className="size-4" />
              </button>
              <button onClick={() => {
                const initial = { ...r };
                setEditing(initial);
                setOriginalEditing(initial);
                setError(null);
              }} className="p-1.5 text-muted-foreground"><Edit2 className="size-4" /></button>
              <button onClick={() => {
                if (!confirm("삭제할까요?")) return;
                setRoutines(prev => prev.filter(x => x.id !== r.id));
              }} className="p-1.5 text-muted-foreground hover:text-destructive"><Trash2 className="size-4" /></button>
            </div>
          );
        })}
      </div>
      <Button onClick={newRoutine} className="w-full"><Plus className="size-4 mr-1" /> 루틴 추가</Button>

      <Dialog open={!!editing} onOpenChange={(v) => {
        if (!v) {
          // discard edits when closing via backdrop/ESC
          setEditing(null);
          setOriginalEditing(null);
          setError(null);
        }
      }}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>{editing?.id ? "루틴 수정" : "새 루틴"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>제목</Label>
                <Input value={editing.title} onChange={(e) => { setEditing({ ...editing, title: e.target.value }); setError(null); }} placeholder="영단어 50개 암기" />
                {error && <p className="text-xs text-destructive">{error}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>과목 (선택)</Label>
                <Select value={editing.category_id ?? ""} onValueChange={(v) => setEditing({ ...editing, category_id: v })}>
                  <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>반복 방식</Label>
                <Select value={editing.repeat_type} onValueChange={(v) => setEditing({ ...editing, repeat_type: v, repeat_days: v === "custom" ? editing.repeat_days : [] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">매일</SelectItem>
                    <SelectItem value="weekday">평일</SelectItem>
                    <SelectItem value="weekend">주말</SelectItem>
                    <SelectItem value="custom">특정 요일</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {editing.repeat_type === "custom" && (
                <div className="space-y-1.5">
                  <Label>요일 선택</Label>
                  <div className="flex gap-1">
                    {DOW.map((d, i) => {
                      const active = (editing.repeat_days as number[]).includes(i);
                      return (
                        <button key={i} type="button"
                          onClick={() => setEditing({ ...editing, repeat_days: active ? editing.repeat_days.filter((x: number) => x !== i) : [...editing.repeat_days, i] })}
                          className={cn("flex-1 h-9 rounded-lg text-xs font-medium", active ? "bg-foreground text-background" : "bg-muted text-muted-foreground")}>
                          {d}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              <div className="space-y-1.5">
                <Label>시작 시간 (선택)</Label>
                <Input type="time" value={editing.start_time ?? ""} onChange={(e) => setEditing({ ...editing, start_time: e.target.value })} />
              </div>
            </div>
          )}
          <DialogFooter><Button onClick={save} disabled={!editing?.title}>저장</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
