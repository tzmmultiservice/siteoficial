import { supabase } from "./supabase";
import type { AdminRole } from "./types";
import type { Session } from "@supabase/supabase-js";

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export function getAdminRoleByEmail(email: string | null | undefined): AdminRole {
  const normalized = (email || "").trim().toLowerCase();
  const owners = (process.env.NEXT_PUBLIC_OWNER_EMAILS || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  if (normalized && owners.includes(normalized)) {
    return "owner";
  }

  return "mechanic";
}

export async function getCurrentAdminRole(): Promise<AdminRole | null> {
  const session = await getSession();
  if (!session) return null;
  return getAdminRoleByEmail(session.user?.email);
}

export function onAuthChange(callback: (session: Session | null) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
}
