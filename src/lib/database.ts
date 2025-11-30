// Database utility for dual hosting support (MySQL for CyberPanel, PostgreSQL for Supabase)

import mysql from 'mysql2/promise';
import { createClient } from '@supabase/supabase-js';
import config, { isCyberPanel, isSupabase } from './config';

// MySQL connection for CyberPanel
let mysqlConnection: mysql.Connection | null = null;

export const getMySQLConnection = async () => {
  if (!mysqlConnection) {
    try {
      mysqlConnection = await mysql.createConnection({
        host: config.database.host,
        port: config.database.port,
        user: config.database.user,
        password: config.database.password,
        database: config.database.name,
        charset: 'utf8mb4'
      });
    } catch (error) {
      console.error('MySQL connection error:', error);
      throw new Error('Failed to connect to MySQL database');
    }
  }
  return mysqlConnection;
};

// Supabase client
export const getSupabaseClient = () => {
  if (!config.supabase.url || !config.supabase.anonKey) {
    throw new Error('Supabase configuration is missing');
  }
  
  return createClient(config.supabase.url, config.supabase.anonKey);
};

// Unified database interface
export class Database {
  // User operations
  static async createUser(userData: {
    email: string;
    name: string;
    password_hash: string;
    avatar_url?: string;
    github_username?: string;
  }) {
    if (isCyberPanel()) {
      const connection = await getMySQLConnection();
      const [result] = await connection.execute(
        `INSERT INTO users (id, email, name, password_hash, avatar_url, github_username, created_at, updated_at) 
         VALUES (UUID(), ?, ?, ?, ?, ?, NOW(), NOW())`,
        [userData.email, userData.name, userData.password_hash, userData.avatar_url, userData.github_username]
      );
      return result;
    } else if (isSupabase()) {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  }

  static async getUserByEmail(email: string) {
    if (isCyberPanel()) {
      const connection = await getMySQLConnection();
      const [rows] = await connection.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
    } else if (isSupabase()) {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    }
  }

  static async getUserById(id: string) {
    if (isCyberPanel()) {
      const connection = await getMySQLConnection();
      const [rows] = await connection.execute(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
    } else if (isSupabase()) {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    }
  }

  // Project operations
  static async createProject(projectData: any) {
    if (isCyberPanel()) {
      const connection = await getMySQLConnection();
      const projectId = `project-${Date.now()}`;
      const [result] = await connection.execute(
        `INSERT INTO projects (id, name, description, vision, goals, scope, license, tech_stack, 
         github_url, website_url, documentation_url, status, visibility, owner_id, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          projectId,
          projectData.name,
          projectData.description,
          projectData.vision,
          JSON.stringify(projectData.goals),
          projectData.scope,
          projectData.license,
          JSON.stringify(projectData.tech_stack),
          projectData.github_url,
          projectData.website_url,
          projectData.documentation_url,
          projectData.status || 'planning',
          projectData.visibility || 'public',
          projectData.owner_id
        ]
      );
      return { ...projectData, id: projectId };
    } else if (isSupabase()) {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  }

  static async getProjects(filters: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    owner_id?: string;
  } = {}) {
    const { page = 1, limit = 10, search, status, owner_id } = filters;
    const offset = (page - 1) * limit;

    if (isCyberPanel()) {
      const connection = await getMySQLConnection();
      let query = 'SELECT * FROM projects WHERE 1=1';
      const params: any[] = [];

      if (search) {
        query += ' AND (name LIKE ? OR description LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
      }

      if (status) {
        query += ' AND status = ?';
        params.push(status);
      }

      if (owner_id) {
        query += ' AND owner_id = ?';
        params.push(owner_id);
      }

      query += ' ORDER BY updated_at DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const [rows] = await connection.execute(query, params);
      return Array.isArray(rows) ? rows : [];
    } else if (isSupabase()) {
      const supabase = getSupabaseClient();
      let query = supabase
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
      }

      if (status) {
        query = query.eq('status', status);
      }

      if (owner_id) {
        query = query.eq('owner_id', owner_id);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }
  }

  static async getProjectById(id: string) {
    if (isCyberPanel()) {
      const connection = await getMySQLConnection();
      const [rows] = await connection.execute(
        `SELECT p.*, u.name as owner_name, u.avatar_url as owner_avatar_url, u.github_username as owner_github_username
         FROM projects p 
         LEFT JOIN users u ON p.owner_id = u.id 
         WHERE p.id = ?`,
        [id]
      );
      return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
    } else if (isSupabase()) {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          owner:users!projects_owner_id_fkey(id, name, avatar_url, github_username)
        `)
        .eq('id', id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    }
  }

  // Discussion operations
  static async createDiscussion(discussionData: any) {
    if (isCyberPanel()) {
      const connection = await getMySQLConnection();
      const discussionId = `discussion-${Date.now()}`;
      const [result] = await connection.execute(
        `INSERT INTO discussions (id, title, content, category, status, author_name, author_email, 
         project_id, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          discussionId,
          discussionData.title,
          discussionData.content,
          discussionData.category,
          discussionData.status || 'open',
          discussionData.author_name,
          discussionData.author_email,
          discussionData.project_id
        ]
      );
      return { ...discussionData, id: discussionId };
    } else if (isSupabase()) {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('discussions')
        .insert([discussionData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  }

  static async getDiscussions(filters: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    project_id?: string;
  } = {}) {
    const { page = 1, limit = 10, search, category, project_id } = filters;
    const offset = (page - 1) * limit;

    if (isCyberPanel()) {
      const connection = await getMySQLConnection();
      let query = 'SELECT * FROM discussions WHERE 1=1';
      const params: any[] = [];

      if (search) {
        query += ' AND (title LIKE ? OR content LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
      }

      if (category) {
        query += ' AND category = ?';
        params.push(category);
      }

      if (project_id) {
        query += ' AND project_id = ?';
        params.push(project_id);
      }

      query += ' ORDER BY updated_at DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const [rows] = await connection.execute(query, params);
      return Array.isArray(rows) ? rows : [];
    } else if (isSupabase()) {
      const supabase = getSupabaseClient();
      let query = supabase
        .from('discussions')
        .select('*')
        .order('updated_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (search) {
        query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
      }

      if (category) {
        query = query.eq('category', category);
      }

      if (project_id) {
        query = query.eq('project_id', project_id);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }
  }

  // Initialize database tables for CyberPanel
  static async initializeTables() {
    if (!isCyberPanel()) return;

    const connection = await getMySQLConnection();
    
    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255),
        avatar_url TEXT,
        github_username VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create projects table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS projects (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        vision TEXT,
        goals JSON,
        scope TEXT,
        license VARCHAR(100),
        tech_stack JSON,
        github_url VARCHAR(500),
        website_url VARCHAR(500),
        documentation_url VARCHAR(500),
        status VARCHAR(50) DEFAULT 'planning',
        visibility VARCHAR(50) DEFAULT 'public',
        stars INT DEFAULT 0,
        forks INT DEFAULT 0,
        contributors_count INT DEFAULT 1,
        issues_count INT DEFAULT 0,
        owner_id VARCHAR(36),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        last_activity_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_id) REFERENCES users(id)
      )
    `);

    // Create discussions table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS discussions (
        id VARCHAR(36) PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        content TEXT NOT NULL,
        category VARCHAR(100) NOT NULL,
        status VARCHAR(50) DEFAULT 'open',
        upvotes INT DEFAULT 0,
        reply_count INT DEFAULT 0,
        author_name VARCHAR(255) NOT NULL,
        author_email VARCHAR(255) NOT NULL,
        project_id VARCHAR(36),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id)
      )
    `);

    console.log('Database tables initialized successfully');
  }
}

export default Database;
