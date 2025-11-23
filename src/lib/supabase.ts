import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from './database.types';

// Client-side Supabase client
export const createClient = () => createClientComponentClient<Database>();

// Server-side Supabase client
export const createServerClient = () => createServerComponentClient<Database>({ cookies });

// Admin client for server-side operations that require elevated permissions
export const createAdminClient = () => {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  }
  
  return createClientComponentClient<Database>({
    supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  });
};

