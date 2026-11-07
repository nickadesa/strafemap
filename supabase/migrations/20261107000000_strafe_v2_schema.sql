-- =============================================================================
-- STRAFE 2.0 Master Schema Migration
-- Covers:
--   1. Extended Profiles (Rank RP, Level 1-1000, @username, Verified Badges, Cosmetics, Clan link)
--   2. Clans & Clan Members (Max 50 members trigger, Level 1-10, 2-5 char [TAG])
--   3. Social Follows (X-style Followers / Following)
--   4. Social Feed Posts & Post Comments (Results Card shares + Free text discussion)
--   5. Ranked Matches & Server-side RP / Champion Top-50 Functions (RANKS.md spec)
--   6. Party Mode v2 Extensions (More Modes, 2-16 players, Unlimited time = 0, Voice Chat state)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. CLANS & CLAN MEMBERS (Created before profiles FK reference)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.clans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tag text NOT NULL UNIQUE CHECK (char_length(btrim(tag)) BETWEEN 2 AND 5),
  name text NOT NULL UNIQUE CHECK (char_length(btrim(name)) BETWEEN 2 AND 40),
  description text DEFAULT '',
  icon_url text,
  level integer NOT NULL DEFAULT 1 CHECK (level BETWEEN 1 AND 10),
  xp bigint NOT NULL DEFAULT 0 CHECK (xp >= 0),
  leader_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.clan_members (
  clan_id uuid NOT NULL REFERENCES public.clans(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('leader', 'officer', 'member')),
  weekly_xp_contributed bigint NOT NULL DEFAULT 0 CHECK (weekly_xp_contributed >= 0),
  joined_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (clan_id, user_id),
  UNIQUE (user_id)
);

-- Enforce max 50 members per clan
CREATE OR REPLACE FUNCTION public.enforce_clan_member_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  member_count integer;
BEGIN
  SELECT count(*) INTO member_count
  FROM public.clan_members
  WHERE clan_id = NEW.clan_id;

  IF member_count >= 50 THEN
    RAISE EXCEPTION 'Clan has reached the maximum capacity of 50 members.';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_clan_member_limit ON public.clan_members;
CREATE TRIGGER trg_enforce_clan_member_limit
  BEFORE INSERT ON public.clan_members
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_clan_member_limit();

-- -----------------------------------------------------------------------------
-- 2. EXTEND PROFILES (X-style Profile, Rank RP, Level 1-1000, Verified, Gacha)
-- -----------------------------------------------------------------------------
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS username text UNIQUE,
  ADD COLUMN IF NOT EXISTS bio text DEFAULT '',
  ADD COLUMN IF NOT EXISTS avatar_url text,
  ADD COLUMN IF NOT EXISTS country_code text DEFAULT 'TH',
  ADD COLUMN IF NOT EXISTS is_guest boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS rp integer NOT NULL DEFAULT 0 CHECK (rp >= 0),
  ADD COLUMN IF NOT EXISTS rank_matches_played integer NOT NULL DEFAULT 0 CHECK (rank_matches_played >= 0),
  ADD COLUMN IF NOT EXISTS rp_updated_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS xp bigint NOT NULL DEFAULT 0 CHECK (xp >= 0),
  ADD COLUMN IF NOT EXISTS level integer NOT NULL DEFAULT 1 CHECK (level BETWEEN 1 AND 1000),
  ADD COLUMN IF NOT EXISTS gacha_tickets integer NOT NULL DEFAULT 3 CHECK (gacha_tickets >= 0),
  ADD COLUMN IF NOT EXISTS verified_tier text DEFAULT 'gold' CHECK (verified_tier IN ('gold', 'green', 'red', 'rainbow') OR verified_tier IS NULL),
  ADD COLUMN IF NOT EXISTS subscription_tier text NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium')),
  ADD COLUMN IF NOT EXISTS pinned_badges jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS unlocked_cosmetics jsonb NOT NULL DEFAULT '{"chatFrames":["default"],"nameColors":["default"],"pinStyles":["default"],"trailStyles":["default"],"titles":["Cartographer"]}'::jsonb,
  ADD COLUMN IF NOT EXISTS equipped_cosmetics jsonb NOT NULL DEFAULT '{"chatFrame":"default","nameColor":"default","pinStyle":"default","trailStyle":"default","title":"Cartographer"}'::jsonb,
  ADD COLUMN IF NOT EXISTS clan_id uuid REFERENCES public.clans(id) ON DELETE SET NULL;

