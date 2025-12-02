'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FileText, Plus } from 'lucide-react';
import type { Project } from '@/types/entities';

interface ProjectDocumentationProps {
  project: Project;
  canEdit: boolean;
}

export function ProjectDocumentation({ project, canEdit }: ProjectDocumentationProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Documentation</h2>
        {canEdit && (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Document
          </Button>
        )}
      </div>

      <div className="text-center py-16">
        <FileText className="w-16 h-16 mx-auto mb-6 text-muted-foreground opacity-50" />
        <h3 className="text-xl font-medium mb-2">No Documentation Yet</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Create guides, API docs, and tutorials to help users and contributors.
        </p>
        {canEdit && (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create First Document
          </Button>
        )}
      </div>
    </div>
  );
}

