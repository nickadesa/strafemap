import { useEffect, useState } from "react";
import { Sparkles, Share2, Check, Send } from "lucide-react";
import { t, type Lang } from "@/lib/i18n";
import {
  renderCard,
  shareCard,
  gradeFor,
  type CardAspect,
  type CardData,
  type CardResolution,
  type CardTemplate,
} from "@/lib/game/shareCard";
import { useFeed, useSocialProfile } from "@/lib/social";
import { loadRank } from "@/lib/rank";

export function ShareCardStudio({
  baseData,
  defaultTemplate,
  lang,
}: {
  baseData: CardData;
  defaultTemplate: CardTemplate;
  lang: Lang;
}) {
  const [template, setTemplate] = useState<CardTemplate>(defaultTemplate);
  const [aspect, setAspect] = useState<CardAspect>("9:16");
  const [resolution, setResolution] = useState<CardResolution>("1080p");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentBlob, setCurrentBlob] = useState<Blob | null>(null);
  const [busy, setBusy] = useState(false);
  const [postedToFeed, setPostedToFeed] = useState(false);
  const { addPost } = useFeed();
  const [social] = useSocialProfile();
  const rank = loadRank();

  useEffect(() => {
    let cancelled = false;
    setBusy(true);
    renderCard({ ...baseData, template, aspect, resolution })
      .then((blob) => {
        if (cancelled) return;
        setCurrentBlob(blob);
        const url = URL.createObjectURL(blob);
        setPreviewUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setBusy(false);
      });
    return () => {
      cancelled = true;
    };
  }, [template, aspect, resolution, baseData.total]);

  const handlePostToFeed = () => {
    if (postedToFeed) return;
    const pct = baseData.max > 0 ? baseData.total / baseData.max : 0;
    addPost({
      authorId: "me",
      authorName: social.nickname,
      authorUsername: social.username,
      authorClanTag: social.clanTag,
      authorVerified: social.verifiedBadge,
      authorRp: rank.rp,
      authorChampPos: rank.championPosition,
      country: social.country,
      content: `Scored ${baseData.total.toLocaleString()} / ${baseData.max.toLocaleString()} pts in ${baseData.mode}`,
      resultCard: {
        mode: baseData.tag,
        score: baseData.total,
        maxScore: baseData.max,
        accuracy: `${Math.round(pct * 100)}%`,
        avgError: baseData.avgKm,
        grade: gradeFor(pct),
      },
    });
    setPostedToFeed(true);
  };

  return (
    <section className="plate mt-6 p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-text">
            <Sparkles className="h-3.5 w-3.5" /> Results Share Card Studio
          </span>
          <h2 className="font-display text-2xl">Live Card Preview & Export</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={!currentBlob || busy}
            onClick={() => currentBlob && shareCard(currentBlob, `strafe-${template}-${aspect}.png`)}
            className="btn btn-primary !px-4 !py-2 text-xs font-semibold"
          >
            <Share2 className="h-4 w-4" />
            {busy ? t(lang, "creating") : t(lang, "shareCard")}
          </button>
          <button
            type="button"
            disabled={postedToFeed}
            onClick={handlePostToFeed}
            className="btn btn-outline !px-4 !py-2 text-xs font-semibold"
          >
            {postedToFeed ? <Check className="h-4 w-4" /> : <Send className="h-4 w-4" />}
            {postedToFeed ? "Posted to feed" : "Post to Social Feed"}
          </button>
        </div>
      </div>

      {/* Controls: Mode Template, Aspect Ratio, Resolution */}
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div>
          <p className="mb-1.5 text-xs font-semibold text-muted-foreground">Card Theme</p>
          <div className="seg w-full">
            {(["daily", "ranked", "party", "classic"] as CardTemplate[]).map((tpl) => (
              <button
                key={tpl}
                type="button"
                onClick={() => setTemplate(tpl)}
                data-on={template === tpl}
                className="seg-item !px-3 !py-1 text-xs capitalize"
              >
                {tpl}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-semibold text-muted-foreground">Aspect Ratio</p>
          <div className="seg w-full">
            {(["16:9", "1:1", "4:5", "9:16"] as CardAspect[]).map((ar) => (
              <button
                key={ar}
                type="button"
                onClick={() => setAspect(ar)}
                data-on={aspect === ar}
                className="seg-item !px-3 !py-1 text-xs"
              >
                {ar}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-semibold text-muted-foreground">Resolution</p>
          <div className="seg w-full">
            {(["1080p", "2K", "4K"] as CardResolution[]).map((res) => (
              <button
                key={res}
                type="button"
                onClick={() => setResolution(res)}
                data-on={resolution === res}
                className="seg-item !px-3 !py-1 text-xs"
              >
                {res}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Canvas Image Preview */}
      <div className="mt-5 flex justify-center rounded-2xl border border-border bg-[#161616] p-4">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="STRAFE Result Share Card Preview"
            className="max-h-[420px] w-auto rounded-xl border border-border object-contain shadow-2xl"
          />
        ) : (
          <div className="grid h-64 place-items-center text-sm text-muted-foreground">
            {t(lang, "creating")}
          </div>
        )}
      </div>
    </section>
  );
}
