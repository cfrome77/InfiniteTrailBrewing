# Infinite Trail Brewing

A modern web application built with **Next.js**, **Sanity.io**, and **Tailwind CSS**, designed as an experimental private craft beer lab, telemetry console, and digital batch log.

---

## 🧭 1. Brand & UX: The Private Lab & Digital Archive

Infinite Trail Brewing operates strictly as a non-commercial, private homebrew project. The site is structured to prioritize **scientific transparency, experimentation logbooks, and community recipe sharing**.

- **Navigational Paths:**
  - `/beers` ➔ **The Brew Log:** A chronological log of active cellar batches and historical logs.
  - `/telemetry` ➔ **Lab Telemetry:** Real-time water profile chemistry, kettle additions, and fermentation telemetry.
  - `/blog` ➔ **Lab Notes:** Detailed logs, brew day recaps, water reports, and fermentation logs.
- **The Homebrew Disclaimer:**
  A permanent visual disclaimer in the global footer alerts all visitors:
  > *Infinite Trail Brewing is a private, non-commercial homebrew project. Our beers are crafted strictly for personal documentation, educational exploration, and sharing with friends & community events. Not for commercial sale or public distribution.*
- **Geographic Coordinates:**
  Rather than standard business addresses, location is styled as geographic coordinates of origin:
  `39.414° N, 77.411° W (Frederick, MD)`

---

## 🎛️ 2. Kettle Telemetry System

Accessible via the dedicated **Lab Telemetry** page (`/telemetry`), this high-end research console visualizes live batch statuses to capture both homebrewer interest and operational-level precision.

- **Teaser Alert:** The homepage Hero section integrates a pulsing, real-time alert button (`Kettle Live Status: Sensors Online ➔ View Live Telemetry`) guiding users directly to the telemetry console.
- **3-Column SCADA-style Display:**
  1.  **Fermentation Logs (Cold-Side):** Visualizes core sensor temperatures and specific density gravity curves (OG ➔ SG ➔ Target FG).
  2.  **Water Chemistry:** Visualizes mashing pH values alongside progress bars representing ionic water concentrations (Sulfate, Chloride, Calcium).
  3.  **Timing Schedules (Hot-Side):** Lists mashing and kettle additions (hops, finings, dry hops) as a vertical Gantt-style timeline.
- **Dynamic Database-backed Fallback Engine:**
  The dashboard retrieves live data from Sanity. If a batch contains real telemetry entries (pH, gravity, or timing list), they take immediate visual precedence. If those fields are blank, the component dynamically falls back to smart, style-based deterministic calculations (e.g. mashing IPA profiles vs Stout mineral targets), keeping the site completely robust and automatic.

---

## 🗄️ 3. Extensible Sanity Schema Design

The `beer` document type in `sanity/schema/beer.ts` is fully extensible to allow a seamless future transition to a retail storefront without requiring database migrations or code rewrites.

- **Editor UI Tabs (`groups`):**
  Splits the Sanity document panel into clean horizontal tabs:
  - **Lab Specs:** Everyday brewing specs (style, ABV, IBU, tasting notes, telemetry logs).
  - **Commercial Info:** Pricing, SKU, and stock levels.
- **Conditional Visibility:**
  Root-level boolean toggle `isCommercialProduct` ("Ready for Public Sale") hides the entire commercial specifications panel in Sanity Studio unless checked, keeping the editor interface 100% clean and focused during homebrewing logs.
- **Sub-Object encapsulation:**
  All transaction metrics are nested inside `commercialSpecs { price, sku, stockCount }` to maintain a dry, modular database payload.

---

## ⚡ 4. Next.js 15 Server Performance & Tag-Based Webhooks

To keep pages "commercial-fast," data fetching has been moved from the client to Server Components, serving static pre-rendered HTML from the CDN edge cache.

- **Cache Tags:**
  Server-side fetches are tagged with cache identifiers:
  - `/beers` fetches are tagged with `['beers']`.
  - `/beers/[slug]` fetches are tagged with `['beer:slug', 'beers']`.
  - `/blog` fetches are tagged with `['posts']`.
- **API Webhook Handler (`/api/revalidate`):**
  Listen for POST requests from Sanity's Content Lake whenever a document is updated.
- **HMAC Signature Verification:**
  The handler securely authenticates requests by hashing the raw body with SHA-256 HMAC using a local `SANITY_REVALIDATE_SECRET` and matching it against the incoming `content-signature` header to block unauthenticated cache-clearing attempts.
- **Targeted Cache Invalidation:**
  Upon valid webhook ingestion, the handler calls `revalidateTag` for that specific document and category, instantly evicting stale cache blocks so the very next visit receives freshly rendered content with 0ms database latency.

---

## 🚀 Getting Started

### 1. Project Initialization

1.  **Clone and Install:**
    ```bash
    git clone <repository-url>
    cd InfiniteTrailBrewing
    npm install
    ```

2.  **Configure Environment Variables:**
    Create a `.env.local` file in the root directory and add the following:
    ```env
    # Sanity.io
    NEXT_PUBLIC_SANITY_PROJECT_ID="your-project-id"
    NEXT_PUBLIC_SANITY_DATASET="production"
    NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
    NEXT_PUBLIC_CONTACT_EMAIL="hello@yourdomain.com"
    SANITY_API_TOKEN="your-api-token"
    SANITY_REVALIDATE_SECRET="your-secure-webhook-secret"

    # Email (Resend)
    RESEND_API_KEY="your-resend-api-key"
    CONTACT_RECEIVING_EMAIL="hello@yourdomain.com"
    ```

### 2. Accessing the Admin Area
- Visit `http://localhost:3000/admin`.
- Log in using your Sanity credentials.

---

## 🧪 Testing

### Unit & Component Tests (Jest)
```bash
npm run test
```

### End-to-End Tests (Playwright)
```bash
npm run test:e2e
```
