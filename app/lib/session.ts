import crypto from "crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "port_admin_session";
const SALT = "portfolio-admin-v1";

export function computeToken(code: string): string {
  return crypto.createHmac("sha256", code).update(SALT).digest("hex");
}

export async function verifySession(): Promise<boolean> {
  const code = process.env.ADMIN_CODE;
  if (!code) return false;
  const store = await cookies();
  const cookie = store.get(SESSION_COOKIE);
  if (!cookie) return false;
  const expected = computeToken(code);
  // timingSafeEqual évite les attaques par timing
  try {
    return crypto.timingSafeEqual(Buffer.from(cookie.value), Buffer.from(expected));
  } catch {
    return false;
  }
}
