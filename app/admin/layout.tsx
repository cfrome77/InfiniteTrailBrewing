import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const auth = cookieStore.get("admin_auth");
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  // Check if we are on the studio route - let Sanity handle its own auth there
  // but protect our custom admin pages.
  // Actually, let's protect everything under /admin except maybe the studio if it has its own.
  // But usually we want a single entry point.

  if (auth?.value !== adminPassword) {
    // We only want to redirect if NOT on the studio path if studio has its own auth,
    // but here we are using a simple password for our custom pages.
    // Let's redirect to login for all /admin pages for now to be safe.
    redirect("/login");
  }

  return <>{children}</>;
}
