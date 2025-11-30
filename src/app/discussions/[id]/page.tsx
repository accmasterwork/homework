'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeft, MessageSquare, ThumbsUp, Reply, Calendar, User } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Discussion {
  id: string;
  title: string;
  content: string;
  category: string;
  status: string;
  upvotes: number;
  reply_count: number;
  author_name: string;
  author_email: string;
  project_id?: string;
  project_name?: string;
  created_at: string;
  updated_at: string;
}

interface Reply {
  id: string;
  content: string;
  author_name: string;
  author_email: string;
  created_at: string;
  upvotes: number;
}

export default function DiscussionDetailPage() {
  const params = useParams();
  const discussionId = params.id as string;
  const { user, loading } = useAuth();
  const router = useRouter();
  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }
    
    if (discussionId) {
      fetchDiscussion();
    }
  }, [discussionId, user, loading, router]);

  const fetchDiscussion = async () => {
    try {
      setIsLoading(true);
      
      // Mock data - in real implementation, this would fetch from /api/discussions/[id]
      const mockDiscussion: Discussion = {
        id: discussionId,
        title: 'Best practices for React component architecture',
        content: `I've been working on a large React application and I'm struggling with organizing my components effectively. 

What are your recommendations for:

1. **Component structure** - How do you organize your component files and folders?
2. **State management** - When do you use local state vs global state?
3. **Reusability** - How do you design components to be reusable across different parts of the app?
4. **Testing** - What's your approach to testing React components?

I'd love to hear about your experiences and any patterns that have worked well for you!

## Current Structure
\`\`\`
src/
  components/
    common/
    features/
    layout/
  hooks/
  utils/
\`\`\`

Any feedback would be greatly appreciated!`,
        category: 'help',
        status: 'open',
        upvotes: 23,
        reply_count: 8,
        author_name: 'Sarah Johnson',
        author_email: 'sarah@example.com',
        project_id: '1',
        project_name: 'React Dashboard',
        created_at: '2024-11-25T10:30:00Z',
        updated_at: '2024-11-28T14:20:00Z'
      };

      const mockReplies: Reply[] = [
        {
          id: '1',
          content: `Great question! Here's what has worked well for me:

**Component Structure:**
- I use feature-based organization rather than type-based
- Each feature has its own folder with components, hooks, and utils
- Common components go in a shared folder

**State Management:**
- Local state for UI-specific data (form inputs, toggles)
- Global state for data that needs to be shared across components
- I use Zustand for global state - it's simpler than Redux

Would love to share more details if you're interested!`,
          author_name: 'Mike Chen',
          author_email: 'mike@example.com',
          created_at: '2024-11-25T11:15:00Z',
          upvotes: 12
        },
        {
          id: '2',
          content: `I second Mike's approach! Feature-based organization is definitely the way to go.

For testing, I recommend:
- Jest + React Testing Library for unit tests
- Storybook for component documentation and visual testing
- Cypress for E2E tests

The key is to test behavior, not implementation details.`,
          author_name: 'Alex Rodriguez',
          author_email: 'alex@example.com',
          created_at: '2024-11-25T14:30:00Z',
          upvotes: 8
        },
        {
          id: '3',
          content: `For reusability, I've found these patterns helpful:

1. **Compound Components** - Great for flexible APIs
2. **Render Props** - When you need to share logic
3. **Custom Hooks** - For stateful logic reuse
4. **Composition over inheritance** - Always!

Here's a simple example of a compound component:

\`\`\`jsx
<Modal>
  <Modal.Header>Title</Modal.Header>
  <Modal.Body>Content</Modal.Body>
  <Modal.Footer>Actions</Modal.Footer>
</Modal>
\`\`\``,
          author_name: 'Emma Wilson',
          author_email: 'emma@example.com',
          created_at: '2024-11-26T09:45:00Z',
          upvotes: 15
        }
      ];

      setDiscussion(mockDiscussion);
      setReplies(mockReplies);
    } catch (err) {
      console.error('Error fetching discussion:', err);
      setError('Failed to load discussion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpvote = async () => {
    if (!discussion) return;
    
    try {
      // Mock upvote - in real implementation, this would call API
      setDiscussion(prev => prev ? { ...prev, upvotes: prev.upvotes + 1 } : null);
      toast.success('Upvoted!');
    } catch (error) {
      toast.error('Failed to upvote');
    }
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!replyContent.trim()) {
      toast.error('Please enter a reply');
      return;
    }

    setIsSubmittingReply(true);
    try {
      // Mock reply submission - in real implementation, this would call API
      const newReply: Reply = {
        id: `reply-${Date.now()}`,
        content: replyContent,
        author_name: user?.name || 'Anonymous',
        author_email: user?.email || '',
        created_at: new Date().toISOString(),
        upvotes: 0
      };

      setReplies(prev => [...prev, newReply]);
      setReplyContent('');
      
      if (discussion) {
        setDiscussion(prev => prev ? { ...prev, reply_count: prev.reply_count + 1 } : null);
      }
      
      toast.success('Reply posted!');
    } catch (error) {
      toast.error('Failed to post reply');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-pulse text-muted-foreground">Loading discussion...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (error || !discussion) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Discussion Not Found</h1>
            <p className="text-muted-foreground mb-6">
              {error || 'The discussion you\'re looking for doesn\'t exist or has been removed.'}
            </p>
            <Link href="/discussions">
              <Button>Back to Discussions</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      general: 'bg-blue-100 text-blue-800',
      help: 'bg-green-100 text-green-800',
      feature: 'bg-purple-100 text-purple-800',
      showcase: 'bg-yellow-100 text-yellow-800',
      feedback: 'bg-orange-100 text-orange-800',
      announcement: 'bg-red-100 text-red-800'
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/discussions"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Discussions
          </Link>
        </div>

        {/* Discussion */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge className={getCategoryColor(discussion.category)}>
                    {discussion.category}
                  </Badge>
                  {discussion.project_name && (
                    <Badge variant="outline">
                      {discussion.project_name}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-2xl mb-2">{discussion.title}</CardTitle>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    {discussion.author_name}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(discussion.created_at).toLocaleDateString()}
                  </span>
                  <span className="flex items-center">
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    {discussion.upvotes} upvotes
                  </span>
                  <span className="flex items-center">
                    <Reply className="h-3 w-3 mr-1" />
                    {discussion.reply_count} replies
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleUpvote}
                className="flex items-center space-x-1"
              >
                <ThumbsUp className="h-3 w-3" />
                <span>Upvote</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap font-sans">{discussion.content}</pre>
            </div>
          </CardContent>
        </Card>

        {/* Replies */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-foreground">
            Replies ({replies.length})
          </h3>
          
          {replies.map((reply) => (
            <Card key={reply.id}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {reply.author_name}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(reply.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground flex items-center">
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      {reply.upvotes}
                    </span>
                    <Button variant="ghost" size="sm">
                      <ThumbsUp className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap font-sans">{reply.content}</pre>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Reply Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Add a Reply
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleReplySubmit} className="space-y-4">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Share your thoughts, provide help, or ask follow-up questions..."
                rows={6}
                className="w-full"
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmittingReply || !replyContent.trim()}
                >
                  {isSubmittingReply ? 'Posting...' : 'Post Reply'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
