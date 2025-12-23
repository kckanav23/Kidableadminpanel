import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { TherapyBadge } from '@/components/badges/TherapyBadge';
import { ClientAvatar } from '@/features/clients/components/ClientAvatar';
import type { ClientSummary } from '@/types/api';

export function ClientCard({ client }: { client: ClientSummary }) {
  const fullName = `${client.firstName} ${client.lastName}`;

  return (
    <Link
      to={`/clients/${client.id}`}
      className="flex items-center gap-4 p-4 rounded-lg border hover:bg-slate-50 transition-colors"
    >
      <ClientAvatar name={fullName} photoUrl={client.photoUrl} />
      <div className="flex-1 min-w-0">
        <p className="font-medium">{fullName}</p>
        <p className="text-sm text-slate-600">{client.age} years old</p>
      </div>
      <div className="flex items-center gap-2">
        {client.therapies.map((therapy, idx) => {
          const therapyType = therapy.toLowerCase() as 'aba' | 'speech' | 'ot';
          return (
            <span key={`${client.id}-therapy-${idx}`}>
              <TherapyBadge type={therapyType} showLabel={false} />
            </span>
          );
        })}
      </div>
      <Badge
        variant="outline"
        className={
          client.status === 'active'
            ? 'text-green-700 border-green-700'
            : client.status === 'suspended'
            ? 'text-red-700 border-red-700'
            : 'text-slate-600 border-slate-300'
        }
      >
        {client.status}
      </Badge>
      <ArrowRight className="size-4 text-slate-400" />
    </Link>
  );
}


