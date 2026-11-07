import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { useRecords, useSettings } from "@/lib/game/storage";
import { loadRank } from "@/lib/rank";
import { ACH_ALL, ACH_GROUPS, RARITY_COLORS, SECRET_BADGE, loadUnlocked, syncAchievements } from "@/lib/achievements";
import { t, type Lang } from "@/lib/i18n";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export const Route = createFileRoute("/achievements")({
  head: () => ({ meta: [
    { title: "Achievements — STRAFE" },
    { name: "description", content: "Browse all 250 STRAFE achievement badges and track which ones you have unlocked." },
    { property: "og:title", content: "Achievements — STRAFE" },
    { property: "og:description", content: "Browse all 250 STRAFE achievement badges and track which ones you have unlocked." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
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

  useEffect(() => { syncAchievements(records ?? [], loadRank()); setUnlocked(loadUnlocked()); }, [records]);

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
      <main className="rail-offset px-5 pb-10 pt-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="font-display text-4xl md:text-5xl">{t(lang, "achievements")}</h1>
              <p className="readout mt-1 text-sm text-muted-foreground">{t(lang, "achUnlocked", { n: count, total: ACH_ALL.length })}</p>
            </div>
            <div className="seg">
              {(["all", "on", "off"] as const).map((f) => (
                <button key={f} className="seg-item" data-on={filter === f} onClick={() => setFilter(f)}>
                  {t(lang, f === "all" ? "all" : f === "on" ? "unlockedOnly" : "lockedOnly")}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-3 h-1 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-primary transition-[width] duration-500" style={{ width: `${(count / ACH_ALL.length) * 100}%` }} />
          </div>
          <div className="seg mb-6">
            <button className="seg-item" data-on={group === "all"} onClick={() => setGroup("all")}>{t(lang, "all")}</button>
            {ACH_GROUPS.map((g) => (
              <button key={g.key} className="seg-item" data-on={group === g.key} onClick={() => setGroup(g.key)}>{g.name}</button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
            {list.map((a) => {
              const on = Boolean(unlocked[a.id]);
              const hidden = a.secret && !on;
              return (
                <button key={a.id} onClick={() => setOpen(a)}
                  className="group flex flex-col items-center gap-1 rounded-2xl p-2 text-center transition-colors hover:bg-muted">
                  <img src={hidden ? SECRET_BADGE : on ? a.files.compact.unlocked : a.files.compact.locked} alt="" loading="lazy"
                    className={`aspect-[288/280] w-full transition-opacity duration-200 ${on ? "group-hover:opacity-90" : "opacity-70"}`} />
                  <span className="line-clamp-1 text-xs font-medium">{hidden ? "???" : a.name}</span>
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
