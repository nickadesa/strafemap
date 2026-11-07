import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { t, type Lang } from "@/lib/i18n";
import { computeStats, useRecords, useSettings } from "@/lib/game/storage";
import { Sidebar } from "@/components/Sidebar";
import {
  MODES,
  SIN_CARDS,
  TIME_OPTIONS,
  todayKey,
  type Difficulty,
  type Mode,
  type Pool,
  type SinCardId,
  type TimeLimit,
} from "@/lib/game/engine";
import { getRank, loadRank } from "@/lib/rank";
import { RankBanner } from "@/components/RankVisuals";
import { Calendar, Flame, Medal, Sparkles, Users } from "lucide-react";

const modeIds = Object.keys(MODES) as Mode[];

export const Route = createFileRoute("/play")({
  head: () => ({
    meta: [
      { title: "Modes Hub — STRAFE" },
      { name: "description", content: "Choose Ranked, Party, Daily Challenge, Find the City, 7 Deadly Sins, or Country Quiz." },
      { property: "og:title", content: "Modes Hub — STRAFE" },
      { property: "og:description", content: "Choose Ranked, Party, Daily Challenge, Find the City, 7 Deadly Sins, or Country Quiz." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): { mode?: Mode } => {
    const mode =
      typeof search["mode"] === "string" && modeIds.includes(search["mode"] as Mode)
        ? (search["mode"] as Mode)
        : undefined;
    return mode ? { mode } : {};
  },
  component: PlayHub,
});

const pools: { id: Pool; label: string }[] = [
  { id: "world", label: "World" },
  { id: "capitals", label: "Capitals" },
  { id: "countries", label: "Countries" },
  { id: "landmarks", label: "Landmarks & nature" },
  { id: "stadiums", label: "Football Stadiums" },
  { id: "wonders", label: "World Wonders" },
  { id: "attractions", label: "Tourist Attractions" },
];
const diffs: Difficulty[] = ["easy", "medium", "hard", "expert", "hardcore"];
const quizZones = ["Global", "Asia", "Europe", "Americas", "Africa", "Oceania"] as const;

function Chip({
  on,
  children,
  onClick,
}: {
  on: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} data-on={on} className="seg-item capitalize">
      {children}
    </button>
  );
}

function PlayHub() {
  const [settings] = useSettings();
  const [records] = useRecords();
  const lang = (settings.language ?? "en") as Lang;
  const initial = Route.useSearch().mode;
  const [mode, setMode] = useState<Mode>(initial ?? "classic");
  const [pool, setPool] = useState<Pool>("world");
  const [difficulty, setDiff] = useState<Difficulty>("medium");
  const [practice, setPractice] = useState(false);
  const [time, setTime] = useState<TimeLimit>(30);
  const [selectedSin, setSelectedSin] = useState<SinCardId>("pride");
  const [quizZone, setQuizZone] = useState<string>("Global");

  const stats = computeStats(records ?? []);
  const rank = loadRank();
  const curRank = getRank(rank.rp, rank.championPosition);
  const dailyStreak = Math.max(1, stats.dailies || 4);

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="rail-offset px-4 pb-12 pt-6 md:px-6 md:pt-8">
        <div className="mx-auto max-w-6xl space-y-6">
          {/* Top Event / Announcement Banner */}
          <section className="plate relative overflow-hidden border-[#0367FC]/40 p-5 md:p-6">
            <div
              className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full opacity-25 blur-3xl"
              style={{ background: "#0367FC" }}
            />
            <div className="relative flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D2F801] px-3 py-0.5 text-[11px] font-black uppercase text-[#161616]">
                  <Sparkles className="h-3.5 w-3.5" /> Season 1 Global Event
                </span>
                <h1 className="font-display mt-2 text-3xl md:text-4xl">
                  7 Deadly Sins & Wikidata World Expansion
                </h1>
                <p className="mt-1 max-w-2xl text-xs text-muted-foreground md:text-sm">
                  Explore 1,100+ enriched global coordinates, test your reflexes in 4-Choice Country Quiz, or climb to Champion Top 50!
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setMode("sins")}
                  className="btn btn-primary !px-4 !py-2.5 text-xs font-extrabold"
                >
                  Try 7 Deadly Sins
                </button>
                <button
                  type="button"
                  onClick={() => setMode("findCity")}
                  className="btn btn-blue !px-4 !py-2.5 text-xs font-extrabold"
                >
                  Play Find the City
                </button>
              </div>
            </div>
          </section>

          {/* Zone 1 & 2 + Daily Challenge Briefing Row: Ranked Mode, Party Mode, Daily Challenge */}
          <section className="grid gap-4 lg:grid-cols-3">
            {/* Ranked Mode Card */}
            <div className="plate flex flex-col justify-between p-5">
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#D2F801]/15 px-3 py-0.5 text-xs font-bold text-[#D2F801]">
                    <Medal className="mr-1 inline h-3.5 w-3.5" />
                    {t(lang, "rankedTag")}
                  </span>
                  <span className="readout text-xs font-bold text-muted-foreground">
                    {rank.rp.toLocaleString()} RP
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <RankBanner rp={rank.rp} championPosition={rank.championPosition} width={58} />
                  <div>
                    <h2 className="font-display text-2xl">{t(lang, "playRanked")}</h2>
                    <p className="text-xs font-semibold" style={{ color: curRank.tier.accent }}>
                      {curRank.name}
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{t(lang, "rankedModeBlurb")}</p>
              </div>
              <div className="mt-4 flex gap-2">
                <Link
                  to="/game/$mode"
                  params={{ mode: "classic" }}
                  search={{ ranked: 1 }}
                  className="btn btn-primary flex-1 !py-2.5 text-xs font-extrabold"
                >
                  {t(lang, "playRanked")}
                </Link>
                <Link to="/rank" className="btn btn-outline !px-3.5 !py-2.5 text-xs">
                  Ladder
                </Link>
              </div>
            </div>

            {/* Party Mode Card */}
            <div className="plate flex flex-col justify-between p-5">
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#0367FC]/20 px-3 py-0.5 text-xs font-bold text-[#0367FC]">
                    <Users className="mr-1 inline h-3.5 w-3.5" />
                    {t(lang, "partyTag")} · 2–16 Players
                  </span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold">
                    🎙️ Voice Chat
                  </span>
                </div>
                <h2 className="font-display mt-3 text-2xl">{t(lang, "party")} Lobby</h2>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Host custom rooms for 2–16 players with Unlimited ∞ timer, More Modes selection, Invite Friends & Voice Soundboard.
                </p>
              </div>
              <Link
                to="/party"
                className="btn btn-blue mt-4 w-full !py-2.5 text-xs font-extrabold"
              >
                {t(lang, "openParty")}
              </Link>
            </div>

            {/* Daily Challenge & Streak Card */}
            <div className="plate flex flex-col justify-between p-5">
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#0367FC] px-3 py-0.5 text-xs font-bold text-white">
                    <Calendar className="mr-1 inline h-3.5 w-3.5" />
                    {t(lang, "daily")} · {todayKey()}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#D2F801]">
                    <Flame className="h-3.5 w-3.5" /> {dailyStreak}d Streak
                  </span>
                </div>
                <h2 className="font-display mt-3 text-2xl">Global Daily Briefing</h2>
                <div className="mt-2 grid grid-cols-7 gap-1 text-center">
                  {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                    <div
                      key={d}
                      className={`rounded-lg border py-1 text-[10px] font-bold ${
                        d <= dailyStreak
                          ? "border-[#D2F801] bg-[#D2F801]/15 text-[#D2F801]"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      D{d}
                    </div>
                  ))}
                </div>
              </div>
              <Link
                to="/game/$mode"
                params={{ mode: "classic" }}
                search={{ daily: 1 }}
                className="btn btn-blue mt-4 w-full !py-2.5 text-xs font-extrabold"
              >
                Play Daily Seed
              </Link>
            </div>
          </section>

          {/* Zone 3: More Modes Grid */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-2xl">More Modes & Custom Rules</h2>
              <span className="text-xs text-muted-foreground">Select any mode to configure below</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {modeIds.map((m) => {
                const active = mode === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={`plate flex flex-col justify-between p-5 text-left transition-all ${
                      active
                        ? "border-[#D2F801] bg-[#D2F801]/10 ring-1 ring-[#D2F801]"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#0367FC]">
                          {t(lang, `${m}Tag`)}
                        </span>
                        {(m === "findCity" || m === "sins" || m === "quiz") && (
                          <span className="rounded-full bg-[#D2F801] px-2 py-0.5 text-[9px] font-black text-[#161616]">
                            FEATURED
                          </span>
                        )}
                      </div>
                      <h3 className="font-display mt-2 text-2xl">{t(lang, m)}</h3>
                      <p className="mt-1.5 text-xs text-muted-foreground">{t(lang, `${m}Blurb`)}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Mode Configuration Panel */}
          <section className="plate space-y-5 p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#D2F801]">
                  Match Configuration
                </span>
                <h3 className="font-display text-3xl">{t(lang, mode)}</h3>
              </div>
              {difficulty === "hardcore" && (
                <span className="rounded-full bg-destructive px-3 py-1 text-xs font-extrabold text-white">
                  ⚠️ Hardcore Active: Map Labels Hidden + Extreme Locations
                </span>
              )}
            </div>

            {/* 7 Deadly Sins Card Selector */}
            {mode === "sins" && (
              <div>
                <p className="mb-2 text-sm font-semibold text-muted-foreground">
                  Choose Your Deadly Sin Skill Card (100% Self-Only Boon & Trade-Off)
                </p>
                <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                  {SIN_CARDS.map((card) => {
                    const on = selectedSin === card.id;
                    return (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => setSelectedSin(card.id)}
                        className={`rounded-2xl border p-3.5 text-left transition-all ${
                          on
                            ? "border-[#D2F801] bg-[#D2F801]/10 ring-1 ring-[#D2F801]"
                            : "border-border bg-background/40 hover:bg-muted/40"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-display text-base" style={{ color: card.accent }}>
                            {card.sinName}
                          </span>
                          <span className="text-[10px] font-bold text-muted-foreground">
                            {card.skillName}
                          </span>
                        </div>
                        <p className="mt-1.5 text-[11px] text-positive">{card.boon}</p>
                        <p className="mt-1 text-[11px] text-destructive">{card.tradeoff}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Country Quiz Continent Zone Selector */}
            {mode === "quiz" ? (
              <div>
                <p className="mb-2 text-sm font-semibold text-muted-foreground">
                  Continent Zone Filter
                </p>
                <div className="seg">
                  {quizZones.map((z) => (
                    <Chip key={z} on={quizZone === z} onClick={() => setQuizZone(z)}>
                      {z}
                    </Chip>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <p className="mb-2 text-sm font-semibold text-muted-foreground">
                  {t(lang, "category")}
                </p>
                <div className="seg">
                  {pools.map((p) => (
                    <Chip key={p.id} on={pool === p.id} onClick={() => setPool(p.id)}>
                      {t(lang, p.id)}
                    </Chip>
                  ))}
                </div>
              </div>
            )}

            {/* Difficulty Selector (including Hardcore!) */}
            <div>
              <p className="mb-2 text-sm font-semibold text-muted-foreground">
                {t(lang, "difficulty")}
              </p>
              <div className="seg">
                {diffs.map((d) => (
                  <Chip key={d} on={difficulty === d} onClick={() => setDiff(d)}>
                    {t(lang, d)}
                  </Chip>
                ))}
              </div>
            </div>

            {/* Time Per Round (including Unlimited ∞) */}
            <div>
              <p className="mb-2 text-sm font-semibold text-muted-foreground">
                {t(lang, "timePerRound")}
              </p>
              <div className="seg">
                {TIME_OPTIONS.map((tOpt) => (
                  <Chip key={tOpt} on={time === tOpt} onClick={() => setTime(tOpt)}>
                    {tOpt === 0 ? t(lang, "unlimited") : `${tOpt}s`}
                  </Chip>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-3 text-sm font-semibold">
              <input
                type="checkbox"
                checked={practice}
                onChange={(e) => setPractice(e.target.checked)}
                className="h-5 w-5 accent-[#D2F801]"
              />
              {t(lang, "practiceNote")}
            </label>

            <Link
              to="/game/$mode"
              params={{ mode }}
              search={{
                pool,
                difficulty,
                time,
                ...(practice ? { practice: 1 as const } : {}),
                ...(mode === "sins" ? { sin: selectedSin } : {}),
                ...(mode === "quiz" ? { zone: quizZone } : {}),
              }}
              className="btn btn-primary px-10 py-4 text-lg font-extrabold"
            >
              {t(lang, "startMode", { mode: t(lang, mode) })}
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
