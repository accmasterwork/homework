'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Sparkles, Plus, X, Lightbulb } from 'lucide-react';
import type { CreateProjectForm } from '@/types/entities';

interface VisionScopeStepProps {
  data: CreateProjectForm;
  updateData: (data: Partial<CreateProjectForm>) => void;
}

const visionPrompts = [
  "What problem does your project solve?",
  "Who is your target audience?",
  "What makes your project unique?",
  "What impact do you want to create?",
];

const goalSuggestions = [
  "Reach 1,000 GitHub stars",
  "Build an active community of contributors",
  "Create comprehensive documentation",
  "Achieve stable 1.0 release",
  "Support multiple programming languages",
  "Integrate with popular tools and platforms",
  "Maintain 95% test coverage",
  "Establish regular release schedule",
];

export function VisionScopeStep({ data, updateData }: VisionScopeStepProps) {
  const [newGoal, setNewGoal] = useState('');
  const [isGeneratingVision, setIsGeneratingVision] = useState(false);

  const addGoal = (goal: string) => {
    if (goal.trim() && !(data.goals || []).includes(goal.trim())) {
      updateData({ goals: [...(data.goals || []), goal.trim()] });
      setNewGoal('');
    }
  };

  const removeGoal = (index: number) => {
    const newGoals = (data.goals || []).filter((_, i) => i !== index);
    updateData({ goals: newGoals });
  };

  const generateVisionWithAI = async () => {
    if (!data.name || !data.description) {
      return;
    }

    setIsGeneratingVision(true);
    try {
      // Simulate AI generation (replace with actual OpenAI API call)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const generatedVision = `${data.name} aims to revolutionize the way developers ${data.description.toLowerCase()}. Our vision is to create an intuitive, powerful, and accessible solution that empowers teams to build better software faster. We believe in the power of open source collaboration and strive to build a thriving community around our project.

By focusing on developer experience and community-driven development, we aim to become the go-to solution in our domain. Our commitment to quality, documentation, and inclusive contribution practices will help us build a sustainable and impactful project that serves developers worldwide.`;

      updateData({ vision: generatedVision });
    } catch (error) {
      console.error('Error generating vision:', error);
    } finally {
      setIsGeneratingVision(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Vision Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label htmlFor="vision" className="block text-sm font-medium">
            Project Vision
          </label>
          {data.name && data.description && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={generateVisionWithAI}
              disabled={isGeneratingVision}
            >
              {isGeneratingVision ? (
                <>
                  <div className="animate-spin w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate with AI
                </>
              )}
            </Button>
          )}
        </div>
        
        <textarea
          id="vision"
          value={data.vision || ''}
          onChange={(e) => updateData({ vision: e.target.value })}
          placeholder="Describe your project's vision, mission, and long-term goals. What impact do you want to create?"
          rows={6}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        
        <div className="mt-2 space-y-2">
          <p className="text-xs text-muted-foreground">
            Consider these questions to help define your vision:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {visionPrompts.map((prompt, index) => (
              <div key={index} className="flex items-start space-x-2 text-xs text-muted-foreground">
                <Lightbulb className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>{prompt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Goals Section */}
      <div>
        <label className="block text-sm font-medium mb-3">
          Project Goals
        </label>
        
        {/* Current Goals */}
        {(data.goals || []).length > 0 && (
          <div className="mb-4 space-y-2">
            {(data.goals || []).map((goal, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/50">
                <span className="text-sm">{goal}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeGoal(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Add New Goal */}
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder="Add a project goal..."
            className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addGoal(newGoal);
              }
            }}
          />
          <Button
            type="button"
            onClick={() => addGoal(newGoal)}
            disabled={!newGoal.trim()}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Goal Suggestions */}
        <div>
          <p className="text-sm text-muted-foreground mb-2">Suggested goals:</p>
          <div className="flex flex-wrap gap-2">
            {goalSuggestions
              .filter(suggestion => !(data.goals || []).includes(suggestion))
              .slice(0, 6)
              .map((suggestion, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addGoal(suggestion)}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  {suggestion}
                </Button>
              ))}
          </div>
        </div>
      </div>

      {/* Scope Section */}
      <div>
        <label htmlFor="scope" className="block text-sm font-medium mb-2">
          Project Scope
        </label>
        <textarea
          id="scope"
          value={data.scope || ''}
          onChange={(e) => updateData({ scope: e.target.value })}
          placeholder="Define what's included and excluded from your project. What are the boundaries and limitations?"
          rows={4}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Clearly defining scope helps contributors understand what the project will and won't do.
        </p>
      </div>

      {/* Preview */}
      {(data.vision || (data.goals || []).length > 0 || data.scope) && (
        <div className="mt-8 p-4 border rounded-lg bg-muted/50">
          <h3 className="font-medium mb-3">Preview</h3>
          <div className="space-y-4">
            {data.vision && (
              <div>
                <h4 className="text-sm font-medium mb-1">Vision</h4>
                <p className="text-sm text-muted-foreground">{data.vision}</p>
              </div>
            )}
            
            {(data.goals || []).length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Goals</h4>
                <ul className="space-y-1">
                  {(data.goals || []).map((goal, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start">
                      <span className="mr-2">•</span>
                      <span>{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {data.scope && (
              <div>
                <h4 className="text-sm font-medium mb-1">Scope</h4>
                <p className="text-sm text-muted-foreground">{data.scope}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
