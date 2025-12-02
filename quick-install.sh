#!/bin/bash

# =============================================================================
# Open Source Project Manager - Quick Direct Install
# =============================================================================
# This script directly installs the platform without intermediate downloads
# =============================================================================

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m'

# Configuration
PROJECT_DIR="ospm"
BRANCH="codegen-bot/open-source-project-manager-foundation-1763889658"

print_header() {
    clear
    echo -e "${PURPLE}"
    echo "╔══════════════════════════════════════════════════════════════════════════════╗"
    echo "║                                                                              ║"
    echo "║                    ${WHITE}🚀 Open Source Project Manager${PURPLE}                         ║"
    echo "║                                                                              ║"
    echo "║                        ${CYAN}Quick Installation${PURPLE}                               ║"
    echo "║                                                                              ║"
    echo "╚══════════════════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
}

print_step() {
    echo -e "${BLUE}⚙️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

check_dependencies() {
    print_step "Checking system dependencies..."
    
    # Check for git
    if ! command -v git >/dev/null 2>&1; then
        print_error "Git is not installed. Please install Git first."
        echo "  Ubuntu/Debian: sudo apt-get install git"
        echo "  CentOS/RHEL: sudo yum install git"
        echo "  macOS: brew install git"
        exit 1
    fi
    
    # Check for Node.js
    if ! command -v node >/dev/null 2>&1; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        echo "  Visit: https://nodejs.org/"
        exit 1
    fi
    
    # Check Node.js version
    local node_version=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$node_version" -lt 18 ]; then
        print_error "Node.js version $node_version is too old. Please install Node.js 18 or higher."
        exit 1
    fi
    
    # Check for npm
    if ! command -v npm >/dev/null 2>&1; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    print_success "All dependencies are available"
}

clone_and_setup() {
    print_step "Cloning repository..."
    
    # Remove existing directory if it exists
    if [ -d "$PROJECT_DIR" ]; then
        print_info "Removing existing $PROJECT_DIR directory..."
        rm -rf "$PROJECT_DIR"
    fi
    
    # Clone repository
    if git clone https://github.com/accmasterwork/homework.git "$PROJECT_DIR"; then
        print_success "Repository cloned successfully"
    else
        print_error "Failed to clone repository"
        exit 1
    fi
    
    # Enter project directory
    cd "$PROJECT_DIR"
    
    # Checkout correct branch
    if git checkout "$BRANCH"; then
        print_success "Checked out branch: $BRANCH"
    else
        print_error "Failed to checkout branch: $BRANCH"
        exit 1
    fi
}

install_dependencies() {
    print_step "Installing Node.js dependencies..."
    
    if npm install; then
        print_success "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
}

setup_environment() {
    print_step "Setting up environment file..."
    
    if [ -f ".env.local.example" ]; then
        cp .env.local.example .env.local
        print_success "Environment file created (.env.local)"
        print_info "Please edit .env.local with your configuration:"
        echo "  - Supabase URL and keys"
        echo "  - GitHub OAuth credentials"
        echo "  - OpenAI API key (optional)"
    else
        print_error ".env.local.example not found"
        exit 1
    fi
}

create_start_script() {
    print_step "Creating start script..."
    
    cat > start.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Open Source Project Manager..."
echo ""
echo "📍 Application will be available at: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""
npm run dev
EOF
    
    chmod +x start.sh
    print_success "Start script created (start.sh)"
}

print_completion() {
    echo ""
    echo -e "${GREEN}"
    echo "╔══════════════════════════════════════════════════════════════════════════════╗"
    echo "║                                                                              ║"
    echo "║                        ${WHITE}🎉 INSTALLATION COMPLETE! 🎉${GREEN}                        ║"
    echo "║                                                                              ║"
    echo "╚══════════════════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
    echo -e "${WHITE}🚀 Your Open Source Project Manager is ready!${NC}"
    echo ""
    echo -e "${YELLOW}📋 Next Steps:${NC}"
    echo "1. Configure your environment:"
    echo "   ${CYAN}nano .env.local${NC}"
    echo ""
    echo "2. Set up your Supabase database:"
    echo "   - Go to https://supabase.com"
    echo "   - Create a new project"
    echo "   - Run the SQL files in supabase/migrations/"
    echo ""
    echo "3. Set up GitHub OAuth:"
    echo "   - Go to GitHub Settings > Developer settings > OAuth Apps"
    echo "   - Create new OAuth App"
    echo "   - Use http://localhost:3000/auth/callback as callback URL"
    echo ""
    echo "4. Start the application:"
    echo "   ${GREEN}./start.sh${NC}"
    echo ""
    echo -e "${CYAN}🌐 Application URL:${NC} http://localhost:3000"
    echo ""
    echo -e "${PURPLE}✨ Happy coding! Your open source projects await! ✨${NC}"
    echo ""
}

# Main execution
main() {
    print_header
    
    echo -e "${WHITE}This script will quickly install the Open Source Project Manager${NC}"
    echo -e "${CYAN}Make sure you have Node.js 18+ and Git installed${NC}"
    echo ""
    
    read -p "Press Enter to continue..."
    echo ""
    
    check_dependencies
    clone_and_setup
    install_dependencies
    setup_environment
    create_start_script
    print_completion
}

# Run main function
main "$@"

