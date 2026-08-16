$loginBody = @{
    username = "admin"
    password = "Admin@123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:5217/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
$token = $loginResponse.token

$headers = @{
    Authorization = "Bearer $token"
}

$dashboardResponse = Invoke-RestMethod -Uri "http://localhost:5217/api/analytics/dashboard" -Method Get -Headers $headers -ContentType "application/json"

Write-Host "Dashboard Response:"
$dashboardResponse | ConvertTo-Json -Depth 10
