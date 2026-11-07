# Roadmap

## Completed Foundation (v1)
- [x] Compact one-row mobile game header and confirm button; bottom-left zoom; no emoji attribution badge; seven-language game/navigation/settings translations verified at 320px, 390px and 1280px, including settings-to-game language selection.
- [x] Smart clue: Inter, content-fit compact state, sequenced flag animation; verified short/long country and city clues on desktop/mobile and reduced motion.
- [x] In-game HUD clean pass: no chat/quick-settings over the map, coords readout under Confirm guess, 10ms haptic tap on pin + confirm
- [x] Instagram story share card (9:16) on game results
- [x] Map: smooth fractional zoom + inertia, Voyager default, pin drop bounce, tiny attribution
- [x] Map cursor: plus crosshair
- [x] Party mode lobby with ready-up before host starts (client-side foundation)
- [x] Bigger location pool (500+) + anti-repeat so places don't come back so often
  - [x] Custom plus cursor shipped
  - [x] Session + recent-play anti-repeat (avoid last ~40 locations across games via localStorage)
  - [x] Expanded pool with additional cities, landmarks, and natural sites
- [x] Collapsible location prompt (click or auto after N seconds, configurable) + timer visible when collapsed
- [x] Game-like home page redesign + Profile page with custom icons (no emoji)
- [x] Bundled SVG flag pack with name aliases; clue card flag-left/centred/timer-right, max 320px, 620ms motion
- [x] Round reveal auto-advances after 5s with bar; emoji reactions only on reveal; chat only on finished ranked/bot games
- [x] Desktop 64px collapsible icon rail, mobile bottom bar; accent colour presets; optional Liquid Glass presets (Bend/Dispersion/Frost/Rim)

## STRAFE 2.0 Master Plan Milestones
- [x] **Core Brand Palette & Navigation v2**: Electric Blue (`#0367FC`) + Acid Lime (`#D2F801`) on `#161616` Dark / `#FFFFFF` Light surfaces; Desktop 64px/240px sidebar with tooltips & bottom User Profile Popover; Mobile header with Notification Bell + compact 4-tab bottom bar (`Home`, `Modes`, `Rank`, `Feed / Clan`).
- [x] **Rank System (`RANKS.md`) & Level 1–1,000**:
  - [x] Installed 71 SVG Rank Banners (`public/ranks/banners/`), 57 SVG Circular Avatar Frames (`public/ranks/frames/`), and `src/data/ranks.json`.
  - [x] Pure `getRank(rp, championPosition)` helper, `<RankBanner />`, `<AvatarFrame />`, and `/dev/ranks` verification harness.
  - [x] Unified `/rank` hub with **Play** (Previous / Current / Next rank + Rewards Preview), **Guide** (`2 → 3 → 4` Adaptive Pyramid fitting a single screen), and **Leaderboard** (`Global`, `Zone`, `Country` filters).
- [x] **Modes Hub (`/play`), Party Mode 2.0 + Voice Chat & New Game Modes**:
  - [x] Event/Announcement banner + 3 zones (`Ranked Mode`, `Party Mode`, `More Modes`).
  - [x] Party Lobby for `2–16` players, configurable round timers (`10s`, `20s`, `30s`, `60s`, `∞ Unlimited`), mode selector, Friend Invites, and WebRTC/Simulated Voice Chat with per-player Mute & Quick Soundboard.
  - [x] **7 Deadly Sins Mode** (100% self-targeted boons & trade-offs: *Pride*, *Greed*, *Wrath*, *Envy*, *Lust*, *Gluttony*, *Sloth*).
  - [x] **Find the City**, **Country Quiz (4-Choice)**, and **Hardcore Difficulty** (borderless/labelless map tiles + strict timers).
- [x] **X-Style Profile, Clans, Multi-Pack Gacha & Social Feed (`/feed`)**:
  - [x] Profile customization (`Avatar`, `Nickname`, `@username` locked for Guests, `Bio`), Verified Badges (`Gold`, `Rainbow Exclusive`, `Green Creator`, `Red Admin`), and up to 5 Pinned Achievement Badges in a single row.
  - [x] Clan system (2–5 char `[TAG]` pill, max 50 members, Level 1–10 progression, Clan Leaderboard).
  - [x] Multi-pack Gacha Pack Opening with tear/flip rarity animations (`Common`, `Rare`, `Epic`, `Mythic`).
  - [x] Dedicated Social Feed (`/feed`) with `4:5` rainbow-ring Stories bar, Results Card posts, free-text discussion, likes, and comments.
- [x] **SmartClue Alignment, Embedded Match Chat, Multi-Ratio Share Card Studio & Supabase Schema**:
  - [x] `SmartClue` centered collapsed state, `"Pin the location"` localized label, Ranked opponent HUD & animated guess-to-target reveal line.
  - [x] Embedded Results chat with left/right avatars, preset quick-messages, and `"nick left the match"` disconnect notice.
  - [x] Share Card Studio supporting `16:9`, `1:1`, `4:5`, `9:16` at `1080p`, `2K`, `4K` across `Daily`, `Ranked`, `Party`, and `Classic` themes.
  - [x] Complete Supabase SQL migration (`supabase/migrations/20261107000000_strafe_v2_schema.sql`) and repo cleanup.
