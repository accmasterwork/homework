'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  ArrowLeft,
  Star,
  GitFork,
  Users,
  AlertTriangle,
  Target,
  FileText,
  MessageSquare,
  Shield,
  Settings,
  Github,
  Globe,
  BookOpen,
  Calendar,
  TrendingUp,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import { formatRelativeTime, formatNumber, getStatusColor } from '@/lib/utils';
import { ProjectOverview } from './ProjectOverview';
import { ProjectMilestones } from './ProjectMilestones';
import { ProjectIssues } from './ProjectIssues';
import { ProjectContributors } from './ProjectContributors';
import { ProjectDocumentation } from './ProjectDocumentation';
import { ProjectDiscussions } from './ProjectDiscussions';
import { ProjectSecurity } from './ProjectSecurity';
import { ProjectSettings } from './ProjectSettings';
import type { Project, User } from '@/types/entities';

interface ProjectDashboardProps {
  project: Project;
  currentUser: User | null;
}

const tabs = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'milestones', label: 'Milestones', icon: Target },
  { id: 'issues', label: 'Issues', icon: AlertTriangle },
  { id: 'contributors', label: 'Contributors', icon: Users },
  { id: 'documentation', label: 'Documentation', icon: FileText },
  { id: 'discussions', label: 'Discussions', icon: MessageSquare },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function ProjectDashboard({ project, currentUser }: ProjectDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const isOwner = currentUser?.id === project.owner_id;
  const canEdit = isOwner; // TODO: Add team member permissions

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <ProjectOverview project={project} currentUser={currentUser} />;
      case 'milestones':
        return <ProjectMilestones project={project} canEdit={canEdit} />;
      case 'issues':
        return <ProjectIssues project={project} canEdit={canEdit} />;
      case 'contributors':
        return <ProjectContributors project={project} canEdit={canEdit} />;
      case 'documentation':
        return <ProjectDocumentation project={project} canEdit={canEdit} />;
      case 'discussions':
        return <ProjectDiscussions project={project} canEdit={canEdit} />;
      case 'security':
        return <ProjectSecurity project={project} canEdit={canEdit} />;
      case 'settings':
        return isOwner ? <ProjectSettings project={project} /> : null;
      default:
        return <ProjectOverview project={project} currentUser={currentUser} />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <h1 className="text-3xl font-bold">{project.name}</h1>
              <Badge 
                variant="outline" 
                className={getStatusColor(project.status)}
              >
                {project.status}
              </Badge>
              {project.visibility === 'private' && (
                <Badge variant="secondary">Private</Badge>
              )}
            </div>
            
            <p className="text-muted-foreground text-lg mb-4">
              {project.description}
            </p>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tech_stack.slice(0, 5).map((tech) => (
                <Badge key={tech} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
              {project.tech_stack.length > 5 && (
                <Badge variant="secondary" className="text-xs">
                  +{project.tech_stack.length - 5} more
                </Badge>
              )}
            </div>

            {/* External Links */}
            <div className="flex items-center space-x-4">
              {project.github_url && (
                <Button variant="outline" size="sm" asChild>
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4 mr-2" />
                    GitHub
                  </a>
                </Button>
              )}
              {project.website_url && (
                <Button variant="outline" size="sm" asChild>
                  <a href={project.website_url} target="_blank" rel="noopener noreferrer">
                    <Globe className="w-4 h-4 mr-2" />
                    Website
                  </a>
                </Button>
              )}
              {project.documentation_url && (
                <Button variant="outline" size="sm" asChild>
                  <a href={project.documentation_url} target="_blank" rel="noopener noreferrer">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Docs
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Project Stats */}
          <div className="lg:w-80">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-2xl font-bold">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span>{formatNumber(project.stars)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Stars</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-2xl font-bold">
                      <GitFork className="w-5 h-5 text-blue-500" />
                      <span>{formatNumber(project.forks)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Forks</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-2xl font-bold">
                      <Users className="w-5 h-5 text-green-500" />
                      <span>{formatNumber(project.contributors_count)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Contributors</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-2xl font-bold">
                      <AlertTriangle className="w-5 h-5 text-orange-500" />
                      <span>{formatNumber(project.issues_count)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Issues</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">License</span>
                    <Badge variant="outline">{project.license}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Created</span>
                    <span>{formatRelativeTime(project.created_at)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Updated</span>
                    <span>{formatRelativeTime(project.updated_at)}</span>
                  </div>
                  
                  {project.last_activity_at && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Last Activity</span>
                      <span>{formatRelativeTime(project.last_activity_at)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-border mb-8">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isVisible = tab.id !== 'settings' || isOwner;
            
            if (!isVisible) return null;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                  ${isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {renderTabContent()}
      </div>
    </div>
  );
}

