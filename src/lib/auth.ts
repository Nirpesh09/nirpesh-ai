import { supabase } from "@/integrations/supabase/client";
import { loadGoogleSession, clearGoogleSession, type GoogleUser } from "@/lib/google-auth";

export type AuthUser = {
  id: string;
  email: string;
  displayName?: string;
  picture?: string;
  provider?: "email" | "google";
};

function googleToAuthUser(g: GoogleUser): AuthUser {
  return { id: g.id, email: g.email, displayName: g.name, picture: g.picture, provider: "google" };
}

export async function signUp(email: string, password: string, displayName?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: displayName ? { data: { display_name: displayName } } : undefined,
  });
  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  clearGoogleSession();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getUser(): Promise<AuthUser | null> {
  // Check Google session first
  const google = loadGoogleSession();
  if (google) return googleToAuthUser(google);

  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  return {
    id: data.user.id,
    email: data.user.email ?? "",
    displayName: data.user.user_metadata?.display_name || data.user.user_metadata?.full_name,
    provider: "email",
  };
}

type Unsubscribe = () => void;
type AuthCallback = (user: AuthUser | null) => void;

const listeners = new Set<AuthCallback>();

/** Notify all listeners when Google session changes */
export function notifyAuthChange() {
  const google = loadGoogleSession();
  const user = google ? googleToAuthUser(google) : null;
  listeners.forEach((fn) => fn(user));
}

export function onAuthChange(callback: AuthCallback): { data: { subscription: { unsubscribe: Unsubscribe } } } {
  // Check Google session immediately
  const google = loadGoogleSession();
  if (google) {
    setTimeout(() => callback(googleToAuthUser(google)), 0);
  }

  // Also listen for Supabase changes
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    // If Google session exists, it takes priority
    const gUser = loadGoogleSession();
    if (gUser) {
      callback(googleToAuthUser(gUser));
      return;
    }
    if (session?.user) {
      callback({
        id: session.user.id,
        email: session.user.email ?? "",
        displayName:
          session.user.user_metadata?.display_name ||
          session.user.user_metadata?.full_name,
        provider: "email",
      });
    } else {
      callback(null);
    }
  });

  // Register for Google auth events too
  listeners.add(callback);

  return {
    data: {
      subscription: {
        unsubscribe: () => {
          listeners.delete(callback);
          data.subscription.unsubscribe();
        },
      },
    },
  };
}
