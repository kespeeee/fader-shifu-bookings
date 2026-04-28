import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [{ title: "Admin sisselogimine — FaderShifu" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error("Sisselogimine ebaõnnestus: " + error.message);
      return;
    }
    toast.success("Tere tulemast tagasi!");
    navigate({ to: "/admin" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 block text-center text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-primary">
          ← Tagasi avalehele
        </Link>
        <form onSubmit={handleSubmit} className="grid gap-5 rounded-2xl border border-border bg-card p-8 shadow-card">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/20">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h1 className="font-display text-3xl tracking-wider">ADMIN</h1>
            <p className="mt-2 text-sm text-muted-foreground">Logi sisse oma aegade haldamiseks</p>
          </div>
          <div className="grid gap-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">E-post</Label>
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@fadershifu.ee" />
          </div>
          <div className="grid gap-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Parool</Label>
            <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" size="lg" disabled={loading} className="h-12 font-display tracking-wider">
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sisestan...</> : "Logi sisse"}
          </Button>
        </form>
      </div>
      <Toaster theme="dark" position="top-center" richColors />
    </div>
  );
}
