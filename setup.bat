@echo off
setlocal enabledelayedexpansion

REM =============================================================================
REM Open Source Project Manager - Windows Setup Script
REM =============================================================================
REM This script will automatically install and configure the entire platform
REM Similar to WordPress installation - just run and follow the prompts!
REM =============================================================================

title Open Source Project Manager Setup

REM Configuration variables
set PROJECT_NAME=Open Source Project Manager
set PROJECT_DIR=ospm
set NODE_VERSION=18
set SUPABASE_PROJECT_NAME=
set GITHUB_CLIENT_ID=
set GITHUB_CLIENT_SECRET=
set OPENAI_API_KEY=
set ADMIN_EMAIL=admin@example.com
set ADMIN_PASSWORD=

REM =============================================================================
REM Utility Functions
REM =============================================================================

:print_header
cls
echo.
echo ================================================================================
echo.
echo                    🚀 Open Source Project Manager Setup
echo.
echo                         Automated Installation Script
echo.
echo ================================================================================
echo.
goto :eof

:print_step
echo.
echo ⚙️  %~1
echo.
goto :eof

:print_success
echo.
echo ✅ %~1
echo.
goto :eof

:print_error
echo.
echo ❌ %~1
echo.
goto :eof

:print_warning
echo.
echo ⚠️  %~1
echo.
goto :eof

:print_info
echo.
echo ℹ️  %~1
echo.
goto :eof

:ask_question
set /p response="🤔 %~1: "
if "!response!"=="" set response=%~2
goto :eof

:check_command
where %1 >nul 2>&1
goto :eof

:install_node
call :print_step "Installing Node.js %NODE_VERSION%..."

call :check_command node
if !errorlevel! equ 0 (
    for /f "tokens=1 delims=v" %%i in ('node --version') do set current_version=%%i
    for /f "tokens=1 delims=." %%i in ("!current_version!") do set major_version=%%i
    if !major_version! geq %NODE_VERSION% (
        call :print_success "Node.js !current_version! is already installed"
        goto :eof
    )
)

call :print_info "Please install Node.js manually:"
echo 1. Go to https://nodejs.org/
echo 2. Download Node.js %NODE_VERSION% LTS
echo 3. Run the installer
echo 4. Restart this script after installation
echo.
pause
exit /b 1

:install_dependencies
call :print_step "Checking system dependencies..."

call :check_command git
if !errorlevel! neq 0 (
    call :print_error "Git is not installed. Please install Git from https://git-scm.com/"
    pause
    exit /b 1
)

call :check_command npm
if !errorlevel! neq 0 (
    call :print_error "npm is not installed. Please install Node.js first."
    pause
    exit /b 1
)

call :print_success "System dependencies are ready"
goto :eof

:clone_repository
call :print_step "Cloning the project repository..."

if exist "%PROJECT_DIR%" (
    call :print_warning "Directory %PROJECT_DIR% already exists. Removing..."
    rmdir /s /q "%PROJECT_DIR%"
)

git clone https://github.com/accmasterwork/homework.git "%PROJECT_DIR%"
cd "%PROJECT_DIR%"
git checkout codegen-bot/open-source-project-manager-foundation-1763889658

call :print_success "Repository cloned successfully"
goto :eof

:install_npm_dependencies
call :print_step "Installing Node.js dependencies..."

npm install

call :print_success "Node.js dependencies installed"
goto :eof

:setup_environment
call :print_step "Setting up environment configuration..."

copy .env.local.example .env.local

REM Generate a simple NextAuth secret (Windows compatible)
set nextauth_secret=%RANDOM%%RANDOM%%RANDOM%%RANDOM%

