'use client';

import { LogOut, User as UserIcon, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/stores/user';
import { useAuthMutations } from '@/lib/api/hooks';

export function UserMenu() {
  const user = useUserStore((state) => state.user);
  const { logout } = useAuthMutations();

  if (!user) return null;

  return (
    <div className="p-4 border-t border-border">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
          ) : (
            <UserIcon className="h-5 w-5 text-primary" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{user.name}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
      </div>
      
      <div className="space-y-1">
        <Button variant="ghost" className="w-full justify-start gap-2" size="sm">
          <Settings className="h-4 w-4" />
          <span className="text-sm">Settings</span>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          size="sm"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm">{logout.isPending ? 'Signing out...' : 'Sign Out'}</span>
        </Button>
      </div>
    </div>
  );
}

