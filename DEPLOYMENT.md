# Production Deployment Guide

This guide covers different deployment options for the Prashiskshan internship management platform.

## 🚀 Deployment Options

### 1. Vercel (Recommended)

The easiest way to deploy your Next.js app is with [Vercel](https://vercel.com/):

#### Quick Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/prashiskshan)

#### Manual Deployment

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Environment Variables**
   Set up environment variables in your Vercel dashboard:
   - `NEXT_PUBLIC_APPWRITE_ENDPOINT`
   - `NEXT_PUBLIC_APPWRITE_PROJECT_ID`
   - `NEXT_PUBLIC_DATABASE_ID`
   - All other required environment variables

### 2. Docker Deployment

#### Build and Run Locally
```bash
# Build the Docker image
docker build -t prashiskshan .

# Run the container
docker run -p 3000:3000 --env-file .env.production prashiskshan
```

#### Docker Compose
```bash
# Create .env file with production values
cp .env.example .env

# Start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

### 3. Traditional Server Deployment

#### Prerequisites
- Node.js 18+ installed
- PM2 for process management (optional but recommended)

#### Steps
```bash
# Install dependencies
npm install --production

# Build the application
npm run build

# Start with PM2 (recommended)
npm install -g pm2
pm2 start ecosystem.config.js

# Or start directly
npm start
```

## 🔧 Environment Configuration

### Required Environment Variables

Create a `.env.production` file with:

```env
NODE_ENV=production

# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id

# Database Configuration
NEXT_PUBLIC_DATABASE_ID=prashiskshan-db
NEXT_PUBLIC_USERS_COLLECTION_ID=users
NEXT_PUBLIC_INTERNSHIPS_COLLECTION_ID=internships
NEXT_PUBLIC_APPLICATIONS_COLLECTION_ID=applications
NEXT_PUBLIC_LOGBOOK_COLLECTION_ID=logbook_entries
NEXT_PUBLIC_REPORTS_COLLECTION_ID=reports
NEXT_PUBLIC_NOTIFICATIONS_COLLECTION_ID=notifications
NEXT_PUBLIC_FILES_COLLECTION_ID=files

# Storage Configuration
NEXT_PUBLIC_STORAGE_BUCKET_ID=files

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 🛡️ Security Considerations

### SSL/TLS
- **Always use HTTPS** in production
- Configure SSL certificates (Let's Encrypt for free certificates)
- Enable HSTS headers (already configured in next.config.js)

### Environment Variables
- **Never commit** sensitive environment variables
- Use environment variable management services
- Rotate API keys regularly

### Appwrite Security
- Configure proper CORS settings
- Set up appropriate database permissions
- Enable rate limiting
- Use API key restrictions

## 📊 Monitoring & Performance

### Health Checks
The app includes a health check endpoint at `/api/health`:
```bash
curl https://your-domain.com/api/health
```

### Performance Monitoring
Consider adding:
- **Vercel Analytics** (if using Vercel)
- **Google Analytics** or **Plausible**
- **Sentry** for error tracking
- **LogRocket** for session recording

### Database Optimization
- Monitor Appwrite database performance
- Set up proper indexes
- Configure backup strategies

## 🚦 CI/CD Pipeline

### GitHub Actions Example
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## 🔄 Updates & Maintenance

### Rolling Updates
- Use blue-green deployment for zero downtime
- Test in staging environment first
- Have rollback plan ready

### Database Migrations
- Plan database schema changes carefully
- Use Appwrite's migration features
- Backup data before major changes

### Backup Strategy
- Regular database backups
- File storage backups
- Environment configuration backups

## 📱 Domain & SSL

### Custom Domain Setup
1. **Purchase domain** from provider (Namecheap, GoDaddy, etc.)
2. **Configure DNS** to point to your deployment platform
3. **Set up SSL certificate** (usually automatic with modern platforms)
4. **Update environment variables** with production domain

### Subdomain Configuration
Consider using subdomains for different environments:
- `app.yourdomain.com` - Production
- `staging.yourdomain.com` - Staging
- `dev.yourdomain.com` - Development

## 🆘 Troubleshooting

### Common Issues

**Build Failures**
- Check all environment variables are set
- Ensure Node.js version compatibility
- Clear build cache: `npm run build -- --no-cache`

**Runtime Errors**
- Check application logs
- Verify Appwrite connectivity
- Ensure all required collections exist

**Performance Issues**
- Enable compression (already configured)
- Optimize images and assets
- Monitor database query performance

### Support
- Check deployment platform documentation
- Review Appwrite status page
- Monitor application health endpoints