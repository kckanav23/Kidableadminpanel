import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

export function EmptyState({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="text-center py-10 px-4 border border-dashed rounded-lg bg-white">
      {icon ? <div className="mx-auto mb-3 w-fit text-slate-400">{icon}</div> : null}
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      {description ? <p className="text-sm text-slate-600 mt-1">{description}</p> : null}
      {action ? (
        <div className="mt-4">
          <Button onClick={action.onClick}>{action.label}</Button>
        </div>
      ) : null}
    </div>
  );
}