-- Ensure Guest accounts cannot set a permanent @username, and max 5 pinned badges
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_guest_no_username_chk,
  ADD CONSTRAINT profiles_guest_no_username_chk CHECK (NOT (is_guest AND username IS NOT NULL)),
  DROP CONSTRAINT IF EXISTS profiles_pinned_badges_max5_chk,
  ADD CONSTRAINT profiles_pinned_badges_max5_chk CHECK (jsonb_typeof(pinned_badges) = 'array' AND jsonb_array_length(pinned_badges) <= 5);

CREATE INDEX IF NOT EXISTS idx_profiles_rp_ranking ON public.profiles (rp DESC, rp_updated_at ASC);
CREATE INDEX IF NOT EXISTS idx_profiles_country_rp ON public.profiles (country_code, rp DESC, rp_updated_at ASC);
CREATE INDEX IF NOT EXISTS idx_profiles_clan_id ON public.profiles (clan_id);

-- -----------------------------------------------------------------------------
-- 3. FOLLOWS (Social Graph)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.follows (
  follower_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (follower_id, following_id),
  CONSTRAINT follows_no_self_follow CHECK (follower_id <> following_id)
);

CREATE INDEX IF NOT EXISTS idx_follows_follower ON public.follows (follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON public.follows (following_id);

-- -----------------------------------------------------------------------------
-- 4. SOCIAL FEED POSTS, LIKES & COMMENTS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.social_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content text NOT NULL DEFAULT '',
  result_card_json jsonb,
  aspect_ratio text DEFAULT '16:9' CHECK (aspect_ratio IN ('16:9', '1:1', '4:5', '9:16')),
  is_story boolean NOT NULL DEFAULT false,
  likes_count integer NOT NULL DEFAULT 0 CHECK (likes_count >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_social_posts_created_at ON public.social_posts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_social_posts_author ON public.social_posts (author_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.social_posts(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content text NOT NULL CHECK (char_length(btrim(content)) BETWEEN 1 AND 500),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON public.post_comments (post_id, created_at ASC);

CREATE TABLE IF NOT EXISTS public.post_likes (
  post_id uuid NOT NULL REFERENCES public.social_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, user_id)
);

-- -----------------------------------------------------------------------------
-- 5. RANKED MATCHES & SERVER-SIDE RANK / RP FUNCTIONS (RANKS.md Specification)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ranked_seasons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  season_number integer NOT NULL UNIQUE,
  name text NOT NULL,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  is_active boolean NOT NULL DEFAULT false,
  final_top50_snapshot jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ranked_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id uuid REFERENCES public.ranked_seasons(id) ON DELETE SET NULL,
  player_a_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  player_b_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rounds_won_a integer NOT NULL CHECK (rounds_won_a BETWEEN 0 AND 10),
  rounds_won_b integer NOT NULL CHECK (rounds_won_b BETWEEN 0 AND 10),
  rp_before_a integer NOT NULL,
  rp_before_b integer NOT NULL,
  rp_delta_a integer NOT NULL,
  rp_delta_b integer NOT NULL,
  rp_after_a integer NOT NULL,
  rp_after_b integer NOT NULL,
  rounds_detail jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ranked_matches_distinct_players CHECK (player_a_id <> player_b_id),
  CONSTRAINT ranked_matches_ten_rounds CHECK (rounds_won_a + rounds_won_b = 10)
);

CREATE INDEX IF NOT EXISTS idx_ranked_matches_player_a ON public.ranked_matches (player_a_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ranked_matches_player_b ON public.ranked_matches (player_b_id, created_at DESC);

-- Server-side function: Compute Champion Position (1..50 for Master RP >= 7000)
-- Ties broken by who reached that RP first (rp_updated_at ASC) per RANKS.md
CREATE OR REPLACE FUNCTION public.get_champion_position(_user_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  WITH master_top50 AS (
    SELECT
      id,
      row_number() OVER (ORDER BY rp DESC, rp_updated_at ASC, id ASC) AS pos
    FROM public.profiles
    WHERE rp >= 7000
      AND is_guest = false
    LIMIT 50
  )
  SELECT pos::integer
  FROM master_top50
  WHERE id = _user_id;
$$;

-- Server-side function: Calculate and apply RP changes for a 10-round human Ranked Match
-- Implements exact rpRules from RANKS.md / src/data/ranks.json:
--   win: +25, loss: -20, draw (5-5): 0
--   marginBonusPerRound: (abs(rounds_a - rounds_b) - 1) * 1.5 rounded to nearest integer (added to winner, subtracted from loser)
--   opponentGap: clamp((opponent_rp - my_rp) / 100.0, -8, +8)
--   placementMatches: first 5 matches multiply positive RP gain by 1.5
--   minRp: 0
CREATE OR REPLACE FUNCTION public.submit_ranked_match(
  _player_a uuid,
  _player_b uuid,
  _rounds_a integer,
  _rounds_b integer,
  _rounds_detail jsonb DEFAULT '[]'::jsonb
)
RETURNS public.ranked_matches
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  prof_a public.profiles%ROWTYPE;
  prof_b public.profiles%ROWTYPE;
  round_diff integer;
  margin_bonus numeric;
  gap_adj_a numeric;
  gap_adj_b numeric;
  raw_delta_a numeric;
  raw_delta_b numeric;
  final_delta_a integer;
  final_delta_b integer;
  new_rp_a integer;
  new_rp_b integer;
  inserted_match public.ranked_matches%ROWTYPE;
BEGIN
  IF _player_a = _player_b THEN
    RAISE EXCEPTION 'Ranked match requires two distinct human players.';
  END IF;

  IF _rounds_a < 0 OR _rounds_b < 0 OR (_rounds_a + _rounds_b) <> 10 THEN
    RAISE EXCEPTION 'Ranked match must consist of exactly 10 rounds.';
  END IF;

  SELECT * INTO prof_a FROM public.profiles WHERE id = _player_a FOR UPDATE;
  SELECT * INTO prof_b FROM public.profiles WHERE id = _player_b FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Both player profiles must exist.';
  END IF;

  round_diff := abs(_rounds_a - _rounds_b);
  margin_bonus := CASE WHEN round_diff > 1 THEN (round_diff - 1) * 1.5 ELSE 0 END;

  gap_adj_a := LEAST(8.0, GREATEST(-8.0, (prof_b.rp - prof_a.rp)::numeric / 100.0));
  gap_adj_b := LEAST(8.0, GREATEST(-8.0, (prof_a.rp - prof_b.rp)::numeric / 100.0));

  IF _rounds_a > _rounds_b THEN
    raw_delta_a := 25 + round(margin_bonus) + gap_adj_a;
    raw_delta_b := -20 - round(margin_bonus) + gap_adj_b;
  ELSIF _rounds_b > _rounds_a THEN
    raw_delta_a := -20 - round(margin_bonus) + gap_adj_a;
    raw_delta_b := 25 + round(margin_bonus) + gap_adj_b;
  ELSE
    raw_delta_a := 0 + gap_adj_a;
    raw_delta_b := 0 + gap_adj_b;
  END IF;

  -- Placement multiplier (1.5x on first 5 matches when gaining positive RP)
  IF prof_a.rank_matches_played < 5 AND raw_delta_a > 0 THEN
    raw_delta_a := raw_delta_a * 1.5;
  END IF;

  IF prof_b.rank_matches_played < 5 AND raw_delta_b > 0 THEN
    raw_delta_b := raw_delta_b * 1.5;
  END IF;

  final_delta_a := round(raw_delta_a)::integer;
  final_delta_b := round(raw_delta_b)::integer;

  new_rp_a := GREATEST(0, prof_a.rp + final_delta_a);
  new_rp_b := GREATEST(0, prof_b.rp + final_delta_b);

  UPDATE public.profiles
  SET
    rp = new_rp_a,
    rank_matches_played = rank_matches_played + 1,
    rp_updated_at = CASE WHEN new_rp_a <> prof_a.rp THEN now() ELSE rp_updated_at END
  WHERE id = _player_a;

  UPDATE public.profiles
  SET
    rp = new_rp_b,
    rank_matches_played = rank_matches_played + 1,
    rp_updated_at = CASE WHEN new_rp_b <> prof_b.rp THEN now() ELSE rp_updated_at END
  WHERE id = _player_b;

  INSERT INTO public.ranked_matches (
    player_a_id,
    player_b_id,
    rounds_won_a,
    rounds_won_b,
    rp_before_a,
    rp_before_b,
    rp_delta_a,
    rp_delta_b,
    rp_after_a,
    rp_after_b,
    rounds_detail
  ) VALUES (
    _player_a,
    _player_b,
    _rounds_a,
    _rounds_b,
    prof_a.rp,
    prof_b.rp,
    new_rp_a - prof_a.rp,
    new_rp_b - prof_b.rp,
    new_rp_a,
    new_rp_b,
    COALESCE(_rounds_detail, '[]'::jsonb)
  )
  RETURNING * INTO inserted_match;

  RETURN inserted_match;
END;
$$;

-- -----------------------------------------------------------------------------
-- 6. PARTY MODE V2 EXTENSIONS (Custom Modes, 2-16 Players, Unlimited Time, Voice)
-- -----------------------------------------------------------------------------
ALTER TABLE public.parties
  ADD COLUMN IF NOT EXISTS mode text NOT NULL DEFAULT 'classic' CHECK (mode IN ('classic', 'find-city', 'seven-sins', 'country-quiz', 'hardcore')),
  ADD COLUMN IF NOT EXISTS max_players integer NOT NULL DEFAULT 8 CHECK (max_players BETWEEN 2 AND 16);

-- Allow time_limit = 0 to represent Unlimited Time (∞) in Party Mode
ALTER TABLE public.parties
  DROP CONSTRAINT IF EXISTS parties_time_limit_check;

ALTER TABLE public.parties
  ADD CONSTRAINT parties_time_limit_check CHECK (time_limit >= 0 AND time_limit <= 600);

ALTER TABLE public.party_players
  ADD COLUMN IF NOT EXISTS is_ready boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS voice_muted boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS selected_sin text;

-- -----------------------------------------------------------------------------
-- 7. ROW LEVEL SECURITY (RLS) POLICIES FOR NEW TABLES
-- -----------------------------------------------------------------------------
ALTER TABLE public.clans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clan_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ranked_seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ranked_matches ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'clans' AND policyname = 'Public read clans') THEN
    CREATE POLICY "Public read clans" ON public.clans FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'clan_members' AND policyname = 'Public read clan_members') THEN
    CREATE POLICY "Public read clan_members" ON public.clan_members FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'follows' AND policyname = 'Public read follows') THEN
    CREATE POLICY "Public read follows" ON public.follows FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'social_posts' AND policyname = 'Public read social_posts') THEN
    CREATE POLICY "Public read social_posts" ON public.social_posts FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'post_comments' AND policyname = 'Public read post_comments') THEN
    CREATE POLICY "Public read post_comments" ON public.post_comments FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ranked_matches' AND policyname = 'Public read ranked_matches') THEN
    CREATE POLICY "Public read ranked_matches" ON public.ranked_matches FOR SELECT USING (true);
  END IF;
END
$$;
