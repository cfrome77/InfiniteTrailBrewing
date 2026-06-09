# Google Authentication Setup Guide

This guide explains how to generate the credentials required for the **Sign in with Google** feature on your brewery website.

---

## 1. Generate `AUTH_SECRET`

NextAuth/Auth.js requires a secret string for encrypting cookies. You can generate a random 32-character string using your terminal:

```bash
# Using openssl
openssl rand -base64 32
```

Alternatively, you can visit [generate-secret.vercel.app/32](https://generate-secret.vercel.app/32) to get one.

**Copy this value and add it to your environment variables:**
`AUTH_SECRET="your_generated_secret"`

---

## 2. Google Cloud Console Setup

### A. Create a Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click the project dropdown in the top-left and select **New Project**.
3. Name it `Infinite Trail Brewing` and click **Create**.

### B. Configure OAuth Consent Screen
1. In the sidebar, go to **APIs & Services > OAuth consent screen**.
2. Select **External** and click **Create**.
3. Fill in the **App Information**:
   - **App name**: `Infinite Trail Brewing Staff`
   - **User support email**: Your own email.
   - **Developer contact info**: Your own email.
4. Click **Save and Continue** through the Scopes and Test Users screens (you don't need to add anything yet).

### C. Create Credentials
1. Go to **APIs & Services > Credentials**.
2. Click **+ Create Credentials** and select **OAuth client ID**.
3. Set **Application type** to `Web application`.
4. Name it `Brewery Website`.
5. **Authorized JavaScript origins**:
   - Add `http://localhost:3000` (for local development).
   - Add `https://your-production-domain.com` (your live website).
6. **Authorized redirect URIs**:
   - Add `http://localhost:3000/api/auth/callback/google`
   - Add `https://your-production-domain.com/api/auth/callback/google`
7. Click **Create**.

---

## 3. Configure Your Environment

After clicking Create, a window will show your **Client ID** and **Client Secret**.

**Update your environment variables in Vercel or your `.env.local` file:**

```env
GOOGLE_CLIENT_ID="123456789-abc.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-your_secret_here"
```

---

## 4. Final Step: Whitelist Yourself

Once the variables are set:
1. Start your application.
2. Go to your **Sanity Studio** (via [sanity.io/manage](https://sanity.io/manage)).
3. Create an **App User** with your Google email address and set **Is Admin** to `ON`.
4. You can now log in at `/admin/dashboard`.
