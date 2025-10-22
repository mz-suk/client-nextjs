import { getNations, NationListISR } from '@/features/nation-list';

export default async function ExampleIsrPage() {
  const nations = await getNations();
  const timestamp = new Date().toISOString();

  return <NationListISR nations={nations} timestamp={timestamp} />;
}
