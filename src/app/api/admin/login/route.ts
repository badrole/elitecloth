import { NextRequest } from "next/server";
import { createSessionToken, SESSION_COOKIE } from "@/lib/supabase-server";

// Simple rate limiting in memory
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

function isRateLimited(ip: string): boolean {
  const record = loginAttempts.get(ip);
  if (!record) return false;
  if (Date.now() - record.lastAttempt > LOCKOUT_MS) {
    loginAttempts.delete(ip);
    return false;
  }
  return record.count >= MAX_ATTEMPTS;
}

function recordAttempt(ip: string) {
  const record = loginAttempts.get(ip);
  if (!record || Date.now() - record.lastAttempt > LOCKOUT_MS) {
    loginAttempts.set(ip, { count: 1, lastAttempt: Date.now() });
  } else {
    record.count++;
    record.lastAttempt = Date.now();
  }
}

function clearAttempts(ip: string) {
  loginAttempts.delete(ip);
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Buffer.from(hash).toString("hex");
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";

  if (isRateLimited(ip)) {
    return Response.json(
      { error: "Terlalu banyak percobaan. Coba lagi dalam 15 menit." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  if (!body?.password) {
    return Response.json({ error: "Password diperlukan" }, { status: 400 });
  }

  const passwordHash = await hashPassword(body.password);
  const expectedHash = process.env.ADMIN_PASSWORD_HASH;

  if (!expectedHash) {
    return Response.json({ error: "Server belum dikonfigurasi" }, { status: 500 });
  }

  if (passwordHash !== expectedHash) {
    recordAttempt(ip);
    return Response.json({ error: "Password salah" }, { status: 401 });
  }

  clearAttempts(ip);
  const token = await createSessionToken();

  const response = Response.json({ success: true });
  response.headers.set(
    "Set-Cookie",
    `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400${process.env.NODE_ENV === "production" ? "; Secure" : ""}`
  );

  return response;
}
