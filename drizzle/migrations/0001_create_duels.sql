CREATE TABLE public.duels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  host_id uuid NOT NULL,
  host_name text NOT NULL DEFAULT 'Host',
  guest_id uuid,
  guest_name text,
  status text NOT NULL DEFAULT 'waiting',
  location_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
  round integer NOT NULL DEFAULT 0,
  host_hp integer NOT NULL DEFAULT 6000,
  guest_hp integer NOT NULL DEFAULT 6000,
  round_started_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.duels TO authenticated;
GRANT ALL ON public.duels TO service_role;
ALTER TABLE public.duels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "duel read" ON public.duels FOR SELECT TO authenticated
  USING (auth.uid() = host_id OR auth.uid() = guest_id OR status = 'waiting');
CREATE POLICY "duel create" ON public.duels FOR INSERT TO authenticated WITH CHECK (auth.uid() = host_id);
CREATE POLICY "duel update" ON public.duels FOR UPDATE TO authenticated
  USING (auth.uid() = host_id OR auth.uid() = guest_id) WITH CHECK (auth.uid() = host_id OR auth.uid() = guest_id);

CREATE OR REPLACE FUNCTION public.join_duel(_code text, _name text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE d public.duels;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in first'; END IF;
  SELECT * INTO d FROM public.duels WHERE code = upper(_code) FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Room not found'; END IF;
  IF d.host_id = auth.uid() OR d.guest_id = auth.uid() THEN RETURN d.id; END IF;
  IF d.status <> 'waiting' OR d.guest_id IS NOT NULL THEN RAISE EXCEPTION 'Room is full'; END IF;
  UPDATE public.duels SET guest_id = auth.uid(), guest_name = left(coalesce(nullif(_name,''),'Guest'), 24),
    status = 'playing', round_started_at = now() WHERE id = d.id;
  RETURN d.id;
END $$;
REVOKE ALL ON FUNCTION public.join_duel(text, text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.join_duel(text, text) TO authenticated;

CREATE TABLE public.duel_guesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  duel_id uuid NOT NULL REFERENCES public.duels(id) ON DELETE CASCADE,
  round integer NOT NULL,
  user_id uuid NOT NULL,
  lat double precision,
  lng double precision,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (duel_id, round, user_id)
);
GRANT SELECT, INSERT ON public.duel_guesses TO authenticated;
GRANT ALL ON public.duel_guesses TO service_role;
ALTER TABLE public.duel_guesses ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE FUNCTION public.is_duel_player(_duel uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.duels WHERE id = _duel AND (host_id = auth.uid() OR guest_id = auth.uid()))
$$;
CREATE POLICY "guess read" ON public.duel_guesses FOR SELECT TO authenticated USING (public.is_duel_player(duel_id));
CREATE POLICY "guess insert" ON public.duel_guesses FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND public.is_duel_player(duel_id));

ALTER PUBLICATION supabase_realtime ADD TABLE public.duels;
ALTER PUBLICATION supabase_realtime ADD TABLE public.duel_guesses;