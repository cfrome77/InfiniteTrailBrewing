# Infinite Trail Brewing

A modern web application built with **Next.js**, **Sanity.io**, and **Tailwind CSS**.

## Features

- **Next.js (App Router)**: Fast, server-side rendered, and optimized.
- **The Trail Report**: A modernized blog system with real-time search and category filtering.
- **Newsletter System**: Integrated with **Sanity** and **Resend**. Create content once and broadcast it to subscribers directly from the CMS.
- **Unified Admin Experience**: A single administrative hub at `/admin` powered by Sanity Studio.
- **Transactional Email**: Integrated with **Resend** for contact form notifications and newsletters.
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
    ```

---

## 🛠 Staff Access & Authentication

This project uses **Sanity.io** as the single source of truth for administrative access. No internal user lists or custom authentication logic are required in the application.

### 1. Granting Access
To give a team member access to the admin area:
1.  Go to the [Sanity Manage](https://www.sanity.io/manage) dashboard.
2.  Select your project.
3.  Go to **Team** (or **Members**) and click **Invite**.
4.  Invite them using their email and assign an appropriate role (e.g., **Administrator**, **Editor**).
5.  Once they accept, they can log in at `/admin` using their Sanity account (which supports Google Sign-in).

### 2. Accessing the Admin Area
- Visit `/admin`.
- You will be prompted to log in by Sanity.
- Once authenticated, you will see a unified Studio with tools for both **Content** (Desk) and **Newsletters**.

---

## 📧 The Trail Report (Blog) & Newsletter

The brewery uses a unified content system:

- **Visibility**: When creating a post, you can choose if it is **Website Only**, **Newsletter Only**, or **Both**.
- **Media**: Posts support inline images and rich text via Sanity's Portable Text.
- **Broadcast**: Use the **Newsletter** tool inside the Studio to select any published post and send it as a newsletter.
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
