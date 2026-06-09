# Infinite Trail Brewing

A modern web application built with **Next.js**, **Sanity.io**, **Auth.js**, and **Tailwind CSS**.

## Features

- **Next.js (App Router)**: Fast, server-side rendered, and optimized.
- **The Trail Report**: A modernized blog system with real-time search and category filtering.
- **Newsletter System**: Integrated with **Sanity** and **Resend**. Create content once and broadcast it to subscribers with one click.
- **Google Authentication**: Secure staff login via Auth.js with Sanity-based admin whitelisting.
- **Sanity.io Content Management**: Headless CMS for managing beers, blog posts, and site content.
- **Transactional Email**: Integrated with **Resend** for contact form notifications and newsletters.
- **Staff Dashboard**: Unified administrative hub at `/admin/dashboard` for managing the brewery.
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
    Create a `.env.local` file in the root directory. See `.env.example` for the full list of required variables, including:
    ```env
    # Sanity.io
    NEXT_PUBLIC_SANITY_PROJECT_ID="your_project_id"
    NEXT_PUBLIC_SANITY_DATASET="production"
    SANITY_API_TOKEN="your_token"

    # Resend
    RESEND_API_KEY="re_..."
    CONTACT_RECEIVING_EMAIL="your@email.com"

    # Authentication
    # See GOOGLE_AUTH_SETUP.md for instructions on how to get these:
    AUTH_SECRET="your_auth_secret"
    GOOGLE_CLIENT_ID="your_google_id"
    GOOGLE_CLIENT_SECRET="your_google_secret"
    ```

---

## 🛠 Staff Access & Authentication

This project uses **Google Sign-in** for staff access, managed via an **Admin Whitelist** in Sanity.

### 1. Managing Access
To grant a team member access to the admin area:
1.  Open the **Sanity Studio** (via [Sanity Manage](https://www.sanity.io/manage) or locally at `/admin/studio`).
2.  Create a new **App User (Staff)** document.
3.  Enter their **Name** and **Gmail/Google-linked Email**.
4.  Toggle the **Is Admin** switch to ON.
5.  Save the document.

### 2. Accessing the Dashboard
- Visit `/admin/dashboard`.
- You will be redirected to the `/login` page to "Continue with Google".
- Only whitelisted users with `isAdmin` enabled will be granted entry.
- From the dashboard, you can access the **Content Studio**, **Newsletter Center**, and other staff tools.

---

## 📧 The Trail Report (Blog) & Newsletter

The brewery uses a unified content system:

- **Visibility**: When creating a post, you can choose if it is **Website Only**, **Newsletter Only**, or **Both**.
- **Media**: Posts support inline images and rich text via Sanity's Portable Text.
- **Broadcast**: In the **Newsletter Center**, you can select any published post to send as a newsletter.
- **Privacy**: Newsletters are sent via **Resend** using BCC to protect subscriber privacy.
- **Compliance**: An automated `/unsubscribe` flow is included for all subscribers.

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
