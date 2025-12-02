import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Mock security assessments data for demo
const mockSecurityAssessments = [
  {
    id: '1',
    title: 'SQL Injection Vulnerability in Login Form',
    description: 'Potential SQL injection vulnerability detected in user authentication endpoint',
    severity: 'critical',
    status: 'open',
    category: 'vulnerability',
    cve_id: 'CVE-2024-1234',
    affected_components: ['auth/login', 'database/queries'],
    project_id: '1',
    reporter_name: 'Security Scanner',
    reporter_email: 'security@example.com',
    discovered_at: '2024-11-25T10:00:00Z',
    resolved_at: null,
    resolution_notes: null,
    created_at: '2024-11-25T10:00:00Z',
    updated_at: '2024-11-25T10:00:00Z'
  },
  {
    id: '2',
    title: 'Outdated Dependencies with Known Vulnerabilities',
    description: 'Several npm packages have known security vulnerabilities and need to be updated',
    severity: 'high',
    status: 'in_progress',
    category: 'dependency',
    cve_id: null,
    affected_components: ['package.json', 'npm dependencies'],
    project_id: '1',
    reporter_name: 'Dependabot',
    reporter_email: 'dependabot@example.com',
    discovered_at: '2024-11-20T08:30:00Z',
    resolved_at: null,
    resolution_notes: 'Working on updating to latest versions',
    created_at: '2024-11-20T08:30:00Z',
    updated_at: '2024-11-27T14:20:00Z'
  },
  {
    id: '3',
    title: 'Missing HTTPS Enforcement',
    description: 'Application does not enforce HTTPS connections, allowing potential man-in-the-middle attacks',
    severity: 'medium',
    status: 'resolved',
    category: 'configuration',
    cve_id: null,
    affected_components: ['server configuration', 'nginx'],
    project_id: '2',
    reporter_name: 'John Doe',
    reporter_email: 'john@example.com',
    discovered_at: '2024-11-15T14:00:00Z',
    resolved_at: '2024-11-22T16:45:00Z',
    resolution_notes: 'Added HTTPS redirect and HSTS headers',
    created_at: '2024-11-15T14:00:00Z',
    updated_at: '2024-11-22T16:45:00Z'
  },
  {
    id: '4',
    title: 'Weak Password Requirements',
    description: 'Password policy allows weak passwords (minimum 6 characters, no complexity requirements)',
    severity: 'low',
    status: 'open',
    category: 'policy',
    cve_id: null,
    affected_components: ['auth/registration', 'password validation'],
    project_id: '2',
    reporter_name: 'Jane Smith',
    reporter_email: 'jane@example.com',
    discovered_at: '2024-11-28T09:15:00Z',
    resolved_at: null,
    resolution_notes: null,
    created_at: '2024-11-28T09:15:00Z',
    updated_at: '2024-11-28T09:15:00Z'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    // If ID is provided, return single assessment
    if (id) {
      const assessment = mockSecurityAssessments.find(a => a.id === id);
      
      if (!assessment) {
        return NextResponse.json({
          success: false,
          error: 'Security assessment not found'
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: assessment
      });
    }

    // Otherwise, return paginated list
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const severity = searchParams.get('severity') || '';
    const status = searchParams.get('status') || '';
    const category = searchParams.get('category') || '';
    const project_id = searchParams.get('project_id') || '';

    // Filter assessments based on query parameters
    let filteredAssessments = mockSecurityAssessments;

    if (search) {
      filteredAssessments = filteredAssessments.filter(assessment =>
        assessment.title.toLowerCase().includes(search.toLowerCase()) ||
        assessment.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (severity) {
      filteredAssessments = filteredAssessments.filter(assessment => assessment.severity === severity);
    }

    if (status) {
      filteredAssessments = filteredAssessments.filter(assessment => assessment.status === status);
    }

    if (category) {
      filteredAssessments = filteredAssessments.filter(assessment => assessment.category === category);
    }

    if (project_id) {
      filteredAssessments = filteredAssessments.filter(assessment => assessment.project_id === project_id);
    }

    // Sort by severity (critical > high > medium > low) and discovered date
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    filteredAssessments.sort((a, b) => {
      const severityDiff = severityOrder[a.severity as keyof typeof severityOrder] - severityOrder[b.severity as keyof typeof severityOrder];
      if (severityDiff !== 0) return severityDiff;
      return new Date(b.discovered_at).getTime() - new Date(a.discovered_at).getTime();
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedAssessments = filteredAssessments.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedAssessments,
      pagination: {
        page,
        limit,
        total: filteredAssessments.length,
        totalPages: Math.ceil(filteredAssessments.length / limit)
      },
      stats: {
        total: mockSecurityAssessments.length,
        critical: mockSecurityAssessments.filter(a => a.severity === 'critical').length,
        high: mockSecurityAssessments.filter(a => a.severity === 'high').length,
        medium: mockSecurityAssessments.filter(a => a.severity === 'medium').length,
        low: mockSecurityAssessments.filter(a => a.severity === 'low').length,
        open: mockSecurityAssessments.filter(a => a.status === 'open').length,
        in_progress: mockSecurityAssessments.filter(a => a.status === 'in_progress').length,
        resolved: mockSecurityAssessments.filter(a => a.status === 'resolved').length
      }
    });

  } catch (error) {
    console.error('Security GET error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const assessmentData = await request.json();

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
    const requiredFields = ['title', 'description', 'severity', 'category', 'project_id'];
    for (const field of requiredFields) {
      if (!assessmentData[field]) {
        return NextResponse.json({
          success: false,
          error: `Missing required field: ${field}`
        }, { status: 400 });
      }
    }

    // Validate severity
    const validSeverities = ['critical', 'high', 'medium', 'low'];
    if (!validSeverities.includes(assessmentData.severity)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid severity. Must be one of: critical, high, medium, low'
      }, { status: 400 });
    }

    // Validate category
    const validCategories = ['vulnerability', 'dependency', 'configuration', 'policy', 'other'];
    if (!validCategories.includes(assessmentData.category)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid category. Must be one of: vulnerability, dependency, configuration, policy, other'
      }, { status: 400 });
    }

    // Create new security assessment
    const newAssessment = {
      id: `security-${Date.now()}`,
      ...assessmentData,
      status: assessmentData.status || 'open',
      discovered_at: assessmentData.discovered_at || new Date().toISOString(),
      resolved_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    mockSecurityAssessments.unshift(newAssessment);

    return NextResponse.json({
      success: true,
      data: newAssessment,
      message: 'Security assessment created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Security POST error:', error);
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
        error: 'Assessment ID is required'
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

    const assessmentIndex = mockSecurityAssessments.findIndex(a => a.id === id);
    
    if (assessmentIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Security assessment not found'
      }, { status: 404 });
    }

    // Validate severity if provided
    if (updateData.severity) {
      const validSeverities = ['critical', 'high', 'medium', 'low'];
      if (!validSeverities.includes(updateData.severity)) {
        return NextResponse.json({
          success: false,
          error: 'Invalid severity. Must be one of: critical, high, medium, low'
        }, { status: 400 });
      }
    }

    // Validate category if provided
    if (updateData.category) {
      const validCategories = ['vulnerability', 'dependency', 'configuration', 'policy', 'other'];
      if (!validCategories.includes(updateData.category)) {
        return NextResponse.json({
          success: false,
          error: 'Invalid category. Must be one of: vulnerability, dependency, configuration, policy, other'
        }, { status: 400 });
      }
    }

    const assessment = mockSecurityAssessments[assessmentIndex];

    // Update assessment
    mockSecurityAssessments[assessmentIndex] = {
      ...assessment,
      ...updateData,
      updated_at: new Date().toISOString()
    };

    // If resolving the assessment, set resolved_at
    if (updateData.status === 'resolved' && !mockSecurityAssessments[assessmentIndex].resolved_at) {
      mockSecurityAssessments[assessmentIndex].resolved_at = new Date().toISOString();
    }

    return NextResponse.json({
      success: true,
      data: mockSecurityAssessments[assessmentIndex],
      message: 'Security assessment updated successfully'
    });

  } catch (error) {
    console.error('Security PUT error:', error);
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
        error: 'Assessment ID is required'
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

    const assessmentIndex = mockSecurityAssessments.findIndex(a => a.id === id);
    
    if (assessmentIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Security assessment not found'
      }, { status: 404 });
    }

    // Delete assessment
    mockSecurityAssessments.splice(assessmentIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Security assessment deleted successfully'
    });

  } catch (error) {
    console.error('Security DELETE error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

