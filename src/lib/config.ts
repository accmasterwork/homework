// Configuration utility for dual hosting support (CyberPanel + Supabase)

export const HOSTING_MODES = {
  CYBERPANEL: 'cyberpanel',
  SUPABASE: 'supabase'
} as const;

export type HostingMode = typeof HOSTING_MODES[keyof typeof HOSTING_MODES];

// Detect hosting mode from environment
export const getHostingMode = (): HostingMode => {
  const mode = process.env.HOSTING_MODE?.toLowerCase();
  
  if (mode === HOSTING_MODES.CYBERPANEL) {
    return HOSTING_MODES.CYBERPANEL;
  }
  
  if (mode === HOSTING_MODES.SUPABASE) {
    return HOSTING_MODES.SUPABASE;
  }
  
  // Auto-detect based on available environment variables
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return HOSTING_MODES.SUPABASE;
  }
  
  if (process.env.DB_HOST || process.env.DATABASE_URL?.includes('mysql')) {
    return HOSTING_MODES.CYBERPANEL;
  }
  
  // Default to CyberPanel if no clear indicators
  return HOSTING_MODES.CYBERPANEL;
};

// Configuration object
export const config = {
  // Hosting mode
  hostingMode: getHostingMode(),
  
  // Database configuration
  database: {
    url: process.env.DATABASE_URL || '',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || ''
  },
  
  // Authentication configuration
  auth: {
    nextAuthUrl: process.env.NEXTAUTH_URL || '',
    nextAuthSecret: process.env.NEXTAUTH_SECRET || '',
    jwtSecret: process.env.JWT_SECRET || '',
    sessionSecret: process.env.SESSION_SECRET || '',
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12')
  },
  
  // Email configuration
  email: {
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT || '587'),
    user: process.env.SMTP_USER || '',
    password: process.env.SMTP_PASSWORD || '',
    from: process.env.SMTP_FROM || '',
    secure: process.env.SMTP_SECURE === 'true'
  },
  
  // Application configuration
  app: {
    url: process.env.APP_URL || process.env.NEXTAUTH_URL || '',
    name: process.env.APP_NAME || 'Open Source Project Manager',
    nodeEnv: process.env.NODE_ENV || 'development',
    apiSecretKey: process.env.API_SECRET_KEY || ''
  },
  
  // File storage configuration
  storage: {
    type: process.env.STORAGE_TYPE || (getHostingMode() === HOSTING_MODES.SUPABASE ? 'supabase' : 'local'),
    uploadDir: process.env.UPLOAD_DIR || '/tmp/uploads',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'),
    allowedFileTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || ['jpg', 'jpeg', 'png', 'gif', 'pdf'],
    supabaseBucket: process.env.SUPABASE_STORAGE_BUCKET || 'uploads'
  },
  
  // Security configuration
  security: {
    corsOrigin: process.env.CORS_ORIGIN || process.env.APP_URL || '',
    rateLimitRequests: parseInt(process.env.RATE_LIMIT_REQUESTS || '100'),
    rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '900000')
  },
  
  // OAuth providers
  oauth: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || ''
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
    }
  },
  
  // Supabase specific configuration
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    jwtSecret: process.env.SUPABASE_JWT_SECRET || ''
  },
  
  // Admin configuration
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@example.com',
    password: process.env.ADMIN_PASSWORD || ''
  },
  
  // External integrations
  integrations: {
    githubToken: process.env.GITHUB_TOKEN || ''
  }
};

// Helper functions
export const isCyberPanel = () => config.hostingMode === HOSTING_MODES.CYBERPANEL;
export const isSupabase = () => config.hostingMode === HOSTING_MODES.SUPABASE;

// Validation function
export const validateConfig = () => {
  const errors: string[] = [];
  
  if (!config.auth.nextAuthSecret) {
    errors.push('NEXTAUTH_SECRET is required');
  }
  
  if (!config.app.url) {
    errors.push('APP_URL or NEXTAUTH_URL is required');
  }
  
  if (isCyberPanel()) {
    if (!config.database.url && (!config.database.host || !config.database.user)) {
      errors.push('Database configuration is required for CyberPanel mode');
    }
  }
  
  if (isSupabase()) {
    if (!config.supabase.url || !config.supabase.anonKey) {
      errors.push('Supabase URL and anon key are required for Supabase mode');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Export configuration for easy access
export default config;
