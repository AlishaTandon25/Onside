# Script to help generate the correct Supabase connection pooler URL for Vercel

Write-Host "🔧 Supabase Connection Pooler URL Generator" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Your current DATABASE_URL from .env:" -ForegroundColor Yellow
$currentUrl = Get-Content .env | Select-String "DATABASE_URL" | ForEach-Object { $_.ToString() }
Write-Host $currentUrl
Write-Host ""

Write-Host "For Vercel, you need to use Supabase's Connection Pooler." -ForegroundColor Green
Write-Host ""
Write-Host "Steps to get your pooler URL:" -ForegroundColor Yellow
Write-Host "1. Go to: https://supabase.com/dashboard" -ForegroundColor White
Write-Host "2. Select your project" -ForegroundColor White
Write-Host "3. Go to Settings → Database" -ForegroundColor White
Write-Host "4. Scroll to 'Connection Pooling' section" -ForegroundColor White
Write-Host "5. Copy the 'Connection string' (Transaction mode)" -ForegroundColor White
Write-Host ""

Write-Host "The pooler URL should look like:" -ForegroundColor Yellow
Write-Host "postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres" -ForegroundColor Cyan
Write-Host ""

Write-Host "Add these parameters to the end:" -ForegroundColor Yellow
Write-Host "?pgbouncer=true&connection_limit=1" -ForegroundColor Cyan
Write-Host ""

Write-Host "Final URL format:" -ForegroundColor Green
Write-Host "postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1" -ForegroundColor White
Write-Host ""

Write-Host "⚠️  IMPORTANT: Set this URL in Vercel Dashboard:" -ForegroundColor Red
Write-Host "   Vercel Dashboard → Your Project → Settings → Environment Variables → DATABASE_URL" -ForegroundColor White
Write-Host ""

Write-Host "After updating, redeploy your Vercel app!" -ForegroundColor Green
