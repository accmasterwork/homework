'use client';

import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, FileText } from 'lucide-react';
import Link from 'next/link';

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold mb-2">Documentation</h1>
          <p className="text-muted-foreground">
            Create and manage documentation across all your projects.
          </p>
        </div>

        <div className="text-center py-16">
          <FileText className="w-16 h-16 mx-auto mb-6 text-muted-foreground opacity-50" />
          <h3 className="text-xl font-medium mb-2">Documentation Hub</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            This page will provide a rich text editor and management system for all your project documentation.
          </p>
        </div>
      </div>
    </div>
  );
}

