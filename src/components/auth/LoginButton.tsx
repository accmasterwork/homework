'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { LogIn } from 'lucide-react';

export function LoginButton() {
  return (
    <Link href="/login">
      <Button className="flex items-center space-x-2">
        <LogIn className="h-4 w-4" />
        <span>Sign In</span>
      </Button>
    </Link>
  );
}
