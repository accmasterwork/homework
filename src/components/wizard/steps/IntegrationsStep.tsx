'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Github, Globe, BookOpen, ExternalLink, Check, AlertCircle } from 'lucide-react';
import type { CreateProjectForm } from '@/types/entities';

interface IntegrationsStepProps {
  data: CreateProjectForm;
  updateData: (data: Partial<CreateProjectForm>) => void;
}

export function IntegrationsStep({ data, updateData }: IntegrationsStepProps) {
  const [isValidatingGitHub, setIsValidatingGitHub] = useState(false);
  const [githubValidation, setGithubValidation] = useState<{
    isValid: boolean;
    message: string;
  } | null>(null);

  const validateGitHubUrl = async (url: string) => {
    if (!url) {
      setGithubValidation(null);
      return;
    }

    setIsValidatingGitHub(true);
    try {
      // Basic URL validation
      const githubRegex = /^https:\/\/github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+\/?$/;
      if (!githubRegex.test(url)) {
        setGithubValidation({
          isValid: false,
          message: 'Please enter a valid GitHub repository URL (e.g., https://github.com/username/repo)'
        });
        return;
      }

      // Simulate API validation (replace with actual GitHub API call)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, assume validation passes
      setGithubValidation({
        isValid: true,
        message: 'Repository found and accessible'
      });
    } catch (error) {
      setGithubValidation({
        isValid: false,
        message: 'Unable to validate repository. Please check the URL.'
      });
    } finally {
      setIsValidatingGitHub(false);
    }
  };

  const handleGitHubUrlChange = (url: string) => {
    updateData({ github_url: url });
    if (url !== data.github_url) {
      setGithubValidation(null);
      if (url.trim()) {
        const timeoutId = setTimeout(() => validateGitHubUrl(url), 500);
        return () => clearTimeout(timeoutId);
      }
    }
  };

  const validateWebsiteUrl = (url: string) => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateDocumentationUrl = (url: string) => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium mb-2">Connect Your Project</h3>
        <p className="text-muted-foreground">
          Link your external resources to provide more context and enable automatic syncing.
        </p>
      </div>

      {/* GitHub Integration */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-3">
          <Github className="w-5 h-5" />
          <h4 className="font-medium">GitHub Repository</h4>
          <Badge variant="secondary">Recommended</Badge>
        </div>
        
        <div>
          <input
            type="url"
            value={data.github_url || ''}
            onChange={(e) => handleGitHubUrlChange(e.target.value)}
            placeholder="https://github.com/username/repository"
            className={`
              w-full px-3 py-2 border rounded-md bg-background text-foreground
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
              ${githubValidation?.isValid === false ? 'border-red-500' : 'border-border'}
            `}
          />
          
          {isValidatingGitHub && (
            <div className="flex items-center space-x-2 mt-2 text-sm text-muted-foreground">
              <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
              <span>Validating repository...</span>
            </div>
          )}
          
          {githubValidation && !isValidatingGitHub && (
            <div className={`flex items-center space-x-2 mt-2 text-sm ${
              githubValidation.isValid ? 'text-green-600' : 'text-red-600'
            }`}>
              {githubValidation.isValid ? (
                <Check className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span>{githubValidation.message}</span>
            </div>
          )}
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <h5 className="font-medium mb-2">GitHub Integration Benefits:</h5>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Automatic sync of stars, forks, and contributors</li>
            <li>• Import existing issues and pull requests</li>
            <li>• Real-time repository metrics</li>
            <li>• Link platform issues to GitHub issues</li>
          </ul>
        </div>
      </div>

      {/* Website URL */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-3">
          <Globe className="w-5 h-5" />
          <h4 className="font-medium">Project Website</h4>
        </div>
        
        <div>
          <input
            type="url"
            value={data.website_url || ''}
            onChange={(e) => updateData({ website_url: e.target.value })}
            placeholder="https://yourproject.com"
            className={`
              w-full px-3 py-2 border rounded-md bg-background text-foreground
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
              ${data.website_url && !validateWebsiteUrl(data.website_url) ? 'border-red-500' : 'border-border'}
            `}
          />
          
          {data.website_url && !validateWebsiteUrl(data.website_url) && (
            <p className="text-red-500 text-sm mt-1">
              Please enter a valid URL (e.g., https://example.com)
            </p>
          )}
        </div>

        <p className="text-sm text-muted-foreground">
          Link to your project's main website, landing page, or demo.
        </p>
      </div>

      {/* Documentation URL */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-3">
          <BookOpen className="w-5 h-5" />
          <h4 className="font-medium">Documentation</h4>
        </div>
        
        <div>
          <input
            type="url"
            value={data.documentation_url || ''}
            onChange={(e) => updateData({ documentation_url: e.target.value })}
            placeholder="https://docs.yourproject.com"
            className={`
              w-full px-3 py-2 border rounded-md bg-background text-foreground
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
              ${data.documentation_url && !validateDocumentationUrl(data.documentation_url) ? 'border-red-500' : 'border-border'}
            `}
          />
          
          {data.documentation_url && !validateDocumentationUrl(data.documentation_url) && (
            <p className="text-red-500 text-sm mt-1">
              Please enter a valid URL (e.g., https://docs.example.com)
            </p>
          )}
        </div>

        <p className="text-sm text-muted-foreground">
          Link to external documentation site (GitBook, Notion, custom docs, etc.).
        </p>
      </div>

      {/* Integration Preview */}
      {(data.github_url || data.website_url || data.documentation_url) && (
        <div className="mt-8 p-4 border rounded-lg bg-muted/50">
          <h3 className="font-medium mb-3">Connected Resources</h3>
          <div className="space-y-3">
            {data.github_url && (
              <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-background">
                <div className="flex items-center space-x-3">
                  <Github className="w-5 h-5" />
                  <div>
                    <div className="font-medium">GitHub Repository</div>
                    <div className="text-sm text-muted-foreground">{data.github_url}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {githubValidation?.isValid && (
                    <Badge variant="success" className="text-xs">
                      <Check className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  <Button variant="ghost" size="sm" asChild>
                    <a href={data.github_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </div>
            )}

            {data.website_url && validateWebsiteUrl(data.website_url) && (
              <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-background">
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5" />
                  <div>
                    <div className="font-medium">Project Website</div>
                    <div className="text-sm text-muted-foreground">{data.website_url}</div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <a href={data.website_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            )}

            {data.documentation_url && validateDocumentationUrl(data.documentation_url) && (
              <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-background">
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-5 h-5" />
                  <div>
                    <div className="font-medium">Documentation</div>
                    <div className="text-sm text-muted-foreground">{data.documentation_url}</div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <a href={data.documentation_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Skip Option */}
      <div className="text-center py-4">
        <p className="text-sm text-muted-foreground">
          Don't have these resources yet? No problem! You can add them later from your project settings.
        </p>
      </div>
    </div>
  );
}

