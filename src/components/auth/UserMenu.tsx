'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  UserCircle
} from 'lucide-react';
import { getInitials } from '@/lib/utils';
import type { User as AppUser } from '@/types/entities';
import toast from 'react-hot-toast';

interface UserMenuProps {
  user: AppUser;
}

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  const handleProfileClick = () => {
    setIsOpen(false);
    router.push('/profile');
  };

  const handleSettingsClick = () => {
    setIsOpen(false);
    router.push('/settings');
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className="flex items-center space-x-2 h-10"
        onClick={() => setIsOpen(!isOpen)}
      >
        {user.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={user.name}
            className="h-6 w-6 rounded-full"
          />
        ) : (
          <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
            {getInitials(user.name)}
          </div>
        )}
        <span className="hidden sm:inline-block text-sm font-medium">
          {user.name}
        </span>
        <ChevronDown className="h-4 w-4" />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-56 bg-background border rounded-md shadow-lg z-50">
            <div className="p-3 border-b">
              <div className="flex items-center space-x-3">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.name}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    {getInitials(user.name)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
            </div>

            <div className="py-1">
              <button
                className="flex w-full items-center px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                onClick={handleProfileClick}
              >
                <UserCircle className="h-4 w-4 mr-3" />
                Profile
              </button>
              
              <button
                className="flex w-full items-center px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                onClick={handleSettingsClick}
              >
                <Settings className="h-4 w-4 mr-3" />
                Settings
              </button>
            </div>

            <div className="border-t py-1">
              <button
                className="flex w-full items-center px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                onClick={() => {
                  setIsOpen(false);
                  handleSignOut();
                }}
              >
                <LogOut className="h-4 w-4 mr-3" />
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
