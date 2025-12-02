import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Mock contributors data for demo
const mockContributors = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'maintainer',
    github_username: 'johndoe',
    avatar_url: null,
    project_id: '1',
    contributions_count: 145,
    commits_count: 98,
    prs_count: 32,
    issues_count: 15,
    joined_at: '2024-01-15T10:00:00Z',
    last_contribution_at: '2024-11-28T14:30:00Z',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-11-28T14:30:00Z'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'core',
    github_username: 'janesmith',
    avatar_url: null,
    project_id: '1',
    contributions_count: 87,
    commits_count: 54,
    prs_count: 23,
    issues_count: 10,
    joined_at: '2024-02-01T08:00:00Z',
    last_contribution_at: '2024-11-27T16:45:00Z',
    created_at: '2024-02-01T08:00:00Z',
    updated_at: '2024-11-27T16:45:00Z'
  },
  {
    id: '3',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    role: 'contributor',
    github_username: 'bobwilson',
    avatar_url: null,
    project_id: '2',
    contributions_count: 34,
    commits_count: 21,
    prs_count: 8,
    issues_count: 5,
    joined_at: '2024-05-10T14:20:00Z',
    last_contribution_at: '2024-11-25T10:30:00Z',
    created_at: '2024-05-10T14:20:00Z',
    updated_at: '2024-11-25T10:30:00Z'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    // If ID is provided, return single contributor
    if (id) {
      const contributor = mockContributors.find(c => c.id === id);
      
      if (!contributor) {
        return NextResponse.json({
          success: false,
          error: 'Contributor not found'
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: contributor
      });
    }

    // Otherwise, return paginated list
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const project_id = searchParams.get('project_id') || '';

    // Filter contributors based on query parameters
    let filteredContributors = mockContributors;

    if (search) {
      filteredContributors = filteredContributors.filter(contributor =>
        contributor.name.toLowerCase().includes(search.toLowerCase()) ||
        contributor.email.toLowerCase().includes(search.toLowerCase()) ||
        contributor.github_username.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (role) {
      filteredContributors = filteredContributors.filter(contributor => contributor.role === role);
    }

    if (project_id) {
      filteredContributors = filteredContributors.filter(contributor => contributor.project_id === project_id);
    }

    // Sort by contributions_count (most active first)
    filteredContributors.sort((a, b) => b.contributions_count - a.contributions_count);

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedContributors = filteredContributors.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedContributors,
      pagination: {
        page,
        limit,
        total: filteredContributors.length,
        totalPages: Math.ceil(filteredContributors.length / limit)
      }
    });

  } catch (error) {
    console.error('Contributors GET error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const contributorData = await request.json();

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

    // Validate required fields
    const requiredFields = ['name', 'email', 'role', 'project_id'];
    for (const field of requiredFields) {
      if (!contributorData[field]) {
        return NextResponse.json({
          success: false,
          error: `Missing required field: ${field}`
        }, { status: 400 });
      }
    }

    // Validate role
    const validRoles = ['maintainer', 'core', 'contributor', 'community'];
    if (!validRoles.includes(contributorData.role)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid role. Must be one of: maintainer, core, contributor, community'
      }, { status: 400 });
    }

    // Create new contributor
    const newContributor = {
      id: `contributor-${Date.now()}`,
      ...contributorData,
      contributions_count: contributorData.contributions_count || 0,
      commits_count: contributorData.commits_count || 0,
      prs_count: contributorData.prs_count || 0,
      issues_count: contributorData.issues_count || 0,
      joined_at: new Date().toISOString(),
      last_contribution_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    mockContributors.unshift(newContributor);

    return NextResponse.json({
      success: true,
      data: newContributor,
      message: 'Contributor added successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Contributors POST error:', error);
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
        error: 'Contributor ID is required'
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

    const contributorIndex = mockContributors.findIndex(c => c.id === id);
    
    if (contributorIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Contributor not found'
      }, { status: 404 });
    }

    // Validate role if provided
    if (updateData.role) {
      const validRoles = ['maintainer', 'core', 'contributor', 'community'];
      if (!validRoles.includes(updateData.role)) {
        return NextResponse.json({
          success: false,
          error: 'Invalid role. Must be one of: maintainer, core, contributor, community'
        }, { status: 400 });
      }
    }

    const contributor = mockContributors[contributorIndex];

    // Update contributor
    mockContributors[contributorIndex] = {
      ...contributor,
      ...updateData,
      updated_at: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: mockContributors[contributorIndex],
      message: 'Contributor updated successfully'
    });

  } catch (error) {
    console.error('Contributors PUT error:', error);
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
        error: 'Contributor ID is required'
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

    const contributorIndex = mockContributors.findIndex(c => c.id === id);
    
    if (contributorIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Contributor not found'
      }, { status: 404 });
    }

    // Delete contributor
    mockContributors.splice(contributorIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Contributor removed successfully'
    });

  } catch (error) {
    console.error('Contributors DELETE error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

