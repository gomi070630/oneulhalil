import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { categoriesQuery } from "@/lib/queries";
import { createCategory, updateCategory, deleteCategory } from "@/lib/categories.functions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/categories")({
  head: () => ({ meta: [{ title: "과목 관리 — StudyMate" }] }),
  component: CategoriesPage,
});

const PALETTE = ["#fda4af","#93c5fd","#fde047","#fdba74","#86efac","#fca5a5","#c4b5fd","#d4d4d8","#67e8f9","#f0abfc","#fcd34d","#a3e635"];

function CategoriesPage() {
  const { data: cats = [] } = useQuery(categoriesQuery());
  const qc = useQueryClient();
  const createFn = useServerFn(createCategory);
  const updateFn = useServerFn(updateCategory);
  const deleteFn = useServerFn(deleteCategory);

  const [editing, setEditing] = useState<{ id?: string; name: string; color: string } | null>(null);

  async function save() {
    if (!editing || !editing.name) return;
    try {
      if (editing.id) await updateFn({ data: { id: editing.id, name: editing.name, color: editing.color } });
      else await createFn({ data: { name: editing.name, color: editing.color } });
      qc.invalidateQueries({ queryKey: ["categories"] });
      setEditing(null);
      toast.success("저장됨");
    } catch (e: any) { toast.error(e.message); }
  }

  return (
    <div className="px-5 pt-8">
      <h1 className="text-xl font-semibold mb-4">과목</h1>
      <div className="space-y-2 mb-4">
        {cats.map((c) => (
          <div key={c.id} className="p-3 bg-card rounded-2xl ring-1 ring-black/5 flex items-center gap-3">
            <span className="size-4 rounded-full" style={{ background: c.color }} />
            <span className="flex-1 font-medium text-sm">{c.name}</span>
            {c.is_default && <span className="text-[10px] text-muted-foreground">기본</span>}
            <button onClick={() => setEditing({ id: c.id, name: c.name, color: c.color })} className="p-1.5 text-muted-foreground"><Edit2 className="size-4" /></button>
            <button onClick={async () => {
              if (!confirm("삭제할까요?")) return;
              await deleteFn({ data: { id: c.id } });
              qc.invalidateQueries({ queryKey: ["categories"] });
            }} className="p-1.5 text-muted-foreground hover:text-destructive"><Trash2 className="size-4" /></button>
          </div>
        ))}
      </div>

      <Button onClick={() => setEditing({ name: "", color: PALETTE[0] })} className="w-full">
        <Plus className="size-4 mr-1" /> 과목 추가
      </Button>

      <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>{editing?.id ? "과목 수정" : "새 과목"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>이름</Label>
                <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>색상</Label>
                <div className="flex flex-wrap gap-2">
                  {PALETTE.map((p) => (
                    <button key={p} onClick={() => setEditing({ ...editing, color: p })}
                      className={cn("size-8 rounded-full ring-2", editing.color === p ? "ring-foreground" : "ring-transparent")}
                      style={{ background: p }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter><Button onClick={save} disabled={!editing?.name}>저장</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
