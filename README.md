# Ahead AI

Premium AI development guide PDFs sold via Stripe checkout. Built with Next.js, Tailwind CSS, Stripe, and deployed on Railway.

**Live:** https://wholesome-creativity-production.up.railway.app
**Company:** Synairo | **Support:** contact@synairo.com

## Tech Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4** — Apple.com-inspired dark design
- **Stripe** — checkout, webhooks, promo codes
- **Prisma + PostgreSQL** — purchase tracking + email delivery status
- **Resend** — transactional email (purchase confirmations with download link)
- **Railway** — hosting (app + Postgres)

## Products

3 paths, 7 SKUs:

| Path | Starter | Growth | Complete |
|------|---------|--------|----------|
| Beginner | $19 | $39 | $99 |
| Principal Engineer | $29 | $49 | $99 |
| **Complete Bundle** | | | **$129** |

All prices have live Stripe price IDs configured in `src/lib/products.ts`.

Active promo code: `TESTMANGOMUSZTARDA67` (100% off, 10 uses max)

## Project Structure

```
src/
  app/
    page.tsx                    # Landing page (all sections)
    layout.tsx                  # Root layout + fonts + metadata
    success/page.tsx            # Post-purchase page with download CTA
    api/
      checkout/route.ts         # Creates Stripe Checkout sessions
      webhook/route.ts          # Handles checkout.session.completed, saves to DB, sends email
      download/route.ts         # Token-based PDF download (7-day expiry)
      cron/check-emails/route.ts # Hourly retry for unsent purchase emails
  components/
    Navbar.tsx                  # Fixed nav with scroll effect
    Hero.tsx                    # Hero section with CTA
    PathsOverview.tsx           # Beginner vs Principal path comparison
    Features.tsx                # Feature highlights
    PricingSection.tsx          # Tabbed pricing (Beginner | Principal | Bundle)
    PricingCard.tsx             # Individual pricing tier card
    FAQ.tsx                     # Accordion FAQ (includes refund policy)
    Footer.tsx                  # Footer with Synairo copyright + contact
  lib/
    stripe.ts                   # Lazy Stripe client init via getStripe()
    prisma.ts                   # Prisma client singleton (pg adapter)
    resend.ts                   # Email sending with success/failure tracking
    products.ts                 # 7 product definitions with Stripe price IDs
prisma/
  schema.prisma                 # Purchase model
prisma.config.ts                # Prisma config (uses DATABASE_PUBLIC_URL for migrations)
public/
  guides/
    aheadai-sample.pdf          # Test PDF placeholder (replace with real content)
```

## Local Development

```bash
# 1. Clone
git clone https://github.com/imaginaerumai/aheadai.git
cd aheadai

# 2. Install
npm install

# 3. Set up environment
cp .env.example .env
# Fill in your Stripe keys and database URL (see .env.example for details)

# 4. Generate Prisma client
npx prisma generate

# 5. Push schema to database (creates tables)
npx prisma db push

# 6. Run dev server
npm run dev
```

Open http://localhost:3000

## How It Works

### Purchase Flow
1. User picks a product on the pricing page → clicks "Get Started"
2. `POST /api/checkout` creates a Stripe Checkout session with promo codes enabled
3. User completes payment on Stripe's hosted checkout
4. Stripe fires `checkout.session.completed` webhook → `POST /api/webhook`
5. Webhook saves purchase to Postgres (`Purchase` table) with `emailSent: false`
6. Webhook attempts to send confirmation email via Resend with download link
7. If email succeeds → marks `emailSent: true`; if not → stays `false` for cron retry
8. User is redirected to `/success` page with download CTA

### Download Flow
- Download links contain a base64url-encoded token with `{email, productId, timestamp}`
- Tokens expire after 7 days
- `GET /api/download?token=...` validates token and serves PDF from `public/guides/`
- File mapping is in `PRODUCT_FILES` in `src/app/api/download/route.ts`

### Email Retry
- `GET /api/cron/check-emails` finds all purchases with `emailSent: false` and `emailAttempts < 10`
- Retries sending the confirmation email for each
- Protected by `CRON_SECRET` bearer token
- Intended to run hourly via external cron (see Production Checklist in ROADMAP.md)

## Deployment (Railway)

The app auto-deploys from the CLI:

```bash
RAILWAY_TOKEN=<your-token> railway up --service wholesome-creativity --detach
```

Build command runs: `prisma generate && prisma db push && next build`

This generates the Prisma client, syncs the DB schema, and builds the Next.js app.

## Key Files to Edit

| Task | File |
|------|------|
| Change products/prices | `src/lib/products.ts` |
| Add real PDF guides | `public/guides/` + update `PRODUCT_FILES` in `src/app/api/download/route.ts` |
| Edit landing page sections | `src/components/*.tsx` |
| Change email template | `src/lib/resend.ts` |
| Modify purchase DB schema | `prisma/schema.prisma` → run `npx prisma db push` |
| Update styling/colors | `src/app/globals.css` |

## Policies

- **Refund policy:** All sales final (non-refundable, digital product)
- **Support:** contact@synairo.com

## See Also

- [ROADMAP.md](./ROADMAP.md) — feature roadmap + **production checklist** with all TODOs
