# Test n8n webhook
Write-Host "Testing n8n webhook..." -ForegroundColor Green

$url = "https://minhngoc123.app.n8n.cloud/webhook-test/food-chatbot"
$body = @{
    message = "Giá rau củ bao nhiêu?"
    sessionId = "test-123"
    timestamp = [int][double]::Parse((Get-Date -UFormat %s))
} | ConvertTo-Json

Write-Host "Sending request to: $url" -ForegroundColor Yellow
Write-Host "Body: $body" -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType "application/json"
    Write-Host "`nSuccess! Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "`nError:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    Write-Host "`nStatus Code:" $_.Exception.Response.StatusCode.value__
}
