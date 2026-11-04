import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useUser } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — STRAFE" },
      { name: "description", content: "Sign in to save your STRAFE scores and stats to your account." },
      { property: "og:title", content: "Sign in — STRAFE" },
      { property: "og:description", content: "Keep your scores across devices." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const user = useUser();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (user) navigate({ to: "/", replace: true }); }, [user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setMsg(null);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMsg(error.message);
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin } });
      if (error) setMsg(error.message);
      else if (!data.session) setMsg("Check your email to confirm your account.");
    }
    setBusy(false);
  };

  const google = async () => {
    setMsg(null);
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (r.error) setMsg(r.error.message ?? "Google sign-in failed.");
  };

  return (
    <div className="min-h-screen pb-16">
      <SiteHeader />
      <main className="mx-auto max-w-md px-5">
        <h1 className="font-display py-8 text-6xl">{mode === "in" ? "Sign in." : "Join up."}</h1>
        <div className="plate space-y-4 p-6">
          <button onClick={google} className="btn btn-outline w-full">Continue with Google</button>
          <div className="text-center text-xs font-semibold text-muted-foreground">or with email</div>
          <form onSubmit={submit} className="space-y-3">
            <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-full border border-input bg-background px-5 py-3 outline-none focus:border-foreground" />
            <input type="password" required minLength={6} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-full border border-input bg-background px-5 py-3 outline-none focus:border-foreground" />
            <button disabled={busy} className="btn btn-primary w-full">{mode === "in" ? "Sign in" : "Create account"}</button>
          </form>
          {msg && <p className="text-center text-sm font-semibold">{msg}</p>}
          <button onClick={() => { setMode(mode === "in" ? "up" : "in"); setMsg(null); }} className="w-full text-sm font-semibold underline">
            {mode === "in" ? "New here? Create an account" : "Have an account? Sign in"}
          </button>
        </div>
        <p className="mt-4 text-center text-sm text-muted-foreground">You can still play as a guest without signing in.</p>
      </main>
    </div>
  );
}
