export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Sanity Studio handles its own authentication.
  return <>{children}</>;
}
