/**
 * Storage utilities for persisting data in localStorage
 * This provides a simple persistence layer for the demo/development environment
 */

const STORAGE_KEYS = {
  PROJECTS: 'ospm_projects',
  SETTINGS: 'ospm_settings',
  USER_PREFERENCES: 'ospm_user_preferences',
} as const;

export class StorageManager {
  private static isClient = typeof window !== 'undefined';

  /**
   * Save data to localStorage
   */
  static save<T>(key: string, data: T): boolean {
    if (!this.isClient) return false;
    
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error(`Failed to save to localStorage (${key}):`, error);
      return false;
    }
  }

  /**
   * Load data from localStorage
   */
  static load<T>(key: string, defaultValue: T): T {
    if (!this.isClient) return defaultValue;
    
    try {
      const serialized = localStorage.getItem(key);
      if (serialized === null) return defaultValue;
      return JSON.parse(serialized) as T;
    } catch (error) {
      console.error(`Failed to load from localStorage (${key}):`, error);
      return defaultValue;
    }
  }

  /**
   * Remove data from localStorage
   */
  static remove(key: string): boolean {
    if (!this.isClient) return false;
    
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Failed to remove from localStorage (${key}):`, error);
      return false;
    }
  }

  /**
   * Clear all OSPM data from localStorage
   */
  static clearAll(): boolean {
    if (!this.isClient) return false;
    
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
      return false;
    }
  }
}

// Typed storage functions for specific data types

export interface Project {
  id: string;
  name: string;
  description: string;
  vision?: string;
  goals?: string[];
  scope?: string;
  license: string;
  tech_stack: string[];
  github_url?: string;
  website_url?: string;
  documentation_url?: string;
  status: string;
  visibility: string;
  stars: number;
  forks: number;
  contributors_count: number;
  issues_count: number;
  owner_id: string;
  created_at: string;
  updated_at: string;
  last_activity_at: string;
}

export const ProjectStorage = {
  save: (projects: Project[]) => 
    StorageManager.save(STORAGE_KEYS.PROJECTS, projects),
  
  load: () => 
    StorageManager.load<Project[]>(STORAGE_KEYS.PROJECTS, []),
  
  add: (project: Project) => {
    const projects = ProjectStorage.load();
    projects.push(project);
    return ProjectStorage.save(projects);
  },
  
  update: (id: string, updates: Partial<Project>) => {
    const projects = ProjectStorage.load();
    const index = projects.findIndex(p => p.id === id);
    if (index !== -1) {
      projects[index] = { ...projects[index], ...updates };
      return ProjectStorage.save(projects);
    }
    return false;
  },
  
  delete: (id: string) => {
    const projects = ProjectStorage.load();
    const filtered = projects.filter(p => p.id !== id);
    return ProjectStorage.save(filtered);
  },
  
  findById: (id: string) => {
    const projects = ProjectStorage.load();
    return projects.find(p => p.id === id);
  },
  
  initialize: (defaultProjects: Project[]) => {
    const existing = ProjectStorage.load();
    if (existing.length === 0) {
      ProjectStorage.save(defaultProjects);
    }
  }
};

export interface PlatformSettings {
  // Platform Settings
  platformName: string;
  platformDescription: string;
  platformUrl: string;
  supportEmail: string;
  
  // Security Settings
  requireEmailVerification: boolean;
  allowPublicRegistration: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  
  // Feature Flags
  enableDiscussions: boolean;
  enableProjectTemplates: boolean;
  enableGitHubIntegration: boolean;
  enableNotifications: boolean;
  
  // Email Settings
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  fromEmail: string;
  
  // Storage Settings
  maxFileSize: number;
  allowedFileTypes: string;
  storageProvider: string;
  
  // API Settings
  rateLimitRequests: number;
  rateLimitWindow: number;
  enableApiKeys: boolean;
  
  // Maintenance
  maintenanceMode: boolean;
  maintenanceMessage: string;
}

export const SettingsStorage = {
  save: (settings: PlatformSettings) => 
    StorageManager.save(STORAGE_KEYS.SETTINGS, settings),
  
  load: (defaultSettings: PlatformSettings) => 
    StorageManager.load<PlatformSettings>(STORAGE_KEYS.SETTINGS, defaultSettings),
};

export const UserPreferencesStorage = {
  save: (preferences: any) => 
    StorageManager.save(STORAGE_KEYS.USER_PREFERENCES, preferences),
  
  load: (defaultPreferences: any) => 
    StorageManager.load(STORAGE_KEYS.USER_PREFERENCES, defaultPreferences),
};

