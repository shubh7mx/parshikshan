import { databases, storage, ID, Query } from '@/lib/appwrite';
import { toast } from 'sonner';

const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID!;
const BUCKET_ID = process.env.NEXT_PUBLIC_STORAGE_BUCKET_ID!;

export interface DatabaseOperationResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Generic CRUD Operations
export class DatabaseOperations {
  static async create<T>(
    collectionId: string, 
    data: Omit<T, '$id' | '$createdAt' | '$updatedAt'>,
    documentId?: string
  ): Promise<DatabaseOperationResult<T>> {
    try {
      const document = await databases.createDocument(
        DATABASE_ID,
        collectionId,
        documentId || ID.unique(),
        data
      );
      return { success: true, data: document as T };
    } catch (error: any) {
      console.error(`Error creating document in ${collectionId}:`, error);
      return { success: false, error: error.message || 'Failed to create document' };
    }
  }

  static async getById<T>(collectionId: string, documentId: string): Promise<DatabaseOperationResult<T>> {
    try {
      const document = await databases.getDocument(DATABASE_ID, collectionId, documentId);
      return { success: true, data: document as T };
    } catch (error: any) {
      console.error(`Error getting document from ${collectionId}:`, error);
      return { success: false, error: error.message || 'Document not found' };
    }
  }

  static async list<T>(
    collectionId: string, 
    queries?: string[],
    limit?: number
  ): Promise<DatabaseOperationResult<T[]>> {
    try {
      const queryArray = queries || [];
      if (limit) queryArray.push(Query.limit(limit));
      
      const documents = await databases.listDocuments(DATABASE_ID, collectionId, queryArray);
      return { success: true, data: documents.documents as T[] };
    } catch (error: any) {
      console.error(`Error listing documents from ${collectionId}:`, error);
      return { success: false, error: error.message || 'Failed to fetch documents' };
    }
  }

  static async update<T>(
    collectionId: string, 
    documentId: string, 
    data: Partial<T>
  ): Promise<DatabaseOperationResult<T>> {
    try {
      const document = await databases.updateDocument(DATABASE_ID, collectionId, documentId, data);
      return { success: true, data: document as T };
    } catch (error: any) {
      console.error(`Error updating document in ${collectionId}:`, error);
      return { success: false, error: error.message || 'Failed to update document' };
    }
  }

  static async delete(collectionId: string, documentId: string): Promise<DatabaseOperationResult> {
    try {
      await databases.deleteDocument(DATABASE_ID, collectionId, documentId);
      return { success: true };
    } catch (error: any) {
      console.error(`Error deleting document from ${collectionId}:`, error);
      return { success: false, error: error.message || 'Failed to delete document' };
    }
  }
}

// Specific Collection Operations
export class UserOperations {
  static async createStudent(data: any): Promise<DatabaseOperationResult> {
    const result = await DatabaseOperations.create('students', data);
    if (result.success) {
      toast.success('Student profile created successfully');
    }
    return result;
  }

  static async createCompany(data: any): Promise<DatabaseOperationResult> {
    const result = await DatabaseOperations.create('companies', data);
    if (result.success) {
      toast.success('Company profile created successfully');
    }
    return result;
  }

  static async createFaculty(data: any): Promise<DatabaseOperationResult> {
    const result = await DatabaseOperations.create('faculty', data);
    if (result.success) {
      toast.success('Faculty profile created successfully');
    }
    return result;
  }

  static async getUserProfile(userId: string, role: string): Promise<DatabaseOperationResult> {
    const collectionMap: { [key: string]: string } = {
      'student': 'students',
      'company': 'companies',
      'faculty': 'faculty',
      'admin': 'admins'
    };
    
    const collection = collectionMap[role];
    if (!collection) {
      return { success: false, error: 'Invalid user role' };
    }

    return await DatabaseOperations.list(collection, [Query.equal('userId', userId)]);
  }
}

export class InternshipOperations {
  static async createProgram(data: any): Promise<DatabaseOperationResult> {
    return await DatabaseOperations.create('internship_programs', data);
  }

  static async createApplication(data: any): Promise<DatabaseOperationResult> {
    const result = await DatabaseOperations.create('internship_applications', data);
    if (result.success) {
      toast.success('Application submitted successfully');
    }
    return result;
  }

  static async updateApplicationStatus(applicationId: string, status: string): Promise<DatabaseOperationResult> {
    const result = await DatabaseOperations.update('internship_applications', applicationId, { status });
    if (result.success) {
      toast.success(`Application ${status} successfully`);
    }
    return result;
  }

  static async getCompanyPrograms(companyId: string): Promise<DatabaseOperationResult> {
    return await DatabaseOperations.list('internship_programs', [Query.equal('companyId', companyId)]);
  }

  static async getStudentApplications(studentId: string): Promise<DatabaseOperationResult> {
    return await DatabaseOperations.list('internship_applications', [Query.equal('studentId', studentId)]);
  }
}

export class ReportOperations {
  static async createReport(data: any): Promise<DatabaseOperationResult> {
    const result = await DatabaseOperations.create('internship_reports', data);
    if (result.success) {
      toast.success('Report submitted successfully');
    }
    return result;
  }

  static async getFacultyReports(facultyId: string): Promise<DatabaseOperationResult> {
    return await DatabaseOperations.list('internship_reports', [Query.equal('supervisorId', facultyId)]);
  }

