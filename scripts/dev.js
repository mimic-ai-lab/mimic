#!/usr/bin/env node

// Load environment variables from .env file
require('dotenv').config();

// Debug: Log what environment variables are loaded
console.log('Environment variables loaded:');
console.log('BETTER_AUTH_SECRET:', process.env.BETTER_AUTH_SECRET ? 'SET' : 'NOT SET');
console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'SET' : 'NOT SET');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');

// Spawn turbo with the environment variables
const { spawn } = require('child_process');
const path = require('path');

console.log('Spawning turbo with environment variables...');

// Create a new env object that includes all current environment variables
const env = { ...process.env };

const turbo = spawn('turbo', ['run', 'dev', '--parallel'], {
    stdio: 'inherit',
    env: env,
    cwd: process.cwd()
});

turbo.on('error', (error) => {
    console.error('Failed to start turbo:', error);
    process.exit(1);
});

turbo.on('exit', (code) => {
    process.exit(code);
}); 