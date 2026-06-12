# Migration: Appwrite → Cloudflare (D1 + R2 + Pages/Workers)

## Overview

Migrate Prashiskshan from Appwrite BaaS to Cloudflare's stack:
- **Database**: Appwrite Database → Cloudflare D1 (SQLite at the edge)
- **Auth**: Appwrite Account → JWT-based auth with D1 user store
- **Storage**: Appwrite Storage → Cloudflare R2 (S3-compatible)
- **Hosting**: Next.js standalone → Cloudflare Pages + Workers
- **Functions**: Appwrite Functions (unused) → Cloudflare Workers

The `wrangler` CLI is already in devDependencies (`^4.100.0`), confirming this direction is intended.

---

## Phase 1: Environment & Config

### 1.1 Remove Appwrite dependencies
- `package.json`: Remove `"appwrite": "^21.0.0"` and `"node-appwrite": "^20.0.0"`
- Add: `"@cloudflare/workers-types"`, `"jose"` (JWT), `"bcryptjs"` (password hashing)

### 1.2 Create Cloudflare config
- Create `wrangler.jsonc` (Pages + D1 bindings + R2 bindings) with:
  ```json
  {
    "d1_databases": [{ "binding": "DB", "database_name": "prashiskshan-db", "database_id": "prashiskshan-db" }],
    "r2_buckets": [{ "binding": "DOCUMENTS", "bucket_name": "prashiskshan-documents" }, { "binding": "PROFILE_IMAGES", "bucket_name": "prashiskshan-profile-images" }]
  }
  ```

### 1.3 Replace environment variables
Consolidate from 18+ `NEXT_PUBLIC_*` Appwrite vars to Cloudflare vars:
- `JWT_SECRET` (server-side only)
- `NEXT_PUBLIC_API_URL` (Workers endpoint)
- Remove all collection-level env vars (tables are in D1 schema, not env)

### 1.4 Update Next.js config
- `next.config.js` / `next.config.ts`: Remove `cloud.appwrite.io` from `images.domains`
- `output: 'standalone'` → Remove (Pages handles this)
- Add `@cloudflare/next-on-pages` adapter config

---

## Phase 2: Database Schema (D1 Migration)

### 2.1 Create D1 SQL schema
File: `migrations/0001_initial.sql`

Convert 10 Appwrite collections → 10 SQL tables with proper constraints:

| Appwrite Collection | D1 Table | Key differences |
|---|---|---|
| `users` | `users` | Add `password_hash` TEXT |
| `colleges` | `colleges` | Foreign key `principal_id` → `users(id)` |
| `students` | `students` | Foreign keys to `users` and `colleges` |
| `companies` | `companies` | Foreign key `contact_person_id` → `users(id)` |
| `internship_programs` | `internship_programs` | Foreign key to `companies` |
| `internship_applications` | `internship_applications` | Foreign keys to `students`, `internship_programs` |
| `internships` | `internships` | Foreign keys to `applications`, `users` (mentor, faculty) |
| `logbook_entries` | `logbook_entries` | Foreign key to `internships` |
| `reports` | `reports` | Foreign key to `internships` |
| `notifications` | `notifications` | Foreign key to `users` |

- Arrays (`skills`, `eligibleCourses`, `objectives`, `attachments`) → JSON TEXT columns
- `enum` types → TEXT with CHECK constraints
- `$createdAt` / `$updatedAt` → `created_at` / `updated_at` with DEFAULT CURRENT_TIMESTAMP
- `$id` → `id` TEXT PRIMARY KEY (UUIDs)
- Appwrite's `'unique()'` → `crypto.randomUUID()` in application code

### 2.2 Create indexes mirroring Appwrite indexes
All indexes from the setup script (`email_index`, `role_index`, `user_index`, `college_index`, `company_index`, `status_index`, `internship_index`, etc.)

### 2.3 Database initialization
File: `scripts/setup-d1.js` — executes migration via `wrangler d1 execute prashiskshan-db --file=migrations/0001_initial.sql`

---

## Phase 3: Database Access Layer

### 3.1 New file: `src/lib/d1.ts`
The core D1 client replacing `src/lib/appwrite.ts`:
```typescript
export function getDB(): D1Database  // via process.env.DB or platform context
export function uuid(): string       // crypto.randomUUID()
```

### 3.2 Rewrite: `src/lib/database.ts`
Replace `DatabaseService` class (Appwrite SDK) with D1 SQL:

