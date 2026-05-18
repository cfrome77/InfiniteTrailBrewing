# Documentation
Migrated to Neon and Better Auth.

## 📋 Manual Transition Checklist

To complete the migration and ensure everything works correctly, please follow these manual steps:

### 1. Configure Substack RSS
- Ensure your Substack is public.
- The RSS feed will be at `https://yourname.substack.com/feed`.
- Set the `SUBSTACK_URL` environment variable to `https://yourname.substack.com`.

### 2. Vercel Environment Variables
Add these to your Vercel Project Settings:
- `DATABASE_URL`: Your Neon connection string.
- `BETTER_AUTH_SECRET`: Generate with `openssl rand -base64 32`.
- `BETTER_AUTH_URL`: Your production URL (e.g., `https://infinitetrail.vercel.app`).
- `NEXT_PUBLIC_APP_URL`: Same as `BETTER_AUTH_URL`.
- `SUBSTACK_URL`: Your Substack URL.

### 3. Setup First Admin User
1. Register a new account on your deployed site at `/login` (if you implement a signup) or use the Better Auth API.
2. In the Neon Console SQL Editor, run:
   ```sql
   UPDATE "user" SET role = 'admin' WHERE email = 'your-email@example.com';
   ```
3. This grants you access to the Beer Management panel at `/admin`.

### 4. Database Schema
Ensure the following tables exist in your Neon `public` schema:
- `currently_brewing`
- `contact_submissions`
- `user`, `session`, `account`, `verification` (Better Auth tables)
