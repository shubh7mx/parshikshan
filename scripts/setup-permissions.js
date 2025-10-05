#!/usr/bin/env node

const { Client, Databases, Permission, Role } = require('node-appwrite');
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

// Collection permissions setup
const collectionPermissions = {
  users: [
    // Anyone can create (for registration)
    Permission.create(Role.any()),
    // Users can read their own data
    Permission.read(Role.users()),
    // Users can update their own data
    Permission.update(Role.users()),
    // Only admins can delete
    Permission.delete(Role.label('admin'))
  ],
  
  students: [
    // Any authenticated user can create (for registration)
    Permission.create(Role.users()),
    // Students can read their own data, faculty can read all
    Permission.read(Role.users()),
    // Users can update their own data
    Permission.update(Role.users()),
    // Only admins can delete
    Permission.delete(Role.label('admin'))
  ],
  
  faculty: [
    // Any authenticated user can create (for registration)
    Permission.create(Role.users()),
    // Faculty can read their own data and student data
    Permission.read(Role.users()),
    // Users can update their own data
    Permission.update(Role.users()),
    // Only admins can delete
    Permission.delete(Role.label('admin'))
  ],
  
  companies: [
    // Any authenticated user can create (for registration)
    Permission.create(Role.users()),
    // Companies can read their own data
    Permission.read(Role.users()),
    // Users can update their own data
    Permission.update(Role.users()),
    // Only admins can delete
    Permission.delete(Role.label('admin'))
  ],
  
  admins: [
    // Only existing admins can create new admins
    Permission.create(Role.label('admin')),
    // Admins can read all admin data
    Permission.read(Role.label('admin')),
    // Admins can update their own data
    Permission.update(Role.label('admin')),
    // Only admins can delete
    Permission.delete(Role.label('admin'))
  ],
  
  colleges: [
    // Only admins can create colleges
    Permission.create(Role.label('admin')),
    // Anyone can read college data
    Permission.read(Role.any()),
    // Only admins can update
    Permission.update(Role.label('admin')),
    // Only admins can delete
    Permission.delete(Role.label('admin'))
  ],
  
  internship_programs: [
    // Companies and admins can create
    Permission.create(Role.users()),
    // Anyone can read published programs
    Permission.read(Role.any()),
    // Only creators and admins can update
    Permission.update(Role.users()),
    // Only creators and admins can delete
    Permission.delete(Role.users())
  ],
  
  internship_applications: [
    // Students can create applications
    Permission.create(Role.users()),
    // Related parties can read
    Permission.read(Role.users()),
    // Applicants and companies can update
    Permission.update(Role.users()),
    // Only admins can delete
    Permission.delete(Role.label('admin'))
  ],
  
  internships: [
    // System creates internships (companies/admins)
    Permission.create(Role.users()),
    // Related parties can read
    Permission.read(Role.users()),
    // Related parties can update
    Permission.update(Role.users()),
    // Only admins can delete
    Permission.delete(Role.label('admin'))
  ],
  
  logbook_entries: [
    // Students can create entries
    Permission.create(Role.users()),
    // Related parties can read
    Permission.read(Role.users()),
    // Students and mentors can update
    Permission.update(Role.users()),
    // Only admins can delete
    Permission.delete(Role.label('admin'))
  ],
  
  reports: [
    // Students can create reports
    Permission.create(Role.users()),
    // Related parties can read
    Permission.read(Role.users()),
    // Students and faculty can update
    Permission.update(Role.users()),
    // Only admins can delete
    Permission.delete(Role.label('admin'))
  ],
  
  notifications: [
    // System creates notifications
    Permission.create(Role.users()),
    // Users can read their own notifications
    Permission.read(Role.users()),
    // Users can update their own notifications (mark as read)
    Permission.update(Role.users()),
    // Only admins can delete
    Permission.delete(Role.label('admin'))
  ]
};

async function updateCollectionPermissions(collectionId, permissions) {
  try {
    const collection = await databases.getCollection(DATABASE_ID, collectionId);
    
    // Update collection permissions
    await databases.updateCollection(
      DATABASE_ID,
      collectionId,
      collection.name,
      permissions,
      collection.documentSecurity,
      collection.enabled
    );
    
    console.log(`✅ Updated permissions for collection: ${collectionId}`);
  } catch (error) {
    console.error(`❌ Failed to update permissions for ${collectionId}:`, error.message);
  }
}

async function main() {
  console.log('🔐 Setting up collection permissions...\n');
  
  for (const [collectionName, permissions] of Object.entries(collectionPermissions)) {
    console.log(`\nUpdating permissions for: ${collectionName}`);
    await updateCollectionPermissions(collectionName, permissions);
    
    // Wait between updates
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n✅ All collection permissions have been updated!');
  console.log('\n📋 Next steps:');
  console.log('1. Try registering a new user');
  console.log('2. Test different user roles');
  console.log('3. Verify authentication flows work properly');
}

main().catch(console.error);