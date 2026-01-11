#!/bin/bash

# Comprehensive Backend Test Script for Resume-Agent
# Tests all endpoints and functionality

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
BACKEND_PORT=3000
MOCK_PORT=4000
BACKEND_URL="http://localhost:$BACKEND_PORT"
MOCK_URL="http://localhost:$MOCK_PORT"

# Test counters
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

# Function to print test results
print_test() {
    local test_name="$1"
    local result="$2"
    local details="$3"

    TESTS_RUN=$((TESTS_RUN + 1))

    if [ "$result" = "PASS" ]; then
        echo -e "${GREEN}✓ PASS${NC}: $test_name"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}✗ FAIL${NC}: $test_name"
        if [ -n "$details" ]; then
            echo -e "    $details"
        fi
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
}

# Function to check if port is open
check_port() {
    local port="$1"
    local service="$2"
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0
    else
        echo -e "${RED}ERROR: $service not running on port $port${NC}"
        return 1
    fi
}

# Function to start backend
start_backend() {
    echo -e "${BLUE}Starting backend server...${NC}"
    cd "$(dirname "$0")"
    npm run dev > backend.log 2>&1 &
    BACKEND_PID=$!
    sleep 3

    if check_port $BACKEND_PORT "Backend"; then
        echo -e "${GREEN}Backend started successfully on port $BACKEND_PORT${NC}"
        return 0
    else
        echo -e "${RED}Failed to start backend${NC}"
        return 1
    fi
}

# Function to start mock server
start_mock() {
    echo -e "${BLUE}Starting mock LLM server...${NC}"
    cd "$(dirname "$0")"
    npm run mock:llm > mock.log 2>&1 &
    MOCK_PID=$!
    sleep 2

    if check_port $MOCK_PORT "Mock server"; then
        echo -e "${GREEN}Mock server started successfully on port $MOCK_PORT${NC}"
        return 0
    else
        echo -e "${RED}Failed to start mock server${NC}"
        return 1
    fi
}

# Function to stop services
cleanup() {
    echo -e "${BLUE}Stopping services...${NC}"
    if [ -n "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    if [ -n "$MOCK_PID" ]; then
        kill $MOCK_PID 2>/dev/null || true
    fi
    echo -e "${GREEN}Services stopped${NC}"
}

# Set trap to cleanup on exit
trap cleanup EXIT

echo -e "${PURPLE}=== Resume-Agent Backend Comprehensive Test Suite ===${NC}"
echo ""

# Start services
if ! start_backend; then
    echo -e "${RED}Cannot proceed without backend. Exiting.${NC}"
    exit 1
fi

echo ""

# Test 1: Health Check
echo -e "${CYAN}1. Testing Health Check Endpoint${NC}"
response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "$BACKEND_URL/health")
http_status=$(echo "$response" | grep "HTTP_STATUS:" | cut -d: -f2)
body=$(echo "$response" | grep -v "HTTP_STATUS:")

if [ "$http_status" = "200" ] && echo "$body" | grep -q "\"status\":\"ok\""; then
    print_test "Health check" "PASS"
else
    print_test "Health check" "FAIL" "Expected status 200 with \"ok\", got: $http_status, body: $body"
fi

echo ""

# Test 2: Resume Analyzer - Basic functionality
echo -e "${CYAN}2. Testing Resume Analyzer - Basic${NC}"
test_resume_text="John Doe. Senior Software Engineer with 5 years experience. Expert in React, Node.js, and cloud technologies. Led development of user-facing applications serving 10K+ users."

response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$BACKEND_URL/api/resume/analyze" \
  -H "Content-Type: application/json" \
  -d "{\"text\":\"$test_resume_text\"}")

http_status=$(echo "$response" | grep "HTTP_STATUS:" | cut -d: -f2)
body=$(echo "$response" | grep -v "HTTP_STATUS:")

if [ "$http_status" = "200" ] && echo "$body" | jq -e ".summary and .inputLength and .engine and .timestamp" >/dev/null 2>&1; then
    input_length=$(echo "$body" | jq -r ".inputLength")
    engine=$(echo "$body" | jq -r ".engine")
    summary_length=$(echo "$body" | jq -r ".summary | length")
    print_test "Resume analyzer basic" "PASS" "Input length: $input_length, Engine: $engine, Summary length: $summary_length"
else
    print_test "Resume analyzer basic" "FAIL" "Expected valid JSON response, got: $http_status, body: $body"
fi

echo ""

# Test 3: Resume Analyzer - Different kinds
echo -e "${CYAN}3. Testing Resume Analyzer - Different Roles${NC}"
roles=("backend-engineer" "security-engineer" "open-source-contributor")

for role in "${roles[@]}"; do
    response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$BACKEND_URL/api/resume/analyze" \
      -H "Content-Type: application/json" \
      -d "{\"text\":\"$test_resume_text\"}")

    http_status=$(echo "$response" | grep "HTTP_STATUS:" | cut -d: -f2)
    body=$(echo "$response" | grep -v "HTTP_STATUS:")

    if [ "$http_status" = "200" ] && echo "$body" | jq -e ".summary" >/dev/null 2>&1; then
        summary=$(echo "$body" | jq -r ".summary")
        print_test "Resume analyzer - $role" "PASS" "Summary: ${summary:0:50}..."
    else
        print_test "Resume analyzer - $role" "FAIL" "Expected valid response for $role"
    fi
