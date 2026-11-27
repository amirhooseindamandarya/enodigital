import "server-only";
import { db, schema } from "./db";

/** ثبت فعالیت کارکنان در پنل */
export async function audit(actorId: number | null, action: string, entity: string, entityId?: string | number, data?: unknown) {
  await db.insert(schema.auditLogs).values({ actorId, action, entity, entityId: entityId == null ? null : String(entityId), data: data ?? null });
}
