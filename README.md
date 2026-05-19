# Infinite Trail Brewing

Welcome to the Infinite Trail Brewing web application.

### 🚀 Neon, Resend, & Substack Migration Guide

To complete the transition to the new architecture, please follow these manual steps:

#### 1. Configure Environment Variables
Add the following variables to your **Vercel Dashboard**:
- `DATABASE_URL`: Your Neon Postgres connection string.
- `SUBSTACK_FEED_URL`: The public RSS feed URL for your Substack (e.g., `https://yourname.substack.com/feed`).
- `RESEND_API_KEY`: Your API key from Resend.
- `CONTACT_RECEIVING_EMAIL`: The email address where you want to receive contact form submissions.
- `BETTER_AUTH_SECRET`: A random 32-character string (generate with `openssl rand -base64 32`).
- `BETTER_AUTH_URL`: Your production URL (e.g., `https://infinitetrail.vercel.app`).

#### 2. Local Setup & Database Push
Run these commands in your local terminal to sync your environment and push the schema to Neon:
```bash
# Pull the latest environment variables from Vercel
vercel env pull .env.local

# Push the Prisma schema (including Better Auth tables) to your Neon database
npx prisma db push
```

#### 3. Testing Note (Resend)
If you are using a Resend free tier account, remember that by default you can only send emails to the email address you signed up with. To send to other domains, you must verify your custom domain in the Resend dashboard.

### 🔑 Authentication & Admin
- After pushing the schema, register your first user through the UI.
- Manually set the `role` to `admin` in your database to access the Beer management panel:
  ```sql
  UPDATE "user" SET role = 'admin' WHERE email = 'your-email@example.com';
  ```
