$loginBody = @{
    username = "admin"
    password = "Admin@123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:5217/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
$token = $loginResponse.token

Write-Host "Got token: $token"

$trackBody = @{
    ActionType = "Search"
    Details = "Test search from powershell"
} | ConvertTo-Json

$headers = @{
    Authorization = "Bearer $token"
}

$trackResponse = Invoke-RestMethod -Uri "http://localhost:5217/api/analytics/track" -Method Post -Headers $headers -Body $trackBody -ContentType "application/json"

Write-Host "Track Response:"
$trackResponse | ConvertTo-Json
