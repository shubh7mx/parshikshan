import { Client, Account, Databases, Storage, Functions, ID, Query } from 'appwrite';

// Create Appwrite client
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

// Initialize services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

// Database and collection constants
export const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID!;

export const COLLECTIONS = {
  USERS: process.env.NEXT_PUBLIC_USERS_COLLECTION_ID!,
  COLLEGES: process.env.NEXT_PUBLIC_COLLEGES_COLLECTION_ID!,
  STUDENTS: process.env.NEXT_PUBLIC_STUDENTS_COLLECTION_ID!,
  COMPANIES: process.env.NEXT_PUBLIC_COMPANIES_COLLECTION_ID!,
  INTERNSHIP_PROGRAMS: process.env.NEXT_PUBLIC_INTERNSHIP_PROGRAMS_COLLECTION_ID!,
  INTERNSHIP_APPLICATIONS: process.env.NEXT_PUBLIC_INTERNSHIP_APPLICATIONS_COLLECTION_ID!,
  INTERNSHIPS: process.env.NEXT_PUBLIC_INTERNSHIPS_COLLECTION_ID!,
  LOGBOOK_ENTRIES: process.env.NEXT_PUBLIC_LOGBOOK_ENTRIES_COLLECTION_ID!,
  REPORTS: process.env.NEXT_PUBLIC_REPORTS_COLLECTION_ID!,
  NOTIFICATIONS: process.env.NEXT_PUBLIC_NOTIFICATIONS_COLLECTION_ID!,
} as const;

export const BUCKETS = {
  DOCUMENTS: process.env.NEXT_PUBLIC_DOCUMENTS_BUCKET_ID!,
  PROFILE_IMAGES: process.env.NEXT_PUBLIC_PROFILE_IMAGES_BUCKET_ID!,
} as const;

// Export client for use in other parts of the application
export { client };

// Re-export Appwrite utilities
export { ID, Query };

// Helper function to handle Appwrite errors
export const handleAppwriteError = (error: any) => {
  console.error('Appwrite error:', error);
  
  if (error?.code === 401) {
    return { error: 'Authentication required', code: 401 };
  }
  
  if (error?.code === 403) {
    return { error: 'Permission denied', code: 403 };
  }
  
  if (error?.code === 404) {
    return { error: 'Resource not found', code: 404 };
  }
  
  return { 
    error: error?.message || 'An unexpected error occurred', 
    code: error?.code || 500 
  };
};