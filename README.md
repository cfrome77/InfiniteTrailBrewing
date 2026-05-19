# Infinite Trail Brewing

Welcome to the Infinite Trail Brewing web application. This project has been migrated from Supabase to a modern stack using Neon Postgres, Prisma, Better Auth, Substack, and Resend.

## 🛠 Local vs. Production Workflow

| Feature | Local Development | Production (Vercel/Neon) |
| :--- | :--- | :--- |
| **Database** | Use a local Postgres instance or a Neon development branch. `DATABASE_URL` in `.env` should point to your local/dev DB. | Uses the production Neon pooled connection string. Managed via Vercel environment variables. |
| **Auth** | `BETTER_AUTH_URL` should be `http://localhost:3000`. No HTTPS required. | `BETTER_AUTH_URL` must match your production domain (HTTPS required). |
| **Blog/Newsletter** | Pulls from your Substack RSS feed via `SUBSTACK_FEED_URL`. Works identically to production. | Pulls from the same Substack feed. Ensure `SUBSTACK_FEED_URL` is set in Vercel. |
| **Contact Form** | **Resend Sandbox:** Unless you verify a domain, you can only send emails to the address associated with your Resend account. | **Verified Domain:** You must verify your domain in the Resend dashboard to send emails to external addresses. |

---

### 🚀 Migration & Setup Guide

To complete the transition to the new architecture, please follow these steps:

#### 1. Configure Environment Variables
Copy `.env.example` to `.env` and fill in the values. For production, add these to your **Vercel Dashboard**:
- `DATABASE_URL`: Your Neon Postgres connection string.
- `SUBSTACK_FEED_URL`: The public RSS feed URL for your Substack (e.g., `https://yourname.substack.com/feed`).
- `SUBSTACK_URL`: The URL of your Substack home page.
- `NEXT_PUBLIC_SUBSTACK_URL`: Same as above (for client-side links).
- `RESEND_API_KEY`: Your API key from Resend.
- `CONTACT_RECEIVING_EMAIL`: The email address where you want to receive contact form submissions.
- `BETTER_AUTH_SECRET`: A random 32-character string (generate with `openssl rand -base64 32`).
- `BETTER_AUTH_URL`: Your site URL (e.g., `http://localhost:3000` or `https://your-app.vercel.app`).

#### 2. Local Setup & Database Push
Run these commands to sync your environment and push the schema:
```bash
# Push the Prisma schema (including Better Auth tables) to your database
npx prisma db push

# Generate the Prisma client
npx prisma generate
```

#### 3. 🔑 Authentication & Admin Setup
- Register your first user through the `/login` or sign-up flow.
- Manually set the `role` to `admin` in your database to access the Beer management panel:
  ```sql
  UPDATE "user" SET role = 'admin' WHERE email = 'your-email@example.com';
  ```

#### 4. Resend Note (Free Tier)
If you are using a Resend free tier account, remember that by default you can only send emails to the email address you signed up with. To send to other domains, you must verify your custom domain in the Resend dashboard.
