import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/** Server-only Supabase client using service role key for admin operations */
export function createAdminClient() {
  return createClient(supabaseUrl, supabaseServiceRoleKey);
}

const SESSION_COOKIE = "admin_session";
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "elitecloth-admin-secret-change-me";

/** Simple HMAC-like session token: timestamp.hash */
export async function createSessionToken(): Promise<string> {
  const timestamp = Date.now().toString();
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(timestamp));
  const hash = Buffer.from(signature).toString("hex");
  return `${timestamp}.${hash}`;
}

export async function verifySessionToken(token: string): Promise<boolean> {
  const [timestamp, hash] = token.split(".");
  if (!timestamp || !hash) return false;

  // Session expires after 24 hours
  const age = Date.now() - parseInt(timestamp);
  if (age > 24 * 60 * 60 * 1000) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(timestamp));
  const expectedHash = Buffer.from(signature).toString("hex");
  return hash === expectedHash;
}

export async function getAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  if (!session?.value) return false;
  return verifySessionToken(session.value);
}

export { SESSION_COOKIE };
