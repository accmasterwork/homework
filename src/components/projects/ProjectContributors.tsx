'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Users, Plus } from 'lucide-react';
import type { Project } from '@/types/entities';

interface ProjectContributorsProps {
  project: Project;
  canEdit: boolean;
}

export function ProjectContributors({ project, canEdit }: ProjectContributorsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Contributors</h2>
        {canEdit && (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Invite Contributor
          </Button>
        )}
      </div>

      <div className="text-center py-16">
        <Users className="w-16 h-16 mx-auto mb-6 text-muted-foreground opacity-50" />
        <h3 className="text-xl font-medium mb-2">No Contributors Yet</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Invite team members and contributors to collaborate on your project.
        </p>
        {canEdit && (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Invite First Contributor
          </Button>
        )}
      </div>
    </div>
  );
}

