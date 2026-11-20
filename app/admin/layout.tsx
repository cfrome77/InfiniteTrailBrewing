export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Access is gated in proxy.ts; Studio adds its own Sanity auth on top.
  return <>{children}</>;
}
