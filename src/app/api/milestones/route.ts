import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Mock milestones data for demo
const mockMilestones = [
  {
    id: '1',
    title: 'Version 1.0 Release',
    description: 'First stable release with core features',
    status: 'in_progress',
    type: 'release',
    progress: 75,
    project_id: '1',
    assignee_id: 'user-123',
    start_date: '2024-11-01T00:00:00Z',
    due_date: '2024-12-15T00:00:00Z',
    created_at: '2024-10-15T10:00:00Z',
    updated_at: '2024-11-28T14:30:00Z',
    github_milestone_number: 1,
    github_url: 'https://github.com/example/react-dashboard/milestone/1'
  },
  {
    id: '2',
    title: 'Community Onboarding',
    description: 'Set up community guidelines and contribution process',
    status: 'completed',
    type: 'community',
    progress: 100,
    project_id: '1',
    assignee_id: 'user-456',
    start_date: '2024-10-01T00:00:00Z',
    due_date: '2024-11-01T00:00:00Z',
    completed_at: '2024-10-28T16:45:00Z',
    created_at: '2024-09-15T09:00:00Z',
    updated_at: '2024-10-28T16:45:00Z'
  },
  {
    id: '3',
    title: 'API Documentation',
    description: 'Complete API documentation with examples',
    status: 'planned',
    type: 'technical',
    progress: 0,
    project_id: '2',
    assignee_id: 'user-789',
    start_date: '2024-12-01T00:00:00Z',
    due_date: '2024-12-31T00:00:00Z',
    created_at: '2024-11-20T11:15:00Z',
    updated_at: '2024-11-20T11:15:00Z'
  },
  {
    id: '4',
    title: 'Security Audit',
    description: 'Comprehensive security review and vulnerability assessment',
    status: 'in_progress',
    type: 'technical',
    progress: 30,
    project_id: '2',
    assignee_id: 'user-456',
    start_date: '2024-11-15T00:00:00Z',
    due_date: '2024-12-20T00:00:00Z',
    created_at: '2024-11-10T14:00:00Z',
    updated_at: '2024-11-25T10:30:00Z'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const type = searchParams.get('type') || '';
    const project_id = searchParams.get('project_id') || '';
    const assignee_id = searchParams.get('assignee_id') || '';

    // Filter milestones based on query parameters
    let filteredMilestones = mockMilestones;

    if (search) {
      filteredMilestones = filteredMilestones.filter(milestone =>
        milestone.title.toLowerCase().includes(search.toLowerCase()) ||
        milestone.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status) {
      filteredMilestones = filteredMilestones.filter(milestone => milestone.status === status);
    }

    if (type) {
      filteredMilestones = filteredMilestones.filter(milestone => milestone.type === type);
    }

    if (project_id) {
      filteredMilestones = filteredMilestones.filter(milestone => milestone.project_id === project_id);
    }

    if (assignee_id) {
      filteredMilestones = filteredMilestones.filter(milestone => milestone.assignee_id === assignee_id);
    }

    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedMilestones = filteredMilestones.slice(startIndex, endIndex);

    // Add mock user data for assignees
    const milestonesWithUsers = paginatedMilestones.map(milestone => ({
      ...milestone,
      assignee: milestone.assignee_id ? {
        id: milestone.assignee_id,
        name: milestone.assignee_id === 'user-123' ? 'John Doe' : 
              milestone.assignee_id === 'user-456' ? 'Jane Smith' : 'Bob Wilson',
        avatar_url: null,
        github_username: milestone.assignee_id === 'user-123' ? 'johndoe' : 
                        milestone.assignee_id === 'user-456' ? 'janesmith' : 'bobwilson'
      } : null,
      project: {
        id: milestone.project_id,
        name: milestone.project_id === '1' ? 'React Dashboard' : 'Node.js API'
      }
    }));

    return NextResponse.json({
      success: true,
      data: milestonesWithUsers,
      pagination: {
        page,
        limit,
        total: filteredMilestones.length,
        totalPages: Math.ceil(filteredMilestones.length / limit),
        hasNext: endIndex < filteredMilestones.length,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching milestones:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const milestoneData = await request.json();

    // Check for authentication - support both Supabase and mock auth
    let user = null;
    
    // First try to get user from Authorization header (mock auth)
    const authHeader = request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      // For demo purposes, accept any token as valid
      user = {
        id: 'demo-user-id',
        email: 'admin@example.com'
      };
    }
    
    // If no auth header, try Supabase authentication
    if (!user) {
      try {
        const supabase = createRouteHandlerClient({ cookies });
        const { data: { user: supabaseUser }, error: authError } = await supabase.auth.getUser();
        user = supabaseUser;
      } catch (supabaseError) {
        console.log('Supabase authentication failed:', supabaseError);
      }
    }
    
    // If still no user, try mock authentication for demo
    if (!user) {
      console.log('Using mock authentication for demo');
      user = {
        id: 'demo-user-id',
        email: 'admin@example.com'
      };
    }

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    // Validate required fields
    const requiredFields = ['title', 'description', 'project_id', 'type', 'due_date'];
    for (const field of requiredFields) {
      if (!milestoneData[field]) {
        return NextResponse.json({
          success: false,
          error: `Missing required field: ${field}`
        }, { status: 400 });
      }
    }

    // Create new milestone (mock implementation)
    const newMilestone = {
      id: `milestone-${Date.now()}`,
      ...milestoneData,
      status: milestoneData.status || 'planned',
      progress: milestoneData.progress || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Add to mock data (in production, this would save to database)
    mockMilestones.unshift(newMilestone);

    return NextResponse.json({
      success: true,
      data: newMilestone,
      message: 'Milestone created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating milestone:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
