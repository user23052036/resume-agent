$text = "Aarav Mehta Backend Engineer Email: aarav.mehta@example.com | Location: India Professional Summary Backend-focused software engineer with hands-on experience in building scalable APIs, distributed systems, and cloud-native services. Strong foundation in system design, databases, and security-aware backend development. Skills - Languages: JavaScript, TypeScript, Python - Backend: Node.js, Express, REST APIs - Databases: PostgreSQL, MongoDB - Cloud and DevOps: AWS, Docker, CI/CD - Tools: Git, Linux Experience Backend Engineer Intern - TechNova Solutions (2023-2024) - Built REST APIs using Node.js and Express - Designed PostgreSQL schemas and optimized queries - Deployed services using Docker on AWS EC2 Projects Distributed Task Scheduler - Designed a job scheduling system with retry and queue mechanisms - Implemented API authentication and role-based access Real-Time Chat Application - Built WebSocket-based chat server with message persistence Education B.Tech in Computer Science XYZ University (2020-2024)"

$body = @{ text = $text }

$json = $body | ConvertTo-Json

Write-Host "Testing resume analysis..."
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/api/resume/analyze" -Method POST -ContentType "application/json" -Body $json
    Write-Host "Analysis response:"
    Write-Host $response.Content
} catch {
    Write-Host "Error in analysis:"
    Write-Host $_.Exception.Message
}

# Test chat after analysis
Write-Host "`nTesting chat..."
$chatBody = @{
    message = "what are the skills of the candidate?"
} | ConvertTo-Json

try {
    $chatResponse = Invoke-WebRequest -Uri "http://localhost:3001/api/agent/chat" -Method POST -ContentType "application/json" -Body $chatBody
    Write-Host "Chat response:"
    Write-Host $chatResponse.Content
} catch {
    Write-Host "Error in chat:"
    Write-Host $_.Exception.Message
}
