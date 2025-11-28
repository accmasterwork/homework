'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { MilestonesBoard } from '@/components/milestones/MilestonesBoard';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import type { Milestone, Project } from '@/types/entities';

export default function MilestonesPage() {
  const { user, loading: authLoading } = useAuth();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

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

      // Fetch milestones
      const { data: milestonesData } = await supabase
        .from('milestones')
        .select(`
          *,
          project:projects!milestones_project_id_fkey(id, name),
          assignee:users!milestones_assignee_id_fkey(id, name, avatar_url)
        `)
        .in('project_id', (projectsData || []).map(p => p.id))
        .order('created_at', { ascending: false });

      setProjects(projectsData || []);
      setMilestones(milestonesData || []);
    } catch (error) {
      console.error('Error fetching milestones:', error);
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

  const filteredMilestones = selectedProject 
    ? milestones.filter(m => m.project_id === selectedProject)
    : milestones;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-pulse text-muted-foreground">Loading milestones...</div>
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
              You need to sign in to view and manage milestones.
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
              <h1 className="text-3xl font-bold mb-2">Milestones</h1>
              <p className="text-muted-foreground">
                Track progress across all your projects with our Kanban-style board.
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {/* Project Filter */}
              <select
                value={selectedProject || ''}
                onChange={(e) => setSelectedProject(e.target.value || null)}
                className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">All Projects</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>

              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Milestone
              </Button>
            </div>
          </div>
        </div>

        <MilestonesBoard 
          milestones={filteredMilestones} 
          projects={projects}
          onMilestoneUpdate={fetchData}
        />
      </div>
    </div>
  );
}

