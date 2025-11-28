# 🚀 Installation Methods - Choose Your Adventure!

The Open Source Project Manager offers **multiple installation methods** to suit your preferences and environment. Choose the one that works best for you!

## 🎯 Method 1: One-Line Installation (Recommended)

### Linux/Mac - Super Quick:
```bash
curl -fsSL https://raw.githubusercontent.com/accmasterwork/homework/codegen-bot/open-source-project-manager-foundation-1763889658/install.sh | bash
```

### Alternative One-Liner:
```bash
bash <(curl -fsSL https://raw.githubusercontent.com/accmasterwork/homework/codegen-bot/open-source-project-manager-foundation-1763889658/setup.sh)
```

## 🎯 Method 2: Download and Run

### Linux/Mac:
```bash
# Download the setup script
wget https://raw.githubusercontent.com/accmasterwork/homework/codegen-bot/open-source-project-manager-foundation-1763889658/setup.sh

# Make it executable and run
chmod +x setup.sh
./setup.sh
```

### Windows:
1. Download `setup.bat` from the repository
2. Double-click to run, or:
```cmd
setup.bat
```

## 🎯 Method 3: Clone and Setup

```bash
# Clone the repository
git clone https://github.com/accmasterwork/homework.git ospm
cd ospm
git checkout codegen-bot/open-source-project-manager-foundation-1763889658

# Run setup
chmod +x setup.sh
./setup.sh
```

## 🎯 Method 4: NPM Scripts (After Cloning)

```bash
# After cloning the repository
npm run setup          # Linux/Mac
npm run setup:windows  # Windows
npm run quick-start    # Setup + Start in one command
```

## 🎯 Method 5: Docker Quick Start

```bash
# Clone repository
git clone https://github.com/accmasterwork/homework.git ospm
cd ospm
git checkout codegen-bot/open-source-project-manager-foundation-1763889658

# Copy environment file and configure
cp .env.local.example .env.local
# Edit .env.local with your settings

# Run with Docker
docker-compose up -d
```

## 🎯 Method 6: Manual Installation

If you prefer to do everything manually:

### 1. Prerequisites:
- Node.js 18+
- Git
- Supabase account
- GitHub OAuth app

### 2. Clone and Install:
```bash
git clone https://github.com/accmasterwork/homework.git ospm
cd ospm
git checkout codegen-bot/open-source-project-manager-foundation-1763889658
npm install
```

### 3. Configure Environment:
```bash
cp .env.local.example .env.local
# Edit .env.local with your configurations
```

### 4. Setup Database:
- Run SQL migrations in Supabase dashboard
- Configure RLS policies

### 5. Build and Start:
```bash
npm run build
npm run dev
```

## 🔧 What Each Method Does

All installation methods will:

✅ **Install Dependencies** - Node.js, Git, build tools  
✅ **Clone Repository** - Get the latest code  
✅ **Setup Environment** - Configure all settings  
✅ **Database Setup** - Supabase configuration  
✅ **OAuth Setup** - GitHub authentication  
✅ **Build Application** - Compile for production  
✅ **Create Scripts** - Easy startup commands  
✅ **Docker Config** - Container deployment ready  

## 🎉 After Installation

Regardless of which method you choose, you'll have:

- **Complete Platform** running at `http://localhost:3000`
- **Admin Access** with your configured credentials
- **All Features** ready to use
- **Development Environment** fully configured
- **Production Ready** Docker setup

## 🚀 Quick Start Commands

After any installation method:

```bash
# Start development server
./start.sh        # Linux/Mac
start.bat         # Windows
npm run dev       # Universal

# Build for production
npm run build

# Run with Docker
docker-compose up -d
```

## 🆘 Need Help?

- **Setup Issues**: Check `SETUP_GUIDE.md` for detailed troubleshooting
- **Configuration**: Review `.env.local.example` for all options
- **Database**: Ensure Supabase migrations are run correctly
- **OAuth**: Verify GitHub app settings match exactly

---

**Choose your preferred method and get started in minutes! 🎯**

