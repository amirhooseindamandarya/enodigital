import "server-only";
import { and, asc, getTableUniqueName, inArray, is, normalizeRelation, One, SQL, type Column } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

/**
 * اتصال به MySQL/MariaDB. اتصال تا اولین پرس‌وجو برقرار نمی‌شود، پس build بدون پایگاه داده هم کار می‌کند.
 * DATABASE_URL مثل: mysql://user:pass@localhost:3306/dbname
 */
const url = process.env.DATABASE_URL ?? "mysql://localhost:3306/missing_database_url";
if (!process.env.DATABASE_URL && process.env.NEXT_PHASE !== "phase-production-build") console.warn("[db] DATABASE_URL تنظیم نشده است");

const g = globalThis as unknown as { __mysql?: mysql.Pool };
const pool =
  g.__mysql ??
  mysql.createPool({
    uri: url,
    connectionLimit: Number(process.env.DATABASE_POOL ?? 5),
    // همهٔ زمان‌ها UTC
    timezone: "Z",
    charset: "utf8mb4_unicode_ci",
    supportBigNumbers: true,
    bigNumberStrings: false,
    waitForConnections: true,
    enableKeepAlive: true,
  });
g.__mysql = pool;

const base = drizzle(pool, { schema, mode: "default" });

/* ------------------------------------------------------------------------------------------------
 * بارگذاری رابطه‌ها (with) بدون LATERAL JOIN
 * دریزل برای `with` از LATERAL JOIN یا زیرپرس‌وجوی وابسته استفاده می‌کند که MariaDB پشتیبانی نمی‌کند.
 * این‌جا پرس‌وجوی اصلی بدون with اجرا می‌شود و هر رابطه با یک پرس‌وجوی `IN (...)` جداگانه بار می‌شود
 * (روی MySQL 5.7+/8 و MariaDB 10.2+ یکسان کار می‌کند). نوع خروجی‌ها تغییری نمی‌کند.
 * ---------------------------------------------------------------------------------------------- */
type Row = Record<string, unknown>;
type WithCfg = Record<string, true | { where?: SQL; orderBy?: SQL | Column | (SQL | Column)[]; with?: WithCfg }>;
type Finder = { findMany: (c?: object) => Promise<Row[]>; findFirst: (c?: object) => Promise<Row | undefined> };

const tables = base._.schema as unknown as Record<string, { columns: Record<string, Column>; relations: Record<string, Parameters<typeof normalizeRelation>[2]>; primaryKey: Column[] }>;
const tableNamesMap = base._.tableNamesMap;
const rawQuery = base.query as unknown as Record<string, Finder>;
const keyOf = (tsName: string, col: Column) => Object.entries(tables[tsName].columns).find(([, c]) => c === col)?.[0] ?? col.name;
const orderList = (o: unknown) => (o === undefined ? [] : Array.isArray(o) ? o : [o]);

async function attach(tsName: string, rows: Row[], withCfg: WithCfg): Promise<void> {
  if (!rows.length) return;
  for (const [relName, cfg] of Object.entries(withCfg)) {
    const rel = tables[tsName].relations[relName];
    if (!rel) throw new Error(`relation ${tsName}.${relName} not found`);
    const { fields, references } = normalizeRelation(tables as never, tableNamesMap, rel);
    const target = tableNamesMap[getTableUniqueName(rel.referencedTable)];
    const fKey = keyOf(tsName, fields[0]);
    const rKey = keyOf(target, references[0]);
    const opts = cfg === true ? {} : cfg;
    const values = [...new Set(rows.map((r) => r[fKey]).filter((v) => v !== null && v !== undefined))];
    const many = !is(rel, One);
    const children = values.length
      ? await rawQuery[target].findMany({
          where: and(inArray(references[0], values as never[]), opts.where),
          // ترتیب پیش‌فرض: کلید اصلی (برای پیام‌ها و آیتم‌ها)
          orderBy: orderList(opts.orderBy).length ? orderList(opts.orderBy) : [asc(tables[target].primaryKey[0] ?? references[0])],
        })
      : [];
    if (opts.with) await attach(target, children, opts.with);
    const groups = new Map<unknown, Row[]>();
    for (const c of children) {
      const k = c[rKey];
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k)!.push(c);
    }
    for (const r of rows) {
      const found = groups.get(r[fKey]) ?? [];
      r[relName] = many ? found : (found[0] ?? null);
    }
  }
}

const query = Object.fromEntries(
  Object.keys(rawQuery).map((tsName) => {
    const q = rawQuery[tsName];
    return [
      tsName,
      {
        async findMany(c?: { with?: WithCfg }) {
          if (!c?.with) return q.findMany(c);
          const { with: w, ...rest } = c;
          const rows = await q.findMany(rest);
          await attach(tsName, rows, w);
          return rows;
        },
        async findFirst(c?: { with?: WithCfg }) {
          if (!c?.with) return q.findFirst(c);
          const { with: w, ...rest } = c;
          const row = await q.findFirst(rest);
          if (row) await attach(tsName, [row], w);
          return row;
        },
      },
    ];
  }),
);

export const db = new Proxy(base, {
  get(target, prop, receiver) {
    if (prop === "query") return query;
    return Reflect.get(target, prop, receiver);
  },
}) as typeof base;
export type DB = typeof db;
export { schema };
