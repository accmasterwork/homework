# 🚀 Open Source Project Manager - One-Click Setup Guide

Welcome to the **easiest way** to install the Open Source Project Manager! Just like WordPress, you can have the entire platform running in minutes with our automated setup scripts.

## 🎯 Quick Start (TL;DR)

### For Linux/Mac Users:
```bash
curl -fsSL https://raw.githubusercontent.com/accmasterwork/homework/codegen-bot/open-source-project-manager-foundation-1763889658/setup.sh | bash
```

### For Windows Users:
1. Download `setup.bat` from this repository
2. Double-click to run
3. Follow the prompts

### Manual Installation:
```bash
git clone https://github.com/accmasterwork/homework.git ospm
cd ospm
git checkout codegen-bot/open-source-project-manager-foundation-1763889658
chmod +x setup.sh
./setup.sh
```

## 📋 What You'll Need

Before running the setup, make sure you have accounts for:

1. **GitHub Account** (for OAuth authentication)
2. **Supabase Account** (for database - free tier available)
3. **OpenAI Account** (optional - for AI features)

## 🛠 Automated Setup Features

Our setup script handles **everything automatically**:

### ✅ **System Dependencies**
- Node.js 18+ installation
- Git configuration
- Build tools setup

### ✅ **Project Setup**
- Repository cloning
- Dependency installation
- Environment configuration
- Database schema setup

### ✅ **Service Integration**
- Supabase database connection
- GitHub OAuth configuration
- OpenAI API setup (optional)
- Admin account creation

### ✅ **Development Environment**
- Build configuration
- Startup scripts
- Docker setup
- Development server

## 📖 Step-by-Step Installation

### Step 1: Download and Run Setup Script

#### Linux/Mac:
```bash
# Download and run in one command
curl -fsSL https://raw.githubusercontent.com/accmasterwork/homework/codegen-bot/open-source-project-manager-foundation-1763889658/setup.sh | bash

# Or download first, then run
wget https://raw.githubusercontent.com/accmasterwork/homework/codegen-bot/open-source-project-manager-foundation-1763889658/setup.sh
chmod +x setup.sh
./setup.sh
```

#### Windows:
```cmd
# Download setup.bat from the repository
# Double-click setup.bat to run
# Or run from command prompt:
setup.bat
```

### Step 2: Follow the Interactive Prompts

The script will guide you through:

1. **System Check** - Verifies Node.js, Git, and other dependencies
2. **Repository Setup** - Clones the project and installs dependencies
3. **Supabase Configuration** - Database setup and connection
4. **GitHub OAuth Setup** - Authentication configuration
5. **OpenAI Setup** (Optional) - AI features configuration
6. **Admin Account** - Create your admin user
7. **Build Process** - Compile and prepare the application

### Step 3: Complete External Setups

#### Supabase Setup:
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your project URL and API keys
4. Run the provided SQL migrations in the SQL Editor

#### GitHub OAuth Setup:
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create new OAuth App with these settings:
   - **Application name**: Open Source Project Manager
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/auth/callback`
3. Copy Client ID and Client Secret

#### OpenAI Setup (Optional):
1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy the key (starts with 'sk-')

## 🚀 Starting the Application

After setup completes, you have several options:

### Quick Start:
```bash
# Linux/Mac
./start.sh

# Windows
start.bat
```

### Manual Start:
```bash
npm run dev
```

### Docker:
```bash
# Production
docker-compose up -d

# Development
docker-compose -f docker-compose.dev.yml up
```

## 🌐 Accessing Your Platform

Once started, open your browser to:
- **URL**: http://localhost:3000
- **Admin Email**: admin@example.com (or your custom email)
- **Admin Password**: demo123456 (or your custom password)

## 🎯 What You Get

### ✅ **Complete Platform Features**
- **5-Step Project Wizard** - Guided project creation
- **Project Dashboard** - 8 comprehensive tabs
- **Kanban Board** - Visual milestone tracking
- **Issue Management** - Advanced filtering and search
- **GitHub Integration** - OAuth authentication
- **AI-Powered Features** - Content generation assistance
- **Responsive Design** - Works on all devices
- **Real-time Data** - Live updates with Supabase

### ✅ **Ready-to-Use Components**
- User authentication system
- Project creation and management
- Milestone tracking with drag-and-drop
- Issue tracking and filtering
- Team collaboration features
- Documentation management
- Security monitoring
- Settings and configuration

## 🔧 Customization Options

### Environment Variables
The setup creates a `.env.local` file with all necessary configurations:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# OpenAI (Optional)
OPENAI_API_KEY=your_openai_api_key

# Admin Account
DEMO_ADMIN_EMAIL=admin@example.com
DEMO_ADMIN_PASSWORD=your_secure_password
```

### Customizing the Platform
- **Branding**: Update colors, logos, and text in the components
- **Features**: Enable/disable specific features in the configuration
- **Database**: Extend the schema for additional functionality
- **Integrations**: Add more third-party services

## 🐳 Docker Deployment

### Development:
```bash
docker-compose -f docker-compose.dev.yml up
```

### Production:
```bash
docker-compose up -d
```

### Custom Docker Build:
```bash
docker build -t ospm .
docker run -p 3000:3000 --env-file .env.local ospm
```

## 🔍 Troubleshooting

### Common Issues:

#### Node.js Version Issues:
```bash
# Check Node.js version
node --version

# Should be 18 or higher
# If not, the setup script will help install the correct version
```

#### Permission Issues (Linux/Mac):
```bash
# Make setup script executable
chmod +x setup.sh

# Run with proper permissions
./setup.sh
```

#### Database Connection Issues:
1. Verify Supabase URL and keys are correct
2. Check that SQL migrations were run
3. Ensure RLS policies are enabled

#### GitHub OAuth Issues:
1. Verify callback URL matches exactly: `http://localhost:3000/auth/callback`
2. Check Client ID and Secret are correct
3. Ensure OAuth app is not suspended

### Getting Help:
- Check the console for error messages
- Verify all environment variables are set
- Ensure all external services (Supabase, GitHub) are properly configured
- Review the setup script output for any failed steps

## 📚 Next Steps

After installation:

1. **Explore the Platform**
   - Create your first project using the wizard
   - Set up milestones and issues
   - Invite team members
   - Configure project settings

2. **Customize for Your Needs**
   - Update branding and styling
   - Configure additional integrations
   - Set up production deployment
   - Add custom features

3. **Deploy to Production**
   - Set up a production Supabase project
   - Configure production environment variables
   - Deploy using Docker or your preferred platform
   - Set up domain and SSL certificates

## 🎉 Success!

Congratulations! You now have a fully functional Open Source Project Management Platform running locally. The setup script has handled all the complex configuration, and you're ready to start managing your open source projects like a pro!

## 📞 Support

If you encounter any issues during setup:
1. Check this guide for troubleshooting steps
2. Review the setup script output for error messages
3. Verify all external service configurations
4. Check the project's GitHub issues for known problems

---

**Happy coding! Your open source projects await! 🚀**

