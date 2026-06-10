import { useEffect, useState } from "react";
import { useMockStore, type Task } from "@/lib/mock-store";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { todayISO } from "@/lib/date-utils";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

type TaskForm = {
  title: string;
  description: string;
  category_id: string;
  due_date: string;
  estimated_minutes: number | "";
  progress: number;
  checklist: { id: string; text: string; completed: boolean }[];
};

export function TaskFormDialog({ children, task, open, onOpenChange }: {
  children?: React.ReactNode;
  task?: Partial<Task>;
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const o = isControlled ? open : internalOpen;
  const setO = isControlled ? (onOpenChange ?? (() => {})) : setInternalOpen;

  const { categories, setTasks } = useMockStore();

  function getInitialForm(task?: Partial<Task>): TaskForm {
    let dd = task?.due_date ?? (todayISO() + "T23:59");
    if (dd.length === 10) dd += "T23:59";

    return {
      title: task?.title ?? "",
      description: task?.description ?? "",
      category_id: task?.category_id ?? (categories[0]?.id ?? ""),
      due_date: dd,
      estimated_minutes: task?.estimated_minutes ?? 60,
      progress: task?.progress ?? 0,
      checklist: task?.checklist ?? [],
    };
  }

  const [form, setForm] = useState<TaskForm>(() => getInitialForm(task));
  const [initialForm, setInitialForm] = useState<TaskForm>(() => getInitialForm(task));
  const [error, setError] = useState<string | null>(null);
  const [showDescription, setShowDescription] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);

  useEffect(() => {
    if (o) {
      const initial = getInitialForm(task);
      setForm(initial);
      setInitialForm(initial);
      setError(null);
      setShowDescription(!!initial.description);
      setShowChecklist(initial.checklist.length > 0);
    }
  }, [o, task]);

  function handleSave() {
    if (!form.title.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }
    const payload = {
      title: form.title.trim(),
      description: form.description || null,
      category_id: form.category_id || null,
      due_date: form.due_date,
      estimated_minutes: form.estimated_minutes === "" ? 60 : Number(form.estimated_minutes),
      checklist: form.checklist,
    };
    // compute progress from checklist if present
    const progress = form.checklist && form.checklist.length > 0
      ? Math.round((form.checklist.filter(i => i.completed).length / form.checklist.length) * 100)
      : 0;
    const completed = progress === 100;

    if (task?.id) {
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, ...payload, progress, checklist: form.checklist, completed } : t));
      toast.success("수정되었습니다");
    } else {
      const newTask: Task = {
        id: "task-" + Math.random().toString(36).slice(2, 9),
        ...payload,
        progress,
        checklist: form.checklist,
        completed,
        created_at: new Date().toISOString(),
      };
      setTasks(prev => [...prev, newTask]);
      toast.success("할 일이 추가되었습니다");
    }
    setO(false);
  }

  function hasChanges() {
    return JSON.stringify(form) !== JSON.stringify(initialForm);
  }

  function canSave() {
    return form.title.trim().length > 0;
  }

  // Closing via backdrop/ESC should not autosave; only explicit save should persist.
  function handleDialogOpenChange(open: boolean) {
    setO(open);
  }

  function addChecklistItem() {
    const it = { id: "chk-" + Math.random().toString(36).slice(2, 9), text: "", completed: false };
    setForm(f => ({ ...f, checklist: [...f.checklist, it] }));
  }

  function updateChecklistItem(id: string, patch: Partial<{ text: string; completed: boolean }>) {
    setForm(f => {
      const next = f.checklist.map(i => i.id === id ? { ...i, ...patch } : i);
      // auto-calc progress if checklist exists
      const progress = next.length > 0 ? Math.round((next.filter(i => i.completed).length / next.length) * 100) : f.progress;
      return { ...f, checklist: next, progress };
    });
  }

  function removeChecklistItem(id: string) {
    setForm(f => {
      const next = f.checklist.filter(i => i.id !== id);
      const progress = next.length > 0 ? Math.round((next.filter(i => i.completed).length / next.length) * 100) : 0;
      return { ...f, checklist: next, progress };
    });
  }

  return (
    <Dialog open={o} onOpenChange={handleDialogOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>{task?.id ? "할 일 수정" : "새 할 일"}</DialogTitle></DialogHeader>
        <div className="space-y-4 pb-2">
          <div className="flex gap-2 items-start">
            <div className="space-y-1.5 flex-1 min-w-0">
              <Label>제목</Label>
              <Input value={form.title} onChange={(e) => { setForm({ ...form, title: e.target.value }); setError(null); }} placeholder="수학 수행평가 준비" />
              {error && <p className="text-xs text-destructive">{error}</p>}
            </div>
            <div className="space-y-1.5 w-[110px] shrink-0">
              <Label>과목</Label>
              <Select value={form.category_id ?? ""} onValueChange={(v) => setForm({ ...form, category_id: v })}>
                <SelectTrigger><SelectValue placeholder="과목 선택" /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="size-2 rounded-full shrink-0" style={{ background: c.color }} />
                        <span className="truncate">{c.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {!showDescription ? (
            <button type="button" onClick={() => setShowDescription(true)} className="text-xs text-muted-foreground flex items-center gap-1 hover:text-foreground transition-colors">
              <Plus className="size-3" /> 설명 추가
            </button>
          ) : (
            <div className="space-y-1.5">
              <Label>설명</Label>
              <Textarea value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
            </div>
          )}

          <div className="space-y-1.5">
            <Label>마감일시</Label>
            <Input type="datetime-local" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
          </div>
          
          <div className="space-y-1.5">
            <Label>예상 소요 (분)</Label>
            <Input type="number" min={5} max={10000} placeholder="예: 60" value={form.estimated_minutes} onChange={(e) => {
              const val = e.target.value;
              setForm({ ...form, estimated_minutes: val === "" ? "" : Number(val) });
            }} />
          </div>

          {!showChecklist ? (
            <button type="button" onClick={() => { setShowChecklist(true); if(form.checklist.length === 0) addChecklistItem(); }} className="text-xs text-muted-foreground flex items-center gap-1 hover:text-foreground transition-colors">
              <Plus className="size-3" /> 체크리스트 추가
            </button>
          ) : (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label>체크리스트</Label>
                <button type="button" onClick={addChecklistItem} className="text-sm text-foreground inline-flex items-center gap-1">
                  <Plus className="size-4" /> 추가
                </button>
              </div>
              <div className="space-y-2">
                {form.checklist.length === 0 && <p className="text-xs text-muted-foreground">체크리스트가 없습니다</p>}
                {form.checklist.map((it) => (
                  <div key={it.id} className="flex items-center gap-2">
                    <input type="checkbox" checked={it.completed} onChange={(e) => updateChecklistItem(it.id, { completed: e.target.checked })} className="size-4 rounded border-gray-300 shrink-0" />
                    <Input value={it.text} onChange={(e) => updateChecklistItem(it.id, { text: e.target.value })} placeholder="항목 내용" className="h-8 text-sm" />
                    <button type="button" onClick={() => removeChecklistItem(it.id)} className="text-muted-foreground p-1 shrink-0">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="sticky bottom-0 left-0 right-0 bg-background pt-3 pb-1 mt-2 border-t z-10 w-full sm:w-auto">
          <Button onClick={handleSave} disabled={!form.title} className="w-full">저장</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
