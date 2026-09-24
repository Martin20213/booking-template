import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

/**
 * Szerver-oldali Supabase kliens (csak API route-okban / server actionben
 * használd, SOHA ne importáld client componentbe — a service role kulcs
 * megkerüli az RLS-t).
 */
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});
