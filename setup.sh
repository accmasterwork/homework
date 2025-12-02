#!/bin/bash

# =============================================================================
# Open Source Project Manager - Automated Setup Script
# =============================================================================
# This script will automatically install and configure the entire platform
# Similar to WordPress installation - just run and follow the prompts!
# =============================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Emojis for better UX
ROCKET="🚀"
CHECK="✅"
CROSS="❌"
WARNING="⚠️"
INFO="ℹ️"
GEAR="⚙️"
PACKAGE="📦"
DATABASE="🗄️"
LOCK="🔐"
GLOBE="🌐"
MAGIC="✨"

# Configuration variables
PROJECT_NAME="Open Source Project Manager"
PROJECT_DIR="ospm"
NODE_VERSION="18"
SUPABASE_PROJECT_NAME=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
OPENAI_API_KEY=""
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD=""

# =============================================================================
# Utility Functions
# =============================================================================

print_header() {
    clear
    echo -e "${PURPLE}"
    echo "╔══════════════════════════════════════════════════════════════════════════════╗"
    echo "║                                                                              ║"
    echo "║                    ${WHITE}🚀 Open Source Project Manager Setup${PURPLE}                    ║"
    echo "║                                                                              ║"
    echo "║                     ${CYAN}Automated Installation Script${PURPLE}                         ║"
    echo "║                                                                              ║"
    echo "╚══════════════════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
}

print_step() {
    echo -e "${BLUE}${GEAR} $1${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}${CHECK} $1${NC}"
    echo ""
}

print_error() {
    echo -e "${RED}${CROSS} $1${NC}"
    echo ""
}

print_warning() {
    echo -e "${YELLOW}${WARNING} $1${NC}"
    echo ""
}

print_info() {
    echo -e "${CYAN}${INFO} $1${NC}"
    echo ""
}

ask_question() {
    local question="$1"
    local default="$2"
    local response
    
    if [ -n "$default" ]; then
        echo -e "${WHITE}$question ${YELLOW}(default: $default)${NC}"
    else
        echo -e "${WHITE}$question${NC}"
    fi
    
    read -r response
    if [ -z "$response" ] && [ -n "$default" ]; then
        response="$default"
    fi
    echo "$response"
}

ask_password() {
    local question="$1"
    local response
    
    echo -e "${WHITE}$question${NC}"
    read -s -r response
    echo ""
    echo "$response"
}

