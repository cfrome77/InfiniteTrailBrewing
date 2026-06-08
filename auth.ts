import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith("/admin")

      if (isOnDashboard) {
        if (isLoggedIn) {
          // Check if the user is in the allowed admin list
          const allowedEmails = (process.env.ALLOWED_ADMIN_EMAILS || "").split(",").map(e => e.trim());
          return allowedEmails.includes(auth.user?.email || "");
        }
        return false // Redirect to login
      }
      return true
    },
  },
  pages: {
    signIn: "/login",
  },
})
