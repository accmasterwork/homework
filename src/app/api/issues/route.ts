import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Mock issues data for demo
const mockIssues = [
  {
    id: '1',
    title: 'Add dark mode support',
    description: 'Implement dark mode toggle for better user experience',
    status: 'open',
    priority: 'medium',
    type: 'feature',
    labels: ['enhancement', 'ui'],
    project_id: '1',
    assignee_id: 'user-123',
    reporter_id: 'user-456',
    created_at: '2024-11-20T10:00:00Z',
    updated_at: '2024-11-25T14:30:00Z',
    due_date: '2024-12-15T00:00:00Z',
    github_issue_number: 42,
    github_url: 'https://github.com/example/react-dashboard/issues/42'
  },
  {
    id: '2',
    title: 'Fix responsive layout on mobile',
    description: 'Dashboard layout breaks on mobile devices below 768px width',
    status: 'in_progress',
    priority: 'high',
    type: 'bug',
    labels: ['bug', 'mobile', 'responsive'],
    project_id: '1',
    assignee_id: 'user-789',
    reporter_id: 'user-123',
    created_at: '2024-11-18T09:15:00Z',
    updated_at: '2024-11-28T11:20:00Z',
    due_date: '2024-12-01T00:00:00Z',
    github_issue_number: 38,
    github_url: 'https://github.com/example/react-dashboard/issues/38'
  },
  {
    id: '3',
    title: 'Add user authentication',
    description: 'Implement JWT-based authentication system',
    status: 'closed',
    priority: 'high',
    type: 'feature',
    labels: ['authentication', 'security'],
    project_id: '2',
    assignee_id: 'user-456',
    reporter_id: 'user-456',
    created_at: '2024-10-15T14:00:00Z',
    updated_at: '2024-11-10T16:45:00Z',
    closed_at: '2024-11-10T16:45:00Z',
    github_issue_number: 15,
    github_url: 'https://github.com/example/nodejs-api/issues/15'
  },
  {
    id: '4',
    title: 'Good first issue: Update README',
    description: 'Update the README file with better installation instructions',
    status: 'open',
    priority: 'low',
    type: 'documentation',
    labels: ['good first issue', 'documentation'],
    project_id: '1',
    assignee_id: null,
    reporter_id: 'user-123',
    created_at: '2024-11-25T08:30:00Z',
    updated_at: '2024-11-25T08:30:00Z',
    github_issue_number: 45,
    github_url: 'https://github.com/example/react-dashboard/issues/45'
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
    const priority = searchParams.get('priority') || '';
    const type = searchParams.get('type') || '';
    const project_id = searchParams.get('project_id') || '';
    const assignee_id = searchParams.get('assignee_id') || '';

    // Filter issues based on query parameters
    let filteredIssues = mockIssues;

    if (search) {
      filteredIssues = filteredIssues.filter(issue =>
        issue.title.toLowerCase().includes(search.toLowerCase()) ||
        issue.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status) {
      filteredIssues = filteredIssues.filter(issue => issue.status === status);
    }

    if (priority) {
      filteredIssues = filteredIssues.filter(issue => issue.priority === priority);
    }

    if (type) {
      filteredIssues = filteredIssues.filter(issue => issue.type === type);
    }

    if (project_id) {
      filteredIssues = filteredIssues.filter(issue => issue.project_id === project_id);
    }

    if (assignee_id) {
      filteredIssues = filteredIssues.filter(issue => issue.assignee_id === assignee_id);
    }

    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedIssues = filteredIssues.slice(startIndex, endIndex);

    // Add mock user data for assignees and reporters
    const issuesWithUsers = paginatedIssues.map(issue => ({
      ...issue,
      assignee: issue.assignee_id ? {
        id: issue.assignee_id,
        name: issue.assignee_id === 'user-123' ? 'John Doe' : 
              issue.assignee_id === 'user-456' ? 'Jane Smith' : 'Bob Wilson',
        avatar_url: null,
        github_username: issue.assignee_id === 'user-123' ? 'johndoe' : 
                        issue.assignee_id === 'user-456' ? 'janesmith' : 'bobwilson'
      } : null,
      reporter: {
        id: issue.reporter_id,
        name: issue.reporter_id === 'user-123' ? 'John Doe' : 
              issue.reporter_id === 'user-456' ? 'Jane Smith' : 'Bob Wilson',
        avatar_url: null,
        github_username: issue.reporter_id === 'user-123' ? 'johndoe' : 
                        issue.reporter_id === 'user-456' ? 'janesmith' : 'bobwilson'
      },
      project: {
        id: issue.project_id,
        name: issue.project_id === '1' ? 'React Dashboard' : 'Node.js API'
      }
    }));

    return NextResponse.json({
      success: true,
      data: issuesWithUsers,
      pagination: {
        page,
        limit,
        total: filteredIssues.length,
        totalPages: Math.ceil(filteredIssues.length / limit),
        hasNext: endIndex < filteredIssues.length,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching issues:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const issueData = await request.json();

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
    const requiredFields = ['title', 'description', 'project_id', 'type', 'priority'];
    for (const field of requiredFields) {
      if (!issueData[field]) {
        return NextResponse.json({
          success: false,
          error: `Missing required field: ${field}`
        }, { status: 400 });
      }
    }

    // Create new issue (mock implementation)
    const newIssue = {
      id: `issue-${Date.now()}`,
      ...issueData,
      reporter_id: user.id,
      status: issueData.status || 'open',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Add to mock data (in production, this would save to database)
    mockIssues.unshift(newIssue);

    return NextResponse.json({
      success: true,
      data: newIssue,
      message: 'Issue created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating issue:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const updateData = await request.json();

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Issue ID is required'
      }, { status: 400 });
    }

    // Check for authentication
    let user = null;
    const authHeader = request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      user = { id: 'demo-user-id', email: 'admin@example.com' };
    }
    
    if (!user) {
      try {
        const supabase = createRouteHandlerClient({ cookies });
        const { data: { user: supabaseUser } } = await supabase.auth.getUser();
        user = supabaseUser;
      } catch (error) {
        user = { id: 'demo-user-id', email: 'admin@example.com' };
      }
    }

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    const issueIndex = mockIssues.findIndex(i => i.id === id);
    
    if (issueIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Issue not found'
      }, { status: 404 });
    }

    const issue = mockIssues[issueIndex];

    // Check if user is the reporter or admin
    if (issue.reporter_id !== user.id && user.email !== 'admin@example.com') {
      return NextResponse.json({
        success: false,
        error: 'Forbidden: You can only edit your own issues'
      }, { status: 403 });
    }

    // Update issue
    mockIssues[issueIndex] = {
      ...issue,
      ...updateData,
      updated_at: new Date().toISOString()
    };

    // If closing the issue, set closed_at
    if (updateData.status === 'closed' && !mockIssues[issueIndex].closed_at) {
      mockIssues[issueIndex].closed_at = new Date().toISOString();
    }

    return NextResponse.json({
      success: true,
      data: mockIssues[issueIndex],
      message: 'Issue updated successfully'
    });

  } catch (error) {
    console.error('Error updating issue:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Issue ID is required'
      }, { status: 400 });
    }

    // Check for authentication
    let user = null;
    const authHeader = request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      user = { id: 'demo-user-id', email: 'admin@example.com' };
    }
    
    if (!user) {
      try {
        const supabase = createRouteHandlerClient({ cookies });
        const { data: { user: supabaseUser } } = await supabase.auth.getUser();
        user = supabaseUser;
      } catch (error) {
        user = { id: 'demo-user-id', email: 'admin@example.com' };
      }
    }

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    const issueIndex = mockIssues.findIndex(i => i.id === id);
    
    if (issueIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Issue not found'
      }, { status: 404 });
    }

    const issue = mockIssues[issueIndex];

    // Check if user is the reporter or admin
    if (issue.reporter_id !== user.id && user.email !== 'admin@example.com') {
      return NextResponse.json({
        success: false,
        error: 'Forbidden: You can only delete your own issues'
      }, { status: 403 });
    }

    // Delete issue
    mockIssues.splice(issueIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Issue deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting issue:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
