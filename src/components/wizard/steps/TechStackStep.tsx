'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Plus, X, Search } from 'lucide-react';
import type { CreateProjectForm } from '@/types/entities';

interface TechStackStepProps {
  data: CreateProjectForm;
  updateData: (data: Partial<CreateProjectForm>) => void;
}

const techCategories = {
  'Frontend': [
    'React', 'Vue.js', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js', 'Gatsby',
    'HTML', 'CSS', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'Bootstrap'
  ],
  'Backend': [
    'Node.js', 'Python', 'Java', 'Go', 'Rust', 'PHP', 'Ruby', 'C#', 'C++',
    'Express.js', 'FastAPI', 'Django', 'Flask', 'Spring Boot', 'Laravel'
  ],
  'Database': [
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Supabase',
    'Firebase', 'DynamoDB', 'Elasticsearch', 'InfluxDB'
  ],
  'Cloud & DevOps': [
    'AWS', 'Google Cloud', 'Azure', 'Docker', 'Kubernetes', 'Terraform',
    'GitHub Actions', 'GitLab CI', 'Jenkins', 'Vercel', 'Netlify'
  ],
  'Mobile': [
    'React Native', 'Flutter', 'Swift', 'Kotlin', 'Ionic', 'Xamarin',
    'Cordova', 'Expo'
  ],
  'Tools & Libraries': [
    'Git', 'Webpack', 'Vite', 'ESLint', 'Prettier', 'Jest', 'Cypress',
    'Storybook', 'GraphQL', 'REST API', 'Socket.io', 'Prisma'
  ]
};

const popularTech = [
  'React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'Docker',
  'Next.js', 'Tailwind CSS', 'Express.js', 'MongoDB', 'AWS', 'Git'
];

export function TechStackStep({ data, updateData }: TechStackStepProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [customTech, setCustomTech] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const addTechnology = (tech: string) => {
    if (tech.trim() && !data.tech_stack.includes(tech.trim())) {
      updateData({ tech_stack: [...data.tech_stack, tech.trim()] });
      setCustomTech('');
    }
  };

  const removeTechnology = (tech: string) => {
    const newTechStack = data.tech_stack.filter(t => t !== tech);
    updateData({ tech_stack: newTechStack });
  };

  const getFilteredTechnologies = () => {
    const allTech = selectedCategory 
      ? techCategories[selectedCategory as keyof typeof techCategories] || []
      : Object.values(techCategories).flat();
    
    return allTech.filter(tech => 
      tech.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !data.tech_stack.includes(tech)
    );
  };

  return (
    <div className="space-y-6">
      {/* Current Tech Stack */}
      {data.tech_stack.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-3">Selected Technologies</h3>
          <div className="flex flex-wrap gap-2">
            {data.tech_stack.map((tech) => (
              <Badge key={tech} variant="default" className="flex items-center space-x-1">
                <span>{tech}</span>
                <button
                  type="button"
                  onClick={() => removeTechnology(tech)}
                  className="ml-1 hover:bg-primary-foreground/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Popular Technologies */}
      <div>
        <h3 className="text-sm font-medium mb-3">Popular Technologies</h3>
        <div className="flex flex-wrap gap-2">
          {popularTech
            .filter(tech => !data.tech_stack.includes(tech))
            .map((tech) => (
              <Button
                key={tech}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addTechnology(tech)}
              >
                <Plus className="w-3 h-3 mr-1" />
                {tech}
              </Button>
            ))}
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <h3 className="text-sm font-medium mb-3">Browse by Category</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            type="button"
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {Object.keys(techCategories).map((category) => (
            <Button
              key={category}
              type="button"
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search technologies..."
            className="w-full pl-10 pr-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Technology Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-60 overflow-y-auto">
          {getFilteredTechnologies().slice(0, 20).map((tech) => (
            <Button
              key={tech}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => addTechnology(tech)}
              className="justify-start"
            >
              <Plus className="w-3 h-3 mr-1" />
              {tech}
            </Button>
          ))}
        </div>
      </div>

      {/* Add Custom Technology */}
      <div>
        <h3 className="text-sm font-medium mb-3">Add Custom Technology</h3>
        <div className="flex space-x-2">
          <input
            type="text"
            value={customTech}
            onChange={(e) => setCustomTech(e.target.value)}
            placeholder="Enter technology name..."
            className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTechnology(customTech);
              }
            }}
          />
          <Button
            type="button"
            onClick={() => addTechnology(customTech)}
            disabled={!customTech.trim()}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tech Stack Summary */}
      {data.tech_stack.length > 0 && (
        <div className="mt-8 p-4 border rounded-lg bg-muted/50">
          <h3 className="font-medium mb-3">Tech Stack Summary</h3>
          <div className="space-y-3">
            {Object.entries(techCategories).map(([category, techs]) => {
              const categoryTechs = data.tech_stack.filter(tech => techs.includes(tech));
              if (categoryTechs.length === 0) return null;
              
              return (
                <div key={category}>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    {category}
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {categoryTechs.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              );
            })}
            
            {/* Custom/Other technologies */}
            {(() => {
              const allKnownTechs = Object.values(techCategories).flat();
              const customTechs = data.tech_stack.filter(tech => !allKnownTechs.includes(tech));
              if (customTechs.length === 0) return null;
              
              return (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Other
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {customTechs.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
          
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-sm text-muted-foreground">
              <strong>{data.tech_stack.length}</strong> technologies selected
            </p>
          </div>
        </div>
      )}

      {data.tech_stack.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>Select at least one technology to continue</p>
        </div>
      )}
    </div>
  );
}

