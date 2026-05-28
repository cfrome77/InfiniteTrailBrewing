import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("admin_auth")?.value;
  const adminPassword = process.env.ADMIN_PASSWORD;

  // STRICT PROTECTION: If password is not set or cookie is missing/invalid, redirect to login.
  if (!adminPassword || authCookie !== adminPassword) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />
      <div className="flex-grow pt-24">
        {children}
      </div>
      <Footer />
    </div>
  );
}
