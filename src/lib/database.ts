import { Query } from 'appwrite';
import { databases, DATABASE_ID, COLLECTIONS, handleAppwriteError } from './appwrite';
import type {
  User,
  College,
  Student,
  Company,
  InternshipProgram,
  InternshipApplication,
  Internship,
  LogbookEntry,
  Report,
  Notification,
  PaginationParams,
  ApiResponse
} from '@/types';

// Generic database service class
class DatabaseService {
  private collectionId: string;

  constructor(collectionId: string) {
    this.collectionId = collectionId;
  }

  async create<T>(data: Omit<T, '$id' | '$createdAt' | '$updatedAt'>): Promise<ApiResponse<T>> {
    try {
      const result = await databases.createDocument(
        DATABASE_ID,
        this.collectionId,
        'unique()',
        data
      );
      return { success: true, data: result as T };
    } catch (error) {
      return { success: false, ...handleAppwriteError(error) };
    }
  }

  async getById<T>(id: string): Promise<ApiResponse<T>> {
    try {
      const result = await databases.getDocument(DATABASE_ID, this.collectionId, id);
      return { success: true, data: result as T };
    } catch (error) {
      return { success: false, ...handleAppwriteError(error) };
    }
  }

  async update<T>(id: string, data: Partial<T>): Promise<ApiResponse<T>> {
    try {
      const result = await databases.updateDocument(
        DATABASE_ID,
        this.collectionId,
        id,
        data
      );
      return { success: true, data: result as T };
    } catch (error) {
      return { success: false, ...handleAppwriteError(error) };
    }
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    try {
      await databases.deleteDocument(DATABASE_ID, this.collectionId, id);
      return { success: true };
    } catch (error) {
      return { success: false, ...handleAppwriteError(error) };
    }
  }

  async list<T>(
    queries: string[] = [],
    pagination?: PaginationParams
  ): Promise<ApiResponse<{ documents: T[]; total: number }>> {
    try {
      const queryList = [...queries];
      
      if (pagination) {
        queryList.push(Query.limit(pagination.limit));
        queryList.push(Query.offset((pagination.page - 1) * pagination.limit));
        
        if (pagination.orderBy) {
          const order = pagination.orderType === 'DESC' ? Query.orderDesc : Query.orderAsc;
          queryList.push(order(pagination.orderBy));
        }
      }

      const result = await databases.listDocuments(DATABASE_ID, this.collectionId, queryList);
      return {
        success: true,
        data: {
          documents: result.documents as unknown as T[],
          total: result.total
        }
      };
    } catch (error) {
      return { success: false, ...handleAppwriteError(error) };
    }
  }

  async search<T>(
    searchTerm: string,
    searchFields: string[] = [],
    additionalQueries: string[] = []
  ): Promise<ApiResponse<T[]>> {
    try {
      const queries = [...additionalQueries];
      
      if (searchTerm && searchFields.length > 0) {
        // Create search queries for each field
        const searchQueries = searchFields.map(field => 
          Query.search(field, searchTerm)
        );
        queries.push(...searchQueries);
      }

      const result = await databases.listDocuments(DATABASE_ID, this.collectionId, queries);
      return { success: true, data: result.documents as unknown as T[] };
    } catch (error) {
      return { success: false, ...handleAppwriteError(error) };
    }
  }
}

// Create service instances for each collection
export const userService = new DatabaseService(COLLECTIONS.USERS);
export const collegeService = new DatabaseService(COLLECTIONS.COLLEGES);
export const studentService = new DatabaseService(COLLECTIONS.STUDENTS);
export const companyService = new DatabaseService(COLLECTIONS.COMPANIES);
export const internshipProgramService = new DatabaseService(COLLECTIONS.INTERNSHIP_PROGRAMS);
export const internshipApplicationService = new DatabaseService(COLLECTIONS.INTERNSHIP_APPLICATIONS);
export const internshipService = new DatabaseService(COLLECTIONS.INTERNSHIPS);
export const logbookEntryService = new DatabaseService(COLLECTIONS.LOGBOOK_ENTRIES);
export const reportService = new DatabaseService(COLLECTIONS.REPORTS);
export const notificationService = new DatabaseService(COLLECTIONS.NOTIFICATIONS);