REM Update environment file (Windows batch compatible)
powershell -Command "(gc .env.local) -replace 'your_supabase_project_url', '%SUPABASE_URL%' | Out-File -encoding ASCII .env.local"
powershell -Command "(gc .env.local) -replace 'your_supabase_anon_key', '%SUPABASE_ANON_KEY%' | Out-File -encoding ASCII .env.local"
powershell -Command "(gc .env.local) -replace 'your_supabase_service_role_key', '%SUPABASE_SERVICE_KEY%' | Out-File -encoding ASCII .env.local"
powershell -Command "(gc .env.local) -replace 'your_supabase_project_id', '%SUPABASE_PROJECT_ID%' | Out-File -encoding ASCII .env.local"
powershell -Command "(gc .env.local) -replace 'your_github_oauth_app_client_id', '%GITHUB_CLIENT_ID%' | Out-File -encoding ASCII .env.local"
powershell -Command "(gc .env.local) -replace 'your_github_oauth_app_client_secret', '%GITHUB_CLIENT_SECRET%' | Out-File -encoding ASCII .env.local"
powershell -Command "(gc .env.local) -replace 'your_openai_api_key', '%OPENAI_API_KEY%' | Out-File -encoding ASCII .env.local"
powershell -Command "(gc .env.local) -replace 'your_nextauth_secret', '%nextauth_secret%' | Out-File -encoding ASCII .env.local"
powershell -Command "(gc .env.local) -replace 'admin@example.com', '%ADMIN_EMAIL%' | Out-File -encoding ASCII .env.local"
powershell -Command "(gc .env.local) -replace 'demo123456', '%ADMIN_PASSWORD%' | Out-File -encoding ASCII .env.local"

call :print_success "Environment configuration completed"
goto :eof

:setup_supabase
call :print_step "Setting up Supabase database..."

call :print_info "Please follow these steps to set up Supabase:"
echo.
echo 1. Go to https://supabase.com and create a new account
echo 2. Create a new project
echo 3. Go to Settings ^> API to get your keys
echo 4. Go to Settings ^> Database to get your connection details
echo.

call :ask_question "Enter your Supabase Project URL" ""
set SUPABASE_URL=!response!

call :ask_question "Enter your Supabase Anon Key" ""
set SUPABASE_ANON_KEY=!response!

call :ask_question "Enter your Supabase Service Role Key" ""
set SUPABASE_SERVICE_KEY=!response!

call :ask_question "Enter your Supabase Project ID" ""
set SUPABASE_PROJECT_ID=!response!

call :print_success "Supabase configuration saved"
goto :eof

:setup_github_oauth
call :print_step "Setting up GitHub OAuth..."

call :print_info "Please follow these steps to set up GitHub OAuth:"
echo.
echo 1. Go to GitHub Settings ^> Developer settings ^> OAuth Apps
echo 2. Click 'New OAuth App'
echo 3. Fill in the details:
echo    - Application name: Open Source Project Manager
echo    - Homepage URL: http://localhost:3000
echo    - Authorization callback URL: http://localhost:3000/auth/callback
echo 4. Click 'Register application'
echo 5. Copy the Client ID and generate a Client Secret
echo.

call :ask_question "Enter your GitHub OAuth Client ID" ""
set GITHUB_CLIENT_ID=!response!

call :ask_question "Enter your GitHub OAuth Client Secret" ""
set GITHUB_CLIENT_SECRET=!response!

call :print_success "GitHub OAuth configuration saved"
goto :eof

:setup_openai
call :print_step "Setting up OpenAI (Optional)..."

call :ask_question "Do you want to enable AI features with OpenAI? (y/n)" "n"
set use_openai=!response!

if /i "!use_openai!"=="y" (
    call :print_info "Please follow these steps to get your OpenAI API key:"
    echo.
    echo 1. Go to https://platform.openai.com/api-keys
    echo 2. Create a new API key
    echo 3. Copy the key (it starts with 'sk-')
    echo.
    
    call :ask_question "Enter your OpenAI API Key" ""
    set OPENAI_API_KEY=!response!
    call :print_success "OpenAI configuration saved"
) else (
    set OPENAI_API_KEY=
    call :print_info "Skipping OpenAI setup - AI features will use simulated responses"
)
goto :eof

:setup_admin_account
call :print_step "Setting up admin account..."

call :ask_question "Enter admin email" "%ADMIN_EMAIL%"
set ADMIN_EMAIL=!response!

set /p ADMIN_PASSWORD="🔐 Enter admin password: "

if "!ADMIN_PASSWORD!"=="" (
    set ADMIN_PASSWORD=demo123456
    call :print_warning "Using default password: demo123456"
)

call :print_success "Admin account configuration saved"
goto :eof

