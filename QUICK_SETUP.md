# 🚀 Quick Database Setup Guide

## Option 1: Automated Setup (Recommended)

### Step 1: Get Appwrite API Key
1. Go to [your Appwrite console](https://fra.cloud.appwrite.io/console/project-68e1f87b00206bba5dc1)
2. Navigate to **Settings > API Keys**
3. Click **Create API Key**
4. Name: "Database Setup Key"
5. Scopes: Select **Database**, **Storage** (full access)
6. Copy the generated API key

### Step 2: Add API Key to Environment
Edit `.env.local` and add:
```env
APPWRITE_API_KEY=your_api_key_here
```

### Step 3: Run Automated Setup
```bash
node scripts/setup-database.js
```

This will automatically create:
- ✅ All 10 collections with proper attributes
- ✅ All indexes for optimal query performance  
- ✅ Storage buckets for files and images
- ✅ Proper permissions for each collection

---

## Option 2: Manual Setup

If automated setup fails, follow these manual steps:

### 1. Create Collections

Go to [Database section](https://fra.cloud.appwrite.io/console/project-68e1f87b00206bba5dc1/databases/database-68e1f937000adfe341d5) in your Appwrite console.

#### Collection 1: Users (ID: `users`)
**Attributes:**
- `name` - String (255, required)
- `email` - Email (required) 
- `phone` - String (20, optional)
- `role` - Enum (student, faculty, admin, industry_partner, required)
- `profileImage` - URL (optional)
- `isActive` - Boolean (required, default: true)

**Indexes:**
- `email_index` - Unique on `email`
- `role_index` - Key on `role`

#### Collection 2: Students (ID: `students`)
**Attributes:**
- `userId` - String (50, required)
- `collegeId` - String (50, required)
- `rollNumber` - String (50, required)
- `semester` - Integer (required)
- `course` - String (100, required)
- `academicYear` - String (10, required)
- `cgpa` - Float (optional)
- `skills` - String Array (required)
- `resume` - URL (optional)
- `isEligibleForInternship` - Boolean (required, default: true)

**Indexes:**
- `roll_index` - Unique on `rollNumber`
- `user_index` - Key on `userId`

#### Collection 3: Companies (ID: `companies`)
**Attributes:**
- `name` - String (255, required)
- `industry` - String (100, required)
- `website` - URL (optional)
- `description` - String (2000, required)
- `address` - String (500, required)
- `contactPersonId` - String (50, required)
- `companySize` - Enum (startup, small, medium, large, enterprise, required)
- `isVerified` - Boolean (required, default: false)

#### Collection 4: Internship Programs (ID: `internship_programs`)
**Attributes:**
- `title` - String (255, required)
- `description` - String (2000, required)
- `companyId` - String (50, required)
- `duration` - Integer (required)
- `stipend` - Float (optional)
- `location` - String (100, required)
- `mode` - Enum (onsite, remote, hybrid, required)
- `requiredSkills` - String Array (required)
- `eligibleCourses` - String Array (required)
- `maxPositions` - Integer (required, default: 1)
- `applicationDeadline` - DateTime (required)
- `startDate` - DateTime (required)
- `endDate` - DateTime (required)
- `status` - Enum (draft, published, closed, completed, required, default: draft)

### 2. Create Storage Buckets

#### Bucket 1: Documents (ID: `documents`)
- **Permissions**: Read/Create/Update/Delete for Users
- **File Security**: Enabled
- **Max Size**: 10MB
- **Extensions**: pdf, doc, docx, txt, jpg, jpeg, png

#### Bucket 2: Profile Images (ID: `profile_images`)
- **Permissions**: Read/Create/Update/Delete for Users
- **File Security**: Enabled
- **Max Size**: 5MB
- **Extensions**: jpg, jpeg, png, webp

### 3. Enable Authentication
1. Go to **Auth** in your Appwrite console
2. Enable **Email/Password** authentication
3. Set password policy to minimum 8 characters

---

## ✅ Verification Steps

After setup (automated or manual):

1. **Check Collections**: Verify all collections appear in Appwrite console
2. **Test App**: Run `npm run dev` and visit `http://localhost:3001`
3. **Create Test User**: Try registering a new account
4. **Browse Dashboards**: Login and check different role dashboards

## 🐛 Troubleshooting

**Script fails with permission error:**
- Ensure API key has Database and Storage permissions
- Try manual setup instead

**Collections already exist:**
- Delete existing collections from console first
- Or modify script to skip existing collections

**Authentication not working:**
- Check if Email/Password auth is enabled in Appwrite
- Verify environment variables are correct

**Need Help?**
- Check the full `SETUP.md` for detailed instructions
- All environment variables are already configured
- Database schema is production-ready

---

## 🎯 What's Next?

Once database is set up:
1. ✅ **Register Test Accounts** for different roles
2. ✅ **Explore Dashboards** for each user type
3. ✅ **Test Features** like logbook entries and applications
4. ✅ **Deploy to Production** using `DEPLOYMENT.md`

Your Prashiskshan platform will be fully functional! 🚀