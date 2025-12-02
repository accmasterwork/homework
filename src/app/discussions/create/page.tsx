'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function CreateDiscussionPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    project_id: ''
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      // Mock API call - in real implementation, this would call /api/discussions
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Discussion created successfully!');
      router.push('/discussions');
    } catch (error) {
      console.error('Error creating discussion:', error);
      toast.error('Failed to create discussion. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { value: 'general', label: 'General Discussion' },
    { value: 'help', label: 'Help & Support' },
    { value: 'feature', label: 'Feature Requests' },
    { value: 'showcase', label: 'Show & Tell' },
    { value: 'feedback', label: 'Feedback' },
    { value: 'announcement', label: 'Announcements' }
  ];

  const mockProjects = [
    { id: '1', name: 'React Dashboard' },
    { id: '2', name: 'Node.js API' },
    { id: '3', name: 'Vue Components' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              href="/discussions"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Discussions
            </Link>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center">
            <MessageSquare className="h-8 w-8 mr-3" />
            Start a New Discussion
          </h1>
          <p className="text-muted-foreground mt-2">
            Share your thoughts, ask questions, or start a conversation with the community
          </p>
        </div>

        {/* Create Discussion Form */}
        <Card>
          <CardHeader>
            <CardTitle>Discussion Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
                  Title *
                </label>
                <Input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter a descriptive title for your discussion"
                  className="w-full"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
                  Category
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Project Association */}
              <div>
                <label htmlFor="project" className="block text-sm font-medium text-foreground mb-2">
                  Related Project (Optional)
                </label>
                <select
                  id="project"
                  value={formData.project_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, project_id: e.target.value }))}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">No specific project</option>
                  {mockProjects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Content */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-foreground mb-2">
                  Content *
                </label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Share your thoughts, ask questions, or provide details about your discussion topic..."
                  rows={8}
                  className="w-full"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Markdown formatting is supported
                </p>
              </div>

              {/* Guidelines */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium text-foreground mb-2">Community Guidelines</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Be respectful and constructive in your discussions</li>
                  <li>• Search existing discussions before creating a new one</li>
                  <li>• Use clear and descriptive titles</li>
                  <li>• Provide context and details to help others understand</li>
                  <li>• Stay on topic and relevant to the community</li>
                </ul>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/discussions')}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
                >
                  {isSubmitting ? 'Creating...' : 'Create Discussion'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
