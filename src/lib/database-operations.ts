import { getDB, uuid, handleError } from './d1';
import { toast } from 'sonner';

export interface DatabaseOperationResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Generic CRUD Operations
export class DatabaseOperations {
  static async create<T>(
    tableName: string,
    data: Record<string, unknown>,
    documentId?: string
  ): Promise<DatabaseOperationResult<T>> {
    try {
      const db = getDB();
      const id = documentId || uuid();
      const columns = [...Object.keys(data), 'id'];
      const placeholders = columns.map(() => '?');
      const values = [...Object.values(data), id].map((v) =>
        Array.isArray(v) ? JSON.stringify(v) : v
      );

      const result = await db
        .prepare(
          `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`
        )
        .bind(...values)
        .first<T>();

      return { success: true, data: result as T };
    } catch (error: any) {
      console.error(`Error creating in ${tableName}:`, error);
      return { success: false, error: error.message || 'Failed to create' };
    }
  }

  static async getById<T>(tableName: string, documentId: string): Promise<DatabaseOperationResult<T>> {
    try {
      const db = getDB();
      const result = await db
        .prepare(`SELECT * FROM ${tableName} WHERE id = ?`)
        .bind(documentId)
        .first<T>();

      if (!result) {
        return { success: false, error: 'Document not found' };
      }
      return { success: true, data: result };
    } catch (error: any) {
      console.error(`Error getting from ${tableName}:`, error);
      return { success: false, error: error.message || 'Document not found' };
    }
  }

  static async list<T>(
    tableName: string,
    filters?: { column: string; value: unknown }[],
    limit?: number,
    orderBy?: string,
    orderDir?: 'ASC' | 'DESC'
  ): Promise<DatabaseOperationResult<T[]>> {
    try {
      const db = getDB();
      const conditions: string[] = [];
      const values: unknown[] = [];

      if (filters) {
        for (const f of filters) {
          conditions.push(`${f.column} = ?`);
          values.push(f.value);
        }
      }

      const whereClause = conditions.length > 0 ? ' WHERE ' + conditions.join(' AND ') : '';
      const orderClause = orderBy ? ` ORDER BY ${orderBy} ${orderDir || 'DESC'}` : ' ORDER BY created_at DESC';
      const limitClause = limit ? ` LIMIT ?` : '';
      if (limit) values.push(limit);

      const result = await db
        .prepare(`SELECT * FROM ${tableName}${whereClause}${orderClause}${limitClause}`)
        .bind(...values)
        .all<T>();

      return { success: true, data: result.results };
    } catch (error: any) {
      console.error(`Error listing from ${tableName}:`, error);
      return { success: false, error: error.message || 'Failed to fetch' };
    }
  }

  static async update<T>(
    tableName: string,
    documentId: string,
    data: Record<string, unknown>
  ): Promise<DatabaseOperationResult<T>> {
    try {
      const db = getDB();
      const keys = Object.keys(data);
      const setClause = keys.map((k) => `${k} = ?`).join(', ');
      const values = keys.map((k) => {
        const val = data[k];
        return Array.isArray(val) ? JSON.stringify(val) : val;
      });

      const result = await db
        .prepare(`UPDATE ${tableName} SET ${setClause}, updated_at = datetime('now') WHERE id = ? RETURNING *`)
        .bind(...values, documentId)
        .first<T>();

      if (!result) {
        return { success: false, error: 'Document not found' };
      }
      return { success: true, data: result };
    } catch (error: any) {
      console.error(`Error updating in ${tableName}:`, error);
      return { success: false, error: error.message || 'Failed to update' };
    }
  }

