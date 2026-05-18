# Production Setup Guide

This guide explains how to set up the Onside application in production with demo credentials.

## Prerequisites

- Node.js 18+ installed
- Access to a PostgreSQL database (e.g., Supabase)
- Database connection string (with connection pooling for Vercel)

## Setup Steps

### 1. Configure Environment Variables

Set the following environment variables in your production environment (Vercel, Railway, etc.):

```bash
DATABASE_URL="postgresql://..."
AUTH_SECRET="your-secret-key"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://your-domain.com"
AUTH_TRUST_HOST="true"
```

### 2. Initialize Database

Run these commands in order:

```bash
# Generate Prisma Client
npx prisma generate

# Create database tables
npx prisma db push

# Seed demo users
npm run setup:production
```

### 3. Verify Setup

Check the health endpoint:

```bash
curl https://your-domain.com/api/health/database
```

Expected response:
```json
{
  "database": "connected",
  "userCount": 3,
  "demoUsersPresent": true,
  "demoUsersFound": [
    "admin@onside.ai",
    "manager@onside.ai",
    "employee@onside.ai"
  ],
  "timestamp": "2026-05-19T..."
}
```

## Demo Credentials

After setup, you can log in with:

- **Admin**: `admin@onside.ai` / `password123`
- **Manager**: `manager@onside.ai` / `password123`
- **Employee**: `employee@onside.ai` / `password123`

## Troubleshooting

### Database Connection Failed

**Error**: `Cannot connect to database`

**Solution**:
1. Verify `DATABASE_URL` is set correctly
2. For Vercel, use Supabase connection pooler URL (port 6543)
3. Ensure database allows connections from your deployment platform

### Tables Not Found

**Error**: `Database tables not found`

**Solution**:
```bash
npx prisma db push
```

### Demo Users Already Exist

The script is idempotent - it will skip creating users that already exist.

## Supabase Connection Pooling

For Vercel deployments, use the connection pooler URL:

```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

Get this from: Supabase Dashboard → Settings → Database → Connection Pooling

## Automated Setup (CI/CD)

Add to your deployment pipeline:

```yaml
# Example for Vercel
build:
  - npx prisma generate
  - npx prisma db push --accept-data-loss
  - npm run setup:production
  - npm run build
```

## Security Notes

- Change demo passwords in production
- Use strong secrets for `AUTH_SECRET`
- Enable SSL for database connections
- Restrict database access to deployment IPs

## Health Check Endpoint

Use `/api/health/database` for monitoring:

```bash
# Check database status
curl https://your-domain.com/api/health/database

# Response when healthy
{
  "database": "connected",
  "userCount": 3,
  "demoUsersPresent": true
}

# Response when unhealthy (500 status)
{
  "database": "disconnected",
  "error": "Connection timeout"
}
```

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Verify environment variables are set
3. Test database connection locally
4. Review Supabase connection settings
