import { useState } from "react";
import { Plus, Send, Heart, MessageCircle, X } from "lucide-react";
import { AvatarFrame, ClanTagPill, VerifiedBadge } from "@/components/RankVisuals";
import { Flag } from "@/components/Flag";
import { useFeed, type StoryHighlight, type useSocialProfile } from "@/lib/social";
import { loadRank } from "@/lib/rank";
import { computeStats } from "@/lib/game/storage";
import { t, type Lang } from "@/lib/i18n";

export function SocialFeedTab({
  social,
  rank,
  stats,
  lang,
}: {
  social: ReturnType<typeof useSocialProfile>[0];
  rank: ReturnType<typeof loadRank>;
  stats: ReturnType<typeof computeStats>;
  lang: Lang;
}) {
  const { posts, stories, addPost, toggleLike, addComment, addStory } = useFeed();
  const [postText, setPostText] = useState("");
  const [attachResultCard, setAttachResultCard] = useState(true);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [activeStory, setActiveStory] = useState<StoryHighlight | null>(null);

  const handleUploadStory = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const imgUrl = reader.result as string;
      addStory({
        authorId: "me",
        authorName: social.nickname,
        authorUsername: social.username,
        authorClanTag: social.clanTag,
        authorVerified: social.verifiedBadge,
        authorRp: rank.rp,
        authorChampPos: rank.championPosition,
        country: social.country,
        mode: "Photo Story",
        score: "Story",
        accuracy: "100%",
        caption: "Shared a new photo story",
        gradient: "linear-gradient(160deg, #161616 0%, #262626 100%)",
        imageUrl: imgUrl,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const publishPost = () => {
    if (!postText.trim() && !attachResultCard) return;
    addPost({
      authorId: "me",
      authorName: social.nickname,
      authorUsername: social.username,
      authorClanTag: social.clanTag,
      authorVerified: social.verifiedBadge,
      authorRp: rank.rp,
      authorChampPos: rank.championPosition,
      country: social.country,
      content: postText.trim() || "My latest STRAFE session card",
      resultCard: attachResultCard
        ? {
            mode: "Ranked 1v1 · Season 1",
            score: Math.max(22450, stats.bestScore),
            maxScore: 25000,
            accuracy: "94%",
            avgError: "32.4 km",
            grade: "S",
          }
        : null,
    });
    setPostText("");
  };

  const submitComment = (postId: string) => {
    const txt = (commentInputs[postId] ?? "").trim();
    if (!txt) return;
    addComment(postId, {
      authorName: social.nickname,
      authorUsername: social.username,
      authorClanTag: social.clanTag,
      authorVerified: social.verifiedBadge,
      text: txt,
    });
    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
  };

  return (
    <div className="space-y-6">
      {/* Story Strip */}
      <section>
        <h2 className="mb-2.5 text-xs font-semibold text-muted-foreground">
          {t(lang, "stories")}
        </h2>
        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
          {/* + Add Story Button */}
          <label className="story-ring relative aspect-[4/5] w-28 shrink-0 cursor-pointer rounded-[18px] text-center transition-opacity hover:opacity-90">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUploadStory}
            />
            <div className="flex h-full w-full flex-col items-center justify-center rounded-[15.5px] bg-card p-2 text-foreground">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-accent-fill text-[#161616]">
                <Plus className="h-5 w-5" />
              </div>
              <span className="mt-2 text-xs font-semibold text-accent-text">+ Add Story</span>
              <span className="text-[10px] text-muted-foreground">Upload photo</span>
            </div>
          </label>

          {stories.map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => setActiveStory(st)}
              className="story-ring relative aspect-[4/5] w-28 shrink-0 overflow-hidden rounded-[18px] text-left transition-opacity hover:opacity-90"
            >
              {st.imageUrl ? (
                <div className="relative h-full w-full rounded-[15.5px] overflow-hidden">
                  <img src={st.imageUrl} alt={st.caption} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 p-2.5 flex flex-col justify-between text-white">
                    <AvatarFrame
                      name={st.authorName}
                      rp={st.authorRp}
                      championPosition={st.authorChampPos}
                      size={28}
                    />
                    <div>
                      <p className="truncate text-xs font-semibold text-white">{st.authorName}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="flex h-full w-full flex-col justify-between rounded-[15.5px] p-2.5 text-white"
                  style={{ background: st.gradient }}
                >
                  <AvatarFrame
                    name={st.authorName}
                    rp={st.authorRp}
                    championPosition={st.authorChampPos}
                    size={28}
                  />
                  <div>
                    <p className="font-display text-lg text-accent-text">{st.score}</p>
                    <p className="truncate text-[10px] font-semibold">{st.authorName}</p>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Post Composer (Supports Free-Form Text & Result Card Attachment) */}
      <section className="plate p-5">
        <div className="flex gap-3">
          <AvatarFrame
            src={social.avatarUrl}
            name={social.nickname}
            rp={rank.rp}
            championPosition={rank.championPosition}
            size={46}
          />
          <div className="flex-1">
            <textarea
              rows={2}
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="Share a geography tip, invite players to a Party lobby, or post your Results Card…"
              className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-foreground/60"
            />
            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <input
                  type="checkbox"
                  checked={attachResultCard}
                  onChange={(e) => setAttachResultCard(e.target.checked)}
                  className="h-4 w-4 accent-accent-fill"
                />
                Attach Latest Match Results Card
              </label>
              <button
                type="button"
                onClick={publishPost}
                className="btn btn-primary !px-5 !py-2 text-xs font-semibold"
              >
                <Send className="h-3.5 w-3.5" />
                Post to Feed
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feed Posts List */}
      <div className="space-y-4">
        {posts.map((post) => (
          <article key={post.id} className="plate p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <AvatarFrame
                  name={post.authorName}
                  rp={post.authorRp}
                  championPosition={post.authorChampPos}
                  size={44}
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <ClanTagPill tag={post.authorClanTag} />
                    <span className="font-semibold">{post.authorName}</span>
                    <VerifiedBadge type={post.authorVerified} size={14} />
                    <Flag country={post.country} size={16} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    @{post.authorUsername} · {post.timestamp}
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-3 text-sm leading-relaxed">{post.content}</p>

            {/* Attached Results Card */}
            {post.resultCard && (
              <div className="mt-3 flex items-center justify-between rounded-2xl border border-border bg-[#161616] p-4 text-white">
                <div>
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                    {post.resultCard.mode}
                  </span>
                  <p className="font-display mt-2 text-3xl text-accent-text">
                    {post.resultCard.score.toLocaleString()}{" "}
                    <span className="text-xs text-white/60">
                      / {post.resultCard.maxScore.toLocaleString()} pts
                    </span>
                  </p>
                  <p className="mt-0.5 text-xs text-white/75">
                    Accuracy: {post.resultCard.accuracy} · Avg Error: {post.resultCard.avgError}
                  </p>
                </div>
                <div className="font-display text-5xl text-accent-text">
                  {post.resultCard.grade}
                </div>
              </div>
            )}

            {/* Like & Comment Bar */}
            <div className="mt-4 flex items-center gap-4 border-t border-border pt-3 text-xs font-semibold">
              <button
                type="button"
                onClick={() => toggleLike(post.id)}
                className={`inline-flex items-center gap-1.5 ${
                  post.likedByMe ? "text-accent-text" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Heart className="h-4 w-4" fill={post.likedByMe ? "#D2F801" : "none"} />
                {post.likes} Likes
              </button>
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <MessageCircle className="h-4 w-4" />
                {post.comments.length} Comments
              </span>
            </div>

            {/* Comments List + Input */}
            {post.comments.length > 0 && (
              <div className="mt-3 space-y-2 rounded-2xl bg-background/40 p-3">
                {post.comments.map((c) => (
                  <div key={c.id} className="text-xs">
                    <div className="flex items-center gap-1">
                      <ClanTagPill tag={c.authorClanTag} />
                      <span className="font-semibold">{c.authorName}</span>
                      <VerifiedBadge type={c.authorVerified ?? "none"} size={12} />
                      <span className="text-muted-foreground">· {c.timestamp}</span>
                    </div>
                    <p className="mt-0.5 text-foreground/90">{c.text}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-3 flex gap-2">
              <input
                value={commentInputs[post.id] ?? ""}
                onChange={(e) =>
                  setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                }
                onKeyDown={(e) => e.key === "Enter" && submitComment(post.id)}
                placeholder="Write a comment…"
                className="flex-1 rounded-full border border-border bg-background px-3.5 py-1.5 text-xs outline-none focus:border-foreground/60"
              />
              <button
                type="button"
                onClick={() => submitComment(post.id)}
                className="rounded-full bg-accent-fill px-3.5 py-1.5 text-xs font-semibold text-[#161616]"
              >
                Reply
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Story Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4 backdrop-blur-md">
          <div className="story-ring relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[24px]">
            {activeStory.imageUrl ? (
              <div className="relative h-full w-full rounded-[21px] overflow-hidden">
                <img src={activeStory.imageUrl} alt={activeStory.caption} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/60 p-6 flex flex-col justify-between text-white">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-lg">{activeStory.authorName}</span>
                    <button
                      type="button"
                      onClick={() => setActiveStory(null)}
                      className="grid h-8 w-8 place-items-center rounded-full bg-black/60"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div>
                    <p className="font-display text-4xl text-accent-text">{activeStory.score}</p>
                    <p className="mt-2 text-sm text-white/90">{activeStory.caption}</p>
                    <button
                      type="button"
                      onClick={() => setActiveStory(null)}
                      className="btn btn-primary mt-4 w-full py-2.5 text-xs font-semibold"
                    >
                      Close Story
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="flex h-full w-full flex-col justify-between rounded-[21px] p-6 text-white"
                style={{ background: activeStory.gradient }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{activeStory.authorName}</span>
                  <button
                    type="button"
                    onClick={() => setActiveStory(null)}
                    className="grid h-8 w-8 place-items-center rounded-full bg-black/50"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-center">
                  <p className="font-display text-5xl text-accent-text">{activeStory.score}</p>
                  <p className="mt-2 text-sm">{activeStory.caption}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveStory(null)}
                  className="btn btn-primary w-full py-2.5 text-xs font-semibold"
                >
                  Close Story
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
