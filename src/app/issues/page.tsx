'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { IssuesManager } from '@/components/issues/IssuesManager';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import type { Issue, Project } from '@/types/entities';

export default function IssuesPage() {
  const { user, loading: authLoading } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch user's projects
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .or(`owner_id.eq.${user?.id},id.in.(${await getUserProjectIds()})`);

      // Fetch issues
      const { data: issuesData } = await supabase
        .from('issues')
        .select(`
          *,
          project:projects!issues_project_id_fkey(id, name),
          assignee:users!issues_assignee_id_fkey(id, name, avatar_url),
          reporter:users!issues_reporter_id_fkey(id, name, avatar_url)
        `)
        .in('project_id', (projectsData || []).map(p => p.id))
        .order('created_at', { ascending: false });

      setProjects(projectsData || []);
      setIssues(issuesData || []);
    } catch (error) {
      console.error('Error fetching issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserProjectIds = async () => {
    if (!user) return [];
    
    const { data } = await supabase
      .from('project_members')
      .select('project_id')
      .eq('user_id', user.id);
    
    return (data || []).map(pm => pm.project_id);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-pulse text-muted-foreground">Loading issues...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Sign In Required</h1>
            <p className="text-muted-foreground mb-8">
              You need to sign in to view and manage issues.
            </p>
            <Link href="/">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Issues</h1>
              <p className="text-muted-foreground">
                Track bugs, features, and tasks across all your projects.
              </p>
            </div>

            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Issue
            </Button>
          </div>
        </div>

        <IssuesManager 
          issues={issues} 
          projects={projects}
          onIssueUpdate={fetchData}
        />
      </div>
    </div>
  );
}

