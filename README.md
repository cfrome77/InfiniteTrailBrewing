# My Next.js Project

A modern web application built with Next.js, Supabase, and Tailwind CSS.

## Features

- **Next.js 15+ (App Router)**: Fast, server-side rendered, and optimized.
- **Supabase Auth & Database**: Seamless authentication and real-time database capabilities.
- **Tailwind CSS**: Utility-first styling for a beautiful and responsive UI.
- **Vercel Deployment**: Optimized for deployment on Vercel.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Local Setup

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd my-project
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Environment Variables:**

   Create a `.env.local` file in the root directory and add your Supabase credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

### Deployment Steps

1. Push your code to GitHub.
2. Go to [Vercel](https://vercel.com/new) and import your repository.
3. Configure the following **Environment Variables** in the Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**.

Vercel will automatically build and deploy your application every time you push to the `main` branch.
