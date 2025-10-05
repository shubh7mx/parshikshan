# Prashiskshan - Setup Guide

## Appwrite Database Setup

Since you have provided your Appwrite credentials, follow these steps to set up the database collections:

### 1. Access Appwrite Console
- Go to [https://fra.cloud.appwrite.io](https://fra.cloud.appwrite.io)
- Login to your account
- Select your project: `68e1f87b00206bba5dc1`

### 2. Create Database
1. Go to **Databases** in the left sidebar
2. Click **Create Database**
3. Name it: `prashiskshan_db`
4. Copy the Database ID and update `.env.local`:
   ```
   NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id_here
   ```

### 3. Create Collections

#### Users Collection
1. Click **Create Collection**
2. Collection ID: `users`
3. Name: `Users`
4. Add these attributes:
   - `name` (String, Required, Size: 255)
   - `email` (Email, Required, Size: 320)
   - `phone` (String, Optional, Size: 20)
   - `role` (Enum, Required, Elements: ['student', 'faculty', 'admin', 'industry_partner'])
   - `profileImage` (URL, Optional)
   - `isActive` (Boolean, Required, Default: true)

5. Set Permissions:
   - **Read**: `users`, `admins`
   - **Create**: `guests`, `users`
   - **Update**: `users` (own documents), `admins`
   - **Delete**: `admins`

6. Create Indexes:
   - Index on `email` (unique)
   - Index on `role`
   - Index on `isActive`

#### Colleges Collection
1. Create Collection: `colleges`
2. Add attributes:
   - `name` (String, Required, Size: 255)
   - `code` (String, Required, Size: 20)
   - `address` (String, Required, Size: 500)
   - `contactEmail` (Email, Required)
   - `contactPhone` (String, Required, Size: 20)
   - `principalId` (String, Required, Size: 50)
   - `isVerified` (Boolean, Required, Default: false)
   - `establishedYear` (Integer, Required)
   - `affiliatedUniversity` (String, Required, Size: 255)

3. Create Indexes:
   - Index on `code` (unique)
   - Index on `isVerified`
   - Index on `principalId`

#### Students Collection
1. Create Collection: `students`
2. Add attributes:
   - `userId` (String, Required, Size: 50)
   - `collegeId` (String, Required, Size: 50)
   - `rollNumber` (String, Required, Size: 50)
   - `semester` (Integer, Required)
   - `course` (String, Required, Size: 100)
   - `academicYear` (String, Required, Size: 10)
   - `cgpa` (Float, Optional)
   - `skills` (String Array, Required)
   - `resume` (URL, Optional)
   - `isEligibleForInternship` (Boolean, Required, Default: true)

3. Create Indexes:
   - Index on `rollNumber` (unique)
   - Index on `userId`
   - Index on `collegeId`
   - Index on `isEligibleForInternship`

#### Companies Collection
1. Create Collection: `companies`
2. Add attributes:
   - `name` (String, Required, Size: 255)
   - `industry` (String, Required, Size: 100)
   - `website` (URL, Optional)
   - `description` (String, Required, Size: 2000)
   - `address` (String, Required, Size: 500)
   - `contactPersonId` (String, Required, Size: 50)
   - `companySize` (Enum, Required, Elements: ['startup', 'small', 'medium', 'large', 'enterprise'])
   - `isVerified` (Boolean, Required, Default: false)
   - `registrationNumber` (String, Optional, Size: 50)

3. Create Indexes:
   - Index on `industry`
   - Index on `companySize`
   - Index on `isVerified`
   - Index on `contactPersonId`

#### InternshipPrograms Collection
1. Create Collection: `internship_programs`
2. Add attributes:
   - `title` (String, Required, Size: 255)
   - `description` (String, Required, Size: 2000)
   - `companyId` (String, Required, Size: 50)
   - `duration` (Integer, Required)
   - `stipend` (Float, Optional)
   - `location` (String, Required, Size: 100)
   - `mode` (Enum, Required, Elements: ['onsite', 'remote', 'hybrid'])
   - `requiredSkills` (String Array, Required)
   - `eligibleCourses` (String Array, Required)
   - `minimumCGPA` (Float, Optional)
   - `maxPositions` (Integer, Required, Default: 1)
   - `applicationDeadline` (DateTime, Required)
   - `startDate` (DateTime, Required)
   - `endDate` (DateTime, Required)
   - `status` (Enum, Required, Default: 'draft', Elements: ['draft', 'published', 'closed', 'completed'])

3. Create Indexes:
   - Index on `companyId`
   - Index on `status`
   - Index on `mode`
   - Index on `location`
   - Index on `applicationDeadline`

#### InternshipApplications Collection
1. Create Collection: `internship_applications`
2. Add attributes:
   - `studentId` (String, Required, Size: 50)
   - `programId` (String, Required, Size: 50)
   - `applicationDate` (DateTime, Required)
   - `coverLetter` (String, Optional, Size: 2000)
   - `additionalDocuments` (String Array, Optional)
   - `status` (Enum, Required, Default: 'pending', Elements: ['pending', 'shortlisted', 'selected', 'rejected'])
   - `facultyRecommendation` (String, Optional, Size: 1000)
   - `interviewDate` (DateTime, Optional)
   - `selectionDate` (DateTime, Optional)

3. Create Indexes:
   - Index on `studentId`
   - Index on `programId`
   - Index on `status`
   - Index on `applicationDate`

#### Internships Collection
1. Create Collection: `internships`
2. Add attributes:
   - `applicationId` (String, Required, Size: 50)
   - `mentorId` (String, Required, Size: 50)
   - `facultyCoordinatorId` (String, Required, Size: 50)
   - `startDate` (DateTime, Required)
   - `endDate` (DateTime, Required)
   - `objectives` (String Array, Required)
   - `status` (Enum, Required, Default: 'not_started', Elements: ['not_started', 'ongoing', 'completed', 'terminated'])
   - `finalGrade` (String, Optional, Size: 10)
   - `certificateIssued` (Boolean, Required, Default: false)
   - `creditsAwarded` (Integer, Required, Default: 4)

3. Create Indexes:
   - Index on `applicationId`
   - Index on `mentorId`
   - Index on `facultyCoordinatorId`
   - Index on `status`

#### LogbookEntries Collection
1. Create Collection: `logbook_entries`
2. Add attributes:
   - `internshipId` (String, Required, Size: 50)
   - `date` (DateTime, Required)
   - `hoursWorked` (Float, Required)
   - `tasksCompleted` (String, Required, Size: 2000)
   - `learningOutcomes` (String, Required, Size: 2000)
   - `challenges` (String, Optional, Size: 1000)
   - `mentorFeedback` (String, Optional, Size: 1000)
   - `attachments` (String Array, Optional)
   - `isVerified` (Boolean, Required, Default: false)
   - `verifiedBy` (String, Optional, Size: 50)

3. Create Indexes:
   - Index on `internshipId`
   - Index on `date`
   - Index on `isVerified`

#### Reports Collection
1. Create Collection: `reports`
2. Add attributes:
   - `internshipId` (String, Required, Size: 50)
   - `type` (Enum, Required, Elements: ['weekly', 'monthly', 'final'])
   - `content` (String, Required, Size: 5000)
   - `attachments` (String Array, Optional)
   - `submissionDate` (DateTime, Required)
   - `feedback` (String, Optional, Size: 1000)
   - `grade` (String, Optional, Size: 10)
   - `isApproved` (Boolean, Required, Default: false)

3. Create Indexes:
   - Index on `internshipId`
   - Index on `type`
   - Index on `isApproved`
   - Index on `submissionDate`

#### Notifications Collection
1. Create Collection: `notifications`
2. Add attributes:
   - `userId` (String, Required, Size: 50)
   - `title` (String, Required, Size: 255)
   - `message` (String, Required, Size: 1000)
   - `type` (Enum, Required, Elements: ['info', 'warning', 'success', 'error'])
   - `isRead` (Boolean, Required, Default: false)
   - `actionUrl` (String, Optional, Size: 500)

3. Create Indexes:
   - Index on `userId`
   - Index on `isRead`
   - Index on `type`

### 4. Create Storage Buckets

#### Documents Bucket
1. Go to **Storage** in the left sidebar
2. Click **Create Bucket**
3. Bucket ID: `documents`
4. Name: `Documents`
5. Permissions:
   - **Read**: `users`
   - **Create**: `users`
   - **Update**: `users` (own files)
   - **Delete**: `users` (own files), `admins`
6. File Security: Enabled
7. Max File Size: 10MB
8. Allowed File Extensions: `pdf,doc,docx,txt,jpg,jpeg,png`

#### Profile Images Bucket
1. Create Bucket ID: `profile_images`
2. Name: `Profile Images`
3. Similar permissions as above
4. Max File Size: 5MB
5. Allowed File Extensions: `jpg,jpeg,png,webp`

### 5. Update Environment Variables

After creating the database and collections, update your `.env.local` file:

```env
# Replace with your actual Database ID
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id_here

# Collection IDs (use the ones you created)
NEXT_PUBLIC_USERS_COLLECTION_ID=users
NEXT_PUBLIC_COLLEGES_COLLECTION_ID=colleges
NEXT_PUBLIC_STUDENTS_COLLECTION_ID=students
NEXT_PUBLIC_COMPANIES_COLLECTION_ID=companies
NEXT_PUBLIC_INTERNSHIP_PROGRAMS_COLLECTION_ID=internship_programs
NEXT_PUBLIC_INTERNSHIP_APPLICATIONS_COLLECTION_ID=internship_applications
NEXT_PUBLIC_INTERNSHIPS_COLLECTION_ID=internships
NEXT_PUBLIC_LOGBOOK_ENTRIES_COLLECTION_ID=logbook_entries
NEXT_PUBLIC_REPORTS_COLLECTION_ID=reports
NEXT_PUBLIC_NOTIFICATIONS_COLLECTION_ID=notifications

# Storage Bucket IDs
NEXT_PUBLIC_DOCUMENTS_BUCKET_ID=documents
NEXT_PUBLIC_PROFILE_IMAGES_BUCKET_ID=profile_images
```

### 6. Authentication Setup

1. Go to **Auth** in Appwrite console
2. Enable **Email/Password** authentication
3. Configure your authentication settings:
   - Email confirmation: Optional (for demo)
   - Password policy: Minimum 8 characters
   - Session length: 7 days

### 7. Restart Development Server

After setting up everything:
```bash
npm run dev
```

Your application should now be fully functional with all the database collections and authentication properly configured!

## Testing the Application

Once everything is set up, you can:

1. Visit `http://localhost:3000`
2. Create test accounts for different roles
3. Explore the different dashboards and features
4. Test the internship application flow

The application includes comprehensive features for all stakeholders in the internship management process.