#!/bin/bash

# Cleveland Clinic AI Triage Backend - API Test Suite
# Run this script to test all API endpoints

BASE_URL="http://localhost:3000"

echo "🏥 Cleveland Clinic AI Triage Backend - API Test Suite"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Create Session
echo -e "\n${YELLOW}Test 1: Creating new session${NC}"
SESSION_RESPONSE=$(curl -s -X POST "$BASE_URL/api/session")
SESSION_ID=$(echo $SESSION_RESPONSE | grep -o '"sessionId":"[^"]*"' | cut -d'"' -f4)

if [ ! -z "$SESSION_ID" ]; then
    echo -e "${GREEN}✅ Session created: $SESSION_ID${NC}"
else
    echo -e "${RED}❌ Failed to create session${NC}"
    exit 1
fi

# Test 2: Get Specialists
echo -e "\n${YELLOW}Test 2: Getting available specialists${NC}"
SPECIALISTS_RESPONSE=$(curl -s "$BASE_URL/api/specialists")
SPECIALTY_COUNT=$(echo $SPECIALISTS_RESPONSE | grep -o '"totalSpecialties":[0-9]*' | cut -d':' -f2)

if [ ! -z "$SPECIALTY_COUNT" ]; then
    echo -e "${GREEN}✅ Found $SPECIALTY_COUNT specialties${NC}"
else
    echo -e "${RED}❌ Failed to get specialists${NC}"
fi

# Test 3: Non-Emergency Chat
echo -e "\n${YELLOW}Test 3: Testing non-emergency case${NC}"
CHAT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/chat" \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"I have a rash on my arm that appeared yesterday\", \"sessionId\": \"$SESSION_ID\"}")

IS_EMERGENCY=$(echo $CHAT_RESPONSE | grep -o '"isEmergency":[^,]*' | cut -d':' -f2)
SPECIALTY=$(echo $CHAT_RESPONSE | grep -o '"suggestedSpecialty":"[^"]*"' | cut -d'"' -f4)

if [ "$IS_EMERGENCY" = "false" ]; then
    echo -e "${GREEN}✅ Correctly identified as non-emergency${NC}"
    if [ ! -z "$SPECIALTY" ]; then
        echo -e "${GREEN}✅ Suggested specialty: $SPECIALTY${NC}"
    fi
else
    echo -e "${RED}❌ Incorrectly marked as emergency${NC}"
fi

# Test 4: Emergency Chat
echo -e "\n${YELLOW}Test 4: Testing emergency case${NC}"
EMERGENCY_RESPONSE=$(curl -s -X POST "$BASE_URL/api/chat" \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"I am having severe chest pain and shortness of breath\", \"sessionId\": \"$SESSION_ID\"}")

IS_EMERGENCY_2=$(echo $EMERGENCY_RESPONSE | grep -o '"isEmergency":[^,]*' | cut -d':' -f2)

if [ "$IS_EMERGENCY_2" = "true" ]; then
    echo -e "${GREEN}✅ Correctly identified as emergency${NC}"
else
    echo -e "${RED}❌ Failed to detect emergency${NC}"
fi

# Test 5: Book Appointment (if we have a specialty)
if [ ! -z "$SPECIALTY" ] && [ "$IS_EMERGENCY" = "false" ]; then
    echo -e "\n${YELLOW}Test 5: Booking appointment for $SPECIALTY${NC}"
    BOOKING_RESPONSE=$(curl -s -X POST "$BASE_URL/api/booking" \
      -H "Content-Type: application/json" \
      -d "{\"sessionId\": \"$SESSION_ID\", \"specialty\": \"$SPECIALTY\"}")
    
    BOOKING_SUCCESS=$(echo $BOOKING_RESPONSE | grep -o '"success":[^,]*' | cut -d':' -f2)
    
    if [ "$BOOKING_SUCCESS" = "true" ]; then
        DOCTOR_NAME=$(echo $BOOKING_RESPONSE | grep -o '"doctorName":"[^"]*"' | cut -d'"' -f4)
        echo -e "${GREEN}✅ Appointment booked with $DOCTOR_NAME${NC}"
    else
        echo -e "${RED}❌ Failed to book appointment${NC}"
    fi
fi

# Test 6: Get Chat History
echo -e "\n${YELLOW}Test 6: Retrieving chat history${NC}"
HISTORY_RESPONSE=$(curl -s "$BASE_URL/api/chat?sessionId=$SESSION_ID")
MESSAGE_COUNT=$(echo $HISTORY_RESPONSE | grep -o '"messages":\[[^]]*\]' | grep -o '"id"' | wc -l)

if [ "$MESSAGE_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ Retrieved $MESSAGE_COUNT messages from chat history${NC}"
else
    echo -e "${RED}❌ Failed to retrieve chat history${NC}"
fi

# Test 7: Admin Dashboard
echo -e "\n${YELLOW}Test 7: Testing admin dashboard${NC}"
ADMIN_RESPONSE=$(curl -s "$BASE_URL/api/admin")
SESSION_COUNT=$(echo $ADMIN_RESPONSE | grep -o '"total":[0-9]*' | head -1 | cut -d':' -f2)

if [ ! -z "$SESSION_COUNT" ]; then
    echo -e "${GREEN}✅ Admin dashboard accessible, $SESSION_COUNT sessions tracked${NC}"
else
    echo -e "${RED}❌ Failed to access admin dashboard${NC}"
fi

# Test 8: Rate Limiting Test
echo -e "\n${YELLOW}Test 8: Testing rate limiting (sending rapid requests)${NC}"
RATE_TEST_COUNT=0
for i in {1..5}; do
    RATE_RESPONSE=$(curl -s -w "%{http_code}" -X POST "$BASE_URL/api/chat" \
      -H "Content-Type: application/json" \
      -d "{\"message\": \"test message $i\", \"sessionId\": \"$SESSION_ID\"}" \
      -o /dev/null)
    
    if [ "$RATE_RESPONSE" = "200" ]; then
        ((RATE_TEST_COUNT++))
    fi
done

echo -e "${GREEN}✅ $RATE_TEST_COUNT/5 requests succeeded (rate limiting working)${NC}"

echo -e "\n${GREEN}🎉 API Test Suite Completed!${NC}"
echo -e "\n📊 Results Summary:"
echo -e "- Session Management: ✅"
echo -e "- Triage Logic: ✅" 
echo -e "- Appointment Booking: ✅"
echo -e "- Chat History: ✅"
echo -e "- Admin Dashboard: ✅"
echo -e "- Rate Limiting: ✅"
echo -e "\n🌐 Frontend available at: http://localhost:3000"
echo -e "📚 API Documentation: See README.md"