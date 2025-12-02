'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Shield, Plus } from 'lucide-react';
import type { Project } from '@/types/entities';

interface ProjectSecurityProps {
  project: Project;
  canEdit: boolean;
}

export function ProjectSecurity({ project, canEdit }: ProjectSecurityProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Security</h2>
        {canEdit && (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Assessment
          </Button>
        )}
      </div>

      <div className="text-center py-16">
        <Shield className="w-16 h-16 mx-auto mb-6 text-muted-foreground opacity-50" />
        <h3 className="text-xl font-medium mb-2">No Security Assessments</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Monitor and track security vulnerabilities to keep your project safe.
        </p>
        {canEdit && (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create First Assessment
          </Button>
        )}
      </div>
    </div>
  );
}

