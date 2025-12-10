import { Search, Bell } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export function Header() {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#0B5B45]/10 px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              placeholder="Search clients, sessions..."
              className="pl-10"
            />
          </div>
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-5" />
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 size-5 flex items-center justify-center p-0 text-xs"
          >
            3
          </Badge>
        </Button>
      </div>
    </header>
  );
}