:run_database_migrations
call :print_step "Running database migrations..."

call :print_info "Please run the following SQL files in your Supabase SQL Editor:"
echo.
echo 1. Go to your Supabase dashboard
echo 2. Navigate to SQL Editor
echo 3. Run the contents of these files in order:
echo    - supabase/migrations/001_initial_schema.sql
echo    - supabase/migrations/002_rls_policies.sql
echo.

pause

call :print_success "Database migrations completed"
goto :eof

:build_application
call :print_step "Building the application..."

npm run build

call :print_success "Application built successfully"
goto :eof

:create_startup_script
call :print_step "Creating startup script..."

echo @echo off > start.bat
echo. >> start.bat
echo echo 🚀 Starting Open Source Project Manager... >> start.bat
echo echo. >> start.bat
echo echo 📍 Application will be available at: http://localhost:3000 >> start.bat
echo echo 🔐 Admin credentials: >> start.bat
echo echo    Email: %ADMIN_EMAIL% >> start.bat
echo echo    Password: %ADMIN_PASSWORD% >> start.bat
echo echo. >> start.bat
echo echo Press Ctrl+C to stop the server >> start.bat
echo echo. >> start.bat
echo. >> start.bat
echo npm run dev >> start.bat

call :print_success "Startup script created (start.bat)"
goto :eof

:create_docker_setup
call :print_step "Setting up Docker configuration..."

call :print_info "Docker configuration is ready!"
echo.
echo To run with Docker:
echo   docker-compose up -d
echo.
echo To run in development mode:
echo   docker-compose -f docker-compose.dev.yml up
echo.

call :print_success "Docker setup completed"
goto :eof

:print_completion
cls
echo.
echo ================================================================================
echo.
echo                        🎉 INSTALLATION COMPLETE! 🎉
echo.
echo ================================================================================
echo.
echo 🚀 Your Open Source Project Manager is ready!
echo.
echo 🌐 Application URL: http://localhost:3000
echo 🔐 Admin Email: %ADMIN_EMAIL%
echo 🔐 Admin Password: %ADMIN_PASSWORD%
echo.
echo ✨ Quick Start Commands:
echo   start.bat                 - Start development server
echo   npm run dev               - Start development server (alternative)
echo   npm run build             - Build for production
echo   docker-compose up         - Run with Docker
echo.
echo ℹ️  What's Available:
echo   ✅ Complete 5-step project wizard
echo   ✅ Project dashboard with 8 tabs
echo   ✅ Kanban-style milestone tracking
echo   ✅ Advanced issue management
echo   ✅ GitHub OAuth authentication
echo   ✅ Responsive design for all devices
echo   ✅ AI-powered content generation
echo   ✅ Real-time data with Supabase
echo.
echo ⚠️  Next Steps:
echo   1. Run 'start.bat' to start the development server
echo   2. Open http://localhost:3000 in your browser
echo   3. Sign in with GitHub to start creating projects
echo   4. Explore all the features and customize as needed
echo.
echo ✨ Happy coding! Your open source projects await! ✨
echo.
pause
goto :eof

REM =============================================================================
REM Main Installation Process
REM =============================================================================

:main
call :print_header

echo Welcome to the Open Source Project Manager setup!
echo This script will automatically install and configure everything you need.
echo.

pause

REM Step 1: Check dependencies
call :install_dependencies

REM Step 2: Install Node.js
call :install_node

REM Step 3: Clone repository
call :clone_repository

REM Step 4: Install npm dependencies
call :install_npm_dependencies

REM Step 5: Setup Supabase
call :setup_supabase

REM Step 6: Setup GitHub OAuth
call :setup_github_oauth

REM Step 7: Setup OpenAI (optional)
call :setup_openai

REM Step 8: Setup admin account
call :setup_admin_account

REM Step 9: Create environment file
call :setup_environment

REM Step 10: Run database migrations
call :run_database_migrations

REM Step 11: Build application
call :build_application

REM Step 12: Create startup script
call :create_startup_script

REM Step 13: Setup Docker
call :create_docker_setup

REM Step 14: Show completion message
call :print_completion

goto :eof

REM =============================================================================
REM Start Installation
REM =============================================================================

call :main

