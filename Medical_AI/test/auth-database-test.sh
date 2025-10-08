#!/bin/bash

echo "🧪 Testing Medical App Authentication and Database System"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test 1: Register a new user
echo -e "\n${BLUE}Test 1: Register a new user${NC}"
echo "POST /api/auth/register"

REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test.user@example.com",
    "password": "testpassword123",
    "firstName": "Test",
    "lastName": "User",
    "phone": "+1-555-0123",
    "dateOfBirth": "1995-05-15",
    "gender": "male"
  }')

echo "$REGISTER_RESPONSE" | jq '.' 2>/dev/null || echo "$REGISTER_RESPONSE"

# Test 2: Login with existing user
echo -e "\n${BLUE}Test 2: Login with existing user${NC}"
echo "POST /api/auth/login"

LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "password123"
  }')

echo "$LOGIN_RESPONSE" | jq '.' 2>/dev/null || echo "$LOGIN_RESPONSE"

# Extract sessionId from login response
SESSION_ID=$(echo "$LOGIN_RESPONSE" | jq -r '.sessionId' 2>/dev/null)

if [ "$SESSION_ID" != "null" ] && [ ! -z "$SESSION_ID" ]; then
  echo -e "${GREEN}✅ Login successful! Session ID: $SESSION_ID${NC}"
  
  # Test 3: Create authenticated chat session
  echo -e "\n${BLUE}Test 3: Create authenticated chat session${NC}"
  echo "POST /api/session"
  
  CHAT_SESSION_RESPONSE=$(curl -s -X POST http://localhost:3000/api/session \
    -H "Content-Type: application/json" \
    -d "{\"userSessionId\": \"$SESSION_ID\"}")
  
  echo "$CHAT_SESSION_RESPONSE" | jq '.' 2>/dev/null || echo "$CHAT_SESSION_RESPONSE"
  
  # Extract chat session ID
  CHAT_SESSION_ID=$(echo "$CHAT_SESSION_RESPONSE" | jq -r '.sessionId' 2>/dev/null)
  
  if [ "$CHAT_SESSION_ID" != "null" ] && [ ! -z "$CHAT_SESSION_ID" ]; then
    echo -e "${GREEN}✅ Chat session created! Chat Session ID: $CHAT_SESSION_ID${NC}"
    
    # Test 4: Create appointment for authenticated user
    echo -e "\n${BLUE}Test 4: Create appointment for authenticated user${NC}"
    echo "POST /api/user/appointments"
    
    APPOINTMENT_RESPONSE=$(curl -s -X POST http://localhost:3000/api/user/appointments \
      -H "Content-Type: application/json" \
      -d "{
        \"sessionId\": \"$SESSION_ID\",
        \"doctorId\": \"doc-001\",
        \"doctorName\": \"Dr. Sarah Johnson\",
        \"specialty\": \"Cardiology\",
        \"scheduledTime\": \"2024-10-15T14:00:00Z\",
        \"symptoms\": [\"chest pain\", \"shortness of breath\"],
        \"notes\": \"Patient reports chest discomfort during exercise\"
      }")
    
    echo "$APPOINTMENT_RESPONSE" | jq '.' 2>/dev/null || echo "$APPOINTMENT_RESPONSE"
    
    # Test 5: Get user appointments
    echo -e "\n${BLUE}Test 5: Get user appointments${NC}"
    echo "GET /api/user/appointments?sessionId=$SESSION_ID"
    
    USER_APPOINTMENTS=$(curl -s "http://localhost:3000/api/user/appointments?sessionId=$SESSION_ID")
    echo "$USER_APPOINTMENTS" | jq '.' 2>/dev/null || echo "$USER_APPOINTMENTS"
    
    # Test 6: Get user profile
    echo -e "\n${BLUE}Test 6: Get user profile${NC}"
    echo "GET /api/user/profile?sessionId=$SESSION_ID"
    
    USER_PROFILE=$(curl -s "http://localhost:3000/api/user/profile?sessionId=$SESSION_ID")
    echo "$USER_PROFILE" | jq '.' 2>/dev/null || echo "$USER_PROFILE"
    
    # Test 7: Update user profile
    echo -e "\n${BLUE}Test 7: Update user profile${NC}"
    echo "PUT /api/user/profile"
    
    PROFILE_UPDATE=$(curl -s -X PUT http://localhost:3000/api/user/profile \
      -H "Content-Type: application/json" \
      -d "{
        \"sessionId\": \"$SESSION_ID\",
        \"updates\": {
          \"phone\": \"+1-555-9999\",
          \"allergies\": [\"Penicillin\", \"Shellfish\", \"Latex\"],
          \"address\": {
            \"street\": \"456 Updated St\",
            \"city\": \"New York\",
            \"state\": \"NY\",
            \"zipCode\": \"10002\"
          }
        }
      }")
    
    echo "$PROFILE_UPDATE" | jq '.' 2>/dev/null || echo "$PROFILE_UPDATE"
    
    # Test 8: Test booking with authenticated session
    echo -e "\n${BLUE}Test 8: Test booking with authenticated chat session${NC}"
    echo "POST /api/booking"
    
    BOOKING_RESPONSE=$(curl -s -X POST http://localhost:3000/api/booking \
      -H "Content-Type: application/json" \
      -d "{
        \"sessionId\": \"$CHAT_SESSION_ID\",
        \"specialty\": \"Internal Medicine\"
      }")
    
    echo "$BOOKING_RESPONSE" | jq '.' 2>/dev/null || echo "$BOOKING_RESPONSE"
    
    # Test 9: Logout
    echo -e "\n${BLUE}Test 9: Logout${NC}"
    echo "POST /api/auth/logout"
    
    LOGOUT_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/logout \
      -H "Content-Type: application/json" \
      -d "{\"sessionId\": \"$SESSION_ID\"}")
    
    echo "$LOGOUT_RESPONSE" | jq '.' 2>/dev/null || echo "$LOGOUT_RESPONSE"
    
  else
    echo -e "${RED}❌ Failed to create chat session${NC}"
  fi
  
else
  echo -e "${RED}❌ Login failed${NC}"
fi

# Test 10: Test with invalid credentials
echo -e "\n${BLUE}Test 10: Test with invalid credentials${NC}"
echo "POST /api/auth/login (invalid credentials)"

INVALID_LOGIN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid@example.com",
    "password": "wrongpassword"
  }')

echo "$INVALID_LOGIN" | jq '.' 2>/dev/null || echo "$INVALID_LOGIN"

# Test 11: List all mock users (for testing)
echo -e "\n${BLUE}Test 11: Available Mock Users${NC}"
echo -e "${YELLOW}You can test with these pre-created users:${NC}"
echo "1. john.doe@example.com (password: password123)"
echo "2. jane.smith@example.com (password: password456)"
echo "3. mike.johnson@example.com (password: password789)"
echo "4. admin@medical-app.com (password: admin123)"

echo -e "\n${GREEN}🎉 Authentication and Database Testing Complete!${NC}"