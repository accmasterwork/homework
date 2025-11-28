'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  AlertTriangle,
  Bug,
  Lightbulb,
  FileText,
  Heart,
  Filter,
  Search,
  Plus
} from 'lucide-react';
import { formatRelativeTime, getPriorityColor } from '@/lib/utils';
import type { Issue, Project } from '@/types/entities';

interface IssuesManagerProps {
  issues: Issue[];
  projects: Project[];
  onIssueUpdate: () => void;
}

const issueTypeIcons = {
  bug: Bug,
  feature: Lightbulb,
  enhancement: AlertTriangle,
  documentation: FileText,
  good_first_issue: Heart,
};

export function IssuesManager({ issues, projects, onIssueUpdate }: IssuesManagerProps) {
  const [filter, setFilter] = useState<{
    status: string;
    type: string;
    priority: string;
    project: string;
    search: string;
  }>({
    status: '',
    type: '',
    priority: '',
    project: '',
    search: ''
  });

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || 'Unknown Project';
  };

  const filteredIssues = issues.filter(issue => {
    if (filter.status && issue.status !== filter.status) return false;
    if (filter.type && issue.type !== filter.type) return false;
    if (filter.priority && issue.priority !== filter.priority) return false;
    if (filter.project && issue.project_id !== filter.project) return false;
    if (filter.search && !issue.title.toLowerCase().includes(filter.search.toLowerCase())) return false;
    return true;
  });

  const IssueCard = ({ issue }: { issue: Issue }) => {
    const TypeIcon = issueTypeIcons[issue.type] || AlertTriangle;
    
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-2 flex-1">
                <TypeIcon className="w-4 h-4 mt-1 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm leading-tight">
                    {issue.title}
                  </h4>
                  {issue.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {issue.description}
                    </p>
                  )}
                </div>
              </div>
              <div className={`
                w-3 h-3 rounded-full flex-shrink-0 mt-1
                ${issue.status === 'closed' ? 'bg-green-500' : 
                  issue.status === 'in_progress' ? 'bg-blue-500' : 'bg-red-500'}
              `} />
            </div>

            {/* Metadata */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {getProjectName(issue.project_id)}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {issue.type}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getPriorityColor(issue.priority)}`}
                >
                  {issue.priority}
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatRelativeTime(issue.created_at)}
              </span>
            </div>

            {/* Labels */}
            {issue.labels && issue.labels.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {issue.labels.slice(0, 3).map((label) => (
                  <Badge key={label} variant="outline" className="text-xs">
                    {label}
                  </Badge>
                ))}
                {issue.labels.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{issue.labels.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search issues..."
                  value={filter.search}
                  onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={filter.status}
              onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed</option>
              <option value="blocked">Blocked</option>
            </select>

            {/* Type Filter */}
            <select
              value={filter.type}
              onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value }))}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="bug">Bug</option>
              <option value="feature">Feature</option>
              <option value="enhancement">Enhancement</option>
              <option value="documentation">Documentation</option>
              <option value="good_first_issue">Good First Issue</option>
            </select>

            {/* Priority Filter */}
            <select
              value={filter.priority}
              onChange={(e) => setFilter(prev => ({ ...prev, priority: e.target.value }))}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>

            {/* Project Filter */}
            <select
              value={filter.project}
              onChange={(e) => setFilter(prev => ({ ...prev, project: e.target.value }))}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Projects</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Issues Grid */}
      {filteredIssues.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIssues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <AlertTriangle className="w-16 h-16 mx-auto mb-6 text-muted-foreground opacity-50" />
          <h3 className="text-xl font-medium mb-2">
            {issues.length === 0 ? 'No Issues Yet' : 'No Issues Match Your Filters'}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {issues.length === 0 
              ? 'Create your first issue to start tracking bugs, features, and tasks.'
              : 'Try adjusting your filters to see more issues.'
            }
          </p>
          {issues.length === 0 && (
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create First Issue
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

