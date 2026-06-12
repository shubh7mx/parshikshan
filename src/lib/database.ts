import { getDB, uuid, buildSetClause, handleError, parseJSON, formatPagination } from './d1';
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
  private tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  async create<T extends Record<string, unknown>>(
    data: Omit<T, 'id' | 'created_at' | 'updated_at'>
  ): Promise<ApiResponse<T>> {
    try {
      const db = getDB();
      const id = uuid();
      const columns = ['id', ...Object.keys(data as Record<string, unknown>)];
      const placeholders = columns.map(() => '?');
      const values = [id, ...Object.values(data as Record<string, unknown>)].map((v) =>
        Array.isArray(v) ? JSON.stringify(v) : v
      );

      const result = await db
        .prepare(
          `INSERT INTO ${this.tableName} (${columns.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`
        )
        .bind(...values)
        .first<T>();

      return { success: true, data: result as T };
    } catch (error) {
      return handleError(error) as ApiResponse<T>;
    }
  }

  async getById<T>(id: string): Promise<ApiResponse<T>> {
    try {
      const db = getDB();
      const result = await db
        .prepare(`SELECT * FROM ${this.tableName} WHERE id = ?`)
        .bind(id)
        .first<T>();

      if (!result) {
        return { success: false, error: 'Resource not found', code: 404 };
      }
      return { success: true, data: result };
    } catch (error) {
      return handleError(error) as ApiResponse<T>;
    }
  }

  async update<T>(id: string, data: Partial<T>): Promise<ApiResponse<T>> {
    try {
      const db = getDB();
      const { setClause, values } = buildSetClause(data as Record<string, unknown>);

      const result = await db
        .prepare(`UPDATE ${this.tableName} SET ${setClause}, updated_at = datetime('now') WHERE id = ? RETURNING *`)
        .bind(...values, id)
        .first<T>();

      if (!result) {
        return { success: false, error: 'Resource not found', code: 404 };
      }
      return { success: true, data: result };
    } catch (error) {
      return handleError(error) as ApiResponse<T>;
    }
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    try {
      const db = getDB();
      const result = await db
        .prepare(`DELETE FROM ${this.tableName} WHERE id = ?`)
        .bind(id)
        .run();

      if (result.changes === 0) {
        return { success: false, error: 'Resource not found', code: 404 };
      }
      return { success: true };
    } catch (error) {
      return handleError(error) as ApiResponse<void>;
    }
  }

  async list<T>(
    filters: { column: string; value: unknown }[] = [],
    pagination?: PaginationParams
  ): Promise<ApiResponse<{ documents: T[]; total: number }>> {
    try {
      const db = getDB();

      let whereClause = '';
      const whereValues: unknown[] = [];

      if (filters.length > 0) {
        const clauses = filters.map((f) => {
          whereValues.push(f.value);
          return `${f.column} = ?`;
        });
        whereClause = ' WHERE ' + clauses.join(' AND ');
      }

      const { limitClause, offsetClause, orderClause } = formatPagination(pagination);

      const countResult = await db
        .prepare(`SELECT COUNT(*) as count FROM ${this.tableName}${whereClause}`)
        .bind(...whereValues)
        .first<{ count: number }>();

      const total = countResult?.count || 0;

      const result = await db
        .prepare(`SELECT * FROM ${this.tableName}${whereClause}${orderClause}${limitClause}${offsetClause}`)
        .bind(...whereValues, pagination?.limit || 20, ((pagination?.page || 1) - 1) * (pagination?.limit || 20))
        .all<T>();

      return { success: true, data: { documents: result.results, total } };
    } catch (error) {
      return handleError(error) as ApiResponse<{ documents: T[]; total: number }>;
    }
  }

  async search<T>(
    searchTerm: string,
    searchFields: string[],
    filters: { column: string; value: unknown }[] = []
  ): Promise<ApiResponse<T[]>> {
    try {
      const db = getDB();

      const conditions: string[] = [];
      const values: unknown[] = [];

      if (searchTerm && searchFields.length > 0) {
        const likeTerm = `%${searchTerm}%`;
        const searchClauses = searchFields.map(() => {
          values.push(likeTerm);
          return ` LIKE ?`;
        });
        conditions.push(`(${searchFields.join(' OR ')}${searchClauses.join('')})`);
      }

      for (const f of filters) {
        conditions.push(`${f.column} = ?`);
        values.push(f.value);
      }

      const whereClause = conditions.length > 0 ? ' WHERE ' + conditions.join(' AND ') : '';

      const result = await db
        .prepare(`SELECT * FROM ${this.tableName}${whereClause} ORDER BY created_at DESC`)
        .bind(...values)
        .all<T>();

      return { success: true, data: result.results };
    } catch (error) {
      return handleError(error) as ApiResponse<T[]>;
    }
  }
}

