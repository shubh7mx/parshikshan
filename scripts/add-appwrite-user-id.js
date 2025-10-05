#!/usr/bin/env node

const { Client, Databases } = require('node-appwrite');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// Initialize Appwrite client
const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

async function addAppwriteUserIdAttribute() {
    try {
        await databases.createStringAttribute(
            DATABASE_ID,
            'users',
            'appwriteUserId',
            50,
            true // required
        );
        
        console.log('✅ Added appwriteUserId attribute to users collection');
        
        // Wait for attribute to be ready
        console.log('⏳ Waiting for attribute to be ready...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Create index for the new attribute
        await databases.createIndex(
            DATABASE_ID,
            'users',
            'appwrite_user_index',
            'unique',
            ['appwriteUserId']
        );
        
        console.log('✅ Created unique index for appwriteUserId');
        
    } catch (error) {
        if (error.message.includes('already exists')) {
            console.log('⚠️  appwriteUserId attribute already exists');
        } else {
            console.error('❌ Failed to add appwriteUserId attribute:', error.message);
        }
    }
}

async function main() {
    console.log('🔧 Adding appwriteUserId attribute to users collection...\n');
    await addAppwriteUserIdAttribute();
    console.log('\n✅ Users collection updated successfully!');
}

main().catch(console.error);