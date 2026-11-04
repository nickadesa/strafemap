import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { useRecords } from "@/lib/game/storage";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({ meta: [{"title": "Leaderboard \u2014 STRAFE"}, {"name": "description", "content": "Compare scores and accuracy from your STRAFE games."}, {"property": "og:title", "content": "Leaderboard \u2014 STRAFE"}, {"property": "og:description", "content": "Compare scores and accuracy from your STRAFE games."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: Leaderboard,
});

const tabs = { daily: 1, weekly: 7, all: Infinity } as const;
type Tab = keyof typeof tabs;

function Leaderboard() {
  const [records] = useRecords();
  const [tab, setTab] = useState<Tab>("all");
  const cutoff = Date.now() - tabs[tab] * 86400000;
  const rows = Object.values(
    (records ?? []).filter((r) => new Date(r.date).getTime() >= cutoff).reduce<Record<string, { name: string; score: number; acc: number; games: number }>>((a, r) => {
      a[r.player] ??= { name: r.player, score: 0, acc: 0, games: 0 };
      a[r.player]!.score += r.score; a[r.player]!.acc += r.score / r.max; a[r.player]!.games++;
      return a;
    }, {}),
  ).sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="md:ml-56 px-5 pb-8 pt-20 md:pt-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-display mb-6 text-5xl">Leaderboard</h1>
          <div className="mb-4 flex gap-2">
            {(Object.keys(tabs) as Tab[]).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === t ? "bg-foreground text-primary" : "bg-card"}`}>
                {t === "all" ? "All-time" : t === "daily" ? "Daily" : "Weekly"}
              </button>
            ))}
          </div>
          <div className="plate overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-muted-foreground"><tr>{["#", "Player", "Total score", "Accuracy", "Games"].map((h) => <th key={h} className="px-5 py-4 font-semibold">{h}</th>)}</tr></thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.name} className="border-t">
                    <td className="font-display px-5 py-4 text-xl">{i + 1}</td>
                    <td className="px-5 py-4 font-semibold">{r.name}</td>
                    <td className="px-5 py-4 font-semibold">{r.score.toLocaleString()}</td>
                    <td className="px-5 py-4">{Math.round((r.acc / r.games) * 100)}%</td>
                    <td className="px-5 py-4">{r.games}</td>
                  </tr>
                ))}
                {records && rows.length === 0 && <tr><td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">No games in this period yet.</td></tr>}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Rankings come from your games (your account when signed in, this device otherwise).</p>
        </div>
      </main>
    </div>
  );
}
