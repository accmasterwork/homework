'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, Plus } from 'lucide-react';
import type { Project } from '@/types/entities';

interface ProjectIssuesProps {
  project: Project;
  canEdit: boolean;
}

export function ProjectIssues({ project, canEdit }: ProjectIssuesProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Issues</h2>
        {canEdit && (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Issue
          </Button>
        )}
      </div>

      <div className="text-center py-16">
        <AlertTriangle className="w-16 h-16 mx-auto mb-6 text-muted-foreground opacity-50" />
        <h3 className="text-xl font-medium mb-2">No Issues Yet</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Track bugs, feature requests, and tasks to keep your project organized.
        </p>
        {canEdit && (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create First Issue
          </Button>
        )}
      </div>
    </div>
  );
}

