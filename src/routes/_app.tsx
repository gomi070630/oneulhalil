import { createFileRoute, Outlet, redirect, Link, useRouter } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Home, ListTodo, Repeat, Tag, LogOut } from "lucide-react";

export const Route = createFileRoute("/_app")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw redirect({ to: "/auth" });
  },
  component: AppLayout,
});

function AppLayout() {
  const router = useRouter();
  async function signOut() {
    await supabase.auth.signOut();
    router.navigate({ to: "/auth" });
  }
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-md mx-auto pb-24">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 inset-x-0 bg-background/95 backdrop-blur border-t border-border">
        <div className="max-w-md mx-auto flex items-center justify-around py-2">
          <TabLink to="/dashboard" icon={<Home className="size-5" />} label="홈" />
          <TabLink to="/tasks" icon={<ListTodo className="size-5" />} label="할 일" />
          <TabLink to="/routines" icon={<Repeat className="size-5" />} label="루틴" />
          <TabLink to="/categories" icon={<Tag className="size-5" />} label="과목" />
          <button onClick={signOut} className="flex flex-col items-center gap-0.5 text-muted-foreground py-1.5 px-3">
            <LogOut className="size-5" />
            <span className="text-[10px] font-medium">로그아웃</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

function TabLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link to={to} className="flex flex-col items-center gap-0.5 text-muted-foreground py-1.5 px-3" activeProps={{ className: "flex flex-col items-center gap-0.5 text-foreground py-1.5 px-3" }}>
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
}
