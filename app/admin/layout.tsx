import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const allowedEmails = (process.env.ALLOWED_ADMIN_EMAILS || "").split(",").map(e => e.trim());

  if (!allowedEmails.includes(session.user.email || "")) {
    // If logged in but not authorized
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream p-4">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-forest mb-4">Access Denied</h1>
          <p className="text-forest/70">Your account ({session.user.email}) does not have staff permissions.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
