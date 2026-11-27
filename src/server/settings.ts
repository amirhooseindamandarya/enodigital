import "server-only";
import { eq } from "drizzle-orm";
import { db, schema } from "./db";

export type StoreSettings = {
  /** درصد مالیات بر ارزش افزوده */
  taxRate: number;
  /** اطلاعات فروشنده روی صورت‌حساب */
  seller: { name: string; nationalId: string; economicCode: string; registrationNo: string; postalCode: string; address: string; phone: string };
  /** چند روز مانده به پایان اشتراک هشدار داده شود */
  expiryWarnDays: number;
  /** امکان ثبت سفارش با پرداخت دستی (کارت‌به‌کارت) */
  allowManualPayment: boolean;
  manualPaymentNote: string;
};

export const DEFAULT_SETTINGS: StoreSettings = {
  taxRate: 10,
  seller: { name: "اِنو دیجیتال", nationalId: "", economicCode: "", registrationNo: "", postalCode: "", address: "", phone: "" },
  expiryWarnDays: 14,
  allowManualPayment: false,
  manualPaymentNote: "",
};

export async function getSettings(): Promise<StoreSettings> {
  const row = await db.query.settings.findFirst({ where: eq(schema.settings.key, "store") });
  const v = (row?.value ?? {}) as Partial<StoreSettings>;
  return { ...DEFAULT_SETTINGS, ...v, seller: { ...DEFAULT_SETTINGS.seller, ...(v.seller ?? {}) } };
}

export async function saveSettings(v: StoreSettings) {
  await db.insert(schema.settings).values({ key: "store", value: v }).onConflictDoUpdate({ target: schema.settings.key, set: { value: v } });
}