// Create service instances for each collection
export const userService = new DatabaseService('users');
export const collegeService = new DatabaseService('colleges');
export const studentService = new DatabaseService('students');
export const companyService = new DatabaseService('companies');
export const internshipProgramService = new DatabaseService('internship_programs');
export const internshipApplicationService = new DatabaseService('internship_applications');
export const internshipService = new DatabaseService('internships');
export const logbookEntryService = new DatabaseService('logbook_entries');
export const reportService = new DatabaseService('reports');
export const notificationService = new DatabaseService('notifications');

// Specialized database operations
export const dbOperations = {
  async getUserByEmail(email: string): Promise<ApiResponse<User>> {
    try {
      const db = getDB();
      const result = await db
        .prepare('SELECT * FROM users WHERE email = ?')
        .bind(email)
        .first<User>();

      if (!result) {
        return { success: false, error: 'User not found', code: 404 };
      }
      return { success: true, data: result };
    } catch (error) {
      return handleError(error) as ApiResponse<User>;
    }
  },

  async getStudentWithDetails(studentId: string): Promise<ApiResponse<Student>> {
    try {
      const db = getDB();
      const result = await db
        .prepare(`
          SELECT s.*,
            u.id as u_id, u.name as u_name, u.email as u_email, u.phone as u_phone,
            u.role as u_role, u.profile_image as u_profile_image, u.is_active as u_is_active,
            u.created_at as u_created_at, u.updated_at as u_updated_at,
            c.id as c_id, c.name as c_name, c.code as c_code, c.address as c_address,
            c.contact_email as c_contact_email, c.contact_phone as c_contact_phone,
            c.principal_id as c_principal_id, c.is_verified as c_is_verified,
            c.established_year as c_established_year, c.affiliated_university as c_affiliated_university,
            c.created_at as c_created_at, c.updated_at as c_updated_at
          FROM students s
          JOIN users u ON s.user_id = u.id
          JOIN colleges c ON s.college_id = c.id
          WHERE s.id = ?
        `)
        .bind(studentId)
        .first<Record<string, unknown>>();

      if (!result) {
        return { success: false, error: 'Student not found', code: 404 };
      }

      const student: Student = {
        id: result.id as string,
        user_id: result.user_id as string,
        college_id: result.college_id as string,
        roll_number: result.roll_number as string,
        semester: result.semester as number,
        course: result.course as string,
        academic_year: result.academic_year as string,
        cgpa: result.cgpa as number | undefined,
        skills: parseJSON<string[]>(result.skills as string, []),
        resume: result.resume as string | undefined,
        is_eligible_for_internship: Boolean(result.is_eligible_for_internship),
        created_at: result.created_at as string,
        updated_at: result.updated_at as string,
        user: {
          id: result.u_id as string,
          name: result.u_name as string,
          email: result.u_email as string,
          phone: result.u_phone as string | undefined,
          role: result.u_role as User['role'],
          profile_image: result.u_profile_image as string | undefined,
          is_active: Boolean(result.u_is_active),
          created_at: result.u_created_at as string,
          updated_at: result.u_updated_at as string,
        },
        college: {
          id: result.c_id as string,
          name: result.c_name as string,
          code: result.c_code as string,
          address: result.c_address as string,
          contact_email: result.c_contact_email as string,
          contact_phone: result.c_contact_phone as string,
          principal_id: result.c_principal_id as string,
          is_verified: Boolean(result.c_is_verified),
          established_year: result.c_established_year as number,
          affiliated_university: result.c_affiliated_university as string,
          created_at: result.c_created_at as string,
          updated_at: result.c_updated_at as string,
        },
      };

      return { success: true, data: student };
    } catch (error) {
      return handleError(error) as ApiResponse<Student>;
    }
  },

  async getCompaniesWithContact(): Promise<ApiResponse<Company[]>> {
    try {
      const db = getDB();
      const result = await db
        .prepare(`
          SELECT c.*,
            u.id as u_id, u.name as u_name, u.email as u_email, u.role as u_role,
            u.phone as u_phone, u.profile_image as u_profile_image, u.is_active as u_is_active,
            u.created_at as u_created_at, u.updated_at as u_updated_at
          FROM companies c
          JOIN users u ON c.contact_person_id = u.id
          ORDER BY c.name
        `)
        .all<Record<string, unknown>>();

      const companies: Company[] = result.results.map((row: Record<string, unknown>) => ({
        id: row.id as string,
        name: row.name as string,
        industry: row.industry as string,
        website: row.website as string | undefined,
        description: row.description as string,
        address: row.address as string,
        contact_person_id: row.contact_person_id as string,
        company_size: row.company_size as Company['company_size'],
        is_verified: Boolean(row.is_verified),
        registration_number: row.registration_number as string | undefined,
        created_at: row.created_at as string,
        updated_at: row.updated_at as string,
        contact_person: {
          id: row.u_id as string,
          name: row.u_name as string,
          email: row.u_email as string,
          role: row.u_role as User['role'],
          phone: row.u_phone as string | undefined,
          profile_image: row.u_profile_image as string | undefined,
          is_active: Boolean(row.u_is_active),
          created_at: row.u_created_at as string,
          updated_at: row.u_updated_at as string,
        },
      }));

      return { success: true, data: companies };
    } catch (error) {
      return handleError(error) as ApiResponse<Company[]>;
    }
  },

  async searchInternshipPrograms(
    searchTerm?: string,
    filters?: { location?: string; mode?: string; duration?: number }
  ): Promise<ApiResponse<InternshipProgram[]>> {
    try {
      const db = getDB();
      const conditions: string[] = ["ip.status = 'published'"];
      const values: unknown[] = [];

      if (searchTerm) {
        conditions.push('ip.title LIKE ?');
        values.push(`%${searchTerm}%`);
      }
      if (filters?.location) {
        conditions.push('ip.location = ?');
        values.push(filters.location);
      }
      if (filters?.mode) {
        conditions.push('ip.mode = ?');
        values.push(filters.mode);
      }
      if (filters?.duration) {
        conditions.push('ip.duration = ?');
        values.push(filters.duration);
      }

      const result = await db
        .prepare(
          `SELECT ip.*, c.name as company_name, c.industry as company_industry 
           FROM internship_programs ip 
           JOIN companies c ON ip.company_id = c.id 
           WHERE ${conditions.join(' AND ')} 
           ORDER BY ip.created_at DESC`
        )
        .bind(...values)
        .all<Record<string, unknown>>();

      const programs: InternshipProgram[] = result.results.map((row) => ({
        id: row.id as string,
        title: row.title as string,
        description: row.description as string,
        company_id: row.company_id as string,
        duration: row.duration as number,
        stipend: row.stipend as number | undefined,
        location: row.location as string,
        mode: row.mode as InternshipProgram['mode'],
        required_skills: parseJSON<string[]>(row.required_skills as string, []),
        eligible_courses: parseJSON<string[]>(row.eligible_courses as string, []),
        minimum_cgpa: row.minimum_cgpa as number | undefined,
        max_positions: row.max_positions as number,
        application_deadline: row.application_deadline as string,
        start_date: row.start_date as string,
        end_date: row.end_date as string,
        status: row.status as InternshipProgram['status'],
        created_at: row.created_at as string,
        updated_at: row.updated_at as string,
        company: {
          id: row.company_id as string,
          name: row.company_name as string,
          industry: row.company_industry as string,
          description: '',
          address: '',
          contact_person_id: '',
          company_size: 'small' as Company['company_size'],
          is_verified: false,
          created_at: '',
          updated_at: '',
        },
      }));

      return { success: true, data: programs };
    } catch (error) {
      return handleError(error) as ApiResponse<InternshipProgram[]>;
    }
  },

  async getApplicationsForStudent(studentId: string): Promise<ApiResponse<InternshipApplication[]>> {
    try {
      const db = getDB();
      const result = await db
        .prepare('SELECT * FROM internship_applications WHERE student_id = ? ORDER BY created_at DESC')
        .bind(studentId)
        .all<InternshipApplication>();

      return { success: true, data: result.results };
    } catch (error) {
      return handleError(error) as ApiResponse<InternshipApplication[]>;
    }
  },

  async getLogbookEntriesForInternship(internshipId: string): Promise<ApiResponse<LogbookEntry[]>> {
    try {
      const db = getDB();
      const result = await db
        .prepare('SELECT * FROM logbook_entries WHERE internship_id = ? ORDER BY date DESC')
        .bind(internshipId)
        .all<LogbookEntry>();

      const entries = result.results.map((e: LogbookEntry) => ({
        ...e,
        attachments: parseJSON<string[]>(e.attachments as unknown as string, []),
      }));

      return { success: true, data: entries };
    } catch (error) {
      return handleError(error) as ApiResponse<LogbookEntry[]>;
    }
  },

  async getNotificationsForUser(userId: string): Promise<ApiResponse<Notification[]>> {
    try {
      const db = getDB();
      const result = await db
        .prepare('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC')
        .bind(userId)
        .all<Notification>();

      return { success: true, data: result.results };
    } catch (error) {
      return handleError(error) as ApiResponse<Notification[]>;
    }
  },

  async markNotificationAsRead(notificationId: string): Promise<ApiResponse<void>> {
    try {
      const db = getDB();
      await db
        .prepare("UPDATE notifications SET is_read = 1, updated_at = datetime('now') WHERE id = ?")
        .bind(notificationId)
        .run();
      return { success: true };
    } catch (error) {
      return handleError(error) as ApiResponse<void>;
    }
  },
};
