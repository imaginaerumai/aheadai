# Ahead AI

Premium AI development guide PDFs sold via Stripe checkout. Built with Next.js, Tailwind CSS, Stripe, and deployed on Railway.

**Live:** https://wholesome-creativity-production.up.railway.app
**Company:** Synairo | **Support:** contact@synairo.com

## Tech Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4** — Apple.com-inspired dark design
- **Stripe** — checkout, webhooks, promo codes
- **Prisma + PostgreSQL** — purchase tracking, download tokens, email delivery status
- **nodemailer (SMTP)** — transactional email (purchase confirmations with download link)
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
    success/page.tsx            # Post-purchase page — fetches download URL dynamically
    api/
      checkout/route.ts         # Creates Stripe Checkout sessions
      webhook/route.ts          # Handles checkout.session.completed, saves to DB, sends email
      download/route.ts         # UUID token-based PDF download (configurable limit + expiry)
      purchase-status/route.ts  # Returns download URL for a Stripe session (used by success page)
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
    resend.ts                   # SMTP email sending via nodemailer
    products.ts                 # 7 product definitions with Stripe price IDs
guides-private/                 # ← PUT YOUR PDF FILES HERE (see below)
  aheadai-sample.pdf            # Test placeholder — replace with real guides
prisma/
  schema.prisma                 # Purchase model
prisma.config.ts                # Prisma config (uses DATABASE_PUBLIC_URL for migrations)
```

## How to Upload Guide Files

### Step 1: Add PDF files

Put your PDF files into the `guides-private/` folder at the project root:

```
guides-private/
  beginner-starter.pdf
  beginner-growth.pdf
  beginner-complete.pdf
  principal-starter.pdf
  principal-growth.pdf
  principal-complete.pdf
```

This folder is **private** — files are NOT served by Next.js and cannot be accessed via URL. They are only served through the authenticated download endpoint after purchase verification.

### Step 2: Update the file mapping

Edit `src/app/api/download/route.ts` — the `PRODUCT_FILES` constant at the top of the file:

```ts
const PRODUCT_FILES: Record<string, string[]> = {
  "beginner-starter": ["beginner-starter.pdf"],
  "beginner-growth": ["beginner-growth.pdf"],
  "beginner-complete": ["beginner-complete.pdf"],
  "principal-starter": ["principal-starter.pdf"],
  "principal-growth": ["principal-growth.pdf"],
  "principal-complete": ["principal-complete.pdf"],
  // Bundle: list ALL files — they'll be zipped together automatically
  "complete-bundle": [
    "beginner-complete.pdf",
    "principal-complete.pdf",
  ],
};
```

The **left side** (e.g. `"beginner-starter"`) is the product ID — these are fixed and must match the IDs in `src/lib/products.ts`. Do NOT change them.

The **right side** is an array of filenames inside `guides-private/`. For bundles, list all PDFs the buyer should receive — they are automatically packaged as a `.zip`.

### Step 3: Commit and deploy

```bash
git add guides-private/ src/app/api/download/route.ts
git commit -m "add real guide PDFs"
git push origin main
RAILWAY_TOKEN=<your-token> railway up --service wholesome-creativity --detach
```

## How It Works

### Purchase Flow
1. User picks a product on the pricing page → clicks "Get Started"
2. `POST /api/checkout` creates a Stripe Checkout session with promo codes enabled
3. User completes payment on Stripe's hosted checkout
4. Stripe fires `checkout.session.completed` webhook → `POST /api/webhook`
5. Webhook saves purchase to Postgres with a unique UUID download token (15 downloads max, 90-day expiry)
6. Webhook sends confirmation email via SMTP with download link
7. If email fails → stays `emailSent: false` for cron retry (up to 10 attempts)
8. User is redirected to `/success?session_id=...` which fetches their download URL dynamically

### Download Flow
- Each purchase gets a **unique UUID token** stored in the database
- `GET /api/download?token=<uuid>` validates the token, checks expiry + download count, then serves the file
- Single file → serves PDF directly
- Multiple files (bundle) → serves as `.zip` via JSZip
- On error (expired, limit reached, invalid) → shows a branded HTML error page with support contact and "Back to Home" link

### Success Page
- Calls `GET /api/purchase-status?session_id=cs_xxx` to fetch the download URL
- Polls every 1.5s for up to ~15 seconds in case the webhook hasn't fired yet
- Download URL is **never in the server-rendered HTML** — fetched client-side only

### Email Retry
- `GET /api/cron/check-emails` finds all purchases with `emailSent: false` and `emailAttempts < 10`
- Retries sending the confirmation email for each
- Protected by `CRON_SECRET` bearer token
- Intended to run hourly via external cron (see Production Checklist in ROADMAP.md)

## Configuration (Environment Variables)

| Variable | Purpose | Default |
|----------|---------|---------|
| `DOWNLOAD_LIMIT` | Max downloads per purchase link | `15` |
| `DOWNLOAD_EXPIRY_DAYS` | Download link expiry in days | `90` |
| `STRIPE_SECRET_KEY` | Stripe API key | — |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | — |
| `DATABASE_URL` | PostgreSQL connection string | — |
| `DATABASE_PUBLIC_URL` | Public DB URL for Prisma migrations (Railway) | — |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | SMTP server credentials | — |
| `EMAIL_FROM` | Sender address | `noreply@synairo.com` |
| `NEXT_PUBLIC_APP_URL` | App's public URL (used in email links) | `http://localhost:3000` |
| `CRON_SECRET` | Protects the email retry endpoint | — |

See `.env.example` for full documentation.

## Local Development

```bash
# 1. Clone
git clone https://github.com/imaginaerumai/aheadai.git
cd aheadai

# 2. Install
npm install

# 3. Set up environment
cp .env.example .env
# Fill in your Stripe keys and database URL

# 4. Generate Prisma client
npx prisma generate

# 5. Push schema to database (creates tables)
npx prisma db push

# 6. Run dev server
npm run dev
```

Open http://localhost:3000

## Deployment (Railway)

```bash
RAILWAY_TOKEN=<your-token> railway up --service wholesome-creativity --detach
```

Build command: `prisma generate && prisma db push --accept-data-loss && next build`

## Key Files to Edit

| Task | File |
|------|------|
| Add/replace PDF guides | `guides-private/` + `PRODUCT_FILES` in `src/app/api/download/route.ts` |
| Change products/prices | `src/lib/products.ts` |
| Edit landing page sections | `src/components/*.tsx` |
| Change email template | `src/lib/resend.ts` |
| Modify purchase DB schema | `prisma/schema.prisma` → run `npx prisma db push` |
| Change download limits | Set `DOWNLOAD_LIMIT` env var (default 15) |
| Update styling/colors | `src/app/globals.css` |

## Policies

- **Refund policy:** All sales final (non-refundable, digital product)
- **Support:** contact@synairo.com

## See Also

- [ROADMAP.md](./ROADMAP.md) — feature roadmap + **production checklist** with all TODOs