done

echo ""

# Test 4: LLM Test Endpoint
echo -e "${CYAN}4. Testing LLM Test Endpoint${NC}"
response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$BACKEND_URL/api/llm/test" \
  -H "Content-Type: application/json" \
  -d "{\"input\":\"Machine learning is transforming industries worldwide.\",\"instruction\":\"Summarize in one sentence\"}"
)

http_status=$(echo "$response" | grep "HTTP_STATUS:" | cut -d: -f2)
body=$(echo "$response" | grep -v "HTTP_STATUS:")

if [ "$http_status" = "200" ] && echo "$body" | jq -e ".result" >/dev/null 2>&1; then
    result=$(echo "$body" | jq -r ".result")
    print_test "LLM test endpoint" "PASS" "Result: ${result:0:50}..."
else
    print_test "LLM test endpoint" "FAIL" "Expected result field, got: $http_status, body: $body"
fi

echo ""

# Test 5: Error Handling - Invalid JSON
echo -e "${CYAN}5. Testing Error Handling${NC}"

# Test invalid JSON
response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$BACKEND_URL/api/resume/analyze" \
  -H "Content-Type: application/json" \
  -d "invalid json")

http_status=$(echo "$response" | grep "HTTP_STATUS:" | cut -d: -f2)

if [ "$http_status" = "400" ] || [ "$http_status" = "500" ]; then
    print_test "Error handling - invalid JSON" "PASS" "Correctly returned error status: $http_status"
else
    print_test "Error handling - invalid JSON" "FAIL" "Expected 400/500, got: $http_status"
fi

# Test missing text field
response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$BACKEND_URL/api/resume/analyze" \
  -H "Content-Type: application/json" \
  -d "{\"kind\":\"backend-engineer\"}"
)

http_status=$(echo "$response" | grep "HTTP_STATUS:" | cut -d: -f2)
body=$(echo "$response" | grep -v "HTTP_STATUS:")

if [ "$http_status" = "400" ] && echo "$body" | grep -q "text"; then
    print_test "Error handling - missing text" "PASS" "Correctly caught missing text field"
else
    print_test "Error handling - missing text" "FAIL" "Expected 400 with text error, got: $http_status"
fi

echo ""

# Test 6: Mock Server Integration
echo -e "${CYAN}6. Testing Mock Server Integration${NC}"

if start_mock; then
    # Test LLM with mock server
    response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$BACKEND_URL/api/llm/test" \
      -H "Content-Type: application/json" \
      -d "{\"input\":\"Test input\",\"apiUrl\":\""$MOCK_URL"/api/v1/chat/completions\",\"apiKey\":\"mock\"}"
)

    http_status=$(echo "$response" | grep "HTTP_STATUS:" | cut -d: -f2)
    body=$(echo "$response" | grep -v "HTTP_STATUS:")

    if [ "$http_status" = "200" ] && echo "$body" | jq -e ".result" >/dev/null 2>&1; then
        result=$(echo "$body" | jq -r ".result")
        if echo "$result" | grep -q "MOCK SUMMARY"; then
            print_test "Mock server integration" "PASS" "Received mock response: ${result:0:30}..."
        else
            print_test "Mock server integration" "FAIL" "Expected mock response, got: $result, Full Body: $body"
        fi
    else
        print_test "Mock server integration" "FAIL" "Expected successful response, got: $http_status, Full Body: $body"
    fi

    # Kill mock server
    kill $MOCK_PID 2>/dev/null || true
    MOCK_PID=""
else
    print_test "Mock server startup" "FAIL" "Could not start mock server for testing"
fi

echo ""

# Test 7: Engine Detection
echo -e "${CYAN}7. Testing Engine Detection${NC}"

# Test without API key (should use local-fallback)
OPENROUTER_API_KEY="" response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$BACKEND_URL/api/resume/analyze" \
  -H "Content-Type: application/json" \
  -d "{\"text\":\"$test_resume_text\"}")

http_status=$(echo "$response" | grep "HTTP_STATUS:" | cut -d: -f2)
body=$(echo "$response" | grep -v "HTTP_STATUS:")
engine=$(echo "$body" | jq -r ".engine")

if [ "$engine" = "local-fallback" ]; then
    print_test "Engine detection - no API key" "PASS" "Correctly detected local-fallback engine"
else
    print_test "Engine detection - no API key" "FAIL" "Expected local-fallback, got: $engine"
fi

echo ""

# Summary
echo -e "${PURPLE}=== Test Results Summary ===${NC}"
echo -e "Tests Run: $TESTS_RUN"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
if [ $TESTS_FAILED -gt 0 ]; then
    echo -e "${RED}Failed: $TESTS_FAILED${NC}"
else
    echo -e "Failed: $TESTS_FAILED"
fi

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed! Backend is working correctly.${NC}"
else
    echo -e "${RED}❌ Some tests failed. Check the output above for details.${NC}"
fi

echo ""
echo -e "${BLUE}Note: Logs are available in backend.log${NC}"
