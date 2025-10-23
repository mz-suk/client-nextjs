import { getNations, NationListSSG } from '@/features/nation-list';

export default async function ExampleSsgPage() {
  const nations = await getNations();
  const buildTime = new Date();
  const timestamp = buildTime.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  return <NationListSSG nations={nations} timestamp={timestamp} buildTime={buildTime.getTime()} />;
}
