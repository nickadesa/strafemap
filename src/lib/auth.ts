import { useEffect, useState } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

/** Current signed-in user (null when signed out, undefined while loading). */
export function useUser() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_e: string, session: Session | null) => setUser(session?.user ?? null));
    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => setUser(data.session?.user ?? null));
    return () => data.subscription.unsubscribe();
  }, []);
  return user;
}
