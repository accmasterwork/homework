import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import config, { isCyberPanel } from '@/lib/config';
import Database from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    if (!isCyberPanel()) {
      return NextResponse.json({ error: 'Not available in Supabase mode' }, { status: 400 });
    }

    // Get token from cookies or Authorization header
    const token = request.cookies.get('auth-token')?.value || 
                  request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ user: null });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, config.auth.jwtSecret) as any;
    
    // Get user from database
    const user = await Database.getUserById(decoded.userId);
    
    if (!user) {
      return NextResponse.json({ user: null });
    }

    // Remove password hash from response
    const { password_hash, ...userWithoutPassword } = user;

    return NextResponse.json({ 
      user: userWithoutPassword,
      session: {
        access_token: token,
        expires_at: decoded.exp
      }
    });

  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ user: null });
  }
}
