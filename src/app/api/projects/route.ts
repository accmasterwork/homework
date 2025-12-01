import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { ProjectStorage, type Project } from '@/lib/storage';

// Default mock project data for demo
const defaultProjects: Project[] = [
  {
    id: '1',
    name: 'React Dashboard',
    description: 'A modern React dashboard with TypeScript and Tailwind CSS',
    vision: 'To create the most intuitive and powerful dashboard for modern web applications',
    goals: ['Improve developer productivity', 'Enhance user experience', 'Provide comprehensive analytics'],
    scope: 'Full-featured dashboard with authentication, data visualization, and real-time updates',
    license: 'MIT',
    tech_stack: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'],
    github_url: 'https://github.com/example/react-dashboard',
    website_url: 'https://react-dashboard-demo.com',
    documentation_url: 'https://docs.react-dashboard.com',
    status: 'active',
    visibility: 'public',
    stars: 245,
    forks: 67,
    contributors_count: 12,
    issues_count: 8,
    owner_id: 'user-123',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-11-28T14:30:00Z',
    last_activity_at: '2024-11-28T14:30:00Z'
  },
  {
    id: '2',
    name: 'Node.js API',
    description: 'RESTful API built with Node.js and Express',
    vision: 'To provide a scalable and secure backend solution for modern applications',
    goals: ['High performance', 'Security first', 'Easy to maintain'],
    scope: 'Complete REST API with authentication, database integration, and documentation',
    license: 'Apache-2.0',
    tech_stack: ['Node.js', 'Express', 'MongoDB', 'JWT'],
    github_url: 'https://github.com/example/nodejs-api',
    status: 'active',
    visibility: 'public',
    stars: 189,
    forks: 43,
    contributors_count: 8,
    issues_count: 5,
    owner_id: 'user-456',
    created_at: '2024-02-20T14:30:00Z',
    updated_at: '2024-11-27T16:45:00Z',
    last_activity_at: '2024-11-27T16:45:00Z'
  },
  {
    id: '3',
    name: 'Python ML Library',
    description: 'Machine learning utilities for data science',
    vision: 'To democratize machine learning for data scientists and developers',
    goals: ['Easy to use', 'Comprehensive algorithms', 'Great documentation'],
    scope: 'Machine learning library with common algorithms and data processing utilities',
    license: 'MIT',
    tech_stack: ['Python', 'NumPy', 'Pandas', 'Scikit-learn'],
    github_url: 'https://github.com/example/python-ml',
    status: 'planning',
    visibility: 'public',
    stars: 0,
    forks: 0,
    contributors_count: 1,
    issues_count: 3,
    owner_id: 'user-789',
    created_at: '2024-11-25T09:15:00Z',
    updated_at: '2024-11-29T11:20:00Z',
    last_activity_at: '2024-11-29T11:20:00Z'
  }
];

