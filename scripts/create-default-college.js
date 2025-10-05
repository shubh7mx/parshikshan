#!/usr/bin/env node

const { Client, Databases, ID } = require('node-appwrite');
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

async function createDefaultCollege() {
  try {
    // Check if default college already exists
    const existing = await databases.listDocuments(
      DATABASE_ID,
      'colleges',
      []
    );

    if (existing.documents.length > 0) {
      console.log('✅ Default college already exists');
      console.log(`College ID: ${existing.documents[0].$id}`);
      console.log(`College Name: ${existing.documents[0].name}`);
      return;
    }

    // Create default college
    const defaultCollege = await databases.createDocument(
      DATABASE_ID,
      'colleges',
      'default-college',
      {
        name: 'Demo University',
        code: 'DEMO',
        address: '123 Education Street, Demo City, DC 12345',
        contactEmail: 'admin@demo-university.edu',
        contactPhone: '+1 (555) 123-4567',
        principalId: 'demo-principal-id',
        isVerified: true,
        establishedYear: 1950,
        affiliatedUniversity: 'Demo State University System'
      }
    );

    console.log('✅ Created default college:');
    console.log(`College ID: ${defaultCollege.$id}`);
    console.log(`College Name: ${defaultCollege.name}`);
    
  } catch (error) {
    console.error('❌ Failed to create default college:', error.message);
  }
}

async function main() {
  console.log('🏫 Creating default college for testing...\n');
  await createDefaultCollege();
  console.log('\n📋 The default college is ready for student registrations!');
}

main().catch(console.error);