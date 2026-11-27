import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// اتصال تا اولین پرس‌وجو برقرار نمی‌شود؛ پس build بدون پایگاه داده هم کار می‌کند
const url = process.env.DATABASE_URL ?? "postgres://localhost:5432/missing_database_url";
if (!process.env.DATABASE_URL && process.env.NEXT_PHASE !== "phase-production-build") console.warn("[db] DATABASE_URL تنظیم نشده است");

// یک اتصال مشترک در حالت توسعه (جلوگیری از اتصال‌های تکراری با HMR)
const g = globalThis as unknown as { __pg?: ReturnType<typeof postgres> };
const client = g.__pg ?? postgres(url, { max: Number(process.env.DATABASE_POOL ?? 10), onnotice: () => {} });
if (process.env.NODE_ENV !== "production") g.__pg = client;

export const db = drizzle(client, { schema });
export type DB = typeof db;
export { schema };