// Specialized database operations
export const dbOperations = {
  // User operations
  async getUserByEmail(email: string): Promise<ApiResponse<User>> {
    try {
      const result = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.USERS,
        [Query.equal('email', email)]
      );
      
      if (result.documents.length === 0) {
        return { success: false, error: 'User not found', code: 404 };
      }
      
      return { success: true, data: result.documents[0] as unknown as User };
    } catch (error) {
      return { success: false, ...handleAppwriteError(error) };
    }
  },

  // Student operations
  async getStudentWithDetails(studentId: string): Promise<ApiResponse<Student>> {
    try {
      const student = await studentService.getById<Student>(studentId);
      if (!student.success || !student.data) {
        return student;
      }

      // Populate user and college data
      const [userResult, collegeResult] = await Promise.all([
        userService.getById<User>(student.data.userId),
        collegeService.getById<College>(student.data.collegeId)
      ]);

      const populatedStudent = {
        ...student.data,
        user: userResult.data,
        college: collegeResult.data
      };

      return { success: true, data: populatedStudent };
    } catch (error) {
      return { success: false, ...handleAppwriteError(error) };
    }
  },

  // Company operations
  async getCompaniesWithContact(): Promise<ApiResponse<Company[]>> {
    try {
      const companies = await companyService.list<Company>();
      if (!companies.success || !companies.data) {
        return { success: false, error: companies.error || 'Failed to fetch companies' };
      }

      const companiesWithContact = await Promise.all(
        companies.data.documents.map(async (company) => {
          const contactResult = await userService.getById<User>(company.contactPersonId);
          return {
            ...company,
            contactPerson: contactResult.data
          };
        })
      );

      return { success: true, data: companiesWithContact };
    } catch (error) {
      return { success: false, ...handleAppwriteError(error) };
    }
  },

  // Internship program operations
  async searchInternshipPrograms(
    searchTerm?: string,
    filters?: any
  ): Promise<ApiResponse<InternshipProgram[]>> {
    try {
      const queries = [Query.equal('status', 'published')];

      if (searchTerm) {
        queries.push(Query.search('title', searchTerm));
      }

      if (filters?.location) {
        queries.push(Query.equal('location', filters.location));
      }

      if (filters?.mode) {
        queries.push(Query.equal('mode', filters.mode));
      }

      if (filters?.duration) {
        queries.push(Query.equal('duration', filters.duration));
      }

      const result = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.INTERNSHIP_PROGRAMS,
        queries
      );

      return { success: true, data: result.documents as unknown as InternshipProgram[] };
    } catch (error) {
      return { success: false, ...handleAppwriteError(error) };
    }
  },

  // Application operations
  async getApplicationsForStudent(studentId: string): Promise<ApiResponse<InternshipApplication[]>> {
    try {
      const result = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.INTERNSHIP_APPLICATIONS,
        [Query.equal('studentId', studentId), Query.orderDesc('$createdAt')]
      );

      return { success: true, data: result.documents as unknown as InternshipApplication[] };
    } catch (error) {
      return { success: false, ...handleAppwriteError(error) };
    }
  },

  // Logbook operations
  async getLogbookEntriesForInternship(internshipId: string): Promise<ApiResponse<LogbookEntry[]>> {
    try {
      const result = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.LOGBOOK_ENTRIES,
        [Query.equal('internshipId', internshipId), Query.orderDesc('date')]
      );

      return { success: true, data: result.documents as unknown as LogbookEntry[] };
    } catch (error) {
      return { success: false, ...handleAppwriteError(error) };
    }
  },

  // Notification operations
  async getNotificationsForUser(userId: string): Promise<ApiResponse<Notification[]>> {
    try {
      const result = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.NOTIFICATIONS,
        [Query.equal('userId', userId), Query.orderDesc('$createdAt')]
      );

      return { success: true, data: result.documents as unknown as Notification[] };
    } catch (error) {
      return { success: false, ...handleAppwriteError(error) };
    }
  },

  async markNotificationAsRead(notificationId: string): Promise<ApiResponse<void>> {
    try {
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.NOTIFICATIONS,
        notificationId,
        { isRead: true }
      );
      return { success: true };
    } catch (error) {
      return { success: false, ...handleAppwriteError(error) };
    }
  }
};