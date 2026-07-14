# PS Laboratories — B2B Website

Professional B2B website for **PS Laboratories**, an Indian ISO 9001:2015 manufacturer of pharmaceutical reference standards, impurities, and custom-synthesized compounds.

**Stack:** Next.js 15 (App Router) + TypeScript + Tailwind CSS  
**Deploy target:** Vercel (free tier)  
**Form backend:** Web3Forms

---

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and paste your Web3Forms access key (see "Environment Variables" below)

# Run development server
npm run dev
# → http://localhost:3000
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `WEB3FORMS_ACCESS_KEY` | Yes | Access key from [Web3Forms](https://web3forms.com) (free, no credit card) |

### Getting a Web3Forms Key

1. Go to [web3forms.com](https://web3forms.com)
2. Sign up (free, takes ~30 seconds)
3. Create a new form — you'll get an access key
4. Paste it into `.env.local`:
   ```
   WEB3FORMS_ACCESS_KEY=your_key_here
   ```

The key is used **server-side** only — the website proxies all form submissions through a Next.js Route Handler (`/api/enquiry`) so your key is never exposed to browsers.

## Data Files

- `src/data/catalog.json` — ~1,140 product entries (copied from project root on build)
- `src/data/company-info.json` — Company information, registrations, expertise areas

### Catalog Data Quality

The catalog was OCR-extracted from a scanned PDF and is ≈90% clean. Known issues:

- **~107 entries** where `synonyms_iupac` ends with what appears to be the **next product's name** (extraction artifact from the PDF's two-column layout)
- **~16 entries** containing "PageN" markers from the PDF extraction
- **~73 entries** with very long names (60+ characters) that may contain overflow text
- Molecular formula and molecular weight are **not available** in the source data — displayed as "Data not yet available" on product pages

### Running the Cleaning Script

```bash
npm run clean-catalog
```

This generates `scripts/data-warnings.log` with detailed warnings and product family groupings for manual review. It does **not** modify the catalog — it only flags potential issues.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx           # Root layout (header, footer, enquiry context)
│   ├── page.tsx             # Home page
│   ├── about/page.tsx       # About Us
│   ├── products/
│   │   ├── page.tsx         # Product catalog (search + pagination)
│   │   └── [id]/page.tsx    # Product detail (SSG for all 1,140 products)
│   ├── enquiry/page.tsx     # Enquiry cart + form
│   ├── request-quote/page.tsx  # Standalone quote request
│   ├── services/page.tsx    # Services / Expertise
│   ├── contact/page.tsx     # Contact form + map
│   ├── legal/privacy/page.tsx  # Privacy Policy
│   ├── api/enquiry/route.ts # Form submission API (Web3Forms proxy)
│   ├── sitemap.ts           # Auto-generated sitemap
│   └── robots.ts            # Robots.txt configuration
├── components/
│   ├── Header.tsx           # Site header with cart badge
│   ├── Footer.tsx           # Site footer
│   ├── AddToEnquiryButton.tsx  # "Add to Enquiry" button
│   └── JsonLd.tsx           # JSON-LD structured data component
├── context/
│   └── EnquiryContext.tsx   # Enquiry cart (React Context + localStorage)
├── data/
│   ├── catalog.json         # Product catalog
│   └── company-info.json    # Company information
└── types/
    └── index.ts             # TypeScript type definitions
```

## Features

### Product Catalog
- **1,140+ products** statically generated at build time
- **Client-side search** using Fuse.js (fuzzy matching on name, CAS no, product code)
- **Pagination** (36 products per page)
- **Product detail pages** with structured data (JSON-LD) for SEO
- **Related products** grouped by parent compound prefix

### Enquiry / Quote Flow
- **Client-side cart** (React Context, persisted to localStorage)
- **Request a Quote** standalone form for custom synthesis enquiries
- All forms submit through a **server-side API route** (Web3Forms proxy)
- **Honeypot spam protection** + in-memory **rate limiting** (5 req/min per IP)

### SEO & Performance
- Statically generated product pages (SSG with `generateStaticParams`)
- JSON-LD structured data (Product schema)
- Auto-generated `sitemap.xml` covering all 1,148+ pages
- `robots.txt`
- Semantic HTML, responsive design, accessible forms

### Security Headers
- Content-Security-Policy (restrictive)
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy (minimal)

## Key Design Decisions

- **No database** — product data is imported at build time from JSON files
- **No payment/checkout** — this industry runs on quote-then-invoice (matching Chemicea's pattern)
- **No prices** — PS Laboratories doesn't publish pricing; every product page pushes toward "Request a Quote"
- **Expired ISO certificate** — displayed with a "renewal in progress" note rather than as an active badge
- **Molecular formula/weight** — left blank as "Data not yet available" since the source PDF didn't include them

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variable in Vercel dashboard:
# Settings → Environment Variables → WEB3FORMS_ACCESS_KEY
```

The project requires zero Vercel-specific configuration — Next.js handles everything.

### Adding a Custom Domain

1. Purchase a domain (e.g., from Namecheap, GoDaddy, or your registrar)
2. In Vercel dashboard, go to your project → **Settings** → **Domains**
3. Add your domain and follow Vercel's DNS configuration instructions
4. Update `metadataBase` in `src/app/layout.tsx` and URLs in `src/app/sitemap.ts` and `src/app/robots.ts` to use your actual domain
5. Update `NEXT_PUBLIC_SITE_URL` in `.env.local`

### Updating Product Data

If `catalog.json` changes:

1. Replace the file at the project root
2. Copy to `src/data/catalog.json`:
   ```bash
   cp catalog.json src/data/catalog.json
   ```
3. Re-run the cleaning script:
   ```bash
   npm run clean-catalog
   ```
4. Rebuild:
   ```bash
   npm run build
   ```
5. Re-deploy

## Placeholders & Items To Customize

| Item | Status | Action Needed |
|------|--------|---------------|
| **Featured products** (homepage) | Placeholder — first 8 products | Update manual selection logic |
| **Web3Forms key** | Stub in `.env.example` | Get a free key from web3forms.com, set `WEB3FORMS_ACCESS_KEY` |
| **ISO 9001:2015 badge** | Certificate expired 20/05/2025 — shown with "renewal in progress" note | Confirm renewal status with the owner, update display |
| **Molecular formula / weight** | Not in source data — shown as "Data not yet available" | Manually populate if data becomes available |
| **Google Maps embed** | Uses `https://www.google.com/maps/embed?` with approximate coordinates | Replace with exact coordinates for the Valsad address |
| **Domain** | `metadataBase` set to `https://pslaboratories.in` | Update when custom domain is purchased |
| **Privacy Policy** | Template text | Have it reviewed by a legal professional before relying on it |
| **Rate limiting** | Simple in-memory limiter | Consider [Upstash Redis](https://upstash.com) + `@upstash/ratelimit` if traffic grows |
| **Catalog data quality** | ~196 warnings flagged | Review `scripts/data-warnings.log` for manual edits needed |

## Lighthouse Score Targets

The project is designed to achieve 90+ across Performance, Accessibility, Best Practices, and SEO. To verify locally:

```bash
npx lighthouse http://localhost:3000 --view --preset=desktop
npx lighthouse http://localhost:3000/products/ACY100 --view --preset=desktop
```

## Validation Checklist

- [ ] `npm run build` — zero errors/warnings
- [ ] `npm run lint` — clean
- [ ] `npm audit` — no high-severity findings (or flagged for review)
- [ ] All product pages (1,140+) statically generated
- [ ] Search works client-side
- [ ] Enquiry cart persists across page navigation
- [ ] Forms validate and submit via API route
- [ ] Responsive layout on mobile/tablet/desktop
- [ ] No inline `eval()` or `dangerouslySetInnerHTML` in application code
- [ ] No `.env.local` or secrets in version control

---

Built with [Next.js](https://nextjs.org) — deployed on [Vercel](https://vercel.com).
