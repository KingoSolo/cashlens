import { HealthCardContent } from './HealthCardContent';

export default async function HealthCardPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ name?: string }>;
}) {
  const { id } = await params;
  const { name } = await searchParams;
  return <HealthCardContent id={id} businessName={name ?? 'Your Business'} />;
}
