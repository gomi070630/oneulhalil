import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { categoriesQuery } from "@/lib/queries";
import { createTask, updateTask } from "@/lib/tasks.functions";
import { todayISO } from "@/lib/date-utils";
import { toast } from "sonner";

type Task = {
  id?: string;
  title?: string;
  description?: string | null;
  category_id?: string | null;
  start_date?: string;
  due_date?: string;
  estimated_minutes?: number;
  importance?: number;
  progress?: number;
};

export function TaskFormDialog({ children, task, open, onOpenChange }: {
  children?: React.ReactNode; task?: Task; open?: boolean; onOpenChange?: (v: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const o = isControlled ? open : internalOpen;
  const setO = isControlled ? (onOpenChange ?? (() => {})) : setInternalOpen;

  const qc = useQueryClient();
  const { data: cats = [] } = useQuery(categoriesQuery());
  const createFn = useServerFn(createTask);
  const updateFn = useServerFn(updateTask);

  const [form, setForm] = useState({
    title: task?.title ?? "",
    description: task?.description ?? "",
    category_id: task?.category_id ?? (cats[0]?.id ?? ""),
    start_date: task?.start_date ?? todayISO(),
    due_date: task?.due_date ?? todayISO(),
    estimated_minutes: task?.estimated_minutes ?? 60,
    importance: task?.importance ?? 2,
    progress: task?.progress ?? 0,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title: form.title,
        description: form.description || null,
        category_id: form.category_id || null,
        start_date: form.start_date,
        due_date: form.due_date,
        estimated_minutes: Number(form.estimated_minutes),
        importance: Number(form.importance),
      };
      if (task?.id) return updateFn({ data: { ...payload, id: task.id, progress: form.progress } });
      return createFn({ data: payload });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      toast.success(task?.id ? "수정되었습니다" : "할 일이 추가되었습니다");
      setO(false);
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <Dialog open={o} onOpenChange={setO}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>{task?.id ? "할 일 수정" : "새 할 일"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>제목</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="수학 수행평가 준비" />
          </div>
          <div className="space-y-1.5">
            <Label>설명</Label>
            <Textarea value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
          </div>
          <div className="space-y-1.5">
            <Label>과목</Label>
            <Select value={form.category_id ?? ""} onValueChange={(v) => setForm({ ...form, category_id: v })}>
              <SelectTrigger><SelectValue placeholder="과목 선택" /></SelectTrigger>
              <SelectContent>
                {cats.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    <span className="inline-flex items-center gap-2"><span className="size-2 rounded-full" style={{ background: c.color }} />{c.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label>시작일</Label>
              <Input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>마감일</Label>
              <Input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>예상 소요 (분)</Label>
            <Input type="number" min={5} max={10000} value={form.estimated_minutes} onChange={(e) => setForm({ ...form, estimated_minutes: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>중요도: {["낮음","보통","높음"][form.importance - 1]}</Label>
            <Slider min={1} max={3} step={1} value={[form.importance]} onValueChange={(v) => setForm({ ...form, importance: v[0] })} />
          </div>
          {task?.id && (
            <div className="space-y-1.5">
              <Label>진행률: {form.progress}%</Label>
              <Slider min={0} max={100} step={5} value={[form.progress]} onValueChange={(v) => setForm({ ...form, progress: v[0] })} />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={() => mutation.mutate()} disabled={!form.title || mutation.isPending}>저장</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
