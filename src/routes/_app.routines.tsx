import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMockStore } from "@/lib/mock-store";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/routines")({
  head: () => ({ meta: [{ title: "루틴 — StudyMate" }] }),
  component: RoutinesPage,
});

const DOW = ["일", "월", "화", "수", "목", "금", "토"];

function RoutinesPage() {
  const { categories, routines, setRoutines } = useMockStore();
  const [editing, setEditing] = useState<any>(null);

  function newRoutine() {
    setEditing({ title: "", category_id: categories[0]?.id ?? null, repeat_type: "daily", repeat_days: [], start_time: "", active: true });
  }

  function save() {
    if (!editing?.title) return;
    const payload = {
      title: editing.title,
      category_id: editing.category_id || null,
      repeat_type: editing.repeat_type,
      repeat_days: editing.repeat_days,
      start_time: editing.start_time || null,
      active: editing.active,
    };
    if (editing.id) {
      setRoutines(prev => prev.map(r => r.id === editing.id ? { ...r, ...payload } : r));
    } else {
      setRoutines(prev => [...prev, { id: "routine-" + Math.random().toString(36).slice(2, 9), ...payload, created_at: new Date().toISOString() }]);
    }
    setEditing(null);
    toast.success("저장됨");
  }

  return (
    <div className="px-5 pt-8">
      <h1 className="text-xl font-semibold mb-4">루틴</h1>
      <div className="space-y-2 mb-4">
        {routines.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">아직 루틴이 없어요</p>}
        {routines.map((r) => {
          const c = categories.find((x) => x.id === r.category_id);
          const repeatLabel = { daily: "매일", weekday: "평일", weekend: "주말", custom: (r.repeat_days as number[]).map((d) => DOW[d]).join(", ") }[r.repeat_type as string];
          return (
            <div key={r.id} className="p-3 bg-card rounded-2xl ring-1 ring-black/5 flex items-center gap-3">
              {c && <span className="size-3 rounded-full shrink-0" style={{ background: c.color }} />}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{r.title}</p>
                <p className="text-[11px] text-muted-foreground">{repeatLabel}{r.start_time ? ` · ${r.start_time}` : ""}</p>
              </div>
              <button onClick={() => setEditing({ ...r })} className="p-1.5 text-muted-foreground"><Edit2 className="size-4" /></button>
              <button onClick={() => {
                if (!confirm("삭제할까요?")) return;
                setRoutines(prev => prev.filter(x => x.id !== r.id));
              }} className="p-1.5 text-muted-foreground hover:text-destructive"><Trash2 className="size-4" /></button>
            </div>
          );
        })}
      </div>
      <Button onClick={newRoutine} className="w-full"><Plus className="size-4 mr-1" /> 루틴 추가</Button>

      <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>{editing?.id ? "루틴 수정" : "새 루틴"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>제목</Label>
                <Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder="영단어 50개 암기" />
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
