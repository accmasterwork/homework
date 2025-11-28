'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  Calendar,
  User,
  MoreHorizontal,
  Plus,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { formatRelativeTime, getPriorityColor } from '@/lib/utils';
import type { Milestone, Project } from '@/types/entities';

interface MilestonesBoardProps {
  milestones: Milestone[];
  projects: Project[];
  onMilestoneUpdate: () => void;
}

const columns = [
  {
    id: 'planning',
    title: 'Planning',
    icon: Target,
    color: 'bg-gray-100 border-gray-200',
    count: 0
  },
  {
    id: 'in_progress',
    title: 'In Progress',
    icon: Clock,
    color: 'bg-blue-50 border-blue-200',
    count: 0
  },
  {
    id: 'completed',
    title: 'Completed',
    icon: CheckCircle,
    color: 'bg-green-50 border-green-200',
    count: 0
  },
  {
    id: 'cancelled',
    title: 'Cancelled',
    icon: XCircle,
    color: 'bg-red-50 border-red-200',
    count: 0
  }
];

export function MilestonesBoard({ milestones, projects, onMilestoneUpdate }: MilestonesBoardProps) {
  const [draggedMilestone, setDraggedMilestone] = useState<Milestone | null>(null);

  const getMilestonesByStatus = (status: string) => {
    return milestones.filter(milestone => milestone.status === status);
  };

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || 'Unknown Project';
  };

  const handleDragStart = (milestone: Milestone) => {
    setDraggedMilestone(milestone);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    
    if (!draggedMilestone || draggedMilestone.status === newStatus) {
      setDraggedMilestone(null);
      return;
    }

    // TODO: Update milestone status in database
    console.log(`Moving milestone ${draggedMilestone.id} to ${newStatus}`);
    
    setDraggedMilestone(null);
    onMilestoneUpdate();
  };

  const MilestoneCard = ({ milestone }: { milestone: Milestone }) => {
    const isOverdue = milestone.due_date && new Date(milestone.due_date) < new Date() && milestone.status !== 'completed';
    
    return (
      <Card 
        className="cursor-move hover:shadow-md transition-shadow"
        draggable
        onDragStart={() => handleDragStart(milestone)}
      >
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
              <h4 className="font-medium text-sm leading-tight pr-2">
                {milestone.title}
              </h4>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>

            {/* Description */}
            {milestone.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {milestone.description}
              </p>
            )}

            {/* Project Badge */}
            <Badge variant="outline" className="text-xs">
              {getProjectName(milestone.project_id)}
            </Badge>

            {/* Metadata */}
            <div className="space-y-2">
              {/* Type and Priority */}
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  {milestone.type}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getPriorityColor(milestone.priority)}`}
                >
                  {milestone.priority}
                </Badge>
              </div>

              {/* Progress */}
              {milestone.progress_percentage > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{milestone.progress_percentage}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div 
                      className="bg-primary h-1.5 rounded-full transition-all"
                      style={{ width: `${milestone.progress_percentage}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Due Date */}
              {milestone.due_date && (
                <div className={`flex items-center space-x-1 text-xs ${
                  isOverdue ? 'text-red-600' : 'text-muted-foreground'
                }`}>
                  <Calendar className="w-3 h-3" />
                  <span>Due {formatRelativeTime(milestone.due_date)}</span>
                  {isOverdue && <AlertCircle className="w-3 h-3" />}
                </div>
              )}

              {/* Assignee */}
              {milestone.assignee_id && (
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <User className="w-3 h-3" />
                  <span>Assigned</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Board Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {columns.map((column) => {
          const count = getMilestonesByStatus(column.id).length;
          const Icon = column.icon;
          
          return (
            <Card key={column.id}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-sm text-muted-foreground">{column.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => {
          const columnMilestones = getMilestonesByStatus(column.id);
          const Icon = column.icon;
          
          return (
            <div key={column.id} className="space-y-4">
              {/* Column Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon className="w-5 h-5" />
                  <h3 className="font-medium">{column.title}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {columnMilestones.length}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Drop Zone */}
              <div
                className={`
                  min-h-[500px] p-4 rounded-lg border-2 border-dashed transition-colors
                  ${column.color}
                `}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                <div className="space-y-3">
                  {columnMilestones.map((milestone) => (
                    <MilestoneCard key={milestone.id} milestone={milestone} />
                  ))}
                  
                  {columnMilestones.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Icon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-sm">No milestones in {column.title.toLowerCase()}</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Milestone
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {milestones.length === 0 && (
        <div className="text-center py-16">
          <Target className="w-16 h-16 mx-auto mb-6 text-muted-foreground opacity-50" />
          <h3 className="text-xl font-medium mb-2">No Milestones Yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Create your first milestone to start tracking progress on your projects. 
            Milestones help you organize work and measure success.
          </p>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create First Milestone
          </Button>
        </div>
      )}
    </div>
  );
}

