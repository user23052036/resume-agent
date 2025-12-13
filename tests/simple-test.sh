#!/bin/bash

# Simple Backend Test Script for Resume-Agent
# Tests core functionality without external dependencies

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

BACKEND_PID=""
MOCK_PID=""

cleanup() {
    echo -e "${BLUE}Cleaning up...${NC}"
    if [ -n "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    if [ -n "$MOCK_PID" ]; then
        kill $MOCK_PID 2>/dev/null || true
    fi
}

trap cleanup EXIT

echo -e "${PURPLE}=== Simple Resume-Agent Backend Test ===${NC}"
echo ""

# Start mock server first
echo -e "${BLUE}Starting mock server...${NC}"
cd "$(dirname "$0")"
npm run mock:llm > mock.log 2>&1 &
MOCK_PID=$!
sleep 2

# Start backend
echo -e "${BLUE}Starting backend server...${NC}"
npm run dev > backend.log 2>&1 &
BACKEND_PID=$!
sleep 3

echo ""

# Test 1: Health check
echo -e "${CYAN}1. Testing Health Check${NC}"
response=$(curl -s http://localhost:3000/health)
if echo "$response" | grep -q '"status":"ok"'; then
    echo -e "${GREEN}✓ PASS${NC}: Health check"
else
    echo -e "${RED}✗ FAIL${NC}: Health check - got: $response"
fi

echo ""

# Test 2: Resume analyzer with mock
echo -e "${CYAN}2. Testing Resume Analyzer${NC}"
response=$(curl -s -X POST http://localhost:3000/api/resume/analyze \
  -H "Content-Type: application/json" \
  -d '{"text":"John Doe. Senior Developer with 5 years experience in React and Node.js."}')

if echo "$response" | grep -q '"summary"'; then
    echo -e "${GREEN}✓ PASS${NC}: Resume analyzer response received"
    echo "Response: $response"
else
    echo -e "${RED}✗ FAIL${NC}: Resume analyzer - got: $response"
fi

echo ""

# Test 3: LLM test with mock
echo -e "${CYAN}3. Testing LLM Test Endpoint${NC}"
response=$(curl -s -X POST http://localhost:3000/api/llm/test \
  -H "Content-Type: application/json" \
  -d '{"input":"Test message","instruction":"Summarize"}')

if echo "$response" | grep -q '"result"'; then
    echo -e "${GREEN}✓ PASS${NC}: LLM test response received"
    echo "Response: $response"
else
    echo -e "${RED}✗ FAIL${NC}: LLM test - got: $response"
fi

echo ""

# Test 4: Error handling
echo -e "${CYAN}4. Testing Error Handling${NC}"
response=$(curl -s -X POST http://localhost:3000/api/resume/analyze \
  -H "Content-Type: application/json" \
  -d '{"kind":"backend-engineer"}')

if echo "$response" | grep -q '"error"'; then
    echo -e "${GREEN}✓ PASS${NC}: Error handling works"
else
    echo -e "${RED}✗ FAIL${NC}: Error handling - got: $response"
fi

echo ""
echo -e "${GREEN}Tests completed! Check backend.log and mock.log for details.${NC}"
