-- Prashiskshan D1 Schema
-- Migration 0001: Initial schema from Appwrite collections

-- Enable foreign keys
PRAGMA foreign_keys = ON;

-- ============================================
-- USERS
-- ============================================
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    role TEXT NOT NULL CHECK (role IN ('student', 'faculty', 'admin', 'industry_partner')),
    profile_image TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);

-- ============================================
-- COLLEGES
-- ============================================
CREATE TABLE colleges (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    address TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    principal_id TEXT NOT NULL REFERENCES users(id),
    is_verified INTEGER NOT NULL DEFAULT 0,
    established_year INTEGER NOT NULL,
    affiliated_university TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX idx_colleges_code ON colleges(code);
CREATE INDEX idx_colleges_is_verified ON colleges(is_verified);
CREATE INDEX idx_colleges_principal_id ON colleges(principal_id);

-- ============================================
-- STUDENTS
-- ============================================
CREATE TABLE students (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    college_id TEXT NOT NULL REFERENCES colleges(id),
    roll_number TEXT NOT NULL UNIQUE,
    semester INTEGER NOT NULL CHECK (semester BETWEEN 1 AND 8),
    course TEXT NOT NULL,
    academic_year TEXT NOT NULL,
    cgpa REAL,
    skills TEXT NOT NULL DEFAULT '[]',
    resume TEXT,
    is_eligible_for_internship INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX idx_students_roll_number ON students(roll_number);
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_students_college_id ON students(college_id);
CREATE INDEX idx_students_is_eligible ON students(is_eligible_for_internship);

-- ============================================
-- COMPANIES
-- ============================================
CREATE TABLE companies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    industry TEXT NOT NULL,
    website TEXT,
    description TEXT NOT NULL,
    address TEXT NOT NULL,
    contact_person_id TEXT NOT NULL REFERENCES users(id),
    company_size TEXT NOT NULL CHECK (company_size IN ('startup', 'small', 'medium', 'large', 'enterprise')),
    is_verified INTEGER NOT NULL DEFAULT 0,
    registration_number TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_companies_industry ON companies(industry);
CREATE INDEX idx_companies_company_size ON companies(company_size);
CREATE INDEX idx_companies_is_verified ON companies(is_verified);
CREATE INDEX idx_companies_contact_person_id ON companies(contact_person_id);

-- ============================================
-- INTERNSHIP PROGRAMS
-- ============================================
CREATE TABLE internship_programs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    company_id TEXT NOT NULL REFERENCES companies(id),
    duration INTEGER NOT NULL,
    stipend REAL,
    location TEXT NOT NULL,
    mode TEXT NOT NULL CHECK (mode IN ('onsite', 'remote', 'hybrid')),
    required_skills TEXT NOT NULL DEFAULT '[]',
    eligible_courses TEXT NOT NULL DEFAULT '[]',
    minimum_cgpa REAL,
    max_positions INTEGER NOT NULL DEFAULT 1,
    application_deadline TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed', 'completed')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_ip_company_id ON internship_programs(company_id);
CREATE INDEX idx_ip_status ON internship_programs(status);
CREATE INDEX idx_ip_mode ON internship_programs(mode);
CREATE INDEX idx_ip_location ON internship_programs(location);
CREATE INDEX idx_ip_application_deadline ON internship_programs(application_deadline);

-- ============================================
-- INTERNSHIP APPLICATIONS
-- ============================================
CREATE TABLE internship_applications (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL REFERENCES students(id),
    program_id TEXT NOT NULL REFERENCES internship_programs(id),
    application_date TEXT NOT NULL,
    cover_letter TEXT,
    additional_documents TEXT NOT NULL DEFAULT '[]',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'shortlisted', 'selected', 'rejected')),
    faculty_recommendation TEXT,
    interview_date TEXT,
    selection_date TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_ia_student_id ON internship_applications(student_id);
CREATE INDEX idx_ia_program_id ON internship_applications(program_id);
CREATE INDEX idx_ia_status ON internship_applications(status);
CREATE INDEX idx_ia_application_date ON internship_applications(application_date);

-- ============================================
-- INTERNSHIPS (active engagements)
-- ============================================
CREATE TABLE internships (
    id TEXT PRIMARY KEY,
    application_id TEXT NOT NULL REFERENCES internship_applications(id),
    mentor_id TEXT NOT NULL REFERENCES users(id),
    faculty_coordinator_id TEXT NOT NULL REFERENCES users(id),
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    objectives TEXT NOT NULL DEFAULT '[]',
    status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'ongoing', 'completed', 'terminated')),
    final_grade TEXT,
    certificate_issued INTEGER NOT NULL DEFAULT 0,
    credits_awarded INTEGER NOT NULL DEFAULT 4,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_i_application_id ON internships(application_id);
CREATE INDEX idx_i_mentor_id ON internships(mentor_id);
CREATE INDEX idx_i_faculty_coordinator_id ON internships(faculty_coordinator_id);
CREATE INDEX idx_i_status ON internships(status);

-- ============================================
-- LOGBOOK ENTRIES
-- ============================================
CREATE TABLE logbook_entries (
    id TEXT PRIMARY KEY,
    internship_id TEXT NOT NULL REFERENCES internships(id),
    date TEXT NOT NULL,
    hours_worked REAL NOT NULL,
    tasks_completed TEXT NOT NULL,
    learning_outcomes TEXT NOT NULL,
    challenges TEXT,
    mentor_feedback TEXT,
    attachments TEXT NOT NULL DEFAULT '[]',
    is_verified INTEGER NOT NULL DEFAULT 0,
    verified_by TEXT REFERENCES users(id),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_le_internship_id ON logbook_entries(internship_id);
CREATE INDEX idx_le_date ON logbook_entries(date);
CREATE INDEX idx_le_is_verified ON logbook_entries(is_verified);

-- ============================================
-- REPORTS
-- ============================================
CREATE TABLE reports (
    id TEXT PRIMARY KEY,
    internship_id TEXT NOT NULL REFERENCES internships(id),
    type TEXT NOT NULL CHECK (type IN ('weekly', 'monthly', 'final')),
    content TEXT NOT NULL,
    attachments TEXT NOT NULL DEFAULT '[]',
    submission_date TEXT NOT NULL,
    feedback TEXT,
    grade TEXT,
    is_approved INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_r_internship_id ON reports(internship_id);
CREATE INDEX idx_r_type ON reports(type);
CREATE INDEX idx_r_is_approved ON reports(is_approved);
CREATE INDEX idx_r_submission_date ON reports(submission_date);

-- ============================================
-- NOTIFICATIONS
-- ============================================
CREATE TABLE notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('info', 'warning', 'success', 'error')),
    is_read INTEGER NOT NULL DEFAULT 0,
    action_url TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_n_user_id ON notifications(user_id);
CREATE INDEX idx_n_is_read ON notifications(is_read);
CREATE INDEX idx_n_type ON notifications(type);

-- ============================================
-- PASSWORD RESETS
-- ============================================
CREATE TABLE password_resets (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    token TEXT NOT NULL UNIQUE,
    expires_at TEXT NOT NULL,
    used INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX idx_pr_token ON password_resets(token);
CREATE INDEX idx_pr_user_id ON password_resets(user_id);
