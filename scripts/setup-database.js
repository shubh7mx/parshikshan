#!/usr/bin/env node

/**
 * Automated Appwrite Database Setup Script
 * This script creates all necessary collections, attributes, and indexes for Prashiskshan
 */

const { Client, Databases, Storage, Permission, Role, ID } = require('node-appwrite');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// Initialize Appwrite client
const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY); // You'll need to add this to .env.local

const databases = new Databases(client);
const storage = new Storage(client);

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

// Collection schemas
const collections = {
    users: {
        name: 'Users',
        attributes: [
            { key: 'name', type: 'string', size: 255, required: true },
            { key: 'email', type: 'email', size: 320, required: true },
            { key: 'phone', type: 'string', size: 20, required: false },
            { key: 'role', type: 'enum', elements: ['student', 'faculty', 'admin', 'industry_partner'], required: true },
            { key: 'profileImage', type: 'url', required: false },
            { key: 'isActive', type: 'boolean', required: true, default: true }
        ],
        indexes: [
            { key: 'email_index', type: 'unique', attributes: ['email'] },
            { key: 'role_index', type: 'key', attributes: ['role'] },
            { key: 'active_index', type: 'key', attributes: ['isActive'] }
        ],
        permissions: [
            Permission.read(Role.users()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users())
        ]
    },
    
    colleges: {
        name: 'Colleges',
        attributes: [
            { key: 'name', type: 'string', size: 255, required: true },
            { key: 'code', type: 'string', size: 20, required: true },
            { key: 'address', type: 'string', size: 500, required: true },
            { key: 'contactEmail', type: 'email', size: 320, required: true },
            { key: 'contactPhone', type: 'string', size: 20, required: true },
            { key: 'principalId', type: 'string', size: 50, required: true },
            { key: 'isVerified', type: 'boolean', required: true, default: false },
            { key: 'establishedYear', type: 'integer', required: true },
            { key: 'affiliatedUniversity', type: 'string', size: 255, required: true }
        ],
        indexes: [
            { key: 'code_index', type: 'unique', attributes: ['code'] },
            { key: 'verified_index', type: 'key', attributes: ['isVerified'] },
            { key: 'principal_index', type: 'key', attributes: ['principalId'] }
        ],
        permissions: [
            Permission.read(Role.users()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users())
        ]
    },
    
    students: {
        name: 'Students',
        attributes: [
            { key: 'userId', type: 'string', size: 50, required: true },
            { key: 'collegeId', type: 'string', size: 50, required: true },
            { key: 'rollNumber', type: 'string', size: 50, required: true },
            { key: 'semester', type: 'integer', required: true },
            { key: 'course', type: 'string', size: 100, required: true },
            { key: 'academicYear', type: 'string', size: 10, required: true },
            { key: 'cgpa', type: 'double', required: false },
            { key: 'skills', type: 'string', size: 1000, array: true, required: true },
            { key: 'resume', type: 'url', required: false },
            { key: 'isEligibleForInternship', type: 'boolean', required: true, default: true }
        ],
        indexes: [
            { key: 'roll_index', type: 'unique', attributes: ['rollNumber'] },
            { key: 'user_index', type: 'key', attributes: ['userId'] },
            { key: 'college_index', type: 'key', attributes: ['collegeId'] },
            { key: 'eligible_index', type: 'key', attributes: ['isEligibleForInternship'] }
        ],
        permissions: [
            Permission.read(Role.users()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users())
        ]
    },
    
    companies: {
        name: 'Companies',
        attributes: [
            { key: 'name', type: 'string', size: 255, required: true },
            { key: 'industry', type: 'string', size: 100, required: true },
            { key: 'website', type: 'url', required: false },
            { key: 'description', type: 'string', size: 2000, required: true },
            { key: 'address', type: 'string', size: 500, required: true },
            { key: 'contactPersonId', type: 'string', size: 50, required: true },
            { key: 'companySize', type: 'enum', elements: ['startup', 'small', 'medium', 'large', 'enterprise'], required: true },
            { key: 'isVerified', type: 'boolean', required: true, default: false },
            { key: 'registrationNumber', type: 'string', size: 50, required: false }
        ],
        indexes: [
            { key: 'industry_index', type: 'key', attributes: ['industry'] },
            { key: 'size_index', type: 'key', attributes: ['companySize'] },
            { key: 'verified_index', type: 'key', attributes: ['isVerified'] },
            { key: 'contact_index', type: 'key', attributes: ['contactPersonId'] }
        ],
        permissions: [
            Permission.read(Role.users()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users())
        ]
    },
    
    internship_programs: {
        name: 'Internship Programs',
        attributes: [
            { key: 'title', type: 'string', size: 255, required: true },
            { key: 'description', type: 'string', size: 2000, required: true },
            { key: 'companyId', type: 'string', size: 50, required: true },
            { key: 'duration', type: 'integer', required: true },
            { key: 'stipend', type: 'double', required: false },
            { key: 'location', type: 'string', size: 100, required: true },
            { key: 'mode', type: 'enum', elements: ['onsite', 'remote', 'hybrid'], required: true },
            { key: 'requiredSkills', type: 'string', size: 1000, array: true, required: true },
            { key: 'eligibleCourses', type: 'string', size: 1000, array: true, required: true },
            { key: 'minimumCGPA', type: 'double', required: false },
            { key: 'maxPositions', type: 'integer', required: true, default: 1 },
            { key: 'applicationDeadline', type: 'datetime', required: true },
            { key: 'startDate', type: 'datetime', required: true },
            { key: 'endDate', type: 'datetime', required: true },
            { key: 'status', type: 'enum', elements: ['draft', 'published', 'closed', 'completed'], required: true, default: 'draft' }
        ],
        indexes: [
            { key: 'company_index', type: 'key', attributes: ['companyId'] },
            { key: 'status_index', type: 'key', attributes: ['status'] },
            { key: 'mode_index', type: 'key', attributes: ['mode'] },
            { key: 'location_index', type: 'key', attributes: ['location'] },
            { key: 'deadline_index', type: 'key', attributes: ['applicationDeadline'] }
        ],
        permissions: [
            Permission.read(Role.users()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users())
        ]
    },
    
    internship_applications: {
        name: 'Internship Applications',
        attributes: [
            { key: 'studentId', type: 'string', size: 50, required: true },
            { key: 'programId', type: 'string', size: 50, required: true },
            { key: 'applicationDate', type: 'datetime', required: true },
            { key: 'coverLetter', type: 'string', size: 2000, required: false },
            { key: 'additionalDocuments', type: 'string', size: 1000, array: true, required: false },
            { key: 'status', type: 'enum', elements: ['pending', 'shortlisted', 'selected', 'rejected'], required: true, default: 'pending' },
            { key: 'facultyRecommendation', type: 'string', size: 1000, required: false },
            { key: 'interviewDate', type: 'datetime', required: false },
            { key: 'selectionDate', type: 'datetime', required: false }
        ],
        indexes: [
            { key: 'student_index', type: 'key', attributes: ['studentId'] },
            { key: 'program_index', type: 'key', attributes: ['programId'] },
            { key: 'status_index', type: 'key', attributes: ['status'] },
            { key: 'application_date_index', type: 'key', attributes: ['applicationDate'] }
        ],
        permissions: [
            Permission.read(Role.users()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users())
        ]
    },
    
    internships: {
        name: 'Internships',
        attributes: [
            { key: 'applicationId', type: 'string', size: 50, required: true },
            { key: 'mentorId', type: 'string', size: 50, required: true },
            { key: 'facultyCoordinatorId', type: 'string', size: 50, required: true },
            { key: 'startDate', type: 'datetime', required: true },
            { key: 'endDate', type: 'datetime', required: true },
            { key: 'objectives', type: 'string', size: 1000, array: true, required: true },
            { key: 'status', type: 'enum', elements: ['not_started', 'ongoing', 'completed', 'terminated'], required: true, default: 'not_started' },
            { key: 'finalGrade', type: 'string', size: 10, required: false },
            { key: 'certificateIssued', type: 'boolean', required: true, default: false },
            { key: 'creditsAwarded', type: 'integer', required: true, default: 4 }
        ],
        indexes: [
            { key: 'application_index', type: 'key', attributes: ['applicationId'] },
            { key: 'mentor_index', type: 'key', attributes: ['mentorId'] },
            { key: 'faculty_index', type: 'key', attributes: ['facultyCoordinatorId'] },
            { key: 'status_index', type: 'key', attributes: ['status'] }
        ],
        permissions: [
            Permission.read(Role.users()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users())
        ]
    },
    
    logbook_entries: {
        name: 'Logbook Entries',
        attributes: [
            { key: 'internshipId', type: 'string', size: 50, required: true },
            { key: 'date', type: 'datetime', required: true },
            { key: 'hoursWorked', type: 'double', required: true },
            { key: 'tasksCompleted', type: 'string', size: 2000, required: true },
            { key: 'learningOutcomes', type: 'string', size: 2000, required: true },
            { key: 'challenges', type: 'string', size: 1000, required: false },
            { key: 'mentorFeedback', type: 'string', size: 1000, required: false },
            { key: 'attachments', type: 'string', size: 1000, array: true, required: false },
            { key: 'isVerified', type: 'boolean', required: true, default: false },
            { key: 'verifiedBy', type: 'string', size: 50, required: false }
        ],
        indexes: [
            { key: 'internship_index', type: 'key', attributes: ['internshipId'] },
            { key: 'date_index', type: 'key', attributes: ['date'] },
            { key: 'verified_index', type: 'key', attributes: ['isVerified'] }
        ],
        permissions: [
            Permission.read(Role.users()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users())
        ]
    },
    
    reports: {
        name: 'Reports',
        attributes: [
            { key: 'internshipId', type: 'string', size: 50, required: true },
            { key: 'type', type: 'enum', elements: ['weekly', 'monthly', 'final'], required: true },
            { key: 'content', type: 'string', size: 5000, required: true },
            { key: 'attachments', type: 'string', size: 1000, array: true, required: false },
            { key: 'submissionDate', type: 'datetime', required: true },
            { key: 'feedback', type: 'string', size: 1000, required: false },
            { key: 'grade', type: 'string', size: 10, required: false },
            { key: 'isApproved', type: 'boolean', required: true, default: false }
        ],
        indexes: [
            { key: 'internship_index', type: 'key', attributes: ['internshipId'] },
            { key: 'type_index', type: 'key', attributes: ['type'] },
            { key: 'approved_index', type: 'key', attributes: ['isApproved'] },
            { key: 'submission_index', type: 'key', attributes: ['submissionDate'] }
        ],
        permissions: [
            Permission.read(Role.users()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users())
        ]
    },
    
    notifications: {
        name: 'Notifications',
        attributes: [
            { key: 'userId', type: 'string', size: 50, required: true },
            { key: 'title', type: 'string', size: 255, required: true },
            { key: 'message', type: 'string', size: 1000, required: true },
            { key: 'type', type: 'enum', elements: ['info', 'warning', 'success', 'error'], required: true },
            { key: 'isRead', type: 'boolean', required: true, default: false },
            { key: 'actionUrl', type: 'string', size: 500, required: false }
        ],
        indexes: [
            { key: 'user_index', type: 'key', attributes: ['userId'] },
            { key: 'read_index', type: 'key', attributes: ['isRead'] },
            { key: 'type_index', type: 'key', attributes: ['type'] }
        ],
        permissions: [
            Permission.read(Role.users()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users())
        ]
    }
};

