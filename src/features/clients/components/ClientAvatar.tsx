import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';

export interface ClientAvatarProps {
  name: string;
  photoUrl?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses: Record<NonNullable<ClientAvatarProps['size']>, string> = {
  sm: 'size-8',
  md: 'size-10',
  lg: 'size-16',
};

export function ClientAvatar({ name, photoUrl, size = 'md' }: ClientAvatarProps) {
  return (
    <Avatar className={sizeClasses[size]}>
      {photoUrl ? <AvatarImage src={photoUrl} alt={name} /> : null}
      <AvatarFallback className="bg-[#E6F4F0] text-[#0B5B45]">{getInitials(name)}</AvatarFallback>
    </Avatar>
  );
}


