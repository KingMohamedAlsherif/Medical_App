#!/bin/bash

echo "🧪 Testing Medical AI Triage System"
echo "================================="

# Test 1: Create Session
echo "1. Creating new session..."
SESSION_RESPONSE=$(curl -s -X POST http://localhost:3000/api/session \
  -H "Content-Type: application/json")

echo "Session Response: $SESSION_RESPONSE"
SESSION_ID=$(echo $SESSION_RESPONSE | grep -o '"sessionId":"[^"]*' | cut -d'"' -f4)
echo "Extracted Session ID: $SESSION_ID"

if [ -z "$SESSION_ID" ]; then
  echo "❌ Failed to create session"
  exit 1
fi

echo -e "\n2. Sending test message for dermatology..."
CHAT_RESPONSE=$(curl -s -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d "{
    \"message\": \"I have a rash on my arm that has been there for a week. It's red and itchy.\",
    \"sessionId\": \"$SESSION_ID\"
  }")

echo "Chat Response: $CHAT_RESPONSE"

# Extract specialty
SPECIALTY=$(echo $CHAT_RESPONSE | grep -o '"suggestedSpecialty":"[^"]*' | cut -d'"' -f4)
echo "Detected Specialty: $SPECIALTY"

if [ ! -z "$SPECIALTY" ]; then
  echo -e "\n3. Attempting to book appointment..."
  BOOKING_RESPONSE=$(curl -s -X POST http://localhost:3000/api/booking \
    -H "Content-Type: application/json" \
    -d "{
      \"sessionId\": \"$SESSION_ID\",
      \"specialty\": \"$SPECIALTY\"
    }")
  
  echo "Booking Response: $BOOKING_RESPONSE"
  
  # Check if booking was successful
  SUCCESS=$(echo $BOOKING_RESPONSE | grep -o '"success":[^,]*' | cut -d':' -f2)
  if [ "$SUCCESS" = "true" ]; then
    echo "✅ Booking successful!"
  else
    echo "❌ Booking failed"
    echo "Response: $BOOKING_RESPONSE"
  fi
else
  echo "❌ No specialty detected"
fi

echo -e "\n4. Checking available specialties..."
SPECIALISTS_RESPONSE=$(curl -s http://localhost:3000/api/specialists)
echo "Available Specialties: $SPECIALISTS_RESPONSE"

echo -e "\nTest completed!"