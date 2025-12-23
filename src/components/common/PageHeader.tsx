import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PageHeader({
  title,
  subtitle,
  backLink,
  actions,
}: {
  title: string;
  subtitle?: string;
  backLink?: { to: string; label?: string };
  actions?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div className="min-w-0">
        {backLink ? (
          <div className="mb-2">
            <Button asChild variant="ghost" size="sm" className="gap-2 px-2">
              <Link to={backLink.to}>
                <ArrowLeft className="size-4" />
                {backLink.label || 'Back'}
              </Link>
            </Button>
          </div>
        ) : null}
        <h1 className="text-3xl mb-1">{title}</h1>
        {subtitle ? <p className="text-slate-600">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}


