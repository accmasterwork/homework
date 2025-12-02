'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { ProjectDashboard } from '@/components/projects/ProjectDashboard';
import { useAuth } from '@/contexts/AuthContext';

import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Project } from '@/types/entities';

export default function ProjectDetailsPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { user, loading: authLoading } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);



  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId, user]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching project with ID:', projectId);
      
      // Use API endpoint instead of direct Supabase call
      const response = await fetch(`/api/projects?id=${projectId}`);
      const result = await response.json();

      console.log('API Response:', { status: response.status, result });

      if (!response.ok) {
        if (response.status === 404) {
          setError('Project not found');
          console.error('Project not found:', projectId);
        } else {
          setError('Failed to load project');
          console.error('Failed to load project:', response.status, result);
        }
        return;
      }

      if (!result.data) {
        setError('Invalid API response - no data');
        console.error('Invalid API response:', result);
        return;
      }

      console.log('Project loaded successfully:', result.data);
      setProject(result.data);
    } catch (err) {
      console.error('Error fetching project:', err);
      setError('Failed to load project');
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
            <div className="animate-pulse text-muted-foreground">Loading project...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">
              {error || 'Project Not Found'}
            </h1>
            <p className="text-muted-foreground mb-8">
              {error === 'Project not found' 
                ? 'The project you\'re looking for doesn\'t exist or you don\'t have permission to view it.'
                : 'There was an error loading the project. Please try again.'
              }
            </p>
            <Link href="/">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Projects
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
      <ProjectDashboard project={project} currentUser={user} />
    </div>
  );
}
