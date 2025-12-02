# Open Source Project Manager

A comprehensive platform for managing open-source projects with AI-powered features, GitHub integration, and team collaboration tools.

## 🚀 Features

### Core Entities
- **Projects** - Store vision, goals, scope, license, tech stack, and metrics
- **Milestones** - Track technical, community, and release milestones
- **Issues** - Manage bugs, features, "good first issues", and more
- **Contributors** - Track maintainers, core contributors, and community members
- **Documentation** - Organize getting started guides, API docs, contributing guides
- **Discussions** - Community feedback and Q&A
- **Security Assessments** - Monitor and track vulnerabilities

### Key Capabilities
- ✅ AI-assisted content generation for vision, scope, and audience
- ✅ Multiple license options (MIT, GPL, Apache, etc.)
- ✅ Tech stack management
- ✅ GitHub integration with real-time sync
- ✅ Priority and status tracking across all entities
- ✅ Beautiful, responsive UI with color-coded badges
- ✅ Search and filtering
- ✅ Real-time metrics (stars, forks, contributors)
- ✅ Team collaboration with role-based permissions
- ✅ Project templates for quick bootstrapping
- ✅ Notification system for project updates

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Authentication**: GitHub OAuth
- **AI Integration**: OpenAI API (optional)
- **Deployment**: Docker (flexible deployment anywhere)

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm
- Supabase account
- GitHub OAuth App

### 1. Clone the repository
```bash
git clone <repository-url>
cd open-source-project-manager
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Setup
Copy the example environment file and configure your variables:
```bash
cp .env.local.example .env.local
```

Fill in your environment variables:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_PROJECT_ID=your_supabase_project_id

# GitHub OAuth Configuration
GITHUB_CLIENT_ID=your_github_oauth_app_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_app_client_secret

# AI Configuration (Optional)
OPENAI_API_KEY=your_openai_api_key

# Application Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

### 4. Database Setup
Run the database migrations:
```bash
# If using Supabase CLI
supabase migration up

# Or manually run the SQL files in supabase/migrations/ in your Supabase dashboard
```

### 5. GitHub OAuth Setup
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App with:
   - Application name: Your app name
   - Homepage URL: `http://localhost:3000` (for development)
   - Authorization callback URL: `http://localhost:3000/auth/callback`
3. Copy the Client ID and Client Secret to your `.env.local`

### 6. Run the development server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🐳 Docker Deployment

### Build and run with Docker
```bash
# Build the image
docker build -t ospm .

# Run the container
docker run -p 3000:3000 --env-file .env.local ospm
```

### Using Docker Compose
```bash
# Development
docker-compose -f docker-compose.dev.yml up

# Production
docker-compose up
```

## 📖 Usage

### Demo Admin Account
For testing purposes, you can create a demo admin account:
- Email: `admin@example.com`
- Password: `demo123456`

### Creating Your First Project
1. Sign in with GitHub
2. Click "Create New Project" or use the Project Wizard
3. Fill in project details (name, description, tech stack, etc.)
4. Optionally connect your GitHub repository for automatic sync
5. Set up milestones, issues, and documentation
6. Invite team members and assign roles

### GitHub Integration
- Connect your GitHub repository to automatically sync:
  - Stars, forks, and contributor counts
  - Issues and pull requests
  - Repository metadata
- Import existing GitHub issues into the platform
- Link platform issues to GitHub issues

### AI-Powered Features
- Generate project vision and scope descriptions
- Get suggestions for project goals and milestones
- Auto-generate documentation templates
- Smart content recommendations

## 🏗️ Project Structure

```
├── src/
│   ├── app/                 # Next.js app router pages
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components
│   │   ├── layout/         # Layout components
│   │   ├── auth/           # Authentication components
│   │   └── projects/       # Project-specific components
│   ├── lib/                # Utility functions and configurations
│   ├── types/              # TypeScript type definitions
│   └── contexts/           # React contexts
├── supabase/
│   └── migrations/         # Database migration files
├── public/                 # Static assets
└── docs/                   # Documentation
```

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm test` - Run tests

### Database Management
- `npm run db:generate` - Generate TypeScript types from Supabase schema
- `npm run db:reset` - Reset database (development only)
- `npm run db:migrate` - Run pending migrations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database and auth powered by [Supabase](https://supabase.com/)
- UI components inspired by [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

## 📞 Support

If you have any questions or need help, please:
1. Check the [documentation](docs/)
2. Search existing [issues](issues)
3. Create a new issue if needed

---

Made with ❤️ for the open source community