// Storage buckets
const buckets = {
    documents: {
        name: 'Documents',
        permissions: [
            Permission.read(Role.users()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users())
        ],
        fileSecurity: true,
        maximumFileSize: 10485760, // 10MB
        allowedFileExtensions: ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png']
    },
    profile_images: {
        name: 'Profile Images',
        permissions: [
            Permission.read(Role.users()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users())
        ],
        fileSecurity: true,
        maximumFileSize: 5242880, // 5MB
        allowedFileExtensions: ['jpg', 'jpeg', 'png', 'webp']
    }
};

async function createCollection(collectionId, schema) {
    try {
        console.log(`Creating collection: ${schema.name}`);
        
        // Create collection
        await databases.createCollection(
            DATABASE_ID,
            collectionId,
            schema.name,
            schema.permissions
        );
        
        console.log(`✅ Collection '${schema.name}' created successfully`);
        
        // Add attributes
        for (const attr of schema.attributes) {
            try {
                let result;
                switch (attr.type) {
                    case 'string':
                        result = await databases.createStringAttribute(
                            DATABASE_ID,
                            collectionId,
                            attr.key,
                            attr.size,
                            attr.required,
                            attr.default,
                            attr.array
                        );
                        break;
                    case 'email':
                        result = await databases.createEmailAttribute(
                            DATABASE_ID,
                            collectionId,
                            attr.key,
                            attr.required,
                            attr.default
                        );
                        break;
                    case 'url':
                        result = await databases.createUrlAttribute(
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
                            attr.min,
                            attr.max,
                            attr.default
                        );
                        break;
                    case 'double':
                        result = await databases.createFloatAttribute(
                            DATABASE_ID,
                            collectionId,
                            attr.key,
                            attr.required,
                            attr.min,
                            attr.max,
                            attr.default
                        );
                        break;
                    case 'boolean':
                        result = await databases.createBooleanAttribute(
                            DATABASE_ID,
                            collectionId,
                            attr.key,
                            attr.required,
                            attr.default
                        );
                        break;
                    case 'datetime':
                        result = await databases.createDatetimeAttribute(
                            DATABASE_ID,
                            collectionId,
                            attr.key,
                            attr.required,
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
                console.log(`  ✅ Attribute '${attr.key}' created`);
                
                // Wait a bit between attribute creation
                await new Promise(resolve => setTimeout(resolve, 1000));
                
            } catch (attrError) {
                console.error(`  ❌ Error creating attribute '${attr.key}':`, attrError.message);
            }
        }
        
        // Wait for attributes to be ready before creating indexes
        console.log('Waiting for attributes to be ready...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Create indexes
        for (const index of schema.indexes) {
            try {
                await databases.createIndex(
                    DATABASE_ID,
                    collectionId,
                    index.key,
                    index.type,
                    index.attributes
                );
                console.log(`  ✅ Index '${index.key}' created`);
                
                // Wait between index creation
                await new Promise(resolve => setTimeout(resolve, 1000));
                
            } catch (indexError) {
                console.error(`  ❌ Error creating index '${index.key}':`, indexError.message);
            }
        }
        
        console.log(`🎉 Collection '${schema.name}' setup completed\n`);
        
    } catch (error) {
        console.error(`❌ Error creating collection '${schema.name}':`, error.message);
    }
}

async function createBucket(bucketId, bucketConfig) {
    try {
        console.log(`Creating bucket: ${bucketConfig.name}`);
        
        await storage.createBucket(
            bucketId,
            bucketConfig.name,
            bucketConfig.permissions,
            bucketConfig.fileSecurity,
            true, // enabled
            bucketConfig.maximumFileSize,
            bucketConfig.allowedFileExtensions
        );
        
        console.log(`✅ Bucket '${bucketConfig.name}' created successfully\n`);
        
    } catch (error) {
        console.error(`❌ Error creating bucket '${bucketConfig.name}':`, error.message);
    }
}

async function main() {
    console.log('🚀 Starting Appwrite Database Setup...\n');
    
    // Check if API key is provided
    if (!process.env.APPWRITE_API_KEY) {
        console.error('❌ APPWRITE_API_KEY is required in .env.local');
        console.log('Please add your Appwrite API key to .env.local:');
        console.log('APPWRITE_API_KEY=your_api_key_here');
        console.log('\nYou can get your API key from: https://cloud.appwrite.io/console/project-68e1f87b00206bba5dc1/auth/api');
        process.exit(1);
    }
    
    console.log('📊 Creating Collections...\n');
    
    // Create all collections
    for (const [collectionId, schema] of Object.entries(collections)) {
        await createCollection(collectionId, schema);
    }
    
    console.log('🗄️ Creating Storage Buckets...\n');
    
    // Create storage buckets
    for (const [bucketId, bucketConfig] of Object.entries(buckets)) {
        await createBucket(bucketId, bucketConfig);
    }
    
    console.log('✅ Database setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Verify collections in Appwrite console');
    console.log('2. Test the application with npm run dev');
    console.log('3. Create test data through the application');
}

// Run the setup
main().catch(console.error);