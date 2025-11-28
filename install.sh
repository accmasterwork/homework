#!/bin/bash

# =============================================================================
# Open Source Project Manager - One-Line Installer
# =============================================================================
# Usage: curl -fsSL https://raw.githubusercontent.com/accmasterwork/homework/codegen-bot/open-source-project-manager-foundation-1763889658/install.sh | bash
# =============================================================================

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 Open Source Project Manager - One-Line Installer${NC}"
echo ""

# Store original directory
ORIGINAL_DIR=$(pwd)

# Create temporary directory
TEMP_DIR=$(mktemp -d)
echo -e "${YELLOW}📦 Using temporary directory: $TEMP_DIR${NC}"

cd "$TEMP_DIR"

echo -e "${YELLOW}📦 Downloading setup script...${NC}"

# Download the main setup script
if curl -fsSL https://raw.githubusercontent.com/accmasterwork/homework/codegen-bot/open-source-project-manager-foundation-1763889658/setup.sh -o setup.sh; then
    echo -e "${GREEN}✅ Setup script downloaded successfully${NC}"
else
    echo -e "${RED}❌ Failed to download setup script${NC}"
    exit 1
fi

# Make it executable
chmod +x setup.sh

echo ""
echo -e "${BLUE}🚀 Starting installation...${NC}"
echo ""

# Run the setup script
if ./setup.sh; then
    echo -e "${GREEN}🎉 Installation completed successfully!${NC}"
    echo ""
    echo -e "${YELLOW}📍 Your project is installed in: $ORIGINAL_DIR/ospm${NC}"
    echo -e "${YELLOW}🚀 To start the application:${NC}"
    echo "   cd $ORIGINAL_DIR/ospm"
    echo "   ./start.sh"
    echo ""
else
    echo -e "${RED}❌ Installation failed${NC}"
    exit 1
fi

# Cleanup
cd "$ORIGINAL_DIR"
rm -rf "$TEMP_DIR"

echo -e "${GREEN}🎉 Setup complete! Happy coding! 🚀${NC}"
