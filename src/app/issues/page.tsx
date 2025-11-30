'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { IssuesManager } from '@/components/issues/IssuesManager';
import { useAuth } from '@/contexts/AuthContext';

import { Button } from '@/components/ui/Button';
import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import type { Issue, Project } from '@/types/entities';

export default function IssuesPage() {
  const { user, loading: authLoading } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch user's projects
      const projectsResponse = await fetch('/api/projects');
      const projectsResult = await projectsResponse.json();
      const projectsData = projectsResult.data || [];

      // Fetch issues
      const issuesResponse = await fetch('/api/issues');
      const issuesResult = await issuesResponse.json();
      const issuesData = issuesResult.data || [];

      setProjects(projectsData);
      setIssues(issuesData);
    } catch (error) {
      console.error('Error fetching issues:', error);
    } finally {
      setLoading(false);
    }
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
