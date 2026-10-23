import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { IconCheck, IconTarget, IconFlame, IconTrophy, IconMap, IconCalendar, IconStar } from "@/components/icons";
import { useUser } from "@/lib/auth";
import { achievements, computeStats, useRecords, useSettings } from "@/lib/game/storage";
import { formatDistance } from "@/lib/game/engine";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — STRAFE" },
      { name: "description", content: "Your player profile and achievements." },
    ],
  }),
  component: ProfilePage,
});

const ACH_ICONS: Record<string, typeof IconTarget> = {
  first: IconTarget,
  sharp: IconTarget,
  perfect: IconStar,
  streak: IconFlame,
  daily: IconCalendar,
  "20k": IconTrophy,
  veteran: IconMap,
};

function ProfilePage() {
  const user = useUser();
  const [settings] = useSettings();
  const [records] = useRecords();
  const list = records ?? [];
  const s = computeStats(list);
  const ach = achievements(list);
  const done = ach.filter((a) => a.done).length;

  return (
    <div className="min-h-screen pb-16">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-5">
        <div className="plate mt-8 flex flex-col items-center p-8 text-center">
          <div className="grid h-24 w-24 place-items-center rounded-full bg-primary text-primary-foreground text-4xl font-display">
            {settings.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <h1 className="font-display mt-4 text-4xl">{settings.name || "Guest"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{user ? user.email : "Playing as guest"}</p>
          <div className="mt-6 flex gap-8 text-center">
            <div><p className="font-display text-2xl">{s.games}</p><p className="text-xs text-muted-foreground">Games</p></div>
            <div><p className="font-display text-2xl">{done}/{ach.length}</p><p className="text-xs text-muted-foreground">Achievements</p></div>
            <div><p className="font-display text-2xl">{s.bestStreak}</p><p className="text-xs text-muted-foreground">Best streak</p></div>
          </div>
        </div>

        <div className="plate mt-4 p-6">
          <h2 className="font-display text-2xl">Achievements</h2>
          <ul className="mt-4 space-y-3">
            {ach.map((a) => {
              const Icon = ACH_ICONS[a.id] ?? IconTarget;
              return (
                <li key={a.id} className={`flex items-center gap-3 ${a.done ? "" : "opacity-40"}`}>
                  <div className={`grid h-10 w-10 place-items-center rounded-xl ${a.done ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                    {a.done ? <IconCheck className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="font-semibold">{a.name}</p>
                    <p className="text-xs text-muted-foreground">{a.desc}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-6 flex justify-center gap-3">
          <Link to="/stats" className="btn btn-outline">Full stats</Link>
          <Link to="/settings" className="btn btn-primary">Edit name</Link>
        </div>
      </main>
    </div>
  );
}
