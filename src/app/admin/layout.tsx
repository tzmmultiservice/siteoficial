export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Admin pages have their own header, no public Footer/WhatsApp
  return <>{children}</>;
}
