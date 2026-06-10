import crypto from "crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, computeToken } from "../../../lib/session";

export async function POST(req: NextRequest) {
  const adminCode = process.env.ADMIN_CODE;
  if (!adminCode) {
    return NextResponse.json({ error: "Non configuré" }, { status: 500 });
  }

  const { code } = await req.json();
  if (typeof code !== "string") {
    return NextResponse.json({ error: "Code invalide" }, { status: 400 });
  }

  // Comparaison en temps constant pour éviter les attaques par timing
  const isValid =
    code.length === adminCode.length &&
    crypto.timingSafeEqual(Buffer.from(code), Buffer.from(adminCode));

  if (!isValid) {
    return NextResponse.json({ error: "Code incorrect" }, { status: 401 });
  }

  const token = computeToken(adminCode);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8, // 8 heures
    path: "/",
  });

  return NextResponse.json({ ok: true });
}
