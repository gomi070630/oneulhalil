import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { categoriesQuery, tasksQuery } from "@/lib/queries";
import { deleteTask, updateTask } from "@/lib/tasks.functions";
import { TaskFormDialog } from "@/components/task-form-dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { dDayLabel } from "@/lib/date-utils";
import { Plus, Trash2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/tasks")({
  head: () => ({ meta: [{ title: "할 일 — StudyMate" }] }),
  component: TasksPage,
});

function TasksPage() {
  const { data: cats = [] } = useQuery(categoriesQuery());
  const { data: tasks = [] } = useQuery(tasksQuery());
  const qc = useQueryClient();
  const updateFn = useServerFn(updateTask);
  const deleteFn = useServerFn(deleteTask);
  const [sort, setSort] = useState("due_asc");
  const [filterCat, setFilterCat] = useState("all");
  const [filterDone, setFilterDone] = useState("all");

  const catMap = useMemo(() => Object.fromEntries(cats.map((c) => [c.id, c])), [cats]);

  const filtered = useMemo(() => {
    let r = [...tasks];
    if (filterCat !== "all") r = r.filter((t) => t.category_id === filterCat);
    if (filterDone === "done") r = r.filter((t) => t.completed);
    if (filterDone === "todo") r = r.filter((t) => !t.completed);
    r.sort((a, b) => {
      if (sort === "due_asc") return a.due_date.localeCompare(b.due_date);
      if (sort === "due_desc") return b.due_date.localeCompare(a.due_date);
      if (sort === "created") return b.created_at.localeCompare(a.created_at);
      if (sort === "importance") return b.importance - a.importance;
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
            <SelectItem value="importance">중요도순</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterCat} onValueChange={setFilterCat}>
          <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 과목</SelectItem>
            {cats.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
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
                onClick={async () => {
                  await updateFn({ data: { id: t.id, completed: !t.completed, progress: !t.completed ? 100 : t.progress } });
                  qc.invalidateQueries({ queryKey: ["tasks"] });
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
              <span className="text-[11px] font-semibold text-muted-foreground mr-1">{dday.text}</span>
              <button onClick={async () => {
                if (!confirm("삭제할까요?")) return;
                await deleteFn({ data: { id: t.id } });
                qc.invalidateQueries({ queryKey: ["tasks"] });
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
