# CRITICAL FIX: Vercel Cannot Connect to Supabase Database

## The Problem
Vercel is getting this error:
```
Can't reach database server at db.sehcsxrywibilltqjzbk.supabase.co
```

This means Vercel cannot connect to your Supabase database.

## Solution: Fix Supabase Connection

### Step 1: Enable IPv4 Add-on in Supabase (REQUIRED for Vercel)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `db.sehcsxrywibilltqjzbk.supabase.co`
3. Go to **Settings** → **Add-ons**
4. Find **"IPv4 Address"** add-on
5. Click **Enable** (this may require upgrading to a paid plan)

**Why?** Vercel uses IPv4 addresses, but Supabase free tier only supports IPv6 by default.

### Step 2: Alternative - Use Connection Pooling

If you can't enable IPv4, use Supabase's connection pooler:

1. Go to Supabase Dashboard → **Settings** → **Database**
2. Find **Connection Pooling** section
3. Copy the **Connection string** (it will look like: `postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres`)
4. Use this connection string in Vercel instead

### Step 3: Update Vercel Environment Variable

1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Select your project: **onside-six**
3. Go to **Settings** → **Environment Variables**
4. Find or add `DATABASE_URL`
5. Set the value to your **connection pooling URL**:

```
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

**Important parameters for Vercel:**
- `pgbouncer=true` - Required for connection pooling
- `connection_limit=1` - Prevents connection exhaustion
- Port `6543` - Connection pooler port (not `5432`)

### Step 4: Get Your Correct Connection String

Here's how to get the right connection string:

#### Option A: Transaction Mode (Recommended for Vercel)
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

#### Option B: Session Mode (if you need full Prisma features)
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

### Step 5: Update Your Vercel Environment Variables

Set these in Vercel Dashboard → Settings → Environment Variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `DATABASE_URL` | Your pooler connection string | Production, Preview, Development |
| `AUTH_SECRET` | `VvQ19xPSpFJVoNDwFCn88Xin+CJ+56EBQa2m3YH1AiA=` | All |
| `NEXTAUTH_SECRET` | `VvQ19xPSpFJVoNDwFCn88Xin+CJ+56EBQa2m3YH1AiA=` | All |
| `NEXTAUTH_URL` | `https://onside-six.vercel.app` | Production |
| `AUTH_TRUST_HOST` | `true` | All |

### Step 6: Redeploy

After updating the environment variables:
1. Go to Vercel Dashboard → Deployments
2. Click on the latest deployment
3. Click **"Redeploy"** button
4. Wait for deployment to complete

### Step 7: Seed the Database

Once deployed successfully, run:
```powershell
.\scripts\seed-vercel.ps1
```

Or visit:
```
https://onside-six.vercel.app/api/debug/seed-db?secret=VvQ19xPSpFJVoNDwFCn88Xin+CJ+56EBQa2m3YH1AiA=
```
(Make a POST request)

## Quick Fix Script

I'll create a script to help you get the right connection string format.
