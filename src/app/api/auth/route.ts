import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { email, password, action } = await request.json();
    
    // For demo purposes, handle mock authentication
    if (action === 'mock_login') {
      if (email === 'admin@example.com' && password === 'demo123456') {
        return NextResponse.json({
          success: true,
          user: {
            id: 'admin-123',
            email: 'admin@example.com',
            name: 'Admin User',
            role: 'admin'
          },
          message: 'Mock authentication successful'
        });
      } else if (email && password) {
        return NextResponse.json({
          success: true,
          user: {
            id: 'user-123',
            email: email,
            name: email.split('@')[0],
            role: 'user'
          },
          message: 'Mock authentication successful'
        });
      } else {
        return NextResponse.json({
          success: false,
          error: 'Invalid credentials'
        }, { status: 401 });
      }
    }

    // Real Supabase authentication (when configured)
    const supabase = createRouteHandlerClient({ cookies });

    if (action === 'login') {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return NextResponse.json({
          success: false,
          error: error.message
        }, { status: 401 });
      }

      return NextResponse.json({
        success: true,
        user: data.user,
        session: data.session
      });
    }

    if (action === 'register') {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return NextResponse.json({
          success: false,
          error: error.message
        }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        user: data.user,
        session: data.session
      });
    }

    if (action === 'logout') {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return NextResponse.json({
          success: false,
          error: error.message
        }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: 'Logged out successfully'
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 });

  } catch (error) {
    console.error('Auth API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Auth GET error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
