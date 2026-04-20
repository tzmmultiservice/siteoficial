import TrackingClient from "./TrackingClient";

// Pre-render a demo page; in production, this will be dynamic via Supabase
export function generateStaticParams() {
  return [{ id: "demo" }];
}

export default async function AcompanharPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TrackingClient id={id} />;
}
