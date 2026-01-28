'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Menu,
  X,
  Home,
  FolderOpen,
  Users,
  LogOut,
  User,
  Plus,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

const getMenuItems = (role: string) => {
  const commonItems = [
    { label: 'Dashboard', href: '/dashboard', icon: Home },
    { label: 'Profile', href: '/dashboard/profile', icon: User },
  ];

  const adminItems = [
    ...commonItems,
    { label: 'Projects', href: '/dashboard/projects', icon: FolderOpen },
    { label: 'Managers', href: '/dashboard/managers', icon: Users },
    { label: 'Members', href: '/dashboard/members', icon: Users },
    { label: 'Add Admin', href: '/dashboard/add-admin', icon: Plus },
    { label: 'Add Manager', href: '/dashboard/add-manager', icon: Plus },
    { label: 'Add Member', href: '/dashboard/add-member', icon: Plus },
    { label: 'Add Project', href: '/dashboard/add-project', icon: Zap },
  ];

  const managerItems = [
    ...commonItems,
    { label: 'Projects', href: '/dashboard/projects', icon: FolderOpen },
    { label: 'Members', href: '/dashboard/members', icon: Users },
    { label: 'Tasks', href: '/dashboard/tasks', icon: FolderOpen },
    { label: 'Assign Task', href: '/dashboard/assign-task', icon: Plus },
  ];

  const memberItems = [
    ...commonItems,
    { label: 'Projects', href: '/dashboard/projects', icon: FolderOpen },
    { label: 'Tasks', href: '/dashboard/tasks', icon: FolderOpen },
  ];

  if (role === 'admin') return adminItems;
  if (role === 'manager') return managerItems;
  return memberItems;
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = user ? getMenuItems(user.role) : [];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="bg-card border-border"
        >
          {isMobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'w-64' : 'w-20'
        } bg-card border-r border-border transition-all duration-300 hidden md:flex flex-col h-screen`}
      >
        {/* Logo Section */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg">
              <span className="text-primary-foreground font-bold text-sm">PM</span>
            </div>
            {isOpen && <span className="font-bold text-sm">ProjectMgr</span>}
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 hover:bg-background rounded transition-colors hidden lg:block"
          >
            {isOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* User Info */}
        {isOpen && user && (
          <div className="p-4 border-b border-border">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
          </div>
        )}

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <button
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-background'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {isOpen && <span className="text-sm">{item.label}</span>}
                </button>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-border">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full bg-background border-border text-foreground hover:bg-card"
          >
            {isOpen && <LogOut className="w-4 h-4 mr-2" />}
            {isOpen ? 'Logout' : <LogOut className="w-4 h-4" />}
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <aside className="fixed inset-0 top-16 left-0 w-64 bg-card border-r border-border z-40 md:hidden flex flex-col">
          {/* User Info */}
          {user && (
            <div className="p-4 border-b border-border">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
            </div>
          )}

          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <button
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-background'
                    }`}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-border">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full bg-background border-border text-foreground hover:bg-card"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </aside>
      )}
    </>
  );
}
