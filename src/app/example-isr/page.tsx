import { getNations, NationListISR } from '@/features/nation-list';
import { revalidateConfig } from '@/shared/config';

export const revalidate = revalidateConfig.dynamic;

export default async function ExampleIsrPage() {
  const nations = await getNations();
  const timestamp = new Date().toISOString();

  return <NationListISR nations={nations} timestamp={timestamp} />;
}
