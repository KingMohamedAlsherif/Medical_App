#!/bin/bash

echo "🧪 Testing Complete Booking Flow"
echo "==============================="

BASE_URL="http://localhost:3000"

# Test 1: Create Session
echo "1. Creating new session..."
SESSION_RESPONSE=$(curl -s -X POST "$BASE_URL/api/session" -H "Content-Type: application/json")
echo "✅ Session created: $SESSION_RESPONSE"

SESSION_ID=$(echo $SESSION_RESPONSE | grep -o '"sessionId":"[^"]*' | cut -d'"' -f4)
echo "📋 Session ID: $SESSION_ID"

if [ -z "$SESSION_ID" ]; then
  echo "❌ Failed to extract session ID"
  exit 1
fi

# Test 2: Send chat message to get specialty
echo -e "\n2. Sending symptom message..."
CHAT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/chat" \
  -H "Content-Type: application/json" \
  -d "{
    \"message\": \"I have a persistent rash on my arm that's been itchy for over a week. It's red and slightly raised.\",
    \"sessionId\": \"$SESSION_ID\"
  }")

echo "✅ Chat response: $CHAT_RESPONSE"

# Extract specialty from chat response
SPECIALTY=$(echo $CHAT_RESPONSE | grep -o '"suggestedSpecialty":"[^"]*' | cut -d'"' -f4)
echo "🏥 Detected Specialty: $SPECIALTY"

if [ -z "$SPECIALTY" ]; then
  echo "❌ No specialty detected in chat response"
  exit 1
fi

# Test 3: Book appointment
echo -e "\n3. Booking appointment..."
BOOKING_RESPONSE=$(curl -s -X POST "$BASE_URL/api/booking" \
  -H "Content-Type: application/json" \
  -d "{
    \"sessionId\": \"$SESSION_ID\",
    \"specialty\": \"$SPECIALTY\"
  }")

echo "✅ Booking response: $BOOKING_RESPONSE"

# Check if booking was successful
SUCCESS=$(echo $BOOKING_RESPONSE | grep -o '"success":[^,]*' | cut -d':' -f2)
if [ "$SUCCESS" = "true" ]; then
  echo "🎉 Booking successful!"
  
  # Test 4: Check booking history
  echo -e "\n4. Checking booking history..."
  HISTORY_RESPONSE=$(curl -s "$BASE_URL/api/booking?sessionId=$SESSION_ID")
  echo "✅ Booking history: $HISTORY_RESPONSE"
  
else
  echo "❌ Booking failed"
  echo "Response: $BOOKING_RESPONSE"
fi

# Test 5: Check available specialists
echo -e "\n5. Checking available specialists..."
SPECIALISTS_RESPONSE=$(curl -s "$BASE_URL/api/specialists")
echo "✅ Available specialists: $SPECIALISTS_RESPONSE"

echo -e "\n🏁 Test completed!"