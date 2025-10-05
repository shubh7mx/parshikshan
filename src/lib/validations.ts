import { z } from 'zod';

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  confirmPassword: z.string(),
  role: z.enum(['student', 'faculty', 'admin', 'industry_partner']),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// User profile schemas
export const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  profileImage: z.string().optional(),
});

// College schemas
export const collegeSchema = z.object({
  name: z.string().min(2, 'College name must be at least 2 characters'),
  code: z.string().min(2, 'College code is required'),
  address: z.string().min(10, 'Please enter a complete address'),
  contactEmail: z.string().email('Please enter a valid email address'),
  contactPhone: z.string().min(10, 'Please enter a valid phone number'),
  principalId: z.string().min(1, 'Principal selection is required'),
  establishedYear: z.number().min(1800).max(new Date().getFullYear()),
  affiliatedUniversity: z.string().min(2, 'University name is required'),
});

// Student schemas
export const studentProfileSchema = z.object({
  rollNumber: z.string().min(1, 'Roll number is required'),
  semester: z.number().min(1).max(8),
  course: z.string().min(2, 'Course name is required'),
  academicYear: z.string().regex(/^\d{4}-\d{2}$/, 'Academic year must be in YYYY-YY format'),
  cgpa: z.number().min(0).max(10).optional(),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  resume: z.string().optional(),
  collegeId: z.string().min(1, 'College selection is required'),
});

// Company schemas
export const companyRegistrationSchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters'),
  industry: z.string().min(2, 'Industry is required'),
  website: z.string().url('Please enter a valid website URL').optional().or(z.literal('')),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  address: z.string().min(10, 'Please enter a complete address'),
  companySize: z.enum(['startup', 'small', 'medium', 'large', 'enterprise']),
  registrationNumber: z.string().optional(),
  contactPersonId: z.string().min(1, 'Contact person is required'),
});

// Internship program schemas
export const internshipProgramSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(100, 'Description must be at least 100 characters'),
  duration: z.number().min(4, 'Duration must be at least 4 weeks').max(26, 'Duration cannot exceed 26 weeks'),
  stipend: z.number().min(0).optional(),
  location: z.string().min(2, 'Location is required'),
  mode: z.enum(['onsite', 'remote', 'hybrid']),
  requiredSkills: z.array(z.string()).min(1, 'At least one required skill must be specified'),
  eligibleCourses: z.array(z.string()).min(1, 'At least one eligible course must be specified'),
  minimumCGPA: z.number().min(0).max(10).optional(),
  maxPositions: z.number().min(1, 'At least one position must be available'),
  applicationDeadline: z.string().refine((date) => new Date(date) > new Date(), {
    message: 'Application deadline must be in the future',
  }),
  startDate: z.string().refine((date) => new Date(date) > new Date(), {
    message: 'Start date must be in the future',
  }),
  endDate: z.string(),
}).refine((data) => new Date(data.endDate) > new Date(data.startDate), {
  message: 'End date must be after start date',
  path: ['endDate'],
});

// Internship application schemas
export const internshipApplicationSchema = z.object({
  programId: z.string().min(1, 'Internship program selection is required'),
  coverLetter: z.string().min(100, 'Cover letter must be at least 100 characters').optional(),
  additionalDocuments: z.array(z.string()).optional(),
  facultyRecommendation: z.string().optional(),
});

// Logbook entry schemas
export const logbookEntrySchema = z.object({
  date: z.string().refine((date) => new Date(date) <= new Date(), {
    message: 'Date cannot be in the future',
  }),
  hoursWorked: z.number().min(0.5, 'Hours worked must be at least 0.5').max(12, 'Hours worked cannot exceed 12 per day'),
  tasksCompleted: z.string().min(20, 'Please provide detailed description of tasks completed'),
  learningOutcomes: z.string().min(20, 'Please describe what you learned'),
  challenges: z.string().optional(),
  attachments: z.array(z.string()).optional(),
});

// Report schemas
export const reportSchema = z.object({
  type: z.enum(['weekly', 'monthly', 'final']),
  content: z.string().min(200, 'Report content must be at least 200 characters'),
  attachments: z.array(z.string()).optional(),
});

// Feedback schemas
export const feedbackSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(20, 'Feedback must be at least 20 characters'),
  suggestions: z.string().optional(),
});

// Search and filter schemas
export const internshipSearchSchema = z.object({
  searchTerm: z.string().optional(),
  location: z.string().optional(),
  mode: z.enum(['onsite', 'remote', 'hybrid']).optional(),
  duration: z.number().optional(),
  skills: z.array(z.string()).optional(),
  companySize: z.enum(['startup', 'small', 'medium', 'large', 'enterprise']).optional(),
  stipendMin: z.number().min(0).optional(),
  stipendMax: z.number().min(0).optional(),
  industry: z.string().optional(),
}).refine((data) => {
  if (data.stipendMin && data.stipendMax) {
    return data.stipendMax >= data.stipendMin;
  }
  return true;
}, {
  message: 'Maximum stipend must be greater than or equal to minimum stipend',
  path: ['stipendMax'],
});

// File upload schemas
export const fileUploadSchema = z.object({
  file: z.instanceof(File, { message: 'Please select a file' }),
  maxSize: z.number().optional(),
  allowedTypes: z.array(z.string()).optional(),
});

// Export type inference
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;
export type CollegeFormData = z.infer<typeof collegeSchema>;
export type StudentProfileData = z.infer<typeof studentProfileSchema>;
export type CompanyRegistrationData = z.infer<typeof companyRegistrationSchema>;
export type InternshipProgramData = z.infer<typeof internshipProgramSchema>;
export type InternshipApplicationData = z.infer<typeof internshipApplicationSchema>;
export type LogbookEntryData = z.infer<typeof logbookEntrySchema>;
export type ReportData = z.infer<typeof reportSchema>;
export type FeedbackData = z.infer<typeof feedbackSchema>;
export type InternshipSearchData = z.infer<typeof internshipSearchSchema>;
export type FileUploadData = z.infer<typeof fileUploadSchema>;