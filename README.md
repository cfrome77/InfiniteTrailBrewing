# Infinite Trail Brewing

A modern web application built with **Next.js**, **Sanity.io**, and **Tailwind CSS**.

## Features

- **Next.js (App Router)**: Fast, server-side rendered, and optimized.
- **Sanity.io Content Management**: Headless CMS for managing beers, blog posts, and site stats.
- **Sanity Auth**: Secure, project-based authentication handled natively by Sanity.
- **Transactional Email**: Integrated with **Resend** for reliable contact form notifications.
- **Embedded Sanity Studio**: CMS interface accessible directly at `/admin`.
- **Testing**: Comprehensive suite with **Jest** and **Playwright**.

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

    # Email (Resend)
    RESEND_API_KEY="your-resend-api-key"
    CONTACT_RECEIVING_EMAIL="hello@yourdomain.com"
    ```

---

## 🛠 Sanity.io Setup & Auth

This project uses **Sanity Auth** for content management. No custom password logic is required.

### 1. Invite Users
To give someone access to manage the site:
1.  Go to the [Sanity Manage](https://www.sanity.io/manage) dashboard.
2.  Select your project.
3.  Go to **Team** (or **Members**) and click **Invite**.
4.  Assign a role (e.g., **Administrator**, **Editor**, or **Viewer**).

### 2. Accessing the Admin Area
- Visit `http://localhost:3000/admin`.
- You will be prompted to log in with your Sanity account.
- Once authenticated, you can manage Beers, Blog Posts, and other content directly within the embedded Studio.

### 3. Configure CORS Settings
Ensure your application can communicate with Sanity:
1.  Go to **Settings > API settings** in the Sanity dashboard.
2.  Under **CORS origins**, click **Add CORS origin**.
3.  Add `http://localhost:3000` (and your production URL later).
4.  Check **Allow credentials**.

---

## 💻 Local Development vs. Production

Sanity.io allows you to separate your data between environments using **Datasets**.

### 1. Create a Development Dataset
To avoid "messing up" your live data during testing:
1.  In the Sanity Dashboard, go to **Datasets**.
2.  Click **Create dataset**.
3.  Name it `development` (or similar) and choose **Public** or **Private** as per your needs.

### 2. Switching Datasets Locally
In your `.env.local` file, change the `NEXT_PUBLIC_SANITY_DATASET` variable:
```env
# For local testing:
NEXT_PUBLIC_SANITY_DATASET="development"

# For live data:
NEXT_PUBLIC_SANITY_DATASET="production"
```

### 3. How it Works
- The **Embedded Studio** at `/admin` is just a user interface.
- It will load and save data to whichever dataset is specified in your environment variables.
- If you are running the app locally on `localhost:3000` with `development` dataset configured, any changes you make in the Studio will **only** affect the `development` dataset.
- The **Sanity.io Web Interface** (sanity.io/manage) allows you to browse all your datasets in one place.

---

## ⚙️ Environment Stability

To prevent `next-env.d.ts` from fluctuating between `dev` and `build` modes (due to mode-dependent route type imports), this project uses an automated stabilization mechanism:

- **Custom Dev Script:** `npm run dev` executes `scripts/dev.js`, which wraps `next dev` and restores `next-env.d.ts` to a stable state upon exit.
- **Post-Build Hook:** A `postbuild` script automatically cleans `next-env.d.ts` after production builds.
- **TypeScript Config:** Mode-dependent types are explicitly included in `tsconfig.json` to maintain full type safety without requiring tracked changes in `next-env.d.ts`.

## 🧪 Testing

### Unit & Component Tests (Jest)
```bash
npm run test
```

### End-to-End Tests (Playwright)
```bash
npm run test:e2e
```

---

## 📧 Contact Form & Resend

**Resend** is used exclusively for the contact form.
1. Get an API key from [resend.com](https://resend.com).
2. Add it to your environment variables:
   - `RESEND_API_KEY`
   - `CONTACT_RECEIVING_EMAIL`
