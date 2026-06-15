# Ahead AI — Roadmap

## v1 (Current) — Landing Page + Stripe Checkout
- [x] Landing page with Apple-like design
- [x] Two paths: Beginner + Principal Engineer
- [x] 7 product SKUs (3 tiers per path + Complete Bundle)
- [x] Stripe Checkout integration (live keys wired)
- [x] Success page with download link
- [x] Email delivery via Resend (code ready, needs API key)
- [x] SEO metadata (OpenGraph, Twitter cards)
- [x] Dark mode support
- [x] Responsive design
- [x] Stripe products/prices created (7 live price IDs)
- [x] Promo code: `TESTMANGOMUSZTARDA67` (100% off, 10 uses)
- [x] Non-refundable policy in FAQ
- [x] Footer: Synairo copyright + contact@synairo.com
- [x] Test PDF download working (`public/guides/aheadai-sample.pdf`)
- [x] Purchase tracking DB (Prisma + Railway Postgres)
- [x] Webhook saves purchases + tracks email delivery
- [x] Hourly email retry endpoint (`/api/cron/check-emails`)
- [ ] Create actual PDF guide content
- [ ] Set up Resend account + verify `synairo.com` domain
- [ ] Custom domain setup (e.g. aheadai.dev)

## Production Checklist

### Railway environment variables (on `wholesome-creativity` service)
- [x] `STRIPE_SECRET_KEY` — live Stripe key (set in Railway)
- [x] `STRIPE_WEBHOOK_SECRET` — webhook signing secret (set in Railway)
- [x] `NEXT_PUBLIC_APP_URL` — `https://wholesome-creativity-production.up.railway.app`
- [x] `DATABASE_URL` — internal Postgres URL (`postgres.railway.internal:5432`)
- [x] `DATABASE_PUBLIC_URL` — public proxy URL (used by Prisma at build time)
- [x] `CRON_SECRET` — random secret for cron endpoint auth (set in Railway)
- [ ] `RESEND_API_KEY` — get from resend.com after signup
- [ ] `EMAIL_FROM` — e.g. `hello@synairo.com` (needs domain verification)

> See `.env.example` for full variable descriptions and local dev setup.

### Stripe dashboard
- [x] 7 products/prices created
- [x] Webhook endpoint → `https://wholesome-creativity-production.up.railway.app/api/webhook`
- [x] Webhook event: `checkout.session.completed`
- [x] Promo codes enabled on checkout

### Database
- [x] Railway Postgres service added to project
- [ ] Verify `Purchase` table created (first deploy with `prisma db push` will create it)

### Email retry cron (when ready)
- [ ] Set up Railway Cron Job or external cron (e.g. cron-job.org):
  - URL: `GET https://<your-domain>/api/cron/check-emails`
  - Header: `Authorization: Bearer <CRON_SECRET value from Railway env vars>`
  - Schedule: `0 * * * *` (every hour)
  - Purpose: retries unsent purchase confirmation emails (max 10 attempts per purchase)

### DNS / Domain
- [ ] Register or configure custom domain (e.g. aheadai.dev)
- [ ] Add domain to Railway service
- [ ] Update `NEXT_PUBLIC_APP_URL` to custom domain
- [ ] Update Stripe webhook URL to custom domain
- [ ] Verify domain with email provider (Resend/SendGrid) for `@synairo.com` sends

### Content
- [ ] Replace `public/guides/aheadai-sample.pdf` with real guide PDFs
- [ ] Create per-product PDF files and update `PRODUCT_FILES` map in `src/app/api/download/route.ts`
- [ ] Consider S3/R2 for file hosting if PDFs are large

## v2 — AI Chat Support
- [ ] User authentication (email + OAuth)
- [ ] AI-powered chat for Tier 2/3 + Bundle buyers
- [ ] Question quota system (limited questions per tier)
- [ ] AI answers first, escalates to human if needed
- [ ] Admin console for viewing pending chats/questions
- [ ] Chat history stored in PostgreSQL on Railway
- [ ] WhatsApp integration for human agent escalation
- [ ] Rate limiting on chat endpoints

## v3 — Content Platform
- [ ] Members area (gated content behind auth)
- [ ] Content updates delivered to existing buyers
- [ ] Blog / articles section for SEO
- [ ] Newsletter signup + drip sequences
- [ ] Affiliate/referral program
- [ ] Analytics dashboard (sales, downloads, chat usage)

## Future Ideas
- Video content / screencasts
- Community Discord/Slack integration
- Live workshop bookings
- Enterprise/team licensing
- Localization (multi-language guides)
