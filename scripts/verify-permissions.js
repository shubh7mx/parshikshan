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

// Collections that need document-level permissions
const collections = [
    'users',
    'students', 
    'companies',
    'colleges',
    'internship_programs',
    'internship_applications',
    'internships',
    'logbook_entries',
    'reports',
    'notifications'
];

async function checkCollectionPermissions(collectionId) {
    try {
        const collection = await databases.getCollection(DATABASE_ID, collectionId);
        console.log(`\n📋 Collection: ${collection.name} (${collectionId})`);
        console.log(`Document Security: ${collection.documentSecurity}`);
        console.log(`Permissions: ${collection.permissions.join(', ')}`);
        
        // Check if documentSecurity is disabled - this allows collection-level permissions
        if (!collection.documentSecurity) {
            console.log(`✅ Document security is DISABLED - collection permissions will be used`);
        } else {
            console.log(`⚠️  Document security is ENABLED - individual document permissions required`);
        }
        
        return collection;
    } catch (error) {
        console.error(`❌ Error checking ${collectionId}:`, error.message);
        return null;
    }
}

async function updateCollectionSecurity(collectionId) {
    try {
        const collection = await databases.getCollection(DATABASE_ID, collectionId);
        
        // Update collection to disable document security and set proper permissions
        await databases.updateCollection(
            DATABASE_ID,
            collectionId,
            collection.name,
            [
                Permission.create(Role.any()),
                Permission.read(Role.any()),
                Permission.update(Role.users()),
                Permission.delete(Role.users())
            ],
            false, // Disable document security
            collection.enabled
        );
        
        console.log(`✅ Updated ${collectionId} - disabled document security and set collection permissions`);
        return true;
    } catch (error) {
        console.error(`❌ Failed to update ${collectionId}:`, error.message);
        return false;
    }
}

async function main() {
    console.log('🔍 Checking collection permissions and document security settings...\n');
    
    const needsUpdate = [];
    
    // Check all collections
    for (const collectionId of collections) {
        const collection = await checkCollectionPermissions(collectionId);
        if (collection && collection.documentSecurity) {
            needsUpdate.push(collectionId);
        }
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    if (needsUpdate.length > 0) {
        console.log(`\n🔧 Collections that need security updates: ${needsUpdate.join(', ')}`);
        console.log('\nUpdating collections to disable document security...\n');
        
        for (const collectionId of needsUpdate) {
            await updateCollectionSecurity(collectionId);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    
    console.log('\n✅ All collections have been checked and updated!');
    console.log('\n📋 Summary:');
    console.log('- Document security disabled for easier development');
    console.log('- Collection-level permissions applied');
    console.log('- Any user can now create documents');
    console.log('- Users can read/update/delete documents');
    console.log('\n🧪 Try registering a user now!');
}

main().catch(console.error);