  static async updateReportStatus(reportId: string, status: string, feedback?: string): Promise<DatabaseOperationResult> {
    const updateData: any = { status };
    if (feedback) updateData.feedback = feedback;
    
    const result = await DatabaseOperations.update('internship_reports', reportId, updateData);
    if (result.success) {
      toast.success('Report reviewed successfully');
    }
    return result;
  }
}

export class NotificationOperations {
  static async createNotification(data: any): Promise<DatabaseOperationResult> {
    return await DatabaseOperations.create('notifications', data);
  }

  static async getUserNotifications(userId: string): Promise<DatabaseOperationResult> {
    return await DatabaseOperations.list('notifications', [
      Query.equal('userId', userId),
      Query.orderDesc('$createdAt'),
      Query.limit(50)
    ]);
  }

  static async markAsRead(notificationId: string): Promise<DatabaseOperationResult> {
    return await DatabaseOperations.update('notifications', notificationId, { isRead: true });
  }
}

export class SkillOperations {
  static async createAssessment(data: any): Promise<DatabaseOperationResult> {
    const result = await DatabaseOperations.create('skill_assessments', data);
    if (result.success) {
      toast.success('Skill assessment completed');
    }
    return result;
  }

  static async getUserAssessments(userId: string): Promise<DatabaseOperationResult> {
    return await DatabaseOperations.list('skill_assessments', [Query.equal('userId', userId)]);
  }

  static async getLearningResources(filters?: any): Promise<DatabaseOperationResult> {
    const queries: string[] = [];
    if (filters?.category) queries.push(Query.equal('category', filters.category));
    if (filters?.difficulty) queries.push(Query.equal('difficulty', filters.difficulty));
    if (filters?.type) queries.push(Query.equal('type', filters.type));
    
    return await DatabaseOperations.list('learning_resources', queries);
  }
}

// File Upload Operations
export class FileOperations {
  static async uploadFile(file: File, folder?: string): Promise<DatabaseOperationResult<{url: string, fileId: string}>> {
    try {
      const fileId = ID.unique();
      const uploadedFile = await storage.createFile(BUCKET_ID, fileId, file);
      
      const fileUrl = storage.getFileView(BUCKET_ID, fileId);
      
      return { 
        success: true, 
        data: { 
          url: fileUrl.toString(),
          fileId: uploadedFile.$id 
        } 
      };
    } catch (error: any) {
      console.error('Error uploading file:', error);
      return { success: false, error: error.message || 'Failed to upload file' };
    }
  }

  static async deleteFile(fileId: string): Promise<DatabaseOperationResult> {
    try {
      await storage.deleteFile(BUCKET_ID, fileId);
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting file:', error);
      return { success: false, error: error.message || 'Failed to delete file' };
    }
  }
}

// Credit System Operations
export class CreditOperations {
  static async calculateCredits(internshipData: any): Promise<DatabaseOperationResult<number>> {
    try {
      // NEP 2020 compliant credit calculation
      const { duration, workHours, assessmentScores } = internshipData;
      
      // Base credits calculation
      let credits = 0;
      
      // Duration-based credits (1 credit per month minimum)
      credits += Math.max(duration, 1);
      
      // Work hours bonus (additional credits for >160 hours/month)
      if (workHours > 160 * duration) {
        credits += Math.floor((workHours - 160 * duration) / 40);
      }
      
      // Assessment-based credits
      if (assessmentScores?.length > 0) {
        const avgScore = assessmentScores.reduce((a: number, b: number) => a + b, 0) / assessmentScores.length;
        if (avgScore >= 80) credits += 1;
        else if (avgScore >= 70) credits += 0.5;
      }
      
      return { success: true, data: Math.min(credits, 6) }; // Cap at 6 credits
    } catch (error: any) {
      console.error('Error calculating credits:', error);
      return { success: false, error: 'Failed to calculate credits' };
    }
  }

  static async createCreditRecord(data: any): Promise<DatabaseOperationResult> {
    return await DatabaseOperations.create('credit_records', data);
  }
}

// Analytics and Reporting
export class AnalyticsOperations {
  static async getDashboardStats(userId: string, role: string): Promise<DatabaseOperationResult> {
    try {
      const stats: any = {};
      
      switch (role) {
        case 'student':
          const applications = await DatabaseOperations.list('internship_applications', [Query.equal('studentId', userId)]);
          const assessments = await DatabaseOperations.list('skill_assessments', [Query.equal('userId', userId)]);
          
          stats.totalApplications = applications.data?.length || 0;
          stats.skillsAssessed = assessments.data?.length || 0;
          stats.acceptanceRate = applications.data ? 
            (applications.data.filter((a: any) => a.status === 'selected').length / applications.data.length * 100).toFixed(1) : 0;
          break;
          
        case 'company':
          const programs = await DatabaseOperations.list('internship_programs', [Query.equal('companyId', userId)]);
          stats.totalPrograms = programs.data?.length || 0;
          break;
          
        case 'faculty':
          const reports = await DatabaseOperations.list('internship_reports', [Query.equal('supervisorId', userId)]);
          stats.reportsToReview = reports.data?.filter((r: any) => r.status === 'pending').length || 0;
          break;
      }
      
      return { success: true, data: stats };
    } catch (error: any) {
      console.error('Error fetching dashboard stats:', error);
      return { success: false, error: 'Failed to fetch statistics' };
    }
  }
}

export { DatabaseOperations as default };