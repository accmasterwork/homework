# 🚀 Dual Hosting Setup Guide

This platform supports **both CyberPanel hosting and Supabase hosting**. You can easily switch between them by changing your environment configuration.

## 🔧 Quick Setup

### For CyberPanel Hosting

1. **Copy the CyberPanel environment file:**
   ```bash
   cp .env.local.cyberpanel .env.local
   ```

2. **Edit your configuration:**
   ```bash
   nano .env.local
   ```

3. **Update these key values:**
   ```env
   # Your domain
   NEXTAUTH_URL=https://yourdomain.com
   APP_URL=https://yourdomain.com
   
   # Database credentials
   DB_HOST=localhost
   DB_USER=your_db_username
   DB_PASSWORD=your_secure_password
   DB_NAME=your_database_name
   
   # Email settings
   SMTP_HOST=mail.yourdomain.com
   SMTP_USER=noreply@yourdomain.com
   SMTP_PASSWORD=your_email_password
   
   # Security keys (generate strong random strings)
   NEXTAUTH_SECRET=your-32-character-secret-key
   JWT_SECRET=your-32-character-jwt-secret
   API_SECRET_KEY=your-32-character-api-secret
   ```

### For Supabase Hosting

1. **Copy the Supabase environment file:**
   ```bash
   cp .env.local.supabase .env.local
   ```

2. **Edit your configuration:**
   ```bash
   nano .env.local
   ```

3. **Update these key values:**
   ```env
   # Supabase project settings
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   
   # Your app URL
   NEXTAUTH_URL=https://your-vercel-app.vercel.app
   APP_URL=https://your-vercel-app.vercel.app
   ```

---

## 📋 CyberPanel Setup (Detailed)

### 1. Database Setup

Create your MySQL database and user:

```sql
-- Connect to MySQL as root
mysql -u root -p

-- Create database
CREATE DATABASE ospm_database CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user
CREATE USER 'ospm_user'@'localhost' IDENTIFIED BY 'your_secure_password';

-- Grant permissions
GRANT ALL PRIVILEGES ON ospm_database.* TO 'ospm_user'@'localhost';
FLUSH PRIVILEGES;

-- Exit MySQL
EXIT;
```

### 2. Install Dependencies

```bash
npm install mysql2 bcryptjs jsonwebtoken nodemailer next-auth
npm install --save-dev @types/bcryptjs @types/jsonwebtoken @types/nodemailer
```

### 3. Initialize Database Tables

The platform will automatically create the required tables when you first run it. Or you can manually initialize:

```bash
# Start the development server
npm run dev

# The database tables will be created automatically
```

### 4. Configure Email (CyberPanel)

In CyberPanel:
1. Go to **Email → Email Accounts**
2. Create email account: `noreply@yourdomain.com`
3. Note the SMTP settings for your domain
4. Update `.env.local` with your SMTP credentials

### 5. SSL Certificate

Ensure your domain has an SSL certificate:
1. In CyberPanel: **SSL → Manage SSL**
2. Issue SSL certificate for your domain
3. Verify HTTPS is working

---

## 📋 Supabase Setup (Detailed)

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Note your project URL and API keys

### 2. Database Schema

Supabase will automatically create tables based on your schema. You can also run SQL directly in the Supabase dashboard.

### 3. Authentication Setup

1. In Supabase Dashboard: **Authentication → Settings**
2. Configure OAuth providers (GitHub, Google)
3. Set redirect URLs

### 4. Storage Setup

1. In Supabase Dashboard: **Storage**
2. Create bucket named `uploads`
3. Configure bucket policies

---

## 🔄 Switching Between Hosting Modes

### CyberPanel → Supabase

```bash
# Backup current config
cp .env.local .env.local.backup

# Switch to Supabase
cp .env.local.supabase .env.local

# Edit with your Supabase credentials
nano .env.local

# Restart application
npm run dev
```

### Supabase → CyberPanel

```bash
# Backup current config
cp .env.local .env.local.backup

# Switch to CyberPanel
cp .env.local.cyberpanel .env.local

# Edit with your CyberPanel credentials
nano .env.local

# Restart application
npm run dev
```

