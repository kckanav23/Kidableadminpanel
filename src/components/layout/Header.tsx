import { useMemo, useState } from 'react';
import { Copy, LogOut, Search, Shield, User } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useAuth } from '@/features/auth';
import { toast } from 'sonner';
import { getAccessCode } from '@/lib/api';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';

export function Header() {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const accessCode = useMemo(() => getAccessCode(), []);
  const displayName = user?.fullName || 'Staff Member';
  const avatarInitial = displayName?.trim()?.charAt(0) || 'U';

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const handleShowSearchComingSoon = () => {
    toast.message('Search is coming soon', {
      description: 'We’re polishing it up. For now, use the left sidebar to navigate.',
    });
  };

  const handleCopyAccessCode = async () => {
    if (!accessCode) return;
    await navigator.clipboard.writeText(accessCode);
    toast.success('Access code copied');
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#0B5B45]/10 px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            {/* Wrapper stays clickable even though the input itself is disabled */}
            <div onClick={handleShowSearchComingSoon} className="cursor-not-allowed">
            <Input
              placeholder="Search clients, sessions..."
              className="pl-10"
              disabled
              aria-disabled="true"
            />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* <Button variant="ghost" size="icon" className="relative">
            <Bell className="size-5" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 size-5 flex items-center justify-center p-0 text-xs"
            >
              3
            </Badge>
          </Button> */}

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <div className="size-8 rounded-full bg-[#0B5B45] flex items-center justify-center text-white">
                  {avatarInitial}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium">{displayName}</p>
                  {user?.admin && (
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Shield className="size-3" />
                      Administrator
                    </p>
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsProfileOpen(true)}>
                <User className="mr-2 size-4" />
                <span>My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 size-4" />
                <span>Log Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>My Profile</DialogTitle>
            <DialogDescription>Basic account details and your staff access code.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="size-10 rounded-full bg-[#0B5B45] flex items-center justify-center text-white">
                {avatarInitial}
              </div>
              <div className="min-w-0">
                <div className="text-base font-medium">{displayName}</div>
                <div className="text-sm text-slate-600">{user?.userId ? `ID: ${user.userId}` : 'ID: —'}</div>
                <div className="mt-1">
                  {user?.admin ? (
                    <Badge variant="outline" className="text-teal-700 border-teal-700">
                      Administrator
                    </Badge>
                  ) : (
                    <Badge variant="secondary">{user?.role || 'staff'}</Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-3 bg-slate-50">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm">
                  <div className="text-slate-600">Access code</div>
                  <div className="font-mono text-sm font-medium text-slate-900">{accessCode || 'Not set'}</div>
                </div>
                <Button variant="outline" size="sm" onClick={handleCopyAccessCode} disabled={!accessCode}>
                  <Copy className="size-4 mr-2" />
                  Copy
                </Button>
              </div>
              <div className="mt-2 text-xs text-slate-500">Keep this private. It grants access to the admin panel.</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}