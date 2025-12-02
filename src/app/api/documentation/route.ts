import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Mock documentation data for demo
const mockDocumentation = [
  {
    id: '1',
    title: 'Getting Started',
    content: `# Getting Started\n\nWelcome to our project! This guide will help you get up and running quickly.\n\n## Installation\n\nFirst, install the dependencies:\n\n\`\`\`bash\nnpm install\n\`\`\`\n\n## Running the Project\n\nStart the development server:\n\n\`\`\`bash\nnpm run dev\n\`\`\``,
    category: 'guide',
    type: 'getting_started',
    project_id: '1',
    author_name: 'John Doe',
    author_email: 'john@example.com',
    order: 1,
    is_published: true,
    version: '1.0',
    slug: 'getting-started',
    tags: ['tutorial', 'setup', 'beginner'],
    views_count: 245,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-11-20T14:30:00Z',
    published_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'API Reference',
    content: `# API Reference\n\n## Authentication\n\nAll API requests require authentication using a Bearer token.\n\n### Endpoints\n\n#### POST /api/auth/login\n\nAuthenticate a user and receive a JWT token.\n\n**Request Body:**\n\`\`\`json\n{\n  "email": "user@example.com",\n  "password": "your_password"\n}\n\`\`\``,
    category: 'reference',
    type: 'api',
    project_id: '1',
    author_name: 'Jane Smith',
    author_email: 'jane@example.com',
    order: 2,
    is_published: true,
    version: '1.0',
    slug: 'api-reference',
    tags: ['api', 'reference', 'endpoints'],
    views_count: 412,
    created_at: '2024-01-20T08:00:00Z',
    updated_at: '2024-11-25T16:45:00Z',
    published_at: '2024-01-20T08:00:00Z'
  },
  {
    id: '3',
    title: 'Contributing Guidelines',
    content: `# Contributing Guidelines\n\nThank you for your interest in contributing!\n\n## Code of Conduct\n\nPlease read and follow our Code of Conduct.\n\n## How to Contribute\n\n1. Fork the repository\n2. Create a feature branch\n3. Make your changes\n4. Submit a pull request`,
    category: 'guide',
    type: 'contributing',
    project_id: '1',
    author_name: 'John Doe',
    author_email: 'john@example.com',
    order: 3,
    is_published: true,
    version: '1.0',
    slug: 'contributing-guidelines',
    tags: ['contributing', 'guide', 'community'],
    views_count: 189,
    created_at: '2024-02-01T14:20:00Z',
    updated_at: '2024-11-22T10:30:00Z',
    published_at: '2024-02-01T14:20:00Z'
  },
  {
    id: '4',
    title: 'Deployment Guide',
    content: `# Deployment Guide\n\n## Production Deployment\n\n### Prerequisites\n\n- Node.js 18 or higher\n- PostgreSQL database\n- Redis for caching\n\n### Steps\n\n1. Set up environment variables\n2. Build the application\n3. Run database migrations\n4. Start the server`,
    category: 'guide',
    type: 'deployment',
    project_id: '2',
    author_name: 'Bob Wilson',
    author_email: 'bob@example.com',
    order: 1,
    is_published: false,
    version: '0.9',
    slug: 'deployment-guide',
    tags: ['deployment', 'production', 'devops'],
    views_count: 67,
    created_at: '2024-11-15T09:15:00Z',
    updated_at: '2024-11-28T11:20:00Z',
    published_at: null
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    // If ID is provided, return single doc
    if (id) {
      const doc = mockDocumentation.find(d => d.id === id);
      
      if (!doc) {
        return NextResponse.json({
          success: false,
          error: 'Documentation not found'
        }, { status: 404 });
      }

      // Increment views count
      doc.views_count++;

      return NextResponse.json({
        success: true,
        data: doc
      });
    }

    // Otherwise, return paginated list
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const type = searchParams.get('type') || '';
    const project_id = searchParams.get('project_id') || '';
    const is_published = searchParams.get('is_published');

    // Filter documentation based on query parameters
    let filteredDocs = mockDocumentation;

    if (search) {
      filteredDocs = filteredDocs.filter(doc =>
        doc.title.toLowerCase().includes(search.toLowerCase()) ||
        doc.content.toLowerCase().includes(search.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (category) {
      filteredDocs = filteredDocs.filter(doc => doc.category === category);
    }

    if (type) {
      filteredDocs = filteredDocs.filter(doc => doc.type === type);
    }

    if (project_id) {
      filteredDocs = filteredDocs.filter(doc => doc.project_id === project_id);
    }

    if (is_published !== null && is_published !== undefined) {
      const publishedFilter = is_published === 'true';
      filteredDocs = filteredDocs.filter(doc => doc.is_published === publishedFilter);
    }

    // Sort by order and created date
    filteredDocs.sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedDocs = filteredDocs.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedDocs,
      pagination: {
        page,
        limit,
        total: filteredDocs.length,
        totalPages: Math.ceil(filteredDocs.length / limit)
      }
    });

  } catch (error) {
    console.error('Documentation GET error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const docData = await request.json();

    // Check for authentication
    let user = null;
    const authHeader = request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      user = { id: 'demo-user-id', email: 'admin@example.com', name: 'Admin User' };
    }
    
    if (!user) {
      try {
        const supabase = createRouteHandlerClient({ cookies });
        const { data: { user: supabaseUser } } = await supabase.auth.getUser();
        user = supabaseUser;
      } catch (error) {
        user = { id: 'demo-user-id', email: 'admin@example.com', name: 'Admin User' };
      }
    }

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    // Validate required fields
    const requiredFields = ['title', 'content', 'category', 'type', 'project_id'];
    for (const field of requiredFields) {
      if (!docData[field]) {
        return NextResponse.json({
          success: false,
          error: `Missing required field: ${field}`
        }, { status: 400 });
      }
    }

    // Generate slug from title
    const slug = docData.slug || docData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Create new documentation
    const newDoc = {
      id: `doc-${Date.now()}`,
      ...docData,
      author_name: user.name || 'Unknown',
      author_email: user.email,
      slug,
      is_published: docData.is_published !== undefined ? docData.is_published : false,
      version: docData.version || '1.0',
      order: docData.order || 999,
      tags: docData.tags || [],
      views_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: docData.is_published ? new Date().toISOString() : null
    };

    mockDocumentation.unshift(newDoc);

    return NextResponse.json({
      success: true,
      data: newDoc,
      message: 'Documentation created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Documentation POST error:', error);
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
        error: 'Documentation ID is required'
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

    const docIndex = mockDocumentation.findIndex(d => d.id === id);
    
    if (docIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Documentation not found'
      }, { status: 404 });
    }

    const doc = mockDocumentation[docIndex];

    // Check if user is the author or admin
    if (doc.author_email !== user.email && user.email !== 'admin@example.com') {
      return NextResponse.json({
        success: false,
        error: 'Forbidden: You can only edit your own documentation'
      }, { status: 403 });
    }

    // Update slug if title changed
    if (updateData.title && updateData.title !== doc.title && !updateData.slug) {
      updateData.slug = updateData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Update documentation
    mockDocumentation[docIndex] = {
      ...doc,
      ...updateData,
      updated_at: new Date().toISOString()
    };

    // If publishing for the first time, set published_at
    if (updateData.is_published && !doc.is_published) {
      mockDocumentation[docIndex].published_at = new Date().toISOString();
    }

    return NextResponse.json({
      success: true,
      data: mockDocumentation[docIndex],
      message: 'Documentation updated successfully'
    });

  } catch (error) {
    console.error('Documentation PUT error:', error);
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
        error: 'Documentation ID is required'
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

    const docIndex = mockDocumentation.findIndex(d => d.id === id);
    
    if (docIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Documentation not found'
      }, { status: 404 });
    }

    const doc = mockDocumentation[docIndex];

    // Check if user is the author or admin
    if (doc.author_email !== user.email && user.email !== 'admin@example.com') {
      return NextResponse.json({
        success: false,
        error: 'Forbidden: You can only delete your own documentation'
      }, { status: 403 });
    }

    // Delete documentation
    mockDocumentation.splice(docIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Documentation deleted successfully'
    });

  } catch (error) {
    console.error('Documentation DELETE error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

