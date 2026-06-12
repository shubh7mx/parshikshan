// User and authentication types
export type UserRole = 'student' | 'faculty' | 'admin' | 'industry_partner';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  profile_image?: string;
  is_active: boolean;
  password_hash?: string;
  created_at: string;
  updated_at: string;
}

export interface College {
  id: string;
  name: string;
  code: string;
  address: string;
  contact_email: string;
  contact_phone: string;
  principal_id: string;
  is_verified: boolean;
  established_year: number;
  affiliated_university: string;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  user_id: string;
  college_id: string;
  roll_number: string;
  semester: number;
  course: string;
  academic_year: string;
  cgpa?: number;
  skills: string[];
  resume?: string;
  is_eligible_for_internship: boolean;
  created_at: string;
  updated_at: string;
  user?: User;
  college?: College;
}

export type CompanySize = 'startup' | 'small' | 'medium' | 'large' | 'enterprise';

export interface Company {
  id: string;
  name: string;
  industry: string;
  website?: string;
  description: string;
  address: string;
  contact_person_id: string;
  company_size: CompanySize;
  is_verified: boolean;
  registration_number?: string;
  created_at: string;
  updated_at: string;
  contact_person?: User;
}

export type InternshipMode = 'onsite' | 'remote' | 'hybrid';
export type InternshipProgramStatus = 'draft' | 'published' | 'closed' | 'completed';

export interface InternshipProgram {
  id: string;
  title: string;
  description: string;
  company_id: string;
  duration: number;
  stipend?: number;
  location: string;
  mode: InternshipMode;
  required_skills: string[];
  eligible_courses: string[];
  minimum_cgpa?: number;
  max_positions: number;
  application_deadline: string;
  start_date: string;
  end_date: string;
  status: InternshipProgramStatus;
  created_at: string;
  updated_at: string;
  company?: Company;
}

export type ApplicationStatus = 'pending' | 'shortlisted' | 'selected' | 'rejected';

export interface InternshipApplication {
  id: string;
  student_id: string;
  program_id: string;
  application_date: string;
  cover_letter?: string;
  additional_documents: string[];
  status: ApplicationStatus;
  faculty_recommendation?: string;
  interview_date?: string;
  selection_date?: string;
  created_at: string;
  updated_at: string;
  student?: Student;
  program?: InternshipProgram;
}

export type InternshipStatus = 'not_started' | 'ongoing' | 'completed' | 'terminated';

export interface Internship {
  id: string;
  application_id: string;
  mentor_id: string;
  faculty_coordinator_id: string;
  start_date: string;
  end_date: string;
  objectives: string[];
  status: InternshipStatus;
  final_grade?: string;
  certificate_issued: boolean;
  credits_awarded: number;
  created_at: string;
  updated_at: string;
  application?: InternshipApplication;
  mentor?: User;
  faculty_coordinator?: User;
}

export interface LogbookEntry {
  id: string;
  internship_id: string;
  date: string;
  hours_worked: number;
  tasks_completed: string;
  learning_outcomes: string;
  challenges?: string;
  mentor_feedback?: string;
  attachments: string[];
  is_verified: boolean;
  verified_by?: string;
  created_at: string;
  updated_at: string;
  internship?: Internship;
}

export type ReportType = 'weekly' | 'monthly' | 'final';

export interface Report {
  id: string;
  internship_id: string;
  type: ReportType;
  content: string;
  attachments: string[];
  submission_date: string;
  feedback?: string;
  grade?: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  internship?: Internship;
}

export type NotificationType = 'info' | 'warning' | 'success' | 'error';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  action_url?: string;
  created_at: string;
  updated_at: string;
}

// Form and API types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  role: UserRole;
  phone?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  code?: number;
}

// Dashboard and analytics types
export interface DashboardStats {
  totalInternships: number;
  activeInternships: number;
  completedInternships: number;
  pendingApplications: number;
  totalStudents: number;
  totalCompanies: number;
}

export interface ChartData {
  name: string;
  value: number;
  label?: string;
}

// Filter and search types
export interface InternshipSearchFilters {
  location?: string;
  mode?: InternshipMode;
  duration?: number;
  skills?: string[];
  companySize?: CompanySize;
  stipendRange?: [number, number];
  industry?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  orderBy?: string;
  orderType?: 'ASC' | 'DESC';
}

// File upload types
export interface FileUploadResult {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  url: string;
}
