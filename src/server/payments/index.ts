import "server-only";

/**
 * درگاه پرداخت. پیش‌فرض زرین‌پال (v4)؛ برای توسعه و آزمون یک درگاه شبیه‌سازی‌شده هم هست.
 * ZARINPAL_MERCHANT_ID پر باشد ← زرین‌پال (با ZARINPAL_SANDBOX=true سندباکس)
 * PAYMENT_MOCK=true ← درگاه آزمایشی (در production فقط با این متغیر فعال می‌شود)
 */
export type PayRequest = { amount: number; orderId: number; callbackUrl: string; description: string; mobile?: string; email?: string | null };
export type PayStart = { authority: string; redirectUrl: string };
export type PayVerify = { ok: boolean; refId?: string; cardPan?: string; message?: string; raw?: unknown };

export interface Gateway {
  name: string;
  request(r: PayRequest): Promise<PayStart>;
  verify(authority: string, amount: number): Promise<PayVerify>;
}

const ZP_ERRORS: Record<string, string> = {
  "-9": "خطای اعتبارسنجی درخواست",
  "-10": "IP یا مرچنت‌کد پذیرنده صحیح نیست",
  "-11": "مرچنت‌کد فعال نیست",
  "-12": "تلاش بیش از حد در یک بازهٔ کوتاه",
  "-15": "درگاه پذیرنده تعلیق شده است",
  "-50": "مبلغ پرداخت‌شده با مبلغ سفارش برابر نیست",
  "-51": "پرداخت ناموفق",
  "-54": "اتوریتی نامعتبر است",
};

export const zarinpal = (merchantId: string, sandbox: boolean): Gateway => {
  const host = sandbox ? "https://sandbox.zarinpal.com" : "https://payment.zarinpal.com";
  const post = async (path: string, body: object) => {
    const res = await fetch(`${host}/pg/v4/payment/${path}.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    });
    return (await res.json().catch(() => ({}))) as { data?: Record<string, unknown> | [] ; errors?: { code?: number; message?: string } | [] };
  };
  return {
    name: "zarinpal",
    async request(r) {
      const json = await post("request", {
        merchant_id: merchantId,
        amount: r.amount,
        currency: "IRR",
        callback_url: r.callbackUrl,
        description: r.description,
        metadata: { ...(r.mobile ? { mobile: r.mobile } : {}), ...(r.email ? { email: r.email } : {}), order_id: String(r.orderId) },
      });
      const data = json.data as { code?: number; authority?: string } | undefined;
      if (!data || data.code !== 100 || !data.authority) {
        const code = String((json.errors as { code?: number })?.code ?? data?.code ?? "");
        throw new Error(ZP_ERRORS[code] ?? `خطای درگاه (${code || "نامشخص"})`);
      }
      return { authority: data.authority, redirectUrl: `${host}/pg/StartPay/${data.authority}` };
    },
    async verify(authority, amount) {
      const json = await post("verify", { merchant_id: merchantId, amount, authority });
      const data = json.data as { code?: number; ref_id?: number; card_pan?: string } | undefined;
      // 100: موفق، 101: قبلاً تأیید شده
      if (data && (data.code === 100 || data.code === 101)) return { ok: true, refId: String(data.ref_id ?? ""), cardPan: data.card_pan, raw: json };
      const code = String((json.errors as { code?: number })?.code ?? data?.code ?? "");
      return { ok: false, message: ZP_ERRORS[code] ?? `پرداخت تأیید نشد (${code})`, raw: json };
    },
  };
};

/** درگاه آزمایشی: صفحهٔ /api/payments/mock نتیجه را شبیه‌سازی می‌کند */
const mock = (): Gateway => ({
  name: "mock",
  async request(r) {
    const authority = `MOCK${r.orderId}${Date.now().toString(36).toUpperCase()}`;
    const qs = new URLSearchParams({ authority, amount: String(r.amount), callback: r.callbackUrl });
    return { authority, redirectUrl: `${process.env.APP_URL ?? ""}/api/payments/mock/?${qs}` };
  },
  async verify(authority) {
    return { ok: true, refId: `R${authority.slice(-8)}`, cardPan: "6037****1234" };
  },
});

export function gateway(): Gateway | null {
  const merchant = process.env.ZARINPAL_MERCHANT_ID;
  if (merchant) return zarinpal(merchant, process.env.ZARINPAL_SANDBOX === "true");
  if (process.env.PAYMENT_MOCK === "true" || process.env.NODE_ENV !== "production") return mock();
  return null;
}

/** درگاهی که یک پرداخت با آن آغاز شده است */
export const gatewayByName = (name: string): Gateway | null => {
  const g = gateway();
  return g && g.name === name ? g : null;
};
