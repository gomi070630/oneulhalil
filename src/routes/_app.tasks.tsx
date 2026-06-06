import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMockStore, type Task } from "@/lib/mock-store";
import { TaskFormDialog } from "@/components/task-form-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { dDayLabel } from "@/lib/date-utils";
import { Plus, Trash2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/tasks")({
  head: () => ({ meta: [{ title: "할 일 — StudyMate" }] }),
  component: TasksPage,
});

function computePriority(task: Task) {
  const now = new Date();
  const due = new Date(task.due_date);
  const hoursUntilDue = Math.max(1, (due.getTime() - now.getTime()) / 3_600_000);
  const urgency = 1 / hoursUntilDue;
  const estimatedHours = task.estimated_minutes / 60;
  const incompletion = 1 - task.progress / 100;
  return urgency * 100 + estimatedHours * 10 + incompletion * 50;
}

function TasksPage() {
  const { categories, tasks, setTasks } = useMockStore();
  const [sort, setSort] = useState("due_asc");
  const [filterCat, setFilterCat] = useState("all");
  const [filterDone, setFilterDone] = useState("all");

  const catMap = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c])), [categories]);

  const filtered = useMemo(() => {
    let r = [...tasks];
    if (filterCat !== "all") r = r.filter((t) => t.category_id === filterCat);
    if (filterDone === "done") r = r.filter((t) => t.completed);
    if (filterDone === "todo") r = r.filter((t) => !t.completed);
    r.sort((a, b) => {
      if (sort === "due_asc") return a.due_date.localeCompare(b.due_date);
      if (sort === "due_desc") return b.due_date.localeCompare(a.due_date);
      if (sort === "created") return b.created_at.localeCompare(a.created_at);
      if (sort === "priority") return computePriority(b) - computePriority(a);
      return 0;
    });
    return r;
  }, [tasks, sort, filterCat, filterDone]);

  return (
    <div className="px-5 pt-8">
      <h1 className="text-xl font-semibold mb-4">할 일</h1>
      <div className="grid grid-cols-3 gap-2 mb-4">
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="due_asc">마감 빠른순</SelectItem>
            <SelectItem value="due_desc">마감 늦은순</SelectItem>
            <SelectItem value="created">최신순</SelectItem>
            <SelectItem value="priority">우선순위순</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterCat} onValueChange={setFilterCat}>
          <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 과목</SelectItem>
            {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterDone} onValueChange={setFilterDone}>
          <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="todo">미완료</SelectItem>
            <SelectItem value="done">완료</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2.5">
        {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">할 일이 없어요</p>}
        {filtered.map((t) => {
          const c = catMap[t.category_id ?? ""];
          const dday = dDayLabel(t.due_date);
          return (
            <div key={t.id} className={cn("p-4 bg-card rounded-2xl ring-1 ring-black/5 flex items-center gap-3", t.completed && "opacity-50")}>
              <button
                onClick={() => {
                  setTasks(prev => prev.map(pt => pt.id === t.id ? { ...pt, completed: !pt.completed, progress: !pt.completed ? 100 : pt.progress } : pt));
                }}
                className={cn("size-5 rounded-full border-2 flex items-center justify-center shrink-0",
                  t.completed ? "bg-foreground border-foreground text-background" : "border-muted-foreground/40")}>
                {t.completed && <Check className="size-3" />}
              </button>
              <TaskFormDialog task={t}>
                <div className="flex-1 min-w-0 cursor-pointer">
                  <div className="flex items-center gap-2">
                    {c && <span className="size-2 rounded-full" style={{ background: c.color }} />}
                    <h3 className={cn("text-sm font-medium truncate", t.completed && "line-through")}>{t.title}</h3>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">{t.start_date} ~ {t.due_date} · {t.estimated_minutes}분</p>
                </div>
              </TaskFormDialog>
              {!t.completed && (
                <span className="text-[11px] font-semibold text-muted-foreground mr-1">{dday.text}</span>
              )}
              <button onClick={() => {
                if (!confirm("삭제할까요?")) return;
                setTasks(prev => prev.filter(pt => pt.id !== t.id));
                toast.success("삭제됨");
              }} className="text-muted-foreground hover:text-destructive p-1">
                <Trash2 className="size-4" />
              </button>
            </div>
          );
        })}
      </div>

      <TaskFormDialog>
        <button className="fixed bottom-20 right-5 size-14 bg-foreground text-background rounded-full shadow-lg flex items-center justify-center">
          <Plus className="size-6" />
        </button>
      </TaskFormDialog>
    </div>
  );
}
