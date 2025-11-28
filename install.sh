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
NC='\033[0m'

echo -e "${BLUE}🚀 Open Source Project Manager - One-Line Installer${NC}"
echo ""

# Create temporary directory
TEMP_DIR=$(mktemp -d)
cd "$TEMP_DIR"

echo -e "${YELLOW}📦 Downloading setup script...${NC}"

# Download the main setup script
curl -fsSL https://raw.githubusercontent.com/accmasterwork/homework/codegen-bot/open-source-project-manager-foundation-1763889658/setup.sh -o setup.sh

# Make it executable
chmod +x setup.sh

echo -e "${GREEN}✅ Setup script downloaded successfully${NC}"
echo ""

# Run the setup script
./setup.sh

# Cleanup
cd /
rm -rf "$TEMP_DIR"

echo -e "${GREEN}🎉 Installation complete!${NC}"

