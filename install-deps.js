#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Open Source Project Manager - Dependency Installer');
console.log('');

// Check if .env.local exists to determine hosting mode
const envPath = path.join(process.cwd(), '.env.local');
let hostingMode = 'supabase'; // default

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('HOSTING_MODE=cyberpanel')) {
    hostingMode = 'cyberpanel';
  }
}

console.log(`📋 Detected hosting mode: ${hostingMode}`);
console.log('');

// Install base dependencies
console.log('📦 Installing base dependencies...');
try {
  execSync('npm install --no-optional', { stdio: 'inherit' });
  console.log('✅ Base dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install base dependencies');
  process.exit(1);
}

// Install hosting-specific dependencies
if (hostingMode === 'cyberpanel') {
  console.log('');
  console.log('🔧 Installing CyberPanel dependencies...');
  const cyberPanelDeps = [
    'mysql2@^3.6.0',
    'bcryptjs@^2.4.3', 
    'jsonwebtoken@^9.0.0',
    'nodemailer@^7.0.0',
    'next-auth@^4.24.0'
  ];
  
  try {
    execSync(`npm install ${cyberPanelDeps.join(' ')}`, { stdio: 'inherit' });
    console.log('✅ CyberPanel dependencies installed successfully');
  } catch (error) {
    console.log('⚠️  Some CyberPanel dependencies failed to install');
    console.log('   This is okay - you can install them manually if needed');
  }
}

console.log('');
console.log('🎉 Installation complete!');
console.log('');
console.log('Next steps:');
console.log('1. Copy environment file: cp .env.local.example .env.local');
console.log('2. Edit .env.local with your settings');
console.log('3. Start development: npm run dev');
console.log('');
