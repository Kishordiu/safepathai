
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!supabase) {
        if (mounted) {
          setAuthenticated(false);
          setLoading(false);
        }
        return;
      }

      const { data } = await supabase.auth.getUser();
      if (mounted) {
        setAuthenticated(Boolean(data.user));
        setLoading(false);
      }
    };

    load();

    const { data: sub } = supabase?.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(Boolean(session?.user));
      setLoading(false);
    }) ?? { data: { subscription: { unsubscribe: () => {} } } };

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    };
  }, []);

  if (loading) {
    return <div className="min-h-screen grid place-items-center text-sm text-muted-foreground">Checking session...</div>;
  }

  if (!authenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
