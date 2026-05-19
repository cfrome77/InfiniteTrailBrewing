import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    redirect("/login");
  }

  const user = session.user as any;
  if (user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="pt-24 min-h-[calc(100vh-160px)]">
        {children}
      </div>
      <Footer />
    </div>
  );
}