---

## 🛠️ Configuration Reference

### Required Environment Variables

#### CyberPanel Mode
```env
HOSTING_MODE=cyberpanel
DATABASE_URL=mysql://user:pass@localhost:3306/db
DB_HOST=localhost
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_database
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-secret
JWT_SECRET=your-jwt-secret
SMTP_HOST=mail.yourdomain.com
SMTP_USER=noreply@yourdomain.com
SMTP_PASSWORD=your_email_password
```

#### Supabase Mode
```env
HOSTING_MODE=supabase
NEXT_PUBLIC_SUPABASE_URL=https://project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXTAUTH_URL=https://yourapp.vercel.app
```

---

## 🔍 Troubleshooting

### Database Connection Issues

**CyberPanel:**
```bash
# Test MySQL connection
mysql -h localhost -u ospm_user -p ospm_database

# Check if tables exist
SHOW TABLES;
```

**Supabase:**
- Check project URL and API keys in Supabase dashboard
- Verify network connectivity
- Check Supabase project status

### Authentication Issues

**CyberPanel:**
- Verify JWT_SECRET is set and at least 32 characters
- Check NEXTAUTH_SECRET is configured
- Ensure domain SSL is working

**Supabase:**
- Verify OAuth providers are configured
- Check redirect URLs match your domain
- Ensure Supabase auth is enabled

### Email Issues

**CyberPanel:**
- Test SMTP settings with a mail client
- Verify email account exists in CyberPanel
- Check firewall allows SMTP ports (587, 465)

**Supabase:**
- Supabase handles email automatically
- Check email templates in Supabase dashboard

---

## 📊 Feature Comparison

| Feature | CyberPanel | Supabase |
|---------|------------|----------|
| **Database** | MySQL/MariaDB | PostgreSQL |
| **Authentication** | NextAuth.js + JWT | Supabase Auth |
| **File Storage** | Local filesystem | Supabase Storage |
| **Email** | SMTP (your server) | Supabase Email |
| **Hosting** | Your server | Vercel/Netlify |
| **Cost** | Server costs only | Usage-based pricing |
| **Control** | Full control | Managed service |
| **Scalability** | Manual scaling | Auto-scaling |

---

## 🎯 Production Deployment

### CyberPanel Production

1. **Server Requirements:**
   - CyberPanel installed
   - Node.js 18+ installed
   - MySQL/MariaDB running
   - SSL certificate configured

2. **Deployment Steps:**
   ```bash
   # Clone repository
   git clone your-repo-url
   cd your-project
   
   # Install dependencies
   npm install
   
   # Configure environment
   cp .env.local.cyberpanel .env.local
   nano .env.local
   
   # Build application
   npm run build
   
   # Start production server
   npm start
   ```

3. **Process Management:**
   ```bash
   # Install PM2 for process management
   npm install -g pm2
   
   # Start with PM2
   pm2 start npm --name "ospm" -- start
   pm2 save
   pm2 startup
   ```

### Supabase Production

1. **Deploy to Vercel:**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Deploy
   vercel --prod
   ```

2. **Environment Variables:**
   - Add all Supabase environment variables in Vercel dashboard
   - Ensure production URLs are configured

---

## 🔐 Security Considerations

### CyberPanel Security

- Use strong database passwords
- Enable MySQL SSL if possible
- Configure firewall properly
- Regular security updates
- Use strong JWT secrets (32+ characters)
- Enable HTTPS only

### Supabase Security

- Enable Row Level Security (RLS)
- Configure proper database policies
- Use environment variables for secrets
- Enable 2FA on Supabase account
- Regular security reviews

---

## 📞 Support

If you need help with setup:

1. **Check the logs:**
   ```bash
   # Development
   npm run dev
   
   # Production (CyberPanel)
   pm2 logs ospm
   ```

2. **Common issues:**
   - Database connection errors
   - Authentication configuration
   - Email delivery problems
   - SSL certificate issues

3. **Get help:**
   - Check this documentation
   - Review error logs
   - Test individual components

---

**🎉 You're all set!** Your platform now supports both CyberPanel and Supabase hosting with easy switching between modes.
