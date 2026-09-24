import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

/**
 * Böngészőben futó (client component) Supabase kliens.
 * Csak az anon kulcsot használja — írási jogot a bookings táblára
 * a Row Level Security policy-k szabályozzák (ld. supabase/schema.sql).
 */
export const supabaseBrowser = createClient(supabaseUrl, supabaseAnonKey);
