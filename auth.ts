import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { serverClient as client } from "@/lib/sanity.server"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false;

      const email = user.email.toLowerCase();

      // 1. Check if the email is a "Master Admin" (via environment variable)
      const masterEmails = (process.env.MASTER_ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase());
      if (masterEmails.includes(email)) {
        return true;
      }

      try {
        // 2. Query Sanity to check if user is an authorized admin
        const appUser = await client.fetch(
          `*[_type == "appUser" && email == $email && isAdmin == true][0]`,
          { email }
        );

        return !!appUser;
      } catch (error) {
        console.error("Auth sign-in check error:", error);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = "admin";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login", // Redirect back to login on failure
  },
})
