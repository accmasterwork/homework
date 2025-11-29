import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from './database.types';

// Client-side Supabase client for use in client components
export const createClient = () => createClientComponentClient<Database>();

// Default client export for convenience in client components
export const supabase = createClientComponentClient<Database>();
