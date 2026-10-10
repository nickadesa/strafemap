CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT 'Player',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, left(coalesce(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1), 'Player'), 20))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.game_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  player text NOT NULL,
  mode text NOT NULL,
  daily boolean NOT NULL DEFAULT false,
  date timestamptz NOT NULL DEFAULT now(),
  score integer NOT NULL,
  max integer NOT NULL,
  rounds jsonb NOT NULL DEFAULT '[]'
);
GRANT SELECT, INSERT, DELETE ON public.game_records TO authenticated;
GRANT ALL ON public.game_records TO service_role;
ALTER TABLE public.game_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own records read" ON public.game_records FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own records insert" ON public.game_records FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own records delete" ON public.game_records FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX ON public.game_records (user_id, date);