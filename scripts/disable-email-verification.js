#!/usr/bin/env node

const { Client, Projects } = require('node-appwrite');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// Initialize Appwrite client with API key
const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const projects = new Projects(client);
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

async function updateProjectSettings() {
    try {
        // Get current project settings
        const project = await projects.get(PROJECT_ID);
        console.log('📋 Current project settings:');
        console.log(`Project Name: ${project.name}`);
        console.log(`Auth Email Password: ${project.authEmailPassword}`);
        console.log(`Auth Email Verification: ${project.authEmailVerification}`);
        
        if (!project.authEmailVerification) {
            console.log('✅ Email verification is already disabled');
            return;
        }
        
        // Update project to disable email verification
        const updatedProject = await projects.updateAuthEmailVerification(
            PROJECT_ID,
            false // Disable email verification
        );
        
        console.log('✅ Email verification has been disabled');
        console.log('📋 Users can now register and login immediately without email confirmation');
        
    } catch (error) {
        console.error('❌ Failed to update project settings:', error.message);
        console.log('\n📝 Manual steps:');
        console.log('1. Go to your Appwrite Console');
        console.log('2. Navigate to Auth > Settings');
        console.log('3. Disable "Email Verification"');
        console.log('4. Save the changes');
    }
}

async function main() {
    console.log('🔧 Disabling email verification for instant registration...\n');
    await updateProjectSettings();
    console.log('\n🚀 Registration flow updated for instant dashboard access!');
}

main().catch(console.error);