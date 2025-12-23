import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList,
  BookOpen, 
  FolderOpen, 
  UserCog, 
  Users2,
  ScrollText,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/features/auth';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import HeroSectionPurple from '../graphics/HeroSectionPurple';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import kidAbleLogo from '../../assets/Layer_1-13.png';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

export function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const navSections: NavSection[] = [
    {
      items: [
        { label: 'Dashboard', path: '/', icon: <LayoutDashboard className="size-5" /> },
        { label: 'Clients', path: '/clients', icon: <Users className="size-5" /> },
        { label: 'Sessions', path: '/sessions', icon: <ClipboardList className="size-5" /> },
      ],
    },
    {
      title: 'LIBRARIES',
      items: [
        { label: 'Strategies', path: '/strategies', icon: <BookOpen className="size-5" /> },
        { label: 'Resources', path: '/resources', icon: <FolderOpen className="size-5" /> },
      ],
    },
    {
      title: 'DIRECTORY',
      items: [
        { label: 'Parents', path: '/parents', icon: <Users2 className="size-5" /> },
      ],
    },
    {
      title: 'ADMIN',
      items: [
        { label: 'Therapists', path: '/therapists', icon: <UserCog className="size-5" />, adminOnly: true },
        { label: 'Audit Logs', path: '/audit-logs', icon: <ScrollText className="size-5" />, adminOnly: true },
      ],
    },
  ];

  const filteredSections = navSections.map(section => ({
    ...section,
    items: section.items.filter(item => !item.adminOnly || user?.admin),
  })).filter(section => section.items.length > 0);

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-center w-full h-16 px-4 mx-auto mb-2">
          <ImageWithFallback
            src={kidAbleLogo} 
            alt="KidAble Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <p className="text-xs text-gray-600 text-center">Admin Portal</p>
      </div>

      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {filteredSections.map((section, idx) => (
          <div key={idx}>
            {section.title && (
              <h3 className="px-3 mb-2 text-xs text-gray-500">{section.title}</h3>
            )}
            <div className="space-y-1">
              {section.items.map(item => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                      isActive
                        ? 'bg-[#F4D16B] text-[#363530]'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-[#0B5B45]'
                    )}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center size-10 rounded-full bg-[#F4D16B] text-[#363530]">
            <span>{user?.fullName?.split(' ').map(n => n[0]).join('') || 'U'}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-900 truncate">{user?.fullName || 'User'}</p>
            <p className="text-xs text-gray-600 capitalize">{user?.role || 'staff'}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="w-full justify-start gap-2 text-gray-700 hover:text-[#0B5B45] hover:bg-gray-100"
        >
          <LogOut className="size-4" />
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-[#0B5B45] text-white hover:bg-[#0D6953]"
      >
        {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </Button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200 flex flex-col transition-transform lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
}