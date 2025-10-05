# Disable Email Verification in Appwrite

To enable instant registration without email confirmation, follow these steps:

## Manual Steps:

1. **Open Appwrite Console**
   - Go to your Appwrite Cloud Console: https://cloud.appwrite.io
   - Select your project

2. **Navigate to Auth Settings**
   - Click on "Auth" in the left sidebar
   - Click on "Settings" tab

3. **Disable Email Verification**
   - Find the "Email Verification" toggle
   - Turn OFF the email verification toggle
   - Click "Update" to save changes

## Alternative (if using self-hosted Appwrite):

1. Go to your Appwrite dashboard
2. Navigate to Auth > Settings
3. Disable "Email Verification"
4. Save the changes

## After Making Changes:

✅ Users can now register and immediately access their dashboard without email confirmation
✅ The registration flow will automatically log users in and redirect them to their role-specific dashboard
✅ No email verification required for instant access

## Registration Flow:
1. User fills out registration form
2. Account is created in Appwrite Auth
3. User document is created in database
4. Role-specific document is created (student/company)
5. User is automatically logged in
6. User is redirected to `/{role}/dashboard`

Example redirects:
- Students → `/student/dashboard`
- Companies → `/company/dashboard`  
- Faculty → `/faculty/dashboard`
- Admins → `/admin/dashboard`