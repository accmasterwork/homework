'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { User } from '@supabase/auth-helpers-nextjs';
import type { User as AppUser } from '@/types/entities';

interface AuthContextType {
  user: AppUser | null;
  supabaseUser: User | null;
  loading: boolean;
  signInWithGitHub: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getUser = async () => {
      try {
        // Check for mock session first (works without Supabase)
        const mockSession = localStorage.getItem('mockSession');
        const mockUserData = localStorage.getItem('mockUser');
        
        if (mockSession && mockUserData) {
          const authUser = JSON.parse(mockUserData);
          setSupabaseUser(authUser);
          
          // Create a mock user profile for demo
          const mockUser: AppUser = {
            id: authUser.id,
            email: authUser.email!,
            name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email.split('@')[0],
            avatar_url: authUser.user_metadata?.avatar_url,
            github_username: authUser.user_metadata?.user_name,
            github_id: authUser.user_metadata?.provider_id,
            role: authUser.email === 'admin@example.com' ? 'admin' : 'user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          setUser(mockUser);
        } else {
          // Try Supabase auth as fallback (if configured)
          try {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            setSupabaseUser(authUser);
            
            if (authUser) {
              // Create a user profile from Supabase data
              const mockUser: AppUser = {
                id: authUser.id,
                email: authUser.email!,
                name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || 'Anonymous',
                avatar_url: authUser.user_metadata?.avatar_url,
                github_username: authUser.user_metadata?.user_name,
                github_id: authUser.user_metadata?.provider_id,
                role: authUser.email === 'admin@example.com' ? 'admin' : 'user',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              };
              setUser(mockUser);
            } else {
              setUser(null);
            }
          } catch (supabaseError) {
            // Supabase not configured, just set user to null
            setUser(null);
            setSupabaseUser(null);
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
        setSupabaseUser(null);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setSupabaseUser(session.user);
          // Refetch user profile
          getUser();
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setSupabaseUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  const signInWithGitHub = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: 'read:user user:email repo',
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in with GitHub:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Clear mock session
      localStorage.removeItem('mockSession');
      localStorage.removeItem('mockUser');
      
      // Also try Supabase signout if available
      try {
        const { error } = await supabase.auth.signOut();
        if (error) console.warn('Supabase signout error:', error);
      } catch (supabaseError) {
        // Supabase not configured, ignore error
      }
      
      setUser(null);
      setSupabaseUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    user,
    supabaseUser,
    loading,
    signInWithGitHub,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
