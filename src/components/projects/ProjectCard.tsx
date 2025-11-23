import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  Star, 
  GitFork, 
  Users, 
  Calendar, 
  ExternalLink,
  Github
} from 'lucide-react';
import { formatRelativeTime, formatNumber, getStatusColor } from '@/lib/utils';
import type { Project } from '@/types/entities';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              <Link href={`/projects/${project.id}`}>
                {project.name}
              </Link>
            </CardTitle>
            <Badge 
              variant="outline" 
              className={getStatusColor(project.status)}
            >
              {project.status}
            </Badge>
          </div>
          <div className="flex items-center space-x-1">
            {project.github_url && (
              <Button variant="ghost" size="icon" asChild>
                <a 
                  href={project.github_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Github className="h-4 w-4" />
                </a>
              </Button>
            )}
            {project.website_url && (
              <Button variant="ghost" size="icon" asChild>
                <a 
                  href={project.website_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-1">
          {project.tech_stack.slice(0, 3).map((tech) => (
            <Badge key={tech} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
          {project.tech_stack.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{project.tech_stack.length - 3}
            </Badge>
          )}
        </div>

        {/* License */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>License: {project.license}</span>
          <span>Updated {formatRelativeTime(project.updated_at)}</span>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4" />
              <span>{formatNumber(project.stars)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <GitFork className="h-4 w-4" />
              <span>{formatNumber(project.forks)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{formatNumber(project.contributors_count)}</span>
            </div>
          </div>
          
          <Link href={`/projects/${project.id}`}>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

