import { getTrainingField, getTrainingFields, getTrainingCollections } from '@/lib/training-jobs';
import { shareCard, size, contentType } from '@/app/opengraph-image';

export { size, contentType };
export const alt = 'Best AI training jobs by profession — Artificial Jobs';

export function generateStaticParams() {
  return [...getTrainingFields(), ...getTrainingCollections()].map((field) => ({ field: field.slug }));
}

export default async function Image({ params }: { params: Promise<{ field: string }> }) {
  const field = getTrainingField((await params).field);
  if (!field) return shareCard('Get paid to train AI.', 'Hourly expert work for professionals.', '', '');
  const roles = `${field.jobs.length} open ${field.jobs.length === 1 ? 'role' : 'roles'}`;
  return shareCard(`AI training jobs for ${field.audience}.`, `${field.label} experts helping AI labs improve their models.`, field.topRate ? `Up to $${field.topRate}/hr` : roles, field.topRate ? roles : '');
}
