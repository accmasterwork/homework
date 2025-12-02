'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MessageSquare, Plus } from 'lucide-react';
import type { Project } from '@/types/entities';

interface ProjectDiscussionsProps {
  project: Project;
  canEdit: boolean;
}

export function ProjectDiscussions({ project, canEdit }: ProjectDiscussionsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Discussions</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Discussion
        </Button>
      </div>

      <div className="text-center py-16">
        <MessageSquare className="w-16 h-16 mx-auto mb-6 text-muted-foreground opacity-50" />
        <h3 className="text-xl font-medium mb-2">No Discussions Yet</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Start conversations with your community about ideas, questions, and announcements.
        </p>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Start First Discussion
        </Button>
      </div>
    </div>
  );
}

