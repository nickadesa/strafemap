CREATE TABLE public.parties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  host_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'waiting',
  location_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
  round int NOT NULL DEFAULT 0,
  rounds int NOT NULL DEFAULT 5,
  time_limit int NOT NULL DEFAULT 30,
  pool text NOT NULL DEFAULT 'world',
  difficulty text NOT NULL DEFAULT 'medium',
  revealed_round int NOT NULL DEFAULT -1,
  round_started_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.party_players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  party_id uuid NOT NULL REFERENCES public.parties(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  name text NOT NULL DEFAULT 'Player',
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (party_id, user_id)
);
CREATE TABLE public.party_guesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  party_id uuid NOT NULL REFERENCES public.parties(id) ON DELETE CASCADE,
  round int NOT NULL,
  user_id uuid NOT NULL,
  lat double precision,
  lng double precision,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (party_id, round, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.parties TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.party_players TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.party_guesses TO authenticated;
GRANT ALL ON public.parties, public.party_players, public.party_guesses TO service_role;
ALTER TABLE public.parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.party_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.party_guesses ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_party_member(_party uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.party_players WHERE party_id = _party AND user_id = auth.uid())
      OR EXISTS (SELECT 1 FROM public.parties WHERE id = _party AND host_id = auth.uid());
$$;

CREATE POLICY "members read party" ON public.parties FOR SELECT TO authenticated USING (public.is_party_member(id));
CREATE POLICY "host creates party" ON public.parties FOR INSERT TO authenticated WITH CHECK (host_id = auth.uid());
CREATE POLICY "host updates party" ON public.parties FOR UPDATE TO authenticated USING (host_id = auth.uid());
CREATE POLICY "host deletes party" ON public.parties FOR DELETE TO authenticated USING (host_id = auth.uid());

CREATE POLICY "members read players" ON public.party_players FOR SELECT TO authenticated USING (public.is_party_member(party_id));
CREATE POLICY "host adds self" ON public.party_players FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND EXISTS (SELECT 1 FROM public.parties p WHERE p.id = party_id AND p.host_id = auth.uid()));
CREATE POLICY "leave party" ON public.party_players FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE POLICY "members read guesses" ON public.party_guesses FOR SELECT TO authenticated USING (public.is_party_member(party_id));
CREATE POLICY "members guess" ON public.party_guesses FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND public.is_party_member(party_id));

CREATE OR REPLACE FUNCTION public.join_party(_code text, _name text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE pid uuid; st text; n int;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in first'; END IF;
  SELECT id, status INTO pid, st FROM public.parties WHERE code = upper(_code);
  IF pid IS NULL THEN RAISE EXCEPTION 'Room not found'; END IF;
  IF EXISTS (SELECT 1 FROM public.party_players WHERE party_id = pid AND user_id = auth.uid()) THEN RETURN pid; END IF;
  IF st <> 'waiting' THEN RAISE EXCEPTION 'Game already started'; END IF;
  SELECT count(*) INTO n FROM public.party_players WHERE party_id = pid;
  IF n >= 12 THEN RAISE EXCEPTION 'Room is full'; END IF;
  INSERT INTO public.party_players (party_id, user_id, name) VALUES (pid, auth.uid(), left(coalesce(nullif(trim(_name), ''), 'Player'), 24));
  RETURN pid;
END $$;
GRANT EXECUTE ON FUNCTION public.join_party(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_party_member(uuid) TO authenticated;

ALTER PUBLICATION supabase_realtime ADD TABLE public.parties;
ALTER PUBLICATION supabase_realtime ADD TABLE public.party_players;
ALTER PUBLICATION supabase_realtime ADD TABLE public.party_guesses;