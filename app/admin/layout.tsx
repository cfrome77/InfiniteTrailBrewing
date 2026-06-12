export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Sanity Studio handles its own authentication.
  return <>{children}</>;
}
