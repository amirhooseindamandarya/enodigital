import { ActionForm, Submit } from "@/account/form";
import { Card, Field, Input, PageTitle, Textarea } from "@/account/ui";
import { saveSettingsAction } from "@/admin/actions";
import { requireStaff } from "@/server/auth/guards";
import { gateway } from "@/server/payments";
import { smsDriver } from "@/server/sms";
import { getSettings } from "@/server/settings";
import { Badge } from "@/account/ui";

export const metadata = { title: "تنظیمات فروشگاه" };

export default async function Settings() {
  await requireStaff(true);
  const s = await getSettings();
  const g = gateway();
  return (
    <>
      <PageTitle title="تنظیمات فروشگاه" />
      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <Card title="درگاه پرداخت">
          {g?.name === "zarinpal" ? <Badge tone="green">زرین‌پال{process.env.ZARINPAL_SANDBOX === "true" ? " (سندباکس)" : ""}</Badge> : g?.name === "mock" ? <Badge tone="amber">آزمایشی — پولی جابه‌جا نمی‌شود</Badge> : <Badge tone="red">تنظیم نشده</Badge>}
          <p className="mt-2 text-[13px] leading-6 text-ink-3">با متغیرهای محیطی ZARINPAL_MERCHANT_ID و ZARINPAL_SANDBOX روی سرور تنظیم می‌شود.</p>
        </Card>
        <Card title="پیامک">
          {smsDriver() === "kavenegar" ? <Badge tone="green">کاوه‌نگار</Badge> : <Badge tone="amber">فقط لاگ سرور (ارسال نمی‌شود)</Badge>}
          <p className="mt-2 text-[13px] leading-6 text-ink-3">برای ارسال کد بازیابی رمز و اطلاع‌رسانی: SMS_DRIVER=kavenegar و KAVENEGAR_API_KEY.</p>
        </Card>
      </div>
      <ActionForm action={saveSettingsAction} className="max-w-3xl gap-6">
        <Card title="فروش و مالیات">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="مالیات بر ارزش افزوده (درصد)"><Input name="taxRate" inputMode="numeric" ltr defaultValue={String(s.taxRate)} /></Field>
            <Field label="هشدار پایان اشتراک (روز قبل)"><Input name="expiryWarnDays" inputMode="numeric" ltr defaultValue={String(s.expiryWarnDays)} /></Field>
          </div>
          <label className="mt-4 flex items-center gap-2 text-[14px] font-semibold"><input type="checkbox" name="allowManualPayment" defaultChecked={s.allowManualPayment} className="size-4 accent-[var(--color-amber)]" />اگر درگاه در دسترس نبود، ثبت سفارش با پرداخت دستی مجاز باشد</label>
          <Field label="راهنمای پرداخت دستی برای مشتری" className="mt-3" hint="مثلاً شمارهٔ کارت/حساب و روش ارسال رسید"><Textarea name="manualPaymentNote" defaultValue={s.manualPaymentNote} /></Field>
        </Card>
        <Card title="اطلاعات فروشنده روی صورت‌حساب">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="نام شرکت" className="sm:col-span-2"><Input name="seller_name" defaultValue={s.seller.name} /></Field>
            <Field label="شناسه ملی"><Input name="seller_nationalId" ltr defaultValue={s.seller.nationalId} /></Field>
            <Field label="کد اقتصادی"><Input name="seller_economicCode" ltr defaultValue={s.seller.economicCode} /></Field>
            <Field label="شمارهٔ ثبت"><Input name="seller_registrationNo" ltr defaultValue={s.seller.registrationNo} /></Field>
            <Field label="کد پستی"><Input name="seller_postalCode" ltr defaultValue={s.seller.postalCode} /></Field>
            <Field label="تلفن"><Input name="seller_phone" ltr defaultValue={s.seller.phone} /></Field>
            <Field label="نشانی" className="sm:col-span-2"><Textarea name="seller_address" defaultValue={s.seller.address} className="min-h-[80px]" /></Field>
          </div>
        </Card>
        <div><Submit>ذخیرهٔ تنظیمات</Submit></div>
      </ActionForm>
    </>
  );
}