check_command() {
    if command -v "$1" >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

install_node() {
    print_step "Installing Node.js $NODE_VERSION..."
    
    if check_command "node"; then
        local current_version=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$current_version" -ge "$NODE_VERSION" ]; then
            print_success "Node.js $current_version is already installed"
            return 0
        fi
    fi
    
    # Install Node.js using NodeSource repository
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
        sudo apt-get install -y nodejs
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        if check_command "brew"; then
            brew install node@${NODE_VERSION}
        else
            print_error "Homebrew not found. Please install Node.js manually from https://nodejs.org/"
            exit 1
        fi
    else
        print_error "Unsupported operating system. Please install Node.js manually."
        exit 1
    fi
    
    print_success "Node.js installed successfully"
}

install_dependencies() {
    print_step "Installing system dependencies..."
    
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get update
        sudo apt-get install -y curl git build-essential
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        if ! check_command "brew"; then
            print_info "Installing Homebrew..."
            /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        fi
        brew install curl git
    fi
    
    print_success "System dependencies installed"
}

clone_repository() {
    print_step "Cloning the project repository..."
    
    if [ -d "$PROJECT_DIR" ]; then
        print_warning "Directory $PROJECT_DIR already exists. Removing..."
        rm -rf "$PROJECT_DIR"
    fi
    
    git clone https://github.com/accmasterwork/homework.git "$PROJECT_DIR"
    if [ $? -ne 0 ]; then
        print_error "Failed to clone repository"
        exit 1
    fi
    
    cd "$PROJECT_DIR"
    if [ $? -ne 0 ]; then
        print_error "Failed to enter project directory"
        exit 1
    fi
    
    git checkout codegen-bot/open-source-project-manager-foundation-1763889658
    if [ $? -ne 0 ]; then
        print_error "Failed to checkout branch"
        exit 1
    fi
    
    print_success "Repository cloned successfully"
}

install_npm_dependencies() {
    print_step "Installing Node.js dependencies..."
    
    npm install
    
    print_success "Node.js dependencies installed"
}

setup_environment() {
    print_step "Setting up environment configuration..."
    
    # Check if example file exists
    if [ ! -f ".env.local.example" ]; then
        print_error ".env.local.example file not found. Make sure you're in the project directory."
        exit 1
    fi
    
    # Copy example environment file
    cp .env.local.example .env.local
    
    # Generate NextAuth secret
    local nextauth_secret
    if command -v openssl >/dev/null 2>&1; then
        nextauth_secret=$(openssl rand -base64 32)
    else
        # Fallback for systems without openssl
        nextauth_secret=$(date +%s | sha256sum | base64 | head -c 32)
    fi
    
    # Create environment file using cat instead of sed to avoid special character issues
    cat > .env.local << EOF
# Application Configuration
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=$nextauth_secret

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_KEY
SUPABASE_PROJECT_ID=$SUPABASE_PROJECT_ID

# GitHub OAuth Configuration
GITHUB_CLIENT_ID=$GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET=$GITHUB_CLIENT_SECRET

# OpenAI Configuration (Optional)
OPENAI_API_KEY=$OPENAI_API_KEY

# Admin Account Configuration
DEMO_ADMIN_EMAIL=$ADMIN_EMAIL
DEMO_ADMIN_PASSWORD=$ADMIN_PASSWORD
EOF
    
    print_success "Environment configuration completed"
}

setup_supabase() {
    print_step "Setting up Supabase database..."
    
    print_info "Please follow these steps to set up Supabase:"
    echo ""
    echo "1. Go to https://supabase.com and create a new account"
    echo "2. Create a new project"
    echo "3. Go to Settings > API to get your keys"
    echo "4. Go to Settings > Database to get your connection details"
    echo ""
    
    SUPABASE_URL=$(ask_question "Enter your Supabase Project URL:" "")
    SUPABASE_ANON_KEY=$(ask_question "Enter your Supabase Anon Key:" "")
    SUPABASE_SERVICE_KEY=$(ask_question "Enter your Supabase Service Role Key:" "")
    SUPABASE_PROJECT_ID=$(ask_question "Enter your Supabase Project ID:" "")
    
    print_success "Supabase configuration saved"
}

setup_github_oauth() {
    print_step "Setting up GitHub OAuth..."
    
    print_info "Please follow these steps to set up GitHub OAuth:"
    echo ""
    echo "1. Go to GitHub Settings > Developer settings > OAuth Apps"
    echo "2. Click 'New OAuth App'"
    echo "3. Fill in the details:"
    echo "   - Application name: Open Source Project Manager"
    echo "   - Homepage URL: http://localhost:3000"
    echo "   - Authorization callback URL: http://localhost:3000/auth/callback"
    echo "4. Click 'Register application'"
    echo "5. Copy the Client ID and generate a Client Secret"
    echo ""
    
    GITHUB_CLIENT_ID=$(ask_question "Enter your GitHub OAuth Client ID:" "")
    GITHUB_CLIENT_SECRET=$(ask_question "Enter your GitHub OAuth Client Secret:" "")
    
    print_success "GitHub OAuth configuration saved"
}

setup_openai() {
    print_step "Setting up OpenAI (Optional)..."
    
    local use_openai=$(ask_question "Do you want to enable AI features with OpenAI? (y/n)" "n")
    
    if [[ "$use_openai" =~ ^[Yy]$ ]]; then
        print_info "Please follow these steps to get your OpenAI API key:"
        echo ""
        echo "1. Go to https://platform.openai.com/api-keys"
        echo "2. Create a new API key"
        echo "3. Copy the key (it starts with 'sk-')"
        echo ""
        
        OPENAI_API_KEY=$(ask_question "Enter your OpenAI API Key:" "")
        print_success "OpenAI configuration saved"
    else
        OPENAI_API_KEY=""
        print_info "Skipping OpenAI setup - AI features will use simulated responses"
    fi
}

setup_admin_account() {
    print_step "Setting up admin account..."
    
    ADMIN_EMAIL=$(ask_question "Enter admin email:" "$ADMIN_EMAIL")
    ADMIN_PASSWORD=$(ask_password "Enter admin password:")
    
    if [ -z "$ADMIN_PASSWORD" ]; then
        ADMIN_PASSWORD="demo123456"
        print_warning "Using default password: demo123456"
    fi
    
    print_success "Admin account configuration saved"
}

run_database_migrations() {
    print_step "Database migration setup..."
    
    print_info "Database migration files are ready!"
    echo ""
    echo "📋 Next steps for database setup:"
    echo "1. Go to your Supabase dashboard"
    echo "2. Navigate to SQL Editor"
    echo "3. Run the contents of these files in order:"
    echo "   - supabase/migrations/001_initial_schema.sql"
    echo "   - supabase/migrations/002_rls_policies.sql"
    echo ""
    echo "💡 You can do this after the installation completes."
    echo ""
    
    print_success "Database migration files prepared"
}

build_application() {
    print_step "Building the application..."
    
    npm run build
    
    print_success "Application built successfully"
}

create_startup_script() {
    print_step "Creating startup script..."
    
    cat > start.sh << 'EOF'
#!/bin/bash

echo "🚀 Starting Open Source Project Manager..."
echo ""
echo "📍 Application will be available at: http://localhost:3000"
echo "🔐 Admin credentials:"
echo "   Email: admin@example.com"
echo "   Password: demo123456"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
EOF
    
    chmod +x start.sh
    
    print_success "Startup script created (start.sh)"
}

create_docker_setup() {
    print_step "Setting up Docker configuration..."
    
    # Docker files are already in the repository
    print_info "Docker configuration is ready!"
    echo ""
    echo "To run with Docker:"
    echo "  docker-compose up -d"
    echo ""
    echo "To run in development mode:"
    echo "  docker-compose -f docker-compose.dev.yml up"
    echo ""
    
    print_success "Docker setup completed"
}

print_completion() {
    clear
    echo -e "${GREEN}"
    echo "╔══════════════════════════════════════════════════════════════════════════════╗"
    echo "║                                                                              ║"
    echo "║                        ${WHITE}🎉 INSTALLATION COMPLETE! 🎉${GREEN}                        ║"
    echo "║                                                                              ║"
    echo "╚══════════════════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
    echo -e "${WHITE}${ROCKET} Your Open Source Project Manager is ready!${NC}"
    echo ""
    echo -e "${CYAN}${GLOBE} Application URL:${NC} http://localhost:3000"
    echo -e "${CYAN}${LOCK} Admin Email:${NC} $ADMIN_EMAIL"
    echo -e "${CYAN}${LOCK} Admin Password:${NC} $ADMIN_PASSWORD"
    echo ""
    echo -e "${YELLOW}${MAGIC} Quick Start Commands:${NC}"
    echo -e "  ${GREEN}./start.sh${NC}                 - Start development server"
    echo -e "  ${GREEN}npm run dev${NC}               - Start development server (alternative)"
    echo -e "  ${GREEN}npm run build${NC}             - Build for production"
    echo -e "  ${GREEN}docker-compose up${NC}         - Run with Docker"
    echo ""
    echo -e "${YELLOW}${INFO} What's Available:${NC}"
    echo -e "  ${CHECK} Complete 5-step project wizard"
    echo -e "  ${CHECK} Project dashboard with 8 tabs"
    echo -e "  ${CHECK} Kanban-style milestone tracking"
    echo -e "  ${CHECK} Advanced issue management"
    echo -e "  ${CHECK} GitHub OAuth authentication"
    echo -e "  ${CHECK} Responsive design for all devices"
    echo -e "  ${CHECK} AI-powered content generation"
    echo -e "  ${CHECK} Real-time data with Supabase"
    echo ""
    echo -e "${YELLOW}${WARNING} Next Steps:${NC}"
    echo "  1. Set up your Supabase database:"
    echo "     - Go to https://supabase.com and create a project"
    echo "     - Run the SQL files in supabase/migrations/ in your SQL Editor"
    echo "     - Update your .env.local with Supabase credentials"
    echo "  2. Set up GitHub OAuth:"
    echo "     - Create OAuth app at https://github.com/settings/developers"
    echo "     - Update your .env.local with GitHub credentials"
    echo "  3. Run './start.sh' to start the development server"
    echo "  4. Open http://localhost:3000 in your browser"
    echo "  5. Sign in with GitHub to start creating projects"
    echo ""
    echo -e "${PURPLE}${MAGIC} Happy coding! Your open source projects await! ${MAGIC}${NC}"
    echo ""
}

# =============================================================================
# Main Installation Process
# =============================================================================

main() {
    # Store original directory
    local ORIGINAL_DIR=$(pwd)
    
    print_header
    
    echo -e "${WHITE}Welcome to the Open Source Project Manager setup!${NC}"
    echo -e "${CYAN}This script will automatically install and configure everything you need.${NC}"
    echo ""
    
    read -p "Press Enter to begin the installation..."
    
    # Step 1: Install system dependencies
    install_dependencies
    
    # Step 2: Install Node.js
    install_node
    
    # Step 3: Clone repository (this changes directory)
    clone_repository
    
    # Step 4: Install npm dependencies
    install_npm_dependencies
    
    # Step 5: Setup Supabase
    setup_supabase
    
    # Step 6: Setup GitHub OAuth
    setup_github_oauth
    
    # Step 7: Setup OpenAI (optional)
    setup_openai
    
    # Step 8: Setup admin account
    setup_admin_account
    
    # Step 9: Create environment file
    setup_environment
    
    # Step 10: Prepare database migrations
    run_database_migrations
    
    # Step 11: Create startup script
    create_startup_script
    
    # Step 13: Setup Docker
    create_docker_setup
    
    # Step 14: Show completion message
    print_completion
    
    # Return to original directory
    cd "$ORIGINAL_DIR"
}

# =============================================================================
# Error Handling
# =============================================================================

trap 'echo -e "\n${RED}${CROSS} Installation interrupted. Please run the script again.${NC}"; exit 1' INT

# Check if running as root (not recommended)
if [ "$EUID" -eq 0 ]; then
    print_warning "Running as root is not recommended. Please run as a regular user."
    read -p "Continue anyway? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# =============================================================================
# Start Installation
# =============================================================================

main "$@"
