import { getInitials } from '../lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface ClientAvatarProps {
  name: string;
  photoUrl?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'size-8',
  md: 'size-10',
  lg: 'size-16',
};

export function ClientAvatar({ name, photoUrl, size = 'md' }: ClientAvatarProps) {
  return (
    <Avatar className={sizeClasses[size]}>
      {photoUrl && <AvatarImage src={photoUrl} alt={name} />}
      <AvatarFallback className="bg-[#E6F4F0] text-[#0B5B45]">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}