// Initialize default projects if localStorage is empty (client-side only)
if (typeof window !== 'undefined') {
  ProjectStorage.initialize(defaultProjects);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    // Load projects from storage (with fallback to default projects)
    let allProjects = ProjectStorage.load();
    if (allProjects.length === 0) {
      allProjects = defaultProjects;
      ProjectStorage.save(allProjects);
    }
    
    // If ID is provided, return single project
    if (id) {
      const project = allProjects.find(p => p.id === id);
      
      if (!project) {
        return NextResponse.json({
          success: false,
          error: 'Project not found'
        }, { status: 404 });
      }

      // Add mock owner data
      const projectWithOwner = {
        ...project,
        owner: {
          id: project.owner_id,
          name: project.owner_id === 'user-123' ? 'John Doe' : project.owner_id === 'demo-user-id' ? 'Admin User' : 'Jane Smith',
          avatar_url: null,
          github_username: project.owner_id === 'user-123' ? 'johndoe' : project.owner_id === 'demo-user-id' ? 'admin' : 'janesmith'
        }
      };

      return NextResponse.json({
        success: true,
        data: projectWithOwner
      });
    }

    // Otherwise, return paginated list
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const owner_id = searchParams.get('owner_id') || '';

    // Filter projects based on query parameters
    let filteredProjects = allProjects;

    if (search) {
      filteredProjects = filteredProjects.filter(project =>
        project.name.toLowerCase().includes(search.toLowerCase()) ||
        project.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status) {
      filteredProjects = filteredProjects.filter(project => project.status === status);
    }

    if (owner_id) {
      filteredProjects = filteredProjects.filter(project => project.owner_id === owner_id);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedProjects,
      pagination: {
        page,
        limit,
        total: filteredProjects.length,
        totalPages: Math.ceil(filteredProjects.length / limit)
      }
    });

  } catch (error) {
    console.error('Projects GET error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const projectData = await request.json();

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
    const requiredFields = ['name', 'description', 'license', 'tech_stack'];
    for (const field of requiredFields) {
      if (!projectData[field]) {
        return NextResponse.json({
          success: false,
          error: `Missing required field: ${field}`
        }, { status: 400 });
      }
    }

    // Create new project
    const newProject: Project = {
      id: `project-${Date.now()}`,
      name: projectData.name,
      description: projectData.description,
      vision: projectData.vision,
      goals: projectData.goals,
      scope: projectData.scope,
      license: projectData.license,
      tech_stack: projectData.tech_stack,
      github_url: projectData.github_url,
      website_url: projectData.website_url,
      documentation_url: projectData.documentation_url,
      owner_id: user.id,
      stars: 0,
      forks: 0,
      contributors_count: 1,
      issues_count: 0,
      status: projectData.status || 'planning',
      visibility: projectData.visibility || 'public',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_activity_at: new Date().toISOString()
    };

    // Save to persistent storage
    const saved = ProjectStorage.add(newProject);
    
    if (!saved) {
      return NextResponse.json({
        success: false,
        error: 'Failed to save project'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: newProject,
      message: 'Project created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Projects POST error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // For demo purposes, use mock authentication
    let user = null;
    
    try {
      const supabase = createRouteHandlerClient({ cookies });
      const { data: { user: supabaseUser }, error: authError } = await supabase.auth.getUser();
      user = supabaseUser;
    } catch (supabaseError) {
      // Fallback to mock user if Supabase is not configured
      user = {
        id: 'mock-user-id',
        email: 'user@example.com'
      };
    }

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    const { id, ...updateData } = await request.json();

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Project ID is required'
      }, { status: 400 });
    }

    // Find project
    const project = ProjectStorage.findById(id);
    
    if (!project) {
      return NextResponse.json({
        success: false,
        error: 'Project not found'
      }, { status: 404 });
    }

    // Check if user owns the project or is admin
    if (project.owner_id !== user.id && user.email !== 'admin@example.com') {
      return NextResponse.json({
        success: false,
        error: 'Forbidden'
      }, { status: 403 });
    }

    // Update project with persistence
    const updated = ProjectStorage.update(id, {
      ...updateData,
      updated_at: new Date().toISOString(),
      last_activity_at: new Date().toISOString()
    });

    if (!updated) {
      return NextResponse.json({
        success: false,
        error: 'Failed to update project'
      }, { status: 500 });
    }

    const updatedProject = ProjectStorage.findById(id);

    return NextResponse.json({
      success: true,
      data: updatedProject,
      message: 'Project updated successfully'
    });

  } catch (error) {
    console.error('Projects PUT error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // For demo purposes, use mock authentication
    let user = null;
    
    try {
      const supabase = createRouteHandlerClient({ cookies });
      const { data: { user: supabaseUser }, error: authError } = await supabase.auth.getUser();
      user = supabaseUser;
    } catch (supabaseError) {
      // Fallback to mock user if Supabase is not configured
      user = {
        id: 'mock-user-id',
        email: 'user@example.com'
      };
    }

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Project ID is required'
      }, { status: 400 });
    }

    // Find project
    const project = ProjectStorage.findById(id);
    
    if (!project) {
      return NextResponse.json({
        success: false,
        error: 'Project not found'
      }, { status: 404 });
    }

    // Check if user owns the project or is admin
    if (project.owner_id !== user.id && user.email !== 'admin@example.com') {
      return NextResponse.json({
        success: false,
        error: 'Forbidden'
      }, { status: 403 });
    }

    // Delete project with persistence
    const deleted = ProjectStorage.delete(id);

    if (!deleted) {
      return NextResponse.json({
        success: false,
        error: 'Failed to delete project'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('Projects DELETE error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
