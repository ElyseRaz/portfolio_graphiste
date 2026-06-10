import { NextResponse } from "next/server";
import { verifySession } from "../../../lib/session";

export async function GET() {
  const ok = await verifySession();
  return ok
    ? NextResponse.json({ ok: true })
    : NextResponse.json({ error: "Non authentifié" }, { status: 401 });
}
