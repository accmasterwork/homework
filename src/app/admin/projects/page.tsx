'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FolderOpen, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Shield, 
  Star, 
  GitFork,
  Users,
  ArrowLeft,
  Plus,
  Download,
  Eye,
  Archive,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface AdminProject {
  id: string;
  name: string;
  description: string;
  owner_name: string;
  owner_email: string;
  status: 'active' | 'maintenance' | 'archived' | 'planning';
  visibility: 'public' | 'private';
  license: string;
  tech_stack: string[];
  stars: number;
  forks: number;
  contributors_count: number;
  issues_count: number;
  created_at: string;
  updated_at: string;
  approval_status: 'pending' | 'approved' | 'rejected';
  moderation_notes?: string;
}

export default function AdminProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'maintenance' | 'archived' | 'planning'>('all');
  const [filterApproval, setFilterApproval] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    const checkAuth = async () => {
      // Check for mock session (works without Supabase)
      const mockSession = localStorage.getItem('mockSession');
      const mockUserData = localStorage.getItem('mockUser');
      
      if (!mockSession || !mockUserData) {
        router.push('/login');
        return;
      }

      const mockUser = JSON.parse(mockUserData);
      
      // Check if user is admin
      if (mockUser.email !== 'admin@example.com') {
        router.push('/dashboard');
        return;
      }

      await loadProjects();
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const loadProjects = async () => {
    // Mock project data for demo
    const mockProjects: AdminProject[] = [
      {
        id: '1',
        name: 'React Dashboard',
        description: 'A modern React dashboard with TypeScript and Tailwind CSS',
        owner_name: 'John Doe',
        owner_email: 'john.doe@example.com',
        status: 'active',
        visibility: 'public',
        license: 'MIT',
        tech_stack: ['React', 'TypeScript', 'Tailwind CSS'],
        stars: 245,
        forks: 67,
        contributors_count: 12,
        issues_count: 8,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-11-28T14:30:00Z',
        approval_status: 'approved'
      },
      {
        id: '2',
        name: 'Node.js API',
        description: 'RESTful API built with Node.js and Express',
        owner_name: 'Jane Smith',
        owner_email: 'jane.smith@example.com',
        status: 'active',
        visibility: 'public',
        license: 'Apache-2.0',
        tech_stack: ['Node.js', 'Express', 'MongoDB'],
        stars: 189,
        forks: 43,
        contributors_count: 8,
        issues_count: 5,
        created_at: '2024-02-20T14:30:00Z',
        updated_at: '2024-11-27T16:45:00Z',
        approval_status: 'approved'
      },
      {
        id: '3',
        name: 'Python ML Library',
        description: 'Machine learning utilities for data science',
        owner_name: 'Bob Wilson',
        owner_email: 'bob.wilson@example.com',
        status: 'planning',
        visibility: 'public',
        license: 'MIT',
        tech_stack: ['Python', 'NumPy', 'Pandas'],
        stars: 0,
        forks: 0,
        contributors_count: 1,
        issues_count: 3,
        created_at: '2024-11-25T09:15:00Z',
        updated_at: '2024-11-29T11:20:00Z',
        approval_status: 'pending',
        moderation_notes: 'Needs documentation review'
      },
      {
        id: '4',
        name: 'Vue.js Components',
        description: 'Reusable Vue.js components library',
        owner_name: 'Alice Brown',
        owner_email: 'alice.brown@example.com',
        status: 'maintenance',
        visibility: 'public',
        license: 'MIT',
        tech_stack: ['Vue.js', 'JavaScript', 'CSS'],
        stars: 156,
        forks: 34,
        contributors_count: 6,
        issues_count: 12,
        created_at: '2024-03-10T16:45:00Z',
        updated_at: '2024-10-15T14:30:00Z',
        approval_status: 'approved'
      },
      {
        id: '5',
        name: 'Inappropriate Project',
        description: 'This project violates community guidelines',
        owner_name: 'Bad Actor',
        owner_email: 'bad@example.com',
        status: 'archived',
        visibility: 'private',
        license: 'Other',
        tech_stack: ['Unknown'],
        stars: 2,
        forks: 0,
        contributors_count: 1,
        issues_count: 0,
        created_at: '2024-11-20T13:20:00Z',
        updated_at: '2024-11-21T10:15:00Z',
        approval_status: 'rejected',
        moderation_notes: 'Violates community guidelines - inappropriate content'
      }
    ];

    setProjects(mockProjects);
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.owner_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    const matchesApproval = filterApproval === 'all' || project.approval_status === filterApproval;
    
    return matchesSearch && matchesStatus && matchesApproval;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      case 'planning':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getApprovalColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getApprovalIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/dashboard"
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Link>
              <div className="h-6 border-l border-gray-300"></div>
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-red-600" />
                <h1 className="text-2xl font-bold text-gray-900">Project Management</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Filters */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-6 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex-1 max-w-lg">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search projects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="archived">Archived</option>
                    <option value="planning">Planning</option>
                  </select>
                  <select
                    value={filterApproval}
                    onChange={(e) => setFilterApproval(e.target.value as any)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="all">All Approval</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Projects Table */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Projects ({filteredProjects.length})
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Oversee all projects, approve submissions, and moderate content
                  </p>
                </div>
              </div>
            </div>
            <ul className="divide-y divide-gray-200">
              {filteredProjects.map((project) => (
                <li key={project.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <FolderOpen className="h-5 w-5 text-gray-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {project.name}
                          </p>
                          <Badge className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                          <Badge className={getApprovalColor(project.approval_status)}>
                            <div className="flex items-center space-x-1">
                              {getApprovalIcon(project.approval_status)}
                              <span>{project.approval_status}</span>
                            </div>
                          </Badge>
                          {project.visibility === 'private' && (
                            <Badge variant="outline">Private</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate mt-1">
                          {project.description}
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <p className="text-sm text-gray-500">
                            Owner: {project.owner_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            License: {project.license}
                          </p>
                          <p className="text-sm text-gray-500">
                            Created: {formatDate(project.created_at)}
                          </p>
                        </div>
                        {project.moderation_notes && (
                          <p className="text-sm text-red-600 mt-1">
                            Note: {project.moderation_notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
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
                          <span>{project.contributors_count}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {filteredProjects.length === 0 && (
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No projects found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
