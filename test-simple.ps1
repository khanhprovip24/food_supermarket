# Simple test with better error handling
$url = "https://minhngoc123.app.n8n.cloud/webhook-test/food-chatbot"

Write-Host "Testing: $url" -ForegroundColor Green

try {
    $response = Invoke-WebRequest -Uri $url -Method Post -Body '{"message":"test","sessionId":"test","timestamp":1234567890}' -ContentType "application/json" -UseBasicParsing
    
    Write-Host "`nStatus Code: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Cyan
    $response.Content
    
} catch {
    Write-Host "`nError Details:" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
    Write-Host "Status Description: $($_.Exception.Response.StatusDescription)"
    Write-Host "Message: $($_.Exception.Message)"
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "`nResponse Body:" -ForegroundColor Yellow
        Write-Host $responseBody
    }
}
