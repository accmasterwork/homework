'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Plus, 
  ThumbsUp, 
  MessageCircle, 
  Clock, 
  User,
  Tag,
  TrendingUp,
  ArrowUp
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface Discussion {
  id: string;
  project_id: string;
  project_name: string;
  title: string;
  content: string;
  category: 'general' | 'help' | 'feature-request' | 'bug-report' | 'announcement';
  status: 'open' | 'closed' | 'resolved';
  upvotes: number;
  reply_count: number;
  author_name: string;
  author_email: string;
  created_at: string;
  updated_at: string;
  last_reply_at?: string;
}

export default function DiscussionsPage() {
  const router = useRouter();
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'general' | 'help' | 'feature-request' | 'bug-report' | 'announcement'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'closed' | 'resolved'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'replies'>('recent');

  useEffect(() => {
    const checkAuth = async () => {
      // Check for mock session (works without Supabase)
      const mockSession = localStorage.getItem('mockSession');
      const mockUserData = localStorage.getItem('mockUser');
      
      if (!mockSession || !mockUserData) {
        router.push('/login');
        return;
      }

      await loadDiscussions();
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const loadDiscussions = async () => {
    // Mock discussion data for demo
    const mockDiscussions: Discussion[] = [
      {
        id: '1',
        project_id: '1',
        project_name: 'React Dashboard',
        title: 'How to customize the theme colors?',
        content: 'I\'m trying to customize the theme colors for my dashboard but can\'t find the right configuration. Can someone help me understand how to modify the color scheme?',
        category: 'help',
        status: 'open',
        upvotes: 12,
        reply_count: 5,
        author_name: 'John Doe',
        author_email: 'john.doe@example.com',
        created_at: '2024-11-28T10:30:00Z',
        updated_at: '2024-11-28T14:45:00Z',
        last_reply_at: '2024-11-28T14:45:00Z'
      },
      {
        id: '2',
        project_id: '1',
        project_name: 'React Dashboard',
        title: 'Feature Request: Dark mode support',
        content: 'It would be great to have built-in dark mode support. Many users prefer dark themes, especially for dashboards used in low-light environments.',
        category: 'feature-request',
        status: 'open',
        upvotes: 28,
        reply_count: 12,
        author_name: 'Jane Smith',
        author_email: 'jane.smith@example.com',
        created_at: '2024-11-27T16:20:00Z',
        updated_at: '2024-11-28T09:15:00Z',
        last_reply_at: '2024-11-28T09:15:00Z'
      },
      {
        id: '3',
        project_id: '2',
        project_name: 'Node.js API',
        title: 'API rate limiting implementation',
        content: 'What\'s the best approach for implementing rate limiting in the API? Looking for recommendations on libraries and strategies.',
        category: 'general',
        status: 'resolved',
        upvotes: 15,
        reply_count: 8,
        author_name: 'Bob Wilson',
        author_email: 'bob.wilson@example.com',
        created_at: '2024-11-26T14:10:00Z',
        updated_at: '2024-11-27T11:30:00Z',
        last_reply_at: '2024-11-27T11:30:00Z'
      },
      {
        id: '4',
        project_id: '1',
        project_name: 'React Dashboard',
        title: 'Bug: Charts not rendering on mobile',
        content: 'The dashboard charts are not rendering properly on mobile devices. They appear blank or distorted. This affects the mobile user experience significantly.',
        category: 'bug-report',
        status: 'open',
        upvotes: 8,
        reply_count: 3,
        author_name: 'Alice Brown',
        author_email: 'alice.brown@example.com',
        created_at: '2024-11-25T09:45:00Z',
        updated_at: '2024-11-26T16:20:00Z',
        last_reply_at: '2024-11-26T16:20:00Z'
      },
      {
        id: '5',
        project_id: '3',
        project_name: 'Python ML Library',
        title: 'Welcome to the Python ML Library discussions!',
        content: 'Welcome everyone! This is the place to discuss features, ask questions, and share ideas about the Python ML Library. Feel free to start conversations and help each other out.',
        category: 'announcement',
        status: 'open',
        upvotes: 45,
        reply_count: 18,
        author_name: 'ML Team',
        author_email: 'team@ml-library.com',
        created_at: '2024-11-20T12:00:00Z',
        updated_at: '2024-11-28T08:30:00Z',
        last_reply_at: '2024-11-28T08:30:00Z'
      }
    ];

    setDiscussions(mockDiscussions);
  };

  const filteredDiscussions = discussions.filter(discussion => {
    const matchesSearch = discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         discussion.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         discussion.project_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || discussion.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || discussion.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedDiscussions = [...filteredDiscussions].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.upvotes - a.upvotes;
      case 'replies':
        return b.reply_count - a.reply_count;
      case 'recent':
      default:
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    }
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'general':
        return 'bg-blue-100 text-blue-800';
      case 'help':
        return 'bg-green-100 text-green-800';
      case 'feature-request':
        return 'bg-purple-100 text-purple-800';
      case 'bug-report':
        return 'bg-red-100 text-red-800';
      case 'announcement':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      case 'resolved':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-8 w-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-900">Discussions</h1>
            </div>
            <Link href="/discussions/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Discussion
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Filters and Search */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-6 py-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex-1 max-w-lg">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search discussions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value as any)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="general">General</option>
                    <option value="help">Help</option>
                    <option value="feature-request">Feature Request</option>
                    <option value="bug-report">Bug Report</option>
                    <option value="announcement">Announcement</option>
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="all">All Status</option>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="popular">Most Popular</option>
                    <option value="replies">Most Replies</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Discussions List */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {sortedDiscussions.length} Discussion{sortedDiscussions.length !== 1 ? 's' : ''}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Community discussions and Q&A
              </p>
            </div>
            <ul className="divide-y divide-gray-200">
              {sortedDiscussions.map((discussion) => (
                <li key={discussion.id} className="px-6 py-4 hover:bg-gray-50">
                  <Link href={`/discussions/${discussion.id}`}>
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <MessageSquare className="h-5 w-5 text-indigo-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors">
                            {discussion.title}
                          </h4>
                          <Badge className={getCategoryColor(discussion.category)}>
                            {discussion.category.replace('-', ' ')}
                          </Badge>
                          <Badge className={getStatusColor(discussion.status)}>
                            {discussion.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                          {discussion.content}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>{discussion.author_name}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Tag className="h-3 w-3" />
                            <span>{discussion.project_name}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatRelativeTime(discussion.updated_at)}</span>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{discussion.upvotes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{discussion.reply_count}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {sortedDiscussions.length === 0 && (
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No discussions found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter criteria, or start a new discussion.
              </p>
              <div className="mt-6">
                <Link href="/discussions/create">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Start New Discussion
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
