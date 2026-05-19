# Infinite Trail Brewing

Welcome to the Infinite Trail Brewing web application. This project has been migrated from Supabase to a modern stack using Neon Postgres, Prisma, Better Auth, Substack, and Resend.

## 🛠 Local vs. Production Workflow

| Feature | Local Development (`.env.local`) | Production (Vercel) |
| :--- | :--- | :--- |
| **Database** | Use a local Postgres instance or a Neon dev branch. | Uses production Neon pooled connection. |
| **Auth** | `BETTER_AUTH_URL` should be `http://localhost:3000`. | `BETTER_AUTH_URL` matches your production domain. |
| **Blog/Newsletter** | Pulls from `SUBSTACK_FEED_URL`. | Pulls from same `SUBSTACK_FEED_URL`. |
| **Contact Form** | **Resend Sandbox:** Limited to verified email. | **Verified Domain:** Full delivery capabilities. |

### Environment Variable Management
You do **not** need to update your variables every time you switch. Instead:
1.  **Production:** Set your production values in the **Vercel Dashboard**.
2.  **Local Development:** Create a `.env.local` file in your root directory. Next.js will automatically prioritize values in `.env.local` over other `.env` files when running locally. **Never commit your `.env.local` file.**

---

### 🚀 Migration & Setup Guide

#### 1. Configure Environment Variables
Copy `.env.example` to `.env.local` and fill in the values for your local environment:
- `DATABASE_URL`: Your local or dev Postgres connection string.
- `SUBSTACK_FEED_URL`: The public RSS feed URL for your Substack.
- `SUBSTACK_URL`: The URL of your Substack home page.
- `NEXT_PUBLIC_SUBSTACK_URL`: Same as above (for client-side links).
- `RESEND_API_KEY`: Your API key from Resend.
- `CONTACT_RECEIVING_EMAIL`: Where you want to receive contact submissions.
- `BETTER_AUTH_SECRET`: Generate with `openssl rand -base64 32`.
- `BETTER_AUTH_URL`: `http://localhost:3000` (for local dev).
- `NEXT_PUBLIC_APP_URL`: `http://localhost:3000` (for local dev).

#### 2. Local Setup & Database Push
Run these commands to sync your environment and push the schema:
```bash
# Push the Prisma schema to your local/dev database
npx prisma db push

# Generate the Prisma client
npx prisma generate
```

#### 3. 🔑 Authentication & Admin Setup
- Register your first user through the `/login` or sign-up flow.
- Manually set the `role` to `admin` in your database:
  ```sql
  UPDATE "user" SET role = 'admin' WHERE email = 'your-email@example.com';
  ```

#### 4. Resend Note (Free Tier)
If you are using a Resend free tier account, remember that by default you can only send emails to the email address you signed up with. To send to other domains, you must verify your custom domain in the Resend dashboard.