- `create<T>(data)` → `INSERT INTO {table} ... RETURNING *`
- `getById<T>(id)` → `SELECT * FROM {table} WHERE id = ?`
- `update<T>(id, data)` → `UPDATE {table} SET ... WHERE id = ? RETURNING *`
- `delete(id)` → `DELETE FROM {table} WHERE id = ?`
- `list<T>(queries, pagination)` → `SELECT * FROM {table} WHERE ... LIMIT ? OFFSET ? ORDER BY ?`
- `search<T>(term, fields, queries)` → `SELECT * FROM {table} WHERE (field1 LIKE ? OR field2 LIKE ?) AND ...`

Specialized methods like `getStudentWithDetails` become JOIN queries instead of N+1 Appwrite fetches — one SELECT with JOINs replaces 3 separate document fetches.

### 3.3 Rewrite: `src/lib/database-operations.ts`
Same transformation for `DatabaseOperations` static class and domain operations (`UserOperations`, `InternshipOperations`, `ReportOperations`, `NotificationOperations`, `SkillOperations`, `CreditOperations`, `AnalyticsOperations`, `FileOperations`).

---

## Phase 4: Authentication Migration

### 4.1 New file: `src/lib/jwt.ts`
Replace Appwrite Sessions with JWT using `jose`:
- `createToken(user)` — SignJWT with user id + role, 24h expiry
- `verifyToken(token)` — jwtVerify, return payload or null
- `setAuthCookie(token)` / `clearAuthCookie()` — httpOnly, secure, sameSite cookies

### 4.2 New file: `src/lib/password.ts`
Replace Appwrite's built-in password handling with `bcryptjs`:
- `hashPassword(password)` / `verifyPassword(password, hash)`

### 4.3 Rewrite: `src/lib/auth-actions.ts`
- `registerUser()` → Hash password, INSERT into users, create JWT, set cookie
- `loginUser()` → SELECT user by email, verify bcrypt hash, create JWT, set cookie
- `logoutUser()` → Clear auth cookie
- `resetPassword()` → Generate reset token, store in `password_resets` table, send email
- `completePasswordReset()` → Verify token, hash new password, UPDATE user
- `getCurrentUser()` → Verify JWT from cookie, SELECT user from D1
- `checkAuth()` / `withAuthCheck()` → Same logic, using JWT verification

### 4.4 Rewrite: `src/contexts/auth-context.tsx`
- `login()` → Call `/api/auth/login` endpoint (calls server action)
- `register()` → Call `/api/auth/register` endpoint
- `logout()` → Call `/api/auth/logout` endpoint
- Remove direct Appwrite SDK calls entirely
- `loginDemo()` → Keep as-is (mock user, no real auth)
- `getUserProfile()` → Call D1-based user fetch endpoint

### 4.5 Rewrite: `src/middleware.ts`
Change from checking `a_session_{PROJECT_ID}` cookie to verifying JWT cookie. Also fix the `'company'` → `'industry_partner'` role inconsistency.

### 4.6 Rewrite: `src/components/auth/protected-route.tsx`
No Appwrite-specific changes needed — reads from auth context which maintains same `user`, `isLoading`, `isAuthenticated` shape.

---

## Phase 5: File Storage Migration

### 5.1 New file: `src/lib/r2.ts`
Replace Appwrite Storage with R2 (S3-compatible):
- `uploadFile(file, bucket, folder?)` → R2 PUT
- `deleteFile(bucket, fileId)` → R2 DELETE
- `getFileUrl(bucket, fileId)` → Public R2 URL

### 5.2 Rewrite: `FileOperations` in `database-operations.ts`
`uploadFile()` and `deleteFile()` → Use R2 instead of Appwrite Storage

### 5.3 Rewrite: `src/app/api/files/route.ts`
GET/POST/DELETE handlers → Use R2 bindings

### 5.4 Update: `src/app/profile/page.tsx`
Wire up the profile image upload stub to call the R2 upload endpoint.

---

## Phase 6: Page Updates

Only 3 pages have actual database calls (the rest use mock data):

### 6.1 `src/app/student/dashboard/page.tsx`
Replace `databases.*` direct calls with D1 service calls (`internshipProgramService.list(...)`, etc.)

### 6.2 `src/app/company/dashboard/page.tsx`
Same transformation — replace all `databases.*` calls with D1 service equivalents.

