import { Suspense } from 'react';
import { Header } from '@/components/layout/Header';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { Button } from '@/components/ui/Button';
import { Plus, Github, Star, Users, BookOpen } from 'lucide-react';
import Link from 'next/link';

// Mock data for demonstration
const mockProjects = [
  {
    id: '1',
    name: 'React UI Library',
    description: 'A comprehensive React component library with TypeScript support',
    license: 'MIT',
    techStack: ['React', 'TypeScript', 'Tailwind CSS'],
    stars: 1234,
    forks: 89,
    contributors: 23,
    status: 'active' as const,
    lastUpdated: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Node.js API Framework',
    description: 'Fast and lightweight API framework for Node.js applications',
    license: 'Apache-2.0',
    techStack: ['Node.js', 'Express', 'MongoDB'],
    stars: 856,
    forks: 67,
    contributors: 15,
    status: 'active' as const,
    lastUpdated: new Date('2024-01-10'),
  },
  {
    id: '3',
    name: 'Python Data Tools',
    description: 'Collection of data analysis and visualization tools for Python',
    license: 'GPL-3.0',
    techStack: ['Python', 'Pandas', 'Matplotlib'],
    stars: 432,
    forks: 34,
    contributors: 8,
    status: 'maintenance' as const,
    lastUpdated: new Date('2023-12-20'),
  },
];

const features = [
  {
    icon: Github,
    title: 'GitHub Integration',
    description: 'Seamlessly sync with your GitHub repositories and track real-time metrics',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Manage contributors, assign roles, and track team contributions',
  },
  {
    icon: BookOpen,
    title: 'Documentation Hub',
    description: 'Centralized documentation with rich text editing and version control',
  },
  {
    icon: Star,
    title: 'AI-Powered Insights',
    description: 'Get intelligent suggestions for project scope, vision, and content',
  },
];

function ProjectsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockProjects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

function FeaturesSection() {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Powerful Features for Open Source Success</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to manage, grow, and maintain your open source projects
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HeroSection() {
  return (
    <section className="py-20 text-center">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Manage Open Source Projects Like a Pro
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Comprehensive platform for managing every aspect of your open source projects. 
          Track milestones, manage contributors, organize documentation, and grow your community.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/wizard">
            <Button size="lg" className="text-lg px-8">
              <Plus className="w-5 h-5 mr-2" />
              Create New Project
            </Button>
          </Link>
          <Link href="/projects">
            <Button variant="outline" size="lg" className="text-lg px-8">
              Browse Projects
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        <HeroSection />
        <FeaturesSection />
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Featured Projects</h2>
                <p className="text-muted-foreground">
                  Discover and explore amazing open source projects
                </p>
              </div>
              <Link href="/projects">
                <Button variant="outline">View All Projects</Button>
              </Link>
            </div>
            
            <Suspense fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-card border rounded-lg p-6 animate-pulse">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-full mb-4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            }>
              <ProjectsGrid />
            </Suspense>
          </div>
        </section>
      </main>
      
      <footer className="bg-muted/50 py-12 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2024 Open Source Project Manager. Built with ❤️ for the open source community.
          </p>
        </div>
      </footer>
    </div>
  );
}

