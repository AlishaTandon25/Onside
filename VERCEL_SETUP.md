# Vercel Production Setup Guide

## Issue
Login with credentials is not working on Vercel because the production database hasn't been seeded with demo users.

## Solution

### Option 1: Seed from Local Machine (Recommended)

1. **Ensure your `.env` file has the production DATABASE_URL**:
   ```bash
   DATABASE_URL="postgresql://postgres:Atomberg%402506@db.sehcsxrywibilltqjzbk.supabase.co:5432/postgres?sslmode=require&sslaccept=accept_invalid_certs&uselibpqcompat=true"
   ```

2. **Run the seed script**:
   ```bash
   npm run db:seed
   ```

3. **Test login on Vercel**:
   - Go to https://onside-six.vercel.app/login
   - Use credentials:
     - Admin: `admin@onside.ai` / `password123`
     - Manager: `manager@onside.ai` / `password123`
     - Employee: `employee@onside.ai` / `password123`

### Option 2: Seed via Vercel CLI

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Link your project**:
   ```bash
   vercel link
   ```

4. **Pull environment variables**:
   ```bash
   vercel env pull .env.production
   ```

5. **Run seed with production env**:
   ```bash
   DATABASE_URL="your-production-db-url" npm run db:seed
   ```

### Option 3: One-Time Vercel Function

If you want to seed directly from Vercel, you can create a temporary API endpoint:

1. Create `app/api/admin/seed/route.ts` (temporarily)
2. Deploy to Vercel
3. Visit `https://onside-six.vercel.app/api/admin/seed`
4. Delete the endpoint after seeding

**⚠️ Security Warning**: Delete this endpoint immediately after use!

## Verify Environment Variables in Vercel

Make sure these are set correctly in Vercel Dashboard → Settings → Environment Variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `DATABASE_URL` | Your Supabase connection string | Production, Preview, Development |
| `AUTH_SECRET` | `VvQ19xPSpFJVoNDwFCn88Xin+CJ+56EBQa2m3YH1AiA=` | Production, Preview, Development |
| `NEXTAUTH_SECRET` | `VvQ19xPSpFJVoNDwFCn88Xin+CJ+56EBQa2m3YH1AiA=` | Production, Preview, Development |
| `NEXTAUTH_URL` | `https://onside-six.vercel.app` | Production only |
| `AUTH_TRUST_HOST` | `true` | Production, Preview, Development |

## After Seeding

Once seeded, you should be able to log in with:
- **Admin**: admin@onside.ai / password123
- **Manager**: manager@onside.ai / password123  
- **Employee**: employee@onside.ai / password123

## Troubleshooting

### Still getting "Invalid email or password"?

1. **Check database connection**:
   - Verify DATABASE_URL is correct in Vercel
   - Test connection from local machine

2. **Check if users exist**:
   ```bash
   # Connect to your database and run:
   SELECT email, role FROM "User";
   ```

3. **Check Vercel logs**:
   - Go to Vercel Dashboard → Deployments → [Latest] → Functions
   - Look for auth-related errors

4. **Verify password hashing**:
   - The seed script uses bcrypt with 10 rounds
   - Password is `password123`

### Database connection issues?

Make sure your Supabase database:
- Allows connections from Vercel IPs
- Has SSL enabled
- Connection string includes `sslmode=require`
