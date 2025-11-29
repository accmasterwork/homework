'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  Target, 
  AlertTriangle, 
  Users, 
  FileText, 
  MessageSquare,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  Plus,
  ArrowRight
} from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { formatRelativeTime, getPriorityColor } from '@/lib/utils';
import Link from 'next/link';
import type { Project, User, Milestone, Issue } from '@/types/entities';

interface ProjectOverviewProps {
  project: Project;
  currentUser: User | null;
}

export function ProjectOverview({ project, currentUser }: ProjectOverviewProps) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [recentIssues, setRecentIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    fetchOverviewData();
  }, [project.id]);

  const fetchOverviewData = async () => {
    try {
      setLoading(true);
      
      // Use mock data for demo purposes
      // In production, this would fetch from API endpoints
      const mockMilestones: Milestone[] = [
        {
          id: '1',
          project_id: project.id,
          title: 'MVP Release',
          description: 'Complete minimum viable product',
          type: 'release',
          status: 'in_progress',
          target_date: '2024-12-15',
          created_at: '2024-11-01T10:00:00Z',
          updated_at: '2024-11-28T14:30:00Z'
        },
        {
          id: '2',
          project_id: project.id,
          title: 'Beta Testing',
          description: 'Conduct beta testing with users',
          type: 'community',
          status: 'planned',
          target_date: '2024-12-30',
          created_at: '2024-11-15T10:00:00Z',
          updated_at: '2024-11-28T14:30:00Z'
        }
      ];

      const mockIssues: Issue[] = [
        {
          id: '1',
          project_id: project.id,
          title: 'Fix mobile responsive design',
          description: 'Dashboard not displaying correctly on mobile devices',
          type: 'bug',
          status: 'open',
          priority: 'high',
          assignee_id: 'user-123',
          reporter_id: 'user-456',
          created_at: '2024-11-28T10:00:00Z',
          updated_at: '2024-11-28T14:30:00Z',
          assignee: {
            id: 'user-123',
            name: 'John Doe',
            avatar_url: null
          },
          reporter: {
            id: 'user-456',
            name: 'Jane Smith',
            avatar_url: null
          }
        },
        {
          id: '2',
          project_id: project.id,
          title: 'Add dark mode support',
          description: 'Implement dark mode theme option',
          type: 'feature',
          status: 'in_progress',
          priority: 'medium',
          assignee_id: 'user-789',
          reporter_id: 'user-123',
          created_at: '2024-11-27T10:00:00Z',
          updated_at: '2024-11-28T14:30:00Z',
          assignee: {
            id: 'user-789',
            name: 'Bob Wilson',
            avatar_url: null
          },
          reporter: {
            id: 'user-123',
            name: 'John Doe',
            avatar_url: null
          }
        }
      ];

      setMilestones(mockMilestones);
      setRecentIssues(mockIssues);
    } catch (error) {
      console.error('Error fetching overview data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const activeMilestones = milestones.filter(m => m.status === 'in_progress');
  const completedMilestones = milestones.filter(m => m.status === 'completed');
  const openIssues = recentIssues.filter(i => i.status === 'open');
  const inProgressIssues = recentIssues.filter(i => i.status === 'in_progress');

  return (
    <div className="space-y-8">
      {/* Project Vision */}
      {project.vision && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Project Vision</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {project.vision}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Project Goals */}
      {project.goals && project.goals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Project Goals</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {project.goals.map((goal, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                  <span className="text-muted-foreground">{goal}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{activeMilestones.length}</p>
                <p className="text-sm text-muted-foreground">Active Milestones</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{openIssues.length}</p>
                <p className="text-sm text-muted-foreground">Open Issues</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{inProgressIssues.length}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{completedMilestones.length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Milestones */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Recent Milestones</span>
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/projects/${project.id}?tab=milestones`}>
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {milestones.length > 0 ? (
              <div className="space-y-4">
                {milestones.map((milestone) => (
                  <div key={milestone.id} className="flex items-start space-x-3 p-3 border border-border rounded-lg">
                    <div className={`
                      w-3 h-3 rounded-full mt-1.5 flex-shrink-0
                      ${milestone.status === 'completed' ? 'bg-green-500' : 
                        milestone.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-400'}
                    `} />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{milestone.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {milestone.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {milestone.type}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getPriorityColor(milestone.priority)}`}
                        >
                          {milestone.priority}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(milestone.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No milestones yet</p>
                <Button variant="outline" size="sm" className="mt-2">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Milestone
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Issues */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Recent Issues</span>
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/projects/${project.id}?tab=issues`}>
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentIssues.length > 0 ? (
              <div className="space-y-4">
                {recentIssues.map((issue) => (
                  <div key={issue.id} className="flex items-start space-x-3 p-3 border border-border rounded-lg">
                    <div className={`
                      w-3 h-3 rounded-full mt-1.5 flex-shrink-0
                      ${issue.status === 'closed' ? 'bg-green-500' : 
                        issue.status === 'in_progress' ? 'bg-blue-500' : 'bg-red-500'}
                    `} />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{issue.title}</h4>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {issue.type}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getPriorityColor(issue.priority)}`}
                        >
                          {issue.priority}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(issue.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No issues yet</p>
                <Button variant="outline" size="sm" className="mt-2">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Issue
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Project Scope */}
      {project.scope && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Project Scope</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {project.scope}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
