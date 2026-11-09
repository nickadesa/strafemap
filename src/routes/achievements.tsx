import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { useRecords, useSettings } from "@/lib/game/storage";
import { loadRank } from "@/lib/rank";
import { ACH_ALL, ACH_GROUPS, RARITY_COLORS, SECRET_BADGE, loadUnlocked, syncAchievements } from "@/lib/achievements";
import { t, type Lang } from "@/lib/i18n";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

import { SlidingTabs } from "@/components/ui/SlidingTabs";

export const Route = createFileRoute("/achievements")({
  head: () => ({
    meta: [
      { title: "Achievements — STRAFE" },
      { name: "description", content: "Browse all 250 STRAFE achievement badges and track which ones you have unlocked." },
      { property: "og:title", content: "Achievements — STRAFE" },
      { property: "og:description", content: "Browse all 250 STRAFE achievement badges and track which ones you have unlocked." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AchievementsPage,
});

type Item = (typeof ACH_ALL)[number];

function AchievementsPage() {
  const [s] = useSettings();
  const [records] = useRecords();
  const lang = (s.language ?? "en") as Lang;
  const [unlocked, setUnlocked] = useState<Record<string, string>>({});
  const [group, setGroup] = useState("all");
  const [filter, setFilter] = useState<"all" | "on" | "off">("all");
  const [open, setOpen] = useState<Item | null>(null);

  useEffect(() => {
    syncAchievements(records ?? [], loadRank());
    setUnlocked(loadUnlocked());
  }, [records]);

  const list = useMemo(
    () =>
      ACH_ALL.filter(
        (a) =>
          (group === "all" || a.unit.group === group) &&
          (filter === "all" || (filter === "on") === Boolean(unlocked[a.id])),
      ).sort((a, b) => Number(Boolean(unlocked[b.id])) - Number(Boolean(unlocked[a.id]))),
    [group, filter, unlocked],
  );
  const count = Object.keys(unlocked).length;

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="rail-offset px-4 pb-16 pt-8 md:px-6">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Apple Large Title Header */}
          <header className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {t(lang, "achievements")}
              </h1>
              <p className="readout mt-1 text-sm text-muted-foreground">
                {t(lang, "achUnlocked", { n: count, total: ACH_ALL.length })}
              </p>
            </div>
            <div className="flex justify-start sm:justify-end">
              <SlidingTabs
                tabs={[
                  { id: "all", label: t(lang, "all") },
                  { id: "on", label: t(lang, "unlockedOnly") },
                  { id: "off", label: t(lang, "lockedOnly") },
                ]}
                activeId={filter}
                onChange={(next) => setFilter(next as "all" | "on" | "off")}
              />
            </div>
          </header>

          {/* Progress Bar */}
          <div className="h-2 overflow-hidden rounded-full bg-muted p-0.5">
            <div
              className="h-full rounded-full transition-[width] duration-500"
              style={{
                width: `${(count / ACH_ALL.length) * 100}%`,
                backgroundColor: "var(--accent-fill)",
              }}
            />
          </div>

          {/* Category Group Filter */}
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                group === "all"
                  ? "bg-accent-fill text-[#03121C]"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setGroup("all")}
            >
              {t(lang, "all")}
            </button>
            {ACH_GROUPS.map((g) => (
              <button
                key={g.key}
                type="button"
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  group === g.key
                    ? "bg-accent-fill text-[#03121C]"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setGroup(g.key)}
              >
                {g.name}
              </button>
            ))}
          </div>

          {/* Badge Grid */}
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-6 sm:gap-3.5">
            {list.map((a) => {
              const on = Boolean(unlocked[a.id]);
              const hidden = a.secret && !on;
              return (
                <button
                  key={a.id}
                  onClick={() => setOpen(a)}
                  className={`group flex flex-col items-center gap-1.5 rounded-2xl border border-border/60 p-2.5 text-center transition-all hover:bg-muted/50 active:scale-95 ${
                    on ? "bg-card/80" : "bg-card/30 opacity-60 hover:opacity-85"
                  }`}
                >
                  <img
                    src={hidden ? SECRET_BADGE : on ? a.files.compact.unlocked : a.files.compact.locked}
                    alt=""
                    loading="lazy"
                    className={`aspect-[288/280] w-full transition-transform duration-200 group-hover:scale-105 ${
                      on ? "" : "grayscale-[40%]"
                    }`}
                  />
                  <span className="line-clamp-1 text-xs font-medium text-foreground">
                    {hidden ? "???" : a.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-w-sm text-center">
          {open && (() => {
            const on = Boolean(unlocked[open.id]);
            const hidden = open.secret && !on;
            return (
              <>
                <img src={hidden ? SECRET_BADGE : on ? open.files.full.unlocked : open.files.full.locked} alt="" className="mx-auto w-40" />
                <DialogTitle className="font-display text-2xl">{hidden ? t(lang, "secretAch") : open.name}</DialogTitle>
                <DialogDescription>{hidden ? t(lang, "secretHint") : open.requirement}</DialogDescription>
                <div className="flex items-center justify-center gap-2 text-xs">
                  <span className="rounded-full px-2.5 py-1 font-semibold" style={{ background: `${RARITY_COLORS[open.rarity]}22`, color: RARITY_COLORS[open.rarity] }}>{open.rarity}</span>
                  <span className="readout text-muted-foreground">{open.id}</span>
                  {on && <span className="readout text-muted-foreground">{unlocked[open.id]!.slice(0, 10)}</span>}
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
