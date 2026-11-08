import { useState } from "react";
import { useClans, useSocialProfile } from "@/lib/social";
import { loadRank } from "@/lib/rank";
import { AvatarFrame, ClanTagPill } from "@/components/RankVisuals";
import { Edit3, Upload } from "lucide-react";

export function ClanSystemTab({
  social,
  updateSocial,
  rank,
}: {
  social: ReturnType<typeof useSocialProfile>[0];
  updateSocial: ReturnType<typeof useSocialProfile>[1];
  rank: ReturnType<typeof loadRank>;
}) {
  const [clans, saveClans] = useClans();
  const [tagInput, setTagInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [descInput, setDescInput] = useState("");
  const [iconUrlInput, setIconUrlInput] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const myClan = clans.find((c) => c.id === social.clanId) ?? null;
  const isLeader = myClan
    ? myClan.members.some((m) => m.id === "me" && m.role === "Leader") || myClan.tag === social.clanTag
    : false;
  const [editingClan, setEditingClan] = useState(false);
  const [editClanName, setEditClanName] = useState(myClan?.name ?? "");
  const [editClanTag, setEditClanTag] = useState(myClan?.tag ?? "");
  const [editClanIcon, setEditClanIcon] = useState<string | null>(myClan?.iconUrl ?? null);

  const handleSaveClanEdits = () => {
    if (!myClan) return;
    const cleanTag = editClanTag.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    const cleanName = editClanName.trim();
    if (cleanTag.length < 2 || cleanTag.length > 5) {
      alert("Clan TAG must be 2 to 5 characters.");
      return;
    }
    if (cleanName.length < 3) {
      alert("Clan name must be at least 3 characters.");
      return;
    }
    const updated = clans.map((c) =>
      c.id === myClan.id ? { ...c, name: cleanName, tag: cleanTag, iconUrl: editClanIcon ?? c.iconUrl } : c
    );
    saveClans(updated);
    updateSocial({ clanTag: cleanTag });
    setEditingClan(false);
  };

  const handleCreateClan = () => {
    const cleanTag = tagInput.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    const cleanName = nameInput.trim();
    if (cleanTag.length < 2 || cleanTag.length > 5) {
      setErrorMsg("Clan TAG must be 2 to 5 characters.");
      return;
    }
    if (cleanName.length < 3) {
      setErrorMsg("Clan full name must be at least 3 characters.");
      return;
    }
    if (clans.some((c) => c.name.toLowerCase() === cleanName.toLowerCase() || c.tag === cleanTag)) {
      setErrorMsg("Clan name or tag is already taken");
      return;
    }

    const isGoldOrHigher = rank.rp >= 2000;
    if (!isGoldOrHigher) {
      setErrorMsg("Requires Rank Gold IV (2,000+ RP) or higher to found a Clan.");
      return;
    }
    if ((social.coins ?? 10000) < 2000) {
      setErrorMsg(`Requires 2,000 Coins to found a Clan (Current: ${(social.coins ?? 10000).toLocaleString()} Coins).`);
      return;
    }

    const created = {
      id: `clan-${Date.now()}`,
      tag: cleanTag,
      name: cleanName,
      iconUrl: iconUrlInput,
      description: descInput.trim() || "Competitive STRAFE Cartography Clan",
      level: 1,
      xp: 500,
      maxMembers: 50,
      totalPoints: rank.rp * 10,
      weeklyMissionProgress: 5,
      weeklyMissionTarget: 50,
      members: [
        {
          id: "me",
          nickname: social.nickname,
          username: social.username,
          rp: rank.rp,
          role: "Leader" as const,
          weeklyContribution: 1200,
        },
      ],
    };
    saveClans([created, ...clans]);
    updateSocial({
      clanId: created.id,
      clanTag: created.tag,
      coins: Math.max(0, (social.coins ?? 10000) - 2000),
    });
    setTagInput("");
    setNameInput("");
    setDescInput("");
    setErrorMsg(null);
  };

  return (
    <div className="space-y-6">
      {/* Current Clan Banner */}
      {myClan ? (
        <section className="plate p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-2xl border border-border bg-accent-fill/10 font-display text-xl text-accent-text">
                {myClan.iconUrl ? (
                  <img src={myClan.iconUrl} alt={myClan.name} className="h-full w-full object-cover" />
                ) : (
                  myClan.tag
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <ClanTagPill tag={myClan.tag} color={social.clanTagColor} />
                  <h2 className="font-display text-2xl sm:text-3xl">{myClan.name}</h2>
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                    Clan Lv.{myClan.level} / 10
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{myClan.description}</p>
                <p className="readout mt-1 text-xs font-semibold text-accent-text">
                  Members: {myClan.members.length} / {myClan.maxMembers} · Party Clan Bonus: +15% Clan Points
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isLeader && (
                <button
                  type="button"
                  onClick={() => {
                    setEditClanName(myClan.name);
                    setEditClanTag(myClan.tag);
                    setEditingClan((v) => !v);
                  }}
                  className="btn btn-outline !px-3 !py-1.5 text-xs font-semibold"
                >
                  <Edit3 className="mr-1 inline h-3.5 w-3.5" />
                  {editingClan ? "Cancel" : "Edit Clan"}
                </button>
              )}
              <button
                type="button"
                onClick={() => updateSocial({ clanId: null, clanTag: null })}
                className="btn btn-outline !px-4 !py-1.5 text-xs"
              >
                Leave Clan
              </button>
            </div>
          </div>

          {/* Clan Leader Edit Form */}
          {editingClan && (
            <div className="mt-4 space-y-3 rounded-2xl border border-border bg-background/60 p-4">
              <span className="text-xs font-semibold text-accent-text">
                Leader Management: Edit Clan Name & Tag
              </span>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-xs">
                  <span className="font-semibold text-muted-foreground">Clan Name</span>
                  <input
                    value={editClanName}
                    onChange={(e) => setEditClanName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm font-semibold"
                  />
                </label>
                <label className="block text-xs">
                  <span className="font-semibold text-muted-foreground">Clan TAG (2–5 Chars)</span>
                  <input
                    value={editClanTag}
                    maxLength={5}
                    onChange={(e) => setEditClanTag(e.target.value.toUpperCase())}
                    className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm font-display"
                  />
                </label>
                <label className="block text-xs sm:col-span-2">
                  <span className="font-semibold text-muted-foreground">Clan Profile / Avatar Photo</span>
                  <div className="mt-1 flex items-center gap-3">
                    {editClanIcon && (
                      <img src={editClanIcon} alt="Clan Icon" className="h-10 w-10 rounded-xl object-cover border border-border" />
                    )}
                    <label className="btn btn-outline inline-flex cursor-pointer items-center gap-1.5 !px-3 !py-1 text-xs font-semibold">
                      <Upload className="h-3.5 w-3.5 text-accent-text" /> Upload Clan Avatar
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              const res = ev.target?.result as string;
                              if (res) setEditClanIcon(res);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    {editClanIcon && (
                      <button
                        type="button"
                        onClick={() => setEditClanIcon(null)}
                        className="text-xs text-muted-foreground hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </label>
              </div>
              <button
                type="button"
                onClick={handleSaveClanEdits}
                className="btn btn-primary !px-5 !py-2 text-xs font-semibold"
              >
                Save Clan Changes
              </button>
            </div>
          )}

          {/* Weekly Clan Mission Bar */}
          <div className="mt-5 rounded-2xl border border-border bg-background/50 p-4">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span>Weekly Clan Mission: Win 50 Party or Ranked Rounds Together</span>
              <span className="readout text-accent-text">
                {myClan.weeklyMissionProgress} / {myClan.weeklyMissionTarget}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-accent-fill"
                style={{
                  width: `${Math.min(100, (myClan.weeklyMissionProgress / myClan.weeklyMissionTarget) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Clan Roster */}
          <div className="mt-5">
            <h3 className="mb-2.5 text-xs font-semibold text-muted-foreground">
              Clan Roster ({myClan.members.length}/{myClan.maxMembers})
            </h3>
            <div className="divide-y divide-border rounded-2xl border border-border bg-background/30">
              {myClan.members.map((m) => (
                <div key={m.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                  <div className="flex items-center gap-2.5">
                    <AvatarFrame name={m.nickname} rp={m.rp} size={36} />
                    <div className="flex items-center gap-1.5">
                      <ClanTagPill tag={myClan.tag} />
                      <span className="font-semibold">{m.nickname}</span>
                      <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold">
                        {m.role}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="readout text-xs font-semibold text-accent-text">{m.rp.toLocaleString()} RP</p>
                    <p className="text-[10px] text-muted-foreground">
                      +{m.weeklyContribution.toLocaleString()} Weekly XP
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        /* Create a Clan Card */
        <section className="plate space-y-4 p-6">
          <h2 className="font-display text-2xl">Create a New Clan (Max 50 Members · Lv.1–10)</h2>
          {errorMsg && (
            <p className="rounded-xl bg-destructive/15 px-3 py-2 text-xs font-semibold text-destructive">
              {errorMsg}
            </p>
          )}
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="block text-xs">
              <span className="font-semibold text-muted-foreground">Clan [TAG] (2–5 chars)</span>
              <input
                value={tagInput}
                maxLength={5}
                placeholder="STRF"
                onChange={(e) => setTagInput(e.target.value.toUpperCase())}
                className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 font-mono text-sm font-semibold uppercase"
              />
            </label>
            <label className="block text-xs sm:col-span-2">
              <span className="font-semibold text-muted-foreground">Unique Clan Full Name</span>
              <input
                value={nameInput}
                maxLength={36}
                placeholder="STRAFE Horizon Vanguard"
                onChange={(e) => setNameInput(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-semibold"
              />
            </label>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-xs">
              <span className="font-semibold text-muted-foreground">Clan Motto / Description</span>
              <input
                value={descInput}
                maxLength={100}
                placeholder="Global Ranked & Party Voice grinders"
                onChange={(e) => setDescInput(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-xs">
              <span className="font-semibold text-muted-foreground">Upload Clan Avatar (Optional)</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      const res = ev.target?.result as string;
                      if (res) setIconUrlInput(res);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="mt-1 w-full text-xs text-muted-foreground"
              />
            </label>
          </div>
          <button
            type="button"
            onClick={handleCreateClan}
            className="btn btn-primary !px-6 !py-2.5 text-xs font-semibold"
          >
            Create Clan
          </button>
        </section>
      )}
    </div>
  );
}