### 6.3 `src/app/faculty/dashboard/page.tsx`
Remove unused `databases, ID` import from Appwrite (already uses only mock data, has dead import).

---

## Phase 7: Notification System Cleanup

### 7.1 Consolidate
- One `src/lib/notifications.ts` querying D1
- One `notification-provider.tsx` using it
- Remove `notification-center.tsx` (unused duplicate)
- Rewrite `notifications/page.tsx` to use the provider instead of own mock data

### 7.2 Remove Appwrite Functions
Delete the `functions` export from `appwrite.ts` — it's never used anywhere.

---

## Phase 8: Deployment Configuration

### 8.1 Create `wrangler.jsonc`
```json
{
  "name": "prashiskshan",
  "pages_build_output_dir": ".vercel/output/static",
  "compatibility_date": "2024-12-01",
  "d1_databases": [
    { "binding": "DB", "database_name": "prashiskshan-db", "database_id": "prashiskshan-db" }
  ],
  "r2_buckets": [
    { "binding": "DOCUMENTS", "bucket_name": "prashiskshan-documents" },
    { "binding": "PROFILE_IMAGES", "bucket_name": "prashiskshan-profile-images" }
  ]
}
```

### 8.2 Update `next.config.js`
- Remove `output: 'standalone'`
- Add `@cloudflare/next-on-pages` webpack config
- Remove `images.domains: ['cloud.appwrite.io']`

### 8.3 Update `package.json` scripts
```json
{
  "pages:dev": "wrangler pages dev .vercel/output/static --d1=DB --r2=DOCUMENTS --r2=PROFILE_IMAGES",
  "pages:build": "npx @cloudflare/next-on-pages",
  "pages:deploy": "wrangler pages deploy .vercel/output/static",
  "db:migrate": "wrangler d1 execute prashiskshan-db --file=migrations/0001_initial.sql",
  "db:seed": "node scripts/seed-d1.js"
}
```

### 8.4 Docker/PM2 (optional removal)
Dockerfile, docker-compose.yml, ecosystem.config.js are no longer needed for primary deployment but may be kept for alternate hosting.

---

## Phase 9: Cleanup

### 9.1 Files to DELETE
- `src/lib/appwrite.ts`
- `scripts/setup-database.js`
- `scripts/setup-permissions.js`
- `scripts/verify-permissions.js`
- `scripts/create-default-college.js` (rewrite for D1 or remove)
- `scripts/add-appwrite-user-id.js`
- `scripts/disable-email-verification.js`
- `scripts/fix-missing-attributes.js`

### 9.2 Files to CREATE
- `migrations/0001_initial.sql`
- `src/lib/d1.ts`
- `src/lib/jwt.ts`
- `src/lib/password.ts`
- `src/lib/r2.ts`
- `scripts/seed-d1.js`

### 9.3 Files to REWRITE (dependency order)
1. `src/types/index.ts` — `$id` → `id`, `$createdAt` → `createdAt`, `$updatedAt` → `updatedAt`
2. `src/lib/database.ts`
3. `src/lib/database-operations.ts`
4. `src/lib/auth-actions.ts`
5. `src/contexts/auth-context.tsx`
6. `src/middleware.ts`
7. `src/app/student/dashboard/page.tsx`
8. `src/app/company/dashboard/page.tsx`
9. `src/app/faculty/dashboard/page.tsx`
10. `src/app/api/files/route.ts`
11. `src/components/notifications/notification-provider.tsx`
12. `src/components/files/file-upload.tsx` (minimal changes)
13. `next.config.js`
14. `next.config.ts`
15. `package.json`

---

## Verification

1. `wrangler d1 execute prashiskshan-db --command "SELECT name FROM sqlite_master WHERE type='table'"` — all 10 tables exist
2. Auth flow: Register → Login → JWT in cookie → Protected route access → Logout
3. CRUD: Create/read/update/delete in every collection via the D1 service layer
4. File upload: Upload PDF to R2, verify public URL, delete
5. JOINs: `getStudentWithDetails` returns user + college in one query
6. Pagination: LIMIT/OFFSET works correctly
7. Search: LIKE queries return expected results
8. Build: `npx @cloudflare/next-on-pages && npx wrangler pages dev` runs without errors
9. TypeScript: No type errors after renaming `$id` → `id`
10. All mock-data pages still render (they don't hit the DB)
