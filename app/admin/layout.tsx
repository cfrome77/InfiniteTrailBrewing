import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  const pathname = headerList.get("x-next-pathname") || "";

  // Sanity Studio handles its own authentication (Sanity account).
  // We allow it to bypass the Google Staff Auth so you can add your first staff members.
  if (pathname.includes("/admin/studio")) {
    return <>{children}</>;
  }

  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return <>{children}</>;
}
