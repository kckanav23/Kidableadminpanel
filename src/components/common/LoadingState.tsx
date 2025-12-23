import { Loader2 } from 'lucide-react';

export function LoadingState({
  label = 'Loading…',
  variant = 'page',
}: {
  label?: string;
  variant?: 'page' | 'inline';
}) {
  const containerClass =
    variant === 'page' ? 'flex items-center justify-center min-h-[50vh]' : 'flex items-center justify-center py-6';

  return (
    <div className={containerClass}>
      <div className="text-center">
        <Loader2 className="size-6 animate-spin text-[#0B5B45] mx-auto mb-2" />
        <p className="text-sm text-slate-600">{label}</p>
      </div>
    </div>
  );
}


