# وب‌سایت + حساب کاربری + پنل مدیریت اِنو دیجیتال (Next.js standalone)
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# آدرس عمومی سایت در صفحات ایستای ساخته‌شده (canonical) نوشته می‌شود
ARG APP_URL=https://enodigital.ir
ARG NEXT_PUBLIC_FORM_ENDPOINT=
ENV APP_URL=$APP_URL NEXT_PUBLIC_FORM_ENDPOINT=$NEXT_PUBLIC_FORM_ENDPOINT
RUN npm run build

FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
RUN addgroup -S app && adduser -S app -G app
COPY --from=build --chown=app:app /app/.next/standalone ./
COPY --from=build --chown=app:app /app/.next/static ./.next/static
COPY --from=build --chown=app:app /app/public ./public
# migration و دادهٔ اولیه هنگام شروع
COPY --from=build --chown=app:app /app/drizzle ./drizzle
COPY --from=build --chown=app:app /app/scripts/db-setup.mjs ./scripts/db-setup.mjs
COPY --from=deps --chown=app:app /app/node_modules/drizzle-orm ./node_modules/drizzle-orm
USER app
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s CMD wget -qO- http://127.0.0.1:3000/api/plans/ >/dev/null || exit 1
CMD ["sh", "-c", "node scripts/db-setup.mjs && node server.js"]
