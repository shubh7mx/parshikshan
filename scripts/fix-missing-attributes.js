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

// Missing attributes to create
const missingAttributes = [
    {
        collection: 'users',
        attributes: [
            { key: 'isActive', type: 'boolean', required: false, default: true }
        ]
    },
    {
        collection: 'colleges',
        attributes: [
            { key: 'isVerified', type: 'boolean', required: false, default: false }
        ]
    },
    {
        collection: 'students',
        attributes: [
            { key: 'isEligibleForInternship', type: 'boolean', required: false, default: true }
        ]
    },
    {
        collection: 'companies',
        attributes: [
            { key: 'isVerified', type: 'boolean', required: false, default: false }
        ]
    },
    {
        collection: 'internship_programs',
        attributes: [
            { key: 'maxPositions', type: 'integer', required: false, default: 1 },
            { key: 'status', type: 'enum', elements: ['draft', 'published', 'closed', 'completed'], required: false, default: 'draft' }
        ]
    },
    {
        collection: 'internship_applications',
        attributes: [
            { key: 'status', type: 'enum', elements: ['pending', 'shortlisted', 'selected', 'rejected'], required: false, default: 'pending' }
        ]
    },
    {
        collection: 'internships',
        attributes: [
            { key: 'status', type: 'enum', elements: ['not_started', 'ongoing', 'completed', 'terminated'], required: false, default: 'not_started' },
            { key: 'certificateIssued', type: 'boolean', required: false, default: false },
            { key: 'creditsAwarded', type: 'integer', required: false, default: 4 }
        ]
    },
    {
        collection: 'logbook_entries',
        attributes: [
            { key: 'isVerified', type: 'boolean', required: false, default: false }
        ]
    },
    {
        collection: 'reports',
        attributes: [
            { key: 'isApproved', type: 'boolean', required: false, default: false }
        ]
    },
    {
        collection: 'notifications',
        attributes: [
            { key: 'isRead', type: 'boolean', required: false, default: false }
        ]
    }
];

// Missing indexes to create
const missingIndexes = [
    { collection: 'users', key: 'active_index', type: 'key', attributes: ['isActive'] },
    { collection: 'colleges', key: 'verified_index', type: 'key', attributes: ['isVerified'] },
    { collection: 'students', key: 'eligible_index', type: 'key', attributes: ['isEligibleForInternship'] },
    { collection: 'companies', key: 'verified_index', type: 'key', attributes: ['isVerified'] },
    { collection: 'internship_programs', key: 'status_index', type: 'key', attributes: ['status'] },
    { collection: 'internship_applications', key: 'status_index', type: 'key', attributes: ['status'] },
    { collection: 'internships', key: 'status_index', type: 'key', attributes: ['status'] },
    { collection: 'logbook_entries', key: 'verified_index', type: 'key', attributes: ['isVerified'] },
    { collection: 'reports', key: 'approved_index', type: 'key', attributes: ['isApproved'] },
    { collection: 'notifications', key: 'read_index', type: 'key', attributes: ['isRead'] }
];

async function createMissingAttribute(collectionId, attr) {
    try {
        let result;
        switch (attr.type) {
            case 'boolean':
                result = await databases.createBooleanAttribute(
                    DATABASE_ID,
                    collectionId,
                    attr.key,
                    attr.required,
                    attr.default
                );
                break;
            case 'integer':
                result = await databases.createIntegerAttribute(
                    DATABASE_ID,
                    collectionId,
                    attr.key,
                    attr.required,
                    undefined, // min
                    undefined, // max
                    attr.default
                );
                break;
            case 'enum':
                result = await databases.createEnumAttribute(
                    DATABASE_ID,
                    collectionId,
                    attr.key,
                    attr.elements,
                    attr.required,
                    attr.default
                );
                break;
        }
        console.log(`  ✅ Created attribute '${attr.key}' in ${collectionId}`);
        
        // Wait between attribute creation
        await new Promise(resolve => setTimeout(resolve, 1000));
        
    } catch (error) {
        if (error.message.includes('already exists')) {
            console.log(`  ⚠️ Attribute '${attr.key}' already exists in ${collectionId}`);
        } else {
            console.error(`  ❌ Error creating attribute '${attr.key}' in ${collectionId}:`, error.message);
        }
    }
}

async function createMissingIndex(collectionId, index) {
    try {
        await databases.createIndex(
            DATABASE_ID,
            collectionId,
            index.key,
            index.type,
            index.attributes
        );
        console.log(`  ✅ Created index '${index.key}' in ${collectionId}`);
        
        // Wait between index creation
        await new Promise(resolve => setTimeout(resolve, 1000));
        
    } catch (error) {
        if (error.message.includes('already exists')) {
            console.log(`  ⚠️ Index '${index.key}' already exists in ${collectionId}`);
        } else {
            console.error(`  ❌ Error creating index '${index.key}' in ${collectionId}:`, error.message);
        }
    }
}

async function main() {
    console.log('🔧 Fixing missing attributes and indexes...\n');
    
    // Create missing attributes
    console.log('📝 Creating missing attributes...');
    for (const collectionData of missingAttributes) {
        console.log(`\nProcessing collection: ${collectionData.collection}`);
        for (const attr of collectionData.attributes) {
            await createMissingAttribute(collectionData.collection, attr);
        }
    }
    
    // Wait for attributes to be ready
    console.log('\n⏳ Waiting for attributes to be ready...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // Create missing indexes
    console.log('\n📑 Creating missing indexes...');
    for (const index of missingIndexes) {
        await createMissingIndex(index.collection, index);
    }
    
    console.log('\n✅ All missing attributes and indexes have been processed!');
    console.log('\n📋 Final verification steps:');
    console.log('1. Check Appwrite console to verify all attributes and indexes');
    console.log('2. Test the application with npm run dev');
    console.log('3. Try creating test accounts for different roles');
}

main().catch(console.error);