  static async delete(tableName: string, documentId: string): Promise<DatabaseOperationResult> {
    try {
      const db = getDB();
      await db
        .prepare(`DELETE FROM ${tableName} WHERE id = ?`)
        .bind(documentId)
        .run();
      return { success: true };
    } catch (error: any) {
      console.error(`Error deleting from ${tableName}:`, error);
      return { success: false, error: error.message || 'Failed to delete' };
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

  static async getUserProfile(userId: string, role: string): Promise<DatabaseOperationResult> {
    try {
      const db = getDB();
      let result;
      switch (role) {
        case 'student':
          result = await db.prepare(
            'SELECT s.*, u.name, u.email, u.role, u.phone FROM students s JOIN users u ON s.user_id = u.id WHERE s.user_id = ?'
          ).bind(userId).first();
          break;
        case 'industry_partner':
          result = await db.prepare(
            'SELECT c.*, u.name, u.email, u.role, u.phone FROM companies c JOIN users u ON c.contact_person_id = u.id WHERE c.contact_person_id = ?'
          ).bind(userId).first();
          break;
        default:
          return { success: false, error: 'Invalid user role' };
      }
      if (!result) {
        return { success: false, error: 'Profile not found' };
      }
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
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
    const result = await DatabaseOperations.update('internship_applications', applicationId, { status } as any);
    if (result.success) {
      toast.success(`Application ${status} successfully`);
    }
    return result;
  }

  static async getCompanyPrograms(companyId: string): Promise<DatabaseOperationResult> {
    return await DatabaseOperations.list('internship_programs', [{ column: 'company_id', value: companyId }]);
  }

  static async getStudentApplications(studentId: string): Promise<DatabaseOperationResult> {
    return await DatabaseOperations.list('internship_applications', [{ column: 'student_id', value: studentId }]);
  }
}

export class ReportOperations {
  static async createReport(data: any): Promise<DatabaseOperationResult> {
    const result = await DatabaseOperations.create('reports', data);
    if (result.success) {
      toast.success('Report submitted successfully');
    }
    return result;
  }

  static async getFacultyReports(facultyId: string): Promise<DatabaseOperationResult> {
    return await DatabaseOperations.list('reports', [{ column: 'faculty_coordinator_id', value: facultyId }]);
  }

  static async updateReportStatus(reportId: string, status: string, feedback?: string): Promise<DatabaseOperationResult> {
    const updateData: any = { is_approved: status === 'approved' ? 1 : 0 };
    if (feedback) updateData.feedback = feedback;

    const result = await DatabaseOperations.update('reports', reportId, updateData);
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
    return await DatabaseOperations.list(
      'notifications',
      [{ column: 'user_id', value: userId }],
      50,
      'created_at',
      'DESC'
    );
  }

  static async markAsRead(notificationId: string): Promise<DatabaseOperationResult> {
    return await DatabaseOperations.update('notifications', notificationId, { is_read: 1 } as any);
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
    return await DatabaseOperations.list('skill_assessments', [{ column: 'user_id', value: userId }]);
  }

  static async getLearningResources(filters?: any): Promise<DatabaseOperationResult> {
    const filterArr = [];
    if (filters?.category) filterArr.push({ column: 'category', value: filters.category });
    if (filters?.difficulty) filterArr.push({ column: 'difficulty', value: filters.difficulty });
    if (filters?.type) filterArr.push({ column: 'type', value: filters.type });
    return await DatabaseOperations.list('learning_resources', filterArr.length > 0 ? filterArr : undefined);
  }
}

// File Upload Operations (R2 via fetch API)
export class FileOperations {
  static async uploadFile(file: File, folder?: string): Promise<DatabaseOperationResult<{ url: string; fileId: string }>> {
    try {
      const fileId = uuid();
      const key = folder ? `${folder}/${fileId}-${file.name}` : `${fileId}-${file.name}`;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('key', key);
      formData.append('bucket', 'DOCUMENTS');

      const response = await fetch('/api/files', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      return {
        success: true,
        data: {
          url: data.url || `/api/files/${key}`,
          fileId: fileId,
        },
      };
    } catch (error: any) {
      console.error('Error uploading file:', error);
      return { success: false, error: error.message || 'Failed to upload file' };
    }
  }

  static async deleteFile(fileId: string): Promise<DatabaseOperationResult> {
    try {
      const response = await fetch(`/api/files?fileId=${fileId}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Delete failed');
      }
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
      const { duration, workHours, assessmentScores } = internshipData;

      let credits = 0;
      credits += Math.max(duration, 1);

      if (workHours > 160 * duration) {
        credits += Math.floor((workHours - 160 * duration) / 40);
      }

      if (assessmentScores?.length > 0) {
        const avgScore = assessmentScores.reduce((a: number, b: number) => a + b, 0) / assessmentScores.length;
        if (avgScore >= 80) credits += 1;
        else if (avgScore >= 70) credits += 0.5;
      }

      return { success: true, data: Math.min(credits, 6) };
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
          const applications = await DatabaseOperations.list('internship_applications', [
            { column: 'student_id', value: userId },
          ]);
          const assessments = await DatabaseOperations.list('skill_assessments', [
            { column: 'user_id', value: userId },
          ]);

          stats.totalApplications = applications.data?.length || 0;
          stats.skillsAssessed = assessments.data?.length || 0;
          stats.acceptanceRate = applications.data
            ? (applications.data.filter((a: any) => a.status === 'selected').length / applications.data.length * 100).toFixed(1)
            : 0;
          break;

        case 'industry_partner':
          const programs = await DatabaseOperations.list('internship_programs', [
            { column: 'company_id', value: userId },
          ]);
          stats.totalPrograms = programs.data?.length || 0;
          break;

        case 'faculty':
          const reports = await DatabaseOperations.list('reports', [
            { column: 'faculty_coordinator_id', value: userId },
          ]);
          stats.reportsToReview = reports.data?.filter((r: any) => r.is_approved === 0).length || 0;
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
