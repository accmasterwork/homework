'use client';

import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  Rocket, 
  Github, 
  Globe, 
  BookOpen, 
  Lock, 
  Users,
  Target,
  Code,
  Loader2
} from 'lucide-react';
import type { CreateProjectForm } from '@/types/entities';

interface ReviewStepProps {
  data: CreateProjectForm;
  onCreateProject: () => void;
  isCreating: boolean;
}

export function ReviewStep({ data, onCreateProject, isCreating }: ReviewStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium mb-2">Review Your Project</h3>
        <p className="text-muted-foreground">
          Take a final look at your project details before creating it.
        </p>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5" />
            <span>Basic Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="font-medium text-lg">{data.name}</h4>
              <Badge variant="outline">{data.license}</Badge>
              {data.visibility === 'private' && (
                <Badge variant="secondary">
                  <Lock className="w-3 h-3 mr-1" />
                  Private
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">{data.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Vision & Goals */}
      {(data.vision || (data.goals || []).length > 0 || data.scope) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Vision & Goals</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.vision && (
              <div>
                <h5 className="font-medium mb-2">Vision</h5>
                <p className="text-sm text-muted-foreground">{data.vision}</p>
              </div>
            )}
            
            {(data.goals || []).length > 0 && (
              <div>
                <h5 className="font-medium mb-2">Goals ({(data.goals || []).length})</h5>
                <ul className="space-y-1">
                  {(data.goals || []).slice(0, 5).map((goal, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start">
                      <span className="mr-2">•</span>
                      <span>{goal}</span>
                    </li>
                  ))}
                  {(data.goals || []).length > 5 && (
                    <li className="text-sm text-muted-foreground">
                      ... and {(data.goals || []).length - 5} more goals
                    </li>
                  )}
                </ul>
              </div>
            )}
            
            {data.scope && (
              <div>
                <h5 className="font-medium mb-2">Scope</h5>
                <p className="text-sm text-muted-foreground">{data.scope}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tech Stack */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Code className="w-5 h-5" />
            <span>Tech Stack</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {(data.tech_stack || []).map((tech) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {(data.tech_stack || []).length} technologies selected
          </p>
        </CardContent>
      </Card>

      {/* Integrations */}
      {(data.github_url || data.website_url || data.documentation_url) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <span>Connected Resources</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.github_url && (
              <div className="flex items-center space-x-3 p-2 border border-border rounded-lg">
                <Github className="w-4 h-4" />
                <div className="flex-1">
                  <div className="text-sm font-medium">GitHub Repository</div>
                  <div className="text-xs text-muted-foreground">{data.github_url}</div>
                </div>
              </div>
            )}
            
            {data.website_url && (
              <div className="flex items-center space-x-3 p-2 border border-border rounded-lg">
                <Globe className="w-4 h-4" />
                <div className="flex-1">
                  <div className="text-sm font-medium">Project Website</div>
                  <div className="text-xs text-muted-foreground">{data.website_url}</div>
                </div>
              </div>
            )}
            
            {data.documentation_url && (
              <div className="flex items-center space-x-3 p-2 border border-border rounded-lg">
                <BookOpen className="w-4 h-4" />
                <div className="flex-1">
                  <div className="text-sm font-medium">Documentation</div>
                  <div className="text-xs text-muted-foreground">{data.documentation_url}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* What happens next */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-primary">
            <Rocket className="w-5 h-5" />
            <span>What happens next?</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start space-x-2">
              <span className="text-primary">•</span>
              <span>Your project will be created with all the information you've provided</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary">•</span>
              <span>You'll be redirected to your project dashboard</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary">•</span>
              <span>You can start adding milestones, issues, and documentation</span>
            </li>
            {data.github_url && (
              <li className="flex items-start space-x-2">
                <span className="text-primary">•</span>
                <span>GitHub integration will sync your repository data automatically</span>
              </li>
            )}
            <li className="flex items-start space-x-2">
              <span className="text-primary">•</span>
              <span>Invite team members and start collaborating</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Create Project Button */}
      <div className="flex justify-center pt-4">
        <Button
          size="lg"
          onClick={onCreateProject}
          disabled={isCreating}
          className="px-8"
        >
          {isCreating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating Project...
            </>
          ) : (
            <>
              <Rocket className="w-4 h-4 mr-2" />
              Create Project
            </>
          )}
        </Button>
      </div>

      {/* Terms and Privacy */}
      <div className="text-center text-xs text-muted-foreground">
        <p>
          By creating this project, you agree to our{' '}
          <a href="/terms" className="underline hover:text-foreground">Terms of Service</a>
          {' '}and{' '}
          <a href="/privacy" className="underline hover:text-foreground">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
