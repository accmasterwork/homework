// Core entity types for the Open Source Project Management Platform

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  github_username?: string;
  github_id?: number;
  role: 'admin' | 'user';
  bio?: string;
  website_url?: string;
  location?: string;
  company?: string;
  twitter_username?: string;
  linkedin_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  vision?: string;
  goals?: string[];
  scope?: string;
  license: 'MIT' | 'Apache-2.0' | 'GPL-3.0' | 'BSD-3-Clause' | 'ISC' | 'LGPL-2.1' | 'Other';
  tech_stack: string[];
  github_url?: string;
  website_url?: string;
  documentation_url?: string;
  status: 'active' | 'maintenance' | 'archived' | 'planning';
  visibility: 'public' | 'private';
  stars: number;
  forks: number;
  contributors_count: number;
  issues_count: number;
  owner_id: string;
  created_at: string;
  updated_at: string;
  last_activity_at?: string;
}

export interface Milestone {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  type: 'technical' | 'community' | 'release';
  status: 'planning' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  start_date?: string;
  due_date?: string;
  completed_at?: string;
  progress_percentage: number;
  assignee_id?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Issue {
  id: string;
  project_id: string;
  milestone_id?: string;
  title: string;
  description?: string;
  type: 'bug' | 'feature' | 'enhancement' | 'documentation' | 'good_first_issue';
  status: 'open' | 'in_progress' | 'closed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'critical';
  labels: string[];
  assignee_id?: string;
  reporter_id: string;
  github_issue_number?: number;
  github_url?: string;
  estimated_hours?: number;
  actual_hours?: number;
  created_at: string;
  updated_at: string;
  closed_at?: string;
}

export interface Contributor {
  id: string;
  project_id: string;
  user_id: string;
  role: 'maintainer' | 'core_contributor' | 'contributor' | 'community_member';
  permissions: ('read' | 'write' | 'admin')[];
  contributions_count: number;
  first_contribution_at?: string;
  last_contribution_at?: string;
  github_username?: string;
  bio?: string;
  skills: string[];
  status: 'active' | 'inactive' | 'alumni';
  created_at: string;
  updated_at: string;
}

export interface Documentation {
  id: string;
  project_id: string;
  title: string;
  content: string;
  type: 'getting_started' | 'api_docs' | 'contributing' | 'changelog' | 'faq' | 'tutorial' | 'other';
  category?: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  version?: string;
  author_id: string;
  last_edited_by?: string;
  view_count: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Discussion {
  id: string;
  project_id: string;
  title: string;
  content: string;
  category: 'general' | 'ideas' | 'q_and_a' | 'show_and_tell' | 'announcements';
  status: 'open' | 'answered' | 'closed';
  upvotes: number;
  reply_count: number;
  author_name: string;
  author_email: string;
  author_id?: string;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface DiscussionReply {
  id: string;
  discussion_id: string;
  content: string;
  author_name: string;
  author_email: string;
  author_id?: string;
  is_answer: boolean;
  upvotes: number;
  created_at: string;
  updated_at: string;
}

export interface SecurityAssessment {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'fixed' | 'wont_fix';
  vulnerability_type: 'dependency' | 'code' | 'configuration' | 'other';
  affected_versions?: string[];
  fixed_in_version?: string;
  cve_id?: string;
  github_advisory_id?: string;
  reporter_id?: string;
  assignee_id?: string;
  discovered_at: string;
  fixed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  members_count: number;
  projects_count: number;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: string;
}

export interface ProjectMember {
  id: string;
  project_id: string;
  user_id: string;
  role: 'viewer' | 'editor' | 'admin';
  invited_by: string;
  joined_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'project_update' | 'issue_assigned' | 'milestone_due' | 'discussion_reply' | 'team_invitation';
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  created_at: string;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: 'web' | 'mobile' | 'library' | 'tool' | 'game' | 'other';
  tech_stack: string[];
  milestones: Omit<Milestone, 'id' | 'project_id' | 'created_at' | 'updated_at'>[];
  issues: Omit<Issue, 'id' | 'project_id' | 'milestone_id' | 'created_at' | 'updated_at'>[];
  documentation: Omit<Documentation, 'id' | 'project_id' | 'created_at' | 'updated_at'>[];
  is_public: boolean;
  usage_count: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  success: boolean;
}

// Form types
export interface CreateProjectForm {
  name: string;
  description: string;
  vision?: string;
  goals?: string[];
  scope?: string;
  license: Project['license'];
  tech_stack: string[];
  github_url?: string;
  website_url?: string;
  documentation_url?: string;
  visibility: Project['visibility'];
}

export interface CreateMilestoneForm {
  title: string;
  description?: string;
  type: Milestone['type'];
  priority: Milestone['priority'];
  start_date?: string;
  due_date?: string;
  assignee_id?: string;
}

export interface CreateIssueForm {
  title: string;
  description?: string;
  type: Issue['type'];
  priority: Issue['priority'];
  labels: string[];
  assignee_id?: string;
  milestone_id?: string;
  estimated_hours?: number;
}

// GitHub integration types
export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  clone_url: string;
  ssh_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  topics: string[];
  license?: {
    key: string;
    name: string;
  };
  created_at: string;
  updated_at: string;
  pushed_at: string;
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
  labels: Array<{
    name: string;
    color: string;
  }>;
  assignee?: {
    login: string;
    avatar_url: string;
  };
  created_at: string;
  updated_at: string;
  closed_at?: string;
}

export interface GitHubContributor {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  contributions: number;
}
