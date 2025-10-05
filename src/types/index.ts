// User and authentication types
export type UserRole = 'student' | 'faculty' | 'admin' | 'industry_partner';

export interface User {
  $id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  profileImage?: string;
  isActive: boolean;
  $createdAt: string;
  $updatedAt: string;
}

export interface College {
  $id: string;
  name: string;
  code: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  principalId: string;
  isVerified: boolean;
  establishedYear: number;
  affiliatedUniversity: string;
  $createdAt: string;
  $updatedAt: string;
}

export interface Student {
  $id: string;
  userId: string;
  collegeId: string;
  rollNumber: string;
  semester: number;
  course: string;
  academicYear: string;
  cgpa?: number;
  skills: string[];
  resume?: string;
  isEligibleForInternship: boolean;
  $createdAt: string;
  $updatedAt: string;
  // Populated fields
  user?: User;
  college?: College;
}

export type CompanySize = 'startup' | 'small' | 'medium' | 'large' | 'enterprise';

export interface Company {
  $id: string;
  name: string;
  industry: string;
  website?: string;
  description: string;
  address: string;
  contactPersonId: string;
  companySize: CompanySize;
  isVerified: boolean;
  registrationNumber?: string;
  $createdAt: string;
  $updatedAt: string;
  // Populated fields
  contactPerson?: User;
}

export type InternshipMode = 'onsite' | 'remote' | 'hybrid';
export type InternshipProgramStatus = 'draft' | 'published' | 'closed' | 'completed';

export interface InternshipProgram {
  $id: string;
  title: string;
  description: string;
  companyId: string;
  duration: number; // in weeks
  stipend?: number;
  location: string;
  mode: InternshipMode;
  requiredSkills: string[];
  eligibleCourses: string[];
  minimumCGPA?: number;
  maxPositions: number;
  applicationDeadline: string;
  startDate: string;
  endDate: string;
  status: InternshipProgramStatus;
  $createdAt: string;
  $updatedAt: string;
  // Populated fields
  company?: Company;
}

export type ApplicationStatus = 'pending' | 'shortlisted' | 'selected' | 'rejected';

export interface InternshipApplication {
  $id: string;
  studentId: string;
  programId: string;
  applicationDate: string;
  coverLetter?: string;
  additionalDocuments: string[];
  status: ApplicationStatus;
  facultyRecommendation?: string;
  interviewDate?: string;
  selectionDate?: string;
  $createdAt: string;
  $updatedAt: string;
  // Populated fields
  student?: Student;
  program?: InternshipProgram;
}

export type InternshipStatus = 'not_started' | 'ongoing' | 'completed' | 'terminated';

export interface Internship {
  $id: string;
  applicationId: string;
  mentorId: string;
  facultyCoordinatorId: string;
  startDate: string;
  endDate: string;
  objectives: string[];
  status: InternshipStatus;
  finalGrade?: string;
  certificateIssued: boolean;
  creditsAwarded: number;
  $createdAt: string;
  $updatedAt: string;
  // Populated fields
  application?: InternshipApplication;
  mentor?: User;
  facultyCoordinator?: User;
}

export interface LogbookEntry {
  $id: string;
  internshipId: string;
  date: string;
  hoursWorked: number;
  tasksCompleted: string;
  learningOutcomes: string;
  challenges?: string;
  mentorFeedback?: string;
  attachments: string[];
  isVerified: boolean;
  verifiedBy?: string;
  $createdAt: string;
  $updatedAt: string;
  // Populated fields
  internship?: Internship;
}

export type ReportType = 'weekly' | 'monthly' | 'final';

export interface Report {
  $id: string;
  internshipId: string;
  type: ReportType;
  content: string;
  attachments: string[];
  submissionDate: string;
  feedback?: string;
  grade?: string;
  isApproved: boolean;
  $createdAt: string;
  $updatedAt: string;
  // Populated fields
  internship?: Internship;
}

export type NotificationType = 'info' | 'warning' | 'success' | 'error';

export interface Notification {
  $id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  actionUrl?: string;
  $createdAt: string;
  $updatedAt: string;
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
  $id: string;
  name: string;
  size: number;
  mimeType: string;
  url: string;
}