import { NextRequest, NextResponse } from 'next/server';

// Mock discussion data for demo
const mockDiscussions = [
  {
    id: '1',
    title: 'Best practices for React component architecture',
    content: 'I\'ve been working on a large React application and I\'m struggling with organizing my components effectively...',
    category: 'help',
    status: 'open',
    upvotes: 23,
    reply_count: 8,
    author_name: 'Sarah Johnson',
    author_email: 'sarah@example.com',
    project_id: '1',
    created_at: '2024-11-25T10:30:00Z',
    updated_at: '2024-11-28T14:20:00Z'
  },
  {
    id: '2',
    title: 'Feature Request: Dark mode support',
    content: 'It would be great to have a dark mode option for better user experience during night coding sessions.',
    category: 'feature',
    status: 'open',
    upvotes: 45,
    reply_count: 12,
    author_name: 'Mike Chen',
    author_email: 'mike@example.com',
    project_id: '2',
    created_at: '2024-11-24T16:45:00Z',
    updated_at: '2024-11-27T09:15:00Z'
  },
  {
    id: '3',
    title: 'Welcome to the community!',
    content: 'Hello everyone! Welcome to our open source project management platform. Feel free to ask questions and share your projects.',
    category: 'announcement',
    status: 'open',
    upvotes: 67,
    reply_count: 25,
    author_name: 'Admin',
    author_email: 'admin@example.com',
    project_id: null,
    created_at: '2024-11-20T12:00:00Z',
    updated_at: '2024-11-28T10:30:00Z'
  },
  {
    id: '4',
    title: 'How to contribute to open source projects?',
    content: 'I\'m new to open source and would love some guidance on how to get started with contributing to projects.',
    category: 'help',
    status: 'open',
    upvotes: 34,
    reply_count: 15,
    author_name: 'Alex Rodriguez',
    author_email: 'alex@example.com',
    project_id: null,
    created_at: '2024-11-22T14:20:00Z',
    updated_at: '2024-11-26T11:45:00Z'
  },
  {
    id: '5',
    title: 'Showcase: My first open source project',
    content: 'I just published my first open source project - a simple task manager built with React and Node.js. Would love your feedback!',
    category: 'showcase',
    status: 'open',
    upvotes: 28,
    reply_count: 7,
    author_name: 'Emma Wilson',
    author_email: 'emma@example.com',
    project_id: '3',
    created_at: '2024-11-21T09:30:00Z',
    updated_at: '2024-11-25T16:20:00Z'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    // If ID is provided, return single discussion
    if (id) {
      const discussion = mockDiscussions.find(d => d.id === id);
      
      if (!discussion) {
        return NextResponse.json({
          success: false,
          error: 'Discussion not found'
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: discussion
      });
    }

    // Otherwise, return paginated list
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const project_id = searchParams.get('project_id') || '';

    // Filter discussions based on query parameters
    let filteredDiscussions = mockDiscussions;

    if (search) {
      filteredDiscussions = filteredDiscussions.filter(discussion =>
        discussion.title.toLowerCase().includes(search.toLowerCase()) ||
        discussion.content.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      filteredDiscussions = filteredDiscussions.filter(discussion => discussion.category === category);
    }

    if (project_id) {
      filteredDiscussions = filteredDiscussions.filter(discussion => discussion.project_id === project_id);
    }

    // Sort by updated_at (most recent first)
    filteredDiscussions.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedDiscussions = filteredDiscussions.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedDiscussions,
      pagination: {
        page,
        limit,
        total: filteredDiscussions.length,
        totalPages: Math.ceil(filteredDiscussions.length / limit)
      }
    });

  } catch (error) {
    console.error('Discussions GET error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const discussionData = await request.json();

    // For demo purposes, use mock authentication
    const user = {
      id: 'user-123',
      name: 'Demo User',
      email: 'demo@example.com'
    };

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    // Validate required fields
    const requiredFields = ['title', 'content', 'category'];
    for (const field of requiredFields) {
      if (!discussionData[field]) {
        return NextResponse.json({
          success: false,
          error: `Missing required field: ${field}`
        }, { status: 400 });
      }
    }

    // Create new discussion (mock implementation)
    const newDiscussion = {
      id: `discussion-${Date.now()}`,
      ...discussionData,
      author_name: user.name,
      author_email: user.email,
      upvotes: 0,
      reply_count: 0,
      status: 'open',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // In a real implementation, this would save to the database
    mockDiscussions.unshift(newDiscussion);

    return NextResponse.json({
      success: true,
      data: newDiscussion,
      message: 'Discussion created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Discussions POST error:', error);
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
        error: 'Discussion ID is required'
      }, { status: 400 });
    }

    // For demo purposes, use mock authentication
    const user = {
      id: 'user-123',
      name: 'Demo User',
      email: 'demo@example.com'
    };

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    const discussionIndex = mockDiscussions.findIndex(d => d.id === id);
    
    if (discussionIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Discussion not found'
      }, { status: 404 });
    }

    // Check if user is the author or admin
    const discussion = mockDiscussions[discussionIndex];
    if (discussion.author_email !== user.email && user.email !== 'admin@example.com') {
      return NextResponse.json({
        success: false,
        error: 'Forbidden: You can only edit your own discussions'
      }, { status: 403 });
    }

    // Update discussion
    mockDiscussions[discussionIndex] = {
      ...discussion,
      ...updateData,
      updated_at: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: mockDiscussions[discussionIndex],
      message: 'Discussion updated successfully'
    });

  } catch (error) {
    console.error('Discussions PUT error:', error);
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
        error: 'Discussion ID is required'
      }, { status: 400 });
    }

    // For demo purposes, use mock authentication
    const user = {
      id: 'user-123',
      name: 'Demo User',
      email: 'demo@example.com'
    };

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    const discussionIndex = mockDiscussions.findIndex(d => d.id === id);
    
    if (discussionIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Discussion not found'
      }, { status: 404 });
    }

    // Check if user is the author or admin
    const discussion = mockDiscussions[discussionIndex];
    if (discussion.author_email !== user.email && user.email !== 'admin@example.com') {
      return NextResponse.json({
        success: false,
        error: 'Forbidden: You can only delete your own discussions'
      }, { status: 403 });
    }

    // Delete discussion
    mockDiscussions.splice(discussionIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Discussion deleted successfully'
    });

  } catch (error) {
    console.error('Discussions DELETE error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
