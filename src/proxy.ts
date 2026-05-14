import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "admin_session";
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "elitecloth-admin-secret-change-me";

async function verifyToken(token: string): Promise<boolean> {
  const [timestamp, hash] = token.split(".");
  if (!timestamp || !hash) return false;

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

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow /admin/login page
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Protect /admin/* and /api/admin/* (except login/logout)
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi =
    pathname.startsWith("/api/admin") &&
    !pathname.startsWith("/api/admin/login") &&
    !pathname.startsWith("/api/admin/logout");

  if (isAdminPage || isAdminApi) {
    const session = request.cookies.get(SESSION_COOKIE)?.value;

    if (!session || !(await verifyToken(session))) {
      if (isAdminApi) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
