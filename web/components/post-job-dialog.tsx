import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function PostJobDialog() {
  return (
    <Link
      href="/post-job"
      className={cn(buttonVariants({ size: 'sm' }), 'rounded-full px-3.5 text-xs')}
    >
      Post a job — $99
    </Link>
  );
}
