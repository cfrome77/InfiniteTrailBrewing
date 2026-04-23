# My Next.js Project

A modern web application built with Next.js, Supabase, and Tailwind CSS.

## Features

- **Next.js 15+ (App Router)**: Fast, server-side rendered, and optimized.
- **Supabase Auth & Database**: Seamless authentication and real-time database capabilities.
- **Tailwind CSS**: Utility-first styling for a beautiful and responsive UI.
- **Admin Panel**: Secure interface for managing beers and blog posts.

## Supabase Workflow

This project is designed to use a local Docker-based Supabase environment for development and the official Supabase Cloud for production.

### Phase 1: Local Environment Setup

This ensures you have a private playground that doesn't touch your live site.

1.  **Install Supabase CLI:**
    If you haven't already, install the Supabase CLI:
    ```bash
    npm install supabase --save-dev
    ```

2.  **Start Supabase (Requires Docker):**
    ```bash
    npx supabase start
    ```
    This will output your local credentials. Keep them handy.

3.  **Configure `.env.local`:**
    Copy the local credentials into your `.env.local` file:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_local_anon_key
    SUPABASE_SERVICE_ROLE_KEY=your_local_service_role_key
    ```

4.  **Initialize Database & Seed Data:**
    Apply migrations and seed the database with a test admin user:
    ```bash
    npx supabase db reset
    ```
    - **Local Admin Login:** `admin@local.test` / `password123`

### Phase 2: Production Setup

Connect your local code to the real Supabase Cloud project.

1.  **Link to the Cloud:**
    Get your Project ID from the Supabase Dashboard and run:
    ```bash
    npx supabase link --project-ref your_project_id
    ```

2.  **Configure Vercel Environment Variables:**
    Add your production keys to Vercel:
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - `SUPABASE_SERVICE_ROLE_KEY`
    - `SUPABASE_PROJECT_ID`
    - `SUPABASE_ACCESS_TOKEN`

3.  **Push the Schema:**
    Sync your local table structures and RLS policies to the live database:
    ```bash
    npx supabase db push
    ```
    *Note: This does not push your `seed.sql`. Your live DB remains clean of test data.*

### Phase 3: The Development Cycle

1.  **Develop Locally:**
    Run `npm run dev` to work on the UI. Use the local Admin UI (`/login`) to manage beers and blog posts in your local database.

2.  **Schema Updates:**
    If you need a new table or column:
    ```bash
    npx supabase migration new your_feature_name
    ```
    Edit the generated file in `supabase/migrations`, then run `npx supabase db reset` to test.

3.  **Deploy:**
    - Push code to GitHub/Vercel for frontend updates.
    - Run `npx supabase db push` to apply database changes to production.

## Admin Management

The Admin Panel is accessible at `/admin`.

- **Access Control:** Only users with the `admin` role in their metadata can access these routes.
- **Beers & Blog:** Use the "Admin" dropdown in the navbar after logging in to manage the "Currently Brewing" list and "Blog Posts".
- **Local Dev:** Use the seeded admin user (`admin@local.test`).
- **Production Admin Setup:** Since this is a private home brewery site, the most secure way to add yourself as the admin is through the **Supabase Dashboard**:

  1. Go to **Authentication > Users** and click **Add User**.
  2. Create your account with your email and password.
  3. Once created, go to the **SQL Editor** and run the following to promote yourself:

  ```sql
  -- Promote your account to Admin
  UPDATE auth.users
  SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
  WHERE email = 'your-email@example.com';
  ```

  4. **Security Tip:** For a single-admin site, go to **Authentication > Providers > Email** and **disable "Allow new users to sign up"**. This ensures nobody else can create an account on your site.

## Supabase Auto-Unpause & Retry Logic

This project includes a mechanism to automatically unpause your Supabase project if it goes into hibernation and a cron job to prevent it from pausing. See `lib/supabase/retry.ts` for implementation details.
