'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Github, 
  Globe, 
  BookOpen,
  Check,
  Loader2
} from 'lucide-react';
import { BasicInfoStep } from './steps/BasicInfoStep';
import { VisionScopeStep } from './steps/VisionScopeStep';
import { TechStackStep } from './steps/TechStackStep';
import { IntegrationsStep } from './steps/IntegrationsStep';
import { ReviewStep } from './steps/ReviewStep';
import { createClient } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import type { CreateProjectForm } from '@/types/entities';

const steps = [
  {
    id: 'basic',
    title: 'Basic Information',
    description: 'Project name, description, and license',
    icon: BookOpen,
  },
  {
    id: 'vision',
    title: 'Vision & Scope',
    description: 'Define your project vision and goals',
    icon: Sparkles,
  },
  {
    id: 'tech',
    title: 'Tech Stack',
    description: 'Choose your technologies and tools',
    icon: Globe,
  },
  {
    id: 'integrations',
    title: 'Integrations',
    description: 'Connect GitHub and other services',
    icon: Github,
  },
  {
    id: 'review',
    title: 'Review & Create',
    description: 'Review your project and create it',
    icon: Check,
  },
];

export function ProjectWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<CreateProjectForm>({
    name: '',
    description: '',
    vision: '',
    goals: [],
    scope: '',
    license: 'MIT',
    tech_stack: [],
    github_url: '',
    website_url: '',
    visibility: 'public',
  });

  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const updateFormData = (data: Partial<CreateProjectForm>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: // Basic Info
        return formData.name.trim() && formData.description.trim() && formData.license;
      case 1: // Vision & Scope
        return true; // Optional fields
      case 2: // Tech Stack
        return formData.tech_stack.length > 0;
      case 3: // Integrations
        return true; // Optional fields
      case 4: // Review
        return true;
      default:
        return false;
    }
  };

  const createProject = async () => {
    if (!user) {
      toast.error('You must be signed in to create a project');
      return;
    }

    setIsCreating(true);
    try {
      // Use our API endpoint instead of direct Supabase call
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          owner_id: user.id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create project');
      }

      toast.success('Project created successfully!');
      router.push(`/projects/${result.data.id}`);
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicInfoStep
            data={formData}
            updateData={updateFormData}
          />
        );
      case 1:
        return (
          <VisionScopeStep
            data={formData}
            updateData={updateFormData}
          />
        );
      case 2:
        return (
          <TechStackStep
            data={formData}
            updateData={updateFormData}
          />
        );
      case 3:
        return (
          <IntegrationsStep
            data={formData}
            updateData={updateFormData}
          />
        );
      case 4:
        return (
          <ReviewStep
            data={formData}
            onCreateProject={createProject}
            isCreating={isCreating}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          
          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors
                    ${isActive 
                      ? 'bg-primary text-primary-foreground border-primary' 
                      : isCompleted 
                        ? 'bg-green-500 text-white border-green-500'
                        : 'bg-background text-muted-foreground border-border'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <div className="mt-2 text-center">
                  <div className={`text-sm font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-muted-foreground hidden sm:block">
                    {step.description}
                  </div>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className={`
                  w-16 h-0.5 mx-4 transition-colors
                  ${isCompleted ? 'bg-green-500' : 'bg-border'}
                `} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {React.createElement(steps[currentStep].icon, { className: "w-5 h-5" })}
            <span>{steps[currentStep].title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderStep()}
        </CardContent>
      </Card>

      {/* Navigation */}
      {currentStep < steps.length - 1 && (
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <Button
            onClick={nextStep}
            disabled={!canProceed()}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
