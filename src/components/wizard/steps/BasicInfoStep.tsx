'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Globe, Lock } from 'lucide-react';
import type { CreateProjectForm } from '@/types/entities';

interface BasicInfoStepProps {
  data: CreateProjectForm;
  updateData: (data: Partial<CreateProjectForm>) => void;
}

const licenses = [
  { value: 'MIT', label: 'MIT License', description: 'Simple and permissive' },
  { value: 'Apache-2.0', label: 'Apache 2.0', description: 'Permissive with patent protection' },
  { value: 'GPL-3.0', label: 'GPL v3', description: 'Strong copyleft' },
  { value: 'BSD-3-Clause', label: 'BSD 3-Clause', description: 'Permissive with attribution' },
  { value: 'ISC', label: 'ISC License', description: 'Simple and permissive' },
  { value: 'LGPL-2.1', label: 'LGPL v2.1', description: 'Weak copyleft' },
  { value: 'Other', label: 'Other', description: 'Custom or other license' },
];

export function BasicInfoStep({ data, updateData }: BasicInfoStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Project name is required';
        } else if (value.length < 3) {
          newErrors.name = 'Project name must be at least 3 characters';
        } else {
          delete newErrors.name;
        }
        break;
      case 'description':
        if (!value.trim()) {
          newErrors.description = 'Project description is required';
        } else if (value.length < 10) {
          newErrors.description = 'Description must be at least 10 characters';
        } else {
          delete newErrors.description;
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const handleInputChange = (field: keyof CreateProjectForm, value: string) => {
    updateData({ [field]: value });
    validateField(field, value);
  };

  return (
    <div className="space-y-6">
      {/* Project Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Project Name *
        </label>
        <input
          id="name"
          type="text"
          value={data.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="My Awesome Project"
          className={`
            w-full px-3 py-2 border rounded-md bg-background text-foreground
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            ${errors.name ? 'border-red-500' : 'border-border'}
          `}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      {/* Project Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-2">
          Project Description *
        </label>
        <textarea
          id="description"
          value={data.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="A brief description of what your project does and why it's useful..."
          rows={4}
          className={`
            w-full px-3 py-2 border rounded-md bg-background text-foreground resize-none
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            ${errors.description ? 'border-red-500' : 'border-border'}
          `}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          {data.description.length}/500 characters
        </p>
      </div>

      {/* License Selection */}
      <div>
        <label className="block text-sm font-medium mb-3">
          License *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {licenses.map((license) => (
            <button
              key={license.value}
              type="button"
              onClick={() => updateData({ license: license.value as any })}
              className={`
                p-3 border rounded-lg text-left transition-colors
                ${data.license === license.value
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border hover:border-primary/50'
                }
              `}
            >
              <div className="font-medium">{license.label}</div>
              <div className="text-sm text-muted-foreground">
                {license.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Project Visibility */}
      <div>
        <label className="block text-sm font-medium mb-3">
          Project Visibility
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => updateData({ visibility: 'public' })}
            className={`
              p-4 border rounded-lg text-left transition-colors
              ${data.visibility === 'public'
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-border hover:border-primary/50'
              }
            `}
          >
            <div className="flex items-center space-x-2 mb-2">
              <Globe className="w-5 h-5" />
              <span className="font-medium">Public</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Anyone can view this project. Great for open source projects.
            </p>
          </button>

          <button
            type="button"
            onClick={() => updateData({ visibility: 'private' })}
            className={`
              p-4 border rounded-lg text-left transition-colors
              ${data.visibility === 'private'
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-border hover:border-primary/50'
              }
            `}
          >
            <div className="flex items-center space-x-2 mb-2">
              <Lock className="w-5 h-5" />
              <span className="font-medium">Private</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Only you and invited team members can view this project.
            </p>
          </button>
        </div>
      </div>

      {/* Preview */}
      {data.name && data.description && (
        <div className="mt-8 p-4 border rounded-lg bg-muted/50">
          <h3 className="font-medium mb-2">Preview</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <h4 className="font-medium">{data.name}</h4>
              <Badge variant="outline">{data.license}</Badge>
              {data.visibility === 'private' && (
                <Badge variant="secondary">
                  <Lock className="w-3 h-3 mr-1" />
                  Private
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{data.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}

