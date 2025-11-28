'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Target, Plus } from 'lucide-react';
import type { Project } from '@/types/entities';

interface ProjectMilestonesProps {
  project: Project;
  canEdit: boolean;
}

export function ProjectMilestones({ project, canEdit }: ProjectMilestonesProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Milestones</h2>
        {canEdit && (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Milestone
          </Button>
        )}
      </div>

      <div className="text-center py-16">
        <Target className="w-16 h-16 mx-auto mb-6 text-muted-foreground opacity-50" />
        <h3 className="text-xl font-medium mb-2">No Milestones Yet</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Create milestones to track progress and organize work into manageable chunks.
        </p>
        {canEdit && (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create First Milestone
          </Button>
        )}
      </div>
    </div>
  );
}

