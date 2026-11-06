import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="surface-dark grid min-h-[80vh] place-items-center pt-[72px] text-center">
      <div className="container-x">
        <p className="text-[14px] font-bold text-[#a9b1ff]">خطای ۴۰۴</p>
        <h1 className="h-section mt-4">صفحه‌ای که دنبالش هستید پیدا نشد</h1>
        <div className="mt-8 flex justify-center gap-3">
          <ButtonLink href="/" variant="light">صفحهٔ اصلی</ButtonLink>
          <ButtonLink href="/products/" variant="ghostDark">محصولات</ButtonLink>
        </div>
      </div>
    </section>
  );
}
