export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          github_username: string | null
          github_id: number | null
          role: 'admin' | 'user'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          avatar_url?: string | null
          github_username?: string | null
          github_id?: number | null
          role?: 'admin' | 'user'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string | null
          github_username?: string | null
          github_id?: number | null
          role?: 'admin' | 'user'
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string
          vision: string | null
          goals: string[] | null
          scope: string | null
          license: 'MIT' | 'Apache-2.0' | 'GPL-3.0' | 'BSD-3-Clause' | 'ISC' | 'LGPL-2.1' | 'Other'
          tech_stack: string[]
          github_url: string | null
          website_url: string | null
          documentation_url: string | null
          status: 'active' | 'maintenance' | 'archived' | 'planning'
          visibility: 'public' | 'private'
          stars: number
          forks: number
          contributors_count: number
          issues_count: number
          owner_id: string
          created_at: string
          updated_at: string
          last_activity_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description: string
          vision?: string | null
          goals?: string[] | null
          scope?: string | null
          license: 'MIT' | 'Apache-2.0' | 'GPL-3.0' | 'BSD-3-Clause' | 'ISC' | 'LGPL-2.1' | 'Other'
          tech_stack: string[]
          github_url?: string | null
          website_url?: string | null
          documentation_url?: string | null
          status?: 'active' | 'maintenance' | 'archived' | 'planning'
          visibility?: 'public' | 'private'
          stars?: number
          forks?: number
          contributors_count?: number
          issues_count?: number
          owner_id: string
          created_at?: string
          updated_at?: string
          last_activity_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string
          vision?: string | null
          goals?: string[] | null
          scope?: string | null
          license?: 'MIT' | 'Apache-2.0' | 'GPL-3.0' | 'BSD-3-Clause' | 'ISC' | 'LGPL-2.1' | 'Other'
          tech_stack?: string[]
          github_url?: string | null
          website_url?: string | null
          documentation_url?: string | null
          status?: 'active' | 'maintenance' | 'archived' | 'planning'
          visibility?: 'public' | 'private'
          stars?: number
          forks?: number
          contributors_count?: number
          issues_count?: number
          owner_id?: string
          created_at?: string
          updated_at?: string
          last_activity_at?: string | null
        }
      }
      milestones: {
        Row: {
          id: string
          project_id: string
          title: string
          description: string | null
          type: 'technical' | 'community' | 'release'
          status: 'planning' | 'in_progress' | 'completed' | 'cancelled'
          priority: 'low' | 'medium' | 'high' | 'critical'
          start_date: string | null
          due_date: string | null
          completed_at: string | null
          progress_percentage: number
          assignee_id: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          description?: string | null
          type: 'technical' | 'community' | 'release'
          status?: 'planning' | 'in_progress' | 'completed' | 'cancelled'
          priority?: 'low' | 'medium' | 'high' | 'critical'
          start_date?: string | null
          due_date?: string | null
          completed_at?: string | null
          progress_percentage?: number
          assignee_id?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          description?: string | null
          type?: 'technical' | 'community' | 'release'
          status?: 'planning' | 'in_progress' | 'completed' | 'cancelled'
          priority?: 'low' | 'medium' | 'high' | 'critical'
          start_date?: string | null
          due_date?: string | null
          completed_at?: string | null
          progress_percentage?: number
          assignee_id?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      issues: {
        Row: {
          id: string
          project_id: string
          milestone_id: string | null
          title: string
          description: string | null
          type: 'bug' | 'feature' | 'enhancement' | 'documentation' | 'good_first_issue'
          status: 'open' | 'in_progress' | 'closed' | 'blocked'
          priority: 'low' | 'medium' | 'high' | 'critical'
          labels: string[]
          assignee_id: string | null
          reporter_id: string
          github_issue_number: number | null
          github_url: string | null
          estimated_hours: number | null
          actual_hours: number | null
          created_at: string
          updated_at: string
          closed_at: string | null
        }
        Insert: {
          id?: string
          project_id: string
          milestone_id?: string | null
          title: string
          description?: string | null
          type: 'bug' | 'feature' | 'enhancement' | 'documentation' | 'good_first_issue'
          status?: 'open' | 'in_progress' | 'closed' | 'blocked'
          priority?: 'low' | 'medium' | 'high' | 'critical'
          labels?: string[]
          assignee_id?: string | null
          reporter_id: string
          github_issue_number?: number | null
          github_url?: string | null
          estimated_hours?: number | null
          actual_hours?: number | null
          created_at?: string
          updated_at?: string
          closed_at?: string | null
        }
        Update: {
          id?: string
          project_id?: string
          milestone_id?: string | null
          title?: string
          description?: string | null
          type?: 'bug' | 'feature' | 'enhancement' | 'documentation' | 'good_first_issue'
          status?: 'open' | 'in_progress' | 'closed' | 'blocked'
          priority?: 'low' | 'medium' | 'high' | 'critical'
          labels?: string[]
          assignee_id?: string | null
          reporter_id?: string
          github_issue_number?: number | null
          github_url?: string | null
          estimated_hours?: number | null
          actual_hours?: number | null
          created_at?: string
          updated_at?: string
          closed_at?: string | null
        }
      }
      contributors: {
        Row: {
          id: string
          project_id: string
          user_id: string
          role: 'maintainer' | 'core_contributor' | 'contributor' | 'community_member'
          permissions: ('read' | 'write' | 'admin')[]
          contributions_count: number
          first_contribution_at: string | null
          last_contribution_at: string | null
          github_username: string | null
          bio: string | null
          skills: string[]
          status: 'active' | 'inactive' | 'alumni'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          role?: 'maintainer' | 'core_contributor' | 'contributor' | 'community_member'
          permissions?: ('read' | 'write' | 'admin')[]
          contributions_count?: number
          first_contribution_at?: string | null
          last_contribution_at?: string | null
          github_username?: string | null
          bio?: string | null
          skills?: string[]
          status?: 'active' | 'inactive' | 'alumni'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          role?: 'maintainer' | 'core_contributor' | 'contributor' | 'community_member'
          permissions?: ('read' | 'write' | 'admin')[]
          contributions_count?: number
          first_contribution_at?: string | null
          last_contribution_at?: string | null
          github_username?: string | null
          bio?: string | null
          skills?: string[]
          status?: 'active' | 'inactive' | 'alumni'
          created_at?: string
          updated_at?: string
        }
      }
      documentation: {
        Row: {
          id: string
          project_id: string
          title: string
          content: string
          type: 'getting_started' | 'api_docs' | 'contributing' | 'changelog' | 'faq' | 'tutorial' | 'other'
          category: string | null
          slug: string
          status: 'draft' | 'published' | 'archived'
          version: string | null
          author_id: string
          last_edited_by: string | null
          view_count: number
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          content: string
          type: 'getting_started' | 'api_docs' | 'contributing' | 'changelog' | 'faq' | 'tutorial' | 'other'
          category?: string | null
          slug: string
          status?: 'draft' | 'published' | 'archived'
          version?: string | null
          author_id: string
          last_edited_by?: string | null
          view_count?: number
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          content?: string
          type?: 'getting_started' | 'api_docs' | 'contributing' | 'changelog' | 'faq' | 'tutorial' | 'other'
          category?: string | null
          slug?: string
          status?: 'draft' | 'published' | 'archived'
          version?: string | null
          author_id?: string
          last_edited_by?: string | null
          view_count?: number
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      discussions: {
        Row: {
          id: string
          project_id: string
          title: string
          content: string
          category: 'general' | 'ideas' | 'q_and_a' | 'show_and_tell' | 'announcements'
          status: 'open' | 'answered' | 'closed'
          upvotes: number
          reply_count: number
          author_name: string
          author_email: string
          author_id: string | null
          is_pinned: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          content: string
          category: 'general' | 'ideas' | 'q_and_a' | 'show_and_tell' | 'announcements'
          status?: 'open' | 'answered' | 'closed'
          upvotes?: number
          reply_count?: number
          author_name: string
          author_email: string
          author_id?: string | null
          is_pinned?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          content?: string
          category?: 'general' | 'ideas' | 'q_and_a' | 'show_and_tell' | 'announcements'
          status?: 'open' | 'answered' | 'closed'
          upvotes?: number
          reply_count?: number
          author_name?: string
          author_email?: string
          author_id?: string | null
          is_pinned?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      security_assessments: {
        Row: {
          id: string
          project_id: string
          title: string
          description: string | null
          severity: 'low' | 'medium' | 'high' | 'critical'
          status: 'open' | 'investigating' | 'fixed' | 'wont_fix'
          vulnerability_type: 'dependency' | 'code' | 'configuration' | 'other'
          affected_versions: string[] | null
          fixed_in_version: string | null
          cve_id: string | null
          github_advisory_id: string | null
          reporter_id: string | null
          assignee_id: string | null
          discovered_at: string
          fixed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          description?: string | null
          severity: 'low' | 'medium' | 'high' | 'critical'
          status?: 'open' | 'investigating' | 'fixed' | 'wont_fix'
          vulnerability_type: 'dependency' | 'code' | 'configuration' | 'other'
          affected_versions?: string[] | null
          fixed_in_version?: string | null
          cve_id?: string | null
          github_advisory_id?: string | null
          reporter_id?: string | null
          assignee_id?: string | null
          discovered_at: string
          fixed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          description?: string | null
          severity?: 'low' | 'medium' | 'high' | 'critical'
          status?: 'open' | 'investigating' | 'fixed' | 'wont_fix'
          vulnerability_type?: 'dependency' | 'code' | 'configuration' | 'other'
          affected_versions?: string[] | null
          fixed_in_version?: string | null
          cve_id?: string | null
          github_advisory_id?: string | null
          reporter_id?: string | null
          assignee_id?: string | null
          discovered_at?: string
          fixed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

