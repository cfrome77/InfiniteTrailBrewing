# Infinite Trail Brewing

A modern web application built with Next.js, Sanity.io, and Tailwind CSS.

## Features

- **Next.js 15 (App Router)**: Fast, server-side rendered, and optimized.
- **Sanity.io Content Management**: Backend management for beers and blog posts.
- **Server Actions Architecture**: Secure data mutations using Next.js Server Actions.
- **Resend**: Transactional email delivery for the contact form.
- **Tailwind CSS**: Utility-first styling for a beautiful and responsive UI.
- **Admin Panel**: Secure interface for managing content, including an embedded Sanity Studio.

## Sanity.io Setup

This project uses Sanity.io for backend content management.

1.  **Create a Sanity Project:**
    Go to [sanity.io/manage](https://sanity.io/manage) and create a new project.

2.  **Configure Environment Variables:**
    Update your `.env.local` (and Vercel environment variables) with your Sanity credentials:
    ```env
    NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
    NEXT_PUBLIC_SANITY_DATASET=production
    SANITY_API_TOKEN=your_token_with_write_access
    ```

3.  **Deploy Schema:**
    The schema is defined in the `sanity/` directory and integrated into the Next.js app. You can manage content directly via the embedded Sanity Studio at `/admin/studio`.

## Admin Management

The Admin Dashboard is accessible at `/admin`.

- **Security**: Access is protected by a password defined in the `ADMIN_PASSWORD` environment variable.
- **Beer Management**: Manage your tap list and archive.
- **Blog Posts**: Write and publish stories.
- **Sanity Studio**: Access the full Sanity Studio interface at `/admin/studio`.

## Contact Form

The contact form uses **Resend** for email delivery. While Sanity handles the content for the rest of the site, Resend is still required to ensure you receive notifications when someone reaches out via the contact form.

Configure your Resend API key and the receiving email address in your environment variables:
- `RESEND_API_KEY`
- `CONTACT_RECEIVING_EMAIL`
