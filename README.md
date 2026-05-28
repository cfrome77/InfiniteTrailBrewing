# Infinite Trail Brewing

A modern web application built with **Next.js 15**, **Sanity.io**, and **Tailwind CSS**.

## Features

- **Next.js 15 (App Router)**: Fast, server-side rendered, and optimized with React 19 support.
- **Sanity.io Content Management**: Headless CMS for managing beers, blog posts, and site stats.
- **Server Actions Architecture**: Secure, type-safe data mutations using Next.js Server Actions.
- **Transactional Email**: Integrated with **Resend** for reliable contact form notifications.
- **Admin Dashboard**: Custom management interface with an embedded **Sanity Studio** at `/admin/studio`.
- **Responsive UI**: Built with Tailwind CSS and Lucide icons.

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
    NEXT_PUBLIC_SANITY_PROJECT_ID="your_project_id"
    NEXT_PUBLIC_SANITY_DATASET="production"
    SANITY_API_TOKEN="your_write_token"

    # Security
    ADMIN_PASSWORD="your_secure_password"

    # Email (Resend)
    RESEND_API_KEY="your_resend_key"
    CONTACT_RECEIVING_EMAIL="hello@yourdomain.com"
    ```

---

## 🛠 Sanity.io Setup (Step-by-Step)

Since you have already created a Sanity project, follow these steps to fully integrate it with the app:

### 1. Get your Project ID
Find your `projectId` in the [Sanity Manage](https://www.sanity.io/manage) dashboard. Add it to `NEXT_PUBLIC_SANITY_PROJECT_ID`.

### 2. Configure CORS Settings
To allow the local development server and your production domain to communicate with Sanity:
1.  Go to **Settings > API settings** in the Sanity dashboard.
2.  Under **CORS origins**, click **Add CORS origin**.
3.  Add `http://localhost:3000`. Check **Allow credentials**.
4.  Add your production URL (e.g., `https://your-app.vercel.app`) once deployed.

### 3. Create a Write Token
The custom admin UI uses Server Actions to update Sanity. This requires a token with write access:
1.  Go to **Settings > API settings > Tokens**.
2.  Click **Add new token**.
3.  Give it a name (e.g., "Web App Write Token") and select the **Editor** role.
4.  Copy the token and add it to `SANITY_API_TOKEN`.

### 4. Accessing the Studio
This project includes an **Embedded Sanity Studio**. You don't need to run a separate command.
- Visit `http://localhost:3000/admin/studio` (requires login) to see the full CMS interface.
- The schema is automatically synchronised from the `sanity/schema/` directory in this codebase.

---

## 🔐 Admin Management

The dashboard at `/admin` provides a streamlined interface for common tasks:

-   **Beer Management**: Quickly update the tap list, brewing status, and flagship status.
-   **Blog Posts**: Manage stories and news.
-   **Sanity Studio**: Full access to the raw data and configuration.

### Security
Access to `/admin` and all data mutations (Server Actions) is protected by the `ADMIN_PASSWORD`. Ensure this is set to a strong value in production.

---

## 📧 Contact Form & Resend

While Sanity handles all site content, **Resend** is used exclusively for the contact form.
- **Why?** Sanity is a database/CMS, not an email provider. Resend ensures that when a user fills out the form, an email is actually delivered to your inbox.
- Ensure your `RESEND_API_KEY` is configured and your domain is verified in the Resend dashboard if using a custom domain.

---

## 💻 Local Development

Run the development server:
```bash
npm run dev
```

The site will be available at `http://localhost:3000`.

---

## 🧪 Testing

This project includes unit and component tests with **Jest** and end-to-end tests with **Playwright**.

### Unit & Component Tests
Run tests with Jest:
```bash
npm run test
```

### End-to-End Tests
Run E2E tests with Playwright:
```bash
npm run test:e2e
```
*Note: The E2E tests will automatically start the development server if it's not already running.*
- **Public Site**: Home, Beers, Blog, Our Story, Contact.
- **Staff Access**: `/login` (enter your `ADMIN_PASSWORD`).
