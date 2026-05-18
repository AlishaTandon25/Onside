# PowerShell script to seed Vercel database
$url = "https://onside-six.vercel.app/api/debug/seed-db?secret=VvQ19xPSpFJVoNDwFCn88Xin+CJ+56EBQa2m3YH1AiA="

Write-Host "🌱 Seeding Vercel database..." -ForegroundColor Cyan
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $url -Method Post -ContentType "application/json"
    
    if ($response.success) {
        Write-Host "✅ Database seeded successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "You can now log in with:" -ForegroundColor Yellow
        Write-Host "  Admin: admin@onside.ai / password123"
        Write-Host "  Manager: manager@onside.ai / password123"
        Write-Host "  Employee: employee@onside.ai / password123"
    } else {
        Write-Host "❌ Seeding failed:" -ForegroundColor Red
        Write-Host $response.error
    }
} catch {
    Write-Host "❌ Error:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}
