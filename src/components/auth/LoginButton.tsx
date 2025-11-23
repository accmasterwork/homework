'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Github } from 'lucide-react';
import toast from 'react-hot-toast';

export function LoginButton() {
  const [loading, setLoading] = useState(false);
  const { signInWithGitHub } = useAuth();

  const handleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGitHub();
      toast.success('Redirecting to GitHub...');
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('Failed to sign in with GitHub');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleSignIn} 
      disabled={loading}
      className="flex items-center space-x-2"
    >
      <Github className="h-4 w-4" />
      <span>{loading ? 'Signing in...' : 'Sign in with GitHub'}</span>
    </Button>
  );
}

