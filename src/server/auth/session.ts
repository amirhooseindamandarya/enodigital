import "server-only";
import { cache } from "react";
import { cookies, headers } from "next/headers";
import { createHash, randomBytes } from "node:crypto";
import { and, eq, gt, ne } from "drizzle-orm";
import { db, schema } from "../db";

export const SESSION_COOKIE = "eno_session";
const TTL_DAYS = 30;
const sha = (s: string) => createHash("sha256").update(s).digest("hex");

export async function createSession(userId: number) {
  const token = randomBytes(32).toString("base64url");
  const h = await headers();
  const expiresAt = new Date(Date.now() + TTL_DAYS * 86400_000);
  await db.insert(schema.sessions).values({
    id: sha(token),
    userId,
    expiresAt,
    ip: (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || null,
    userAgent: h.get("user-agent")?.slice(0, 300) ?? null,
  });
  await db.update(schema.users).set({ lastLoginAt: new Date() }).where(eq(schema.users.id, userId));
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
    secure: process.env.NODE_ENV === "production" && process.env.COOKIE_SECURE !== "false",
  });
}

/** کاربر جاری (در هر درخواست یک‌بار از پایگاه داده خوانده می‌شود) */
export const getCurrentUser = cache(async () => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const id = sha(token);
  const row = await db.query.sessions.findFirst({ where: and(eq(schema.sessions.id, id), gt(schema.sessions.expiresAt, new Date())) });
  if (!row) return null;
  const user = await db.query.users.findFirst({ where: eq(schema.users.id, row.userId) });
  if (!user || user.status !== "active") return null;
  if (Date.now() - row.lastSeenAt.getTime() > 10 * 60_000) {
    await db.update(schema.sessions).set({ lastSeenAt: new Date() }).where(eq(schema.sessions.id, id));
  }
  const { passwordHash: _omit, ...safe } = user;
  void _omit;
  return { ...safe, sessionId: id };
});
export type CurrentUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) await db.delete(schema.sessions).where(eq(schema.sessions.id, sha(token)));
  jar.delete(SESSION_COOKIE);
}

export async function revokeOtherSessions(userId: number, keepId: string) {
  await db.delete(schema.sessions).where(and(eq(schema.sessions.userId, userId), ne(schema.sessions.id, keepId)));
}

export async function revokeAllSessions(userId: number) {
  await db.delete(schema.sessions).where(eq(schema.sessions.userId, userId));
}
