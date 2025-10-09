#!/bin/bash

# Test script for Conversational Triage API
echo "🧪 Testing Conversational Triage System"
echo "======================================="

SERVER_URL="http://localhost:3001"
API_ENDPOINT="$SERVER_URL/api/chat/conversational"

echo "Testing server availability..."
if ! curl -s "$SERVER_URL" > /dev/null; then
    echo "❌ Server not running on $SERVER_URL"
    exit 1
fi

echo "✅ Server is running"
echo ""

# Test 1: Initial greeting
echo "Test 1: Initial greeting"
echo "------------------------"
RESPONSE1=$(curl -s -X POST "$API_ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, I need help"
  }')

SESSION_ID=$(echo "$RESPONSE1" | jq -r '.sessionId')
echo "Session ID: $SESSION_ID"
echo "Response: $(echo "$RESPONSE1" | jq -r '.response' | head -n 2)"
echo "Stage: $(echo "$RESPONSE1" | jq -r '.conversationState.stage')"
echo ""

# Test 2: Provide name
echo "Test 2: Providing name"
echo "----------------------"
CONV_STATE=$(echo "$RESPONSE1" | jq '.conversationState')
RESPONSE2=$(curl -s -X POST "$API_ENDPOINT" \
  -H "Content-Type: application/json" \
  -d "{
    \"message\": \"My name is John Smith\",
    \"sessionId\": \"$SESSION_ID\",
    \"conversationState\": $CONV_STATE
  }")

echo "Response: $(echo "$RESPONSE2" | jq -r '.response' | head -n 2)"
echo "Stage: $(echo "$RESPONSE2" | jq -r '.conversationState.stage')"
echo "Patient Name: $(echo "$RESPONSE2" | jq -r '.conversationState.patientData.name')"
echo ""

# Test 3: Provide age
echo "Test 3: Providing age"
echo "---------------------"
CONV_STATE=$(echo "$RESPONSE2" | jq '.conversationState')
RESPONSE3=$(curl -s -X POST "$API_ENDPOINT" \
  -H "Content-Type: application/json" \
  -d "{
    \"message\": \"I am 45 years old\",
    \"sessionId\": \"$SESSION_ID\",
    \"conversationState\": $CONV_STATE
  }")

echo "Response: $(echo "$RESPONSE3" | jq -r '.response' | head -n 2)"
echo "Patient Age: $(echo "$RESPONSE3" | jq -r '.conversationState.patientData.age')"
echo ""

# Test 4: Provide gender
echo "Test 4: Providing gender"
echo "------------------------"
CONV_STATE=$(echo "$RESPONSE3" | jq '.conversationState')
RESPONSE4=$(curl -s -X POST "$API_ENDPOINT" \
  -H "Content-Type: application/json" \
  -d "{
    \"message\": \"Male\",
    \"sessionId\": \"$SESSION_ID\",
    \"conversationState\": $CONV_STATE
  }")

echo "Response: $(echo "$RESPONSE4" | jq -r '.response' | head -n 2)"
echo "Patient Gender: $(echo "$RESPONSE4" | jq -r '.conversationState.patientData.gender')"
echo ""

# Test 5: Provide chronic conditions
echo "Test 5: Providing chronic conditions"
echo "------------------------------------"
CONV_STATE=$(echo "$RESPONSE4" | jq '.conversationState')
RESPONSE5=$(curl -s -X POST "$API_ENDPOINT" \
  -H "Content-Type: application/json" \
  -d "{
    \"message\": \"I have hypertension and diabetes\",
    \"sessionId\": \"$SESSION_ID\",
    \"conversationState\": $CONV_STATE
  }")

echo "Response: $(echo "$RESPONSE5" | jq -r '.response' | head -n 2)"
echo "Stage: $(echo "$RESPONSE5" | jq -r '.conversationState.stage')"
echo "Chronic Conditions: $(echo "$RESPONSE5" | jq -r '.conversationState.patientData.chronicConditions')"
echo ""

# Test 6: Emergency symptoms
echo "Test 6: Emergency symptoms (chest pain)"
echo "--------------------------------------"
CONV_STATE=$(echo "$RESPONSE5" | jq '.conversationState')
RESPONSE6=$(curl -s -X POST "$API_ENDPOINT" \
  -H "Content-Type: application/json" \
  -d "{
    \"message\": \"I'm having severe chest pain and shortness of breath\",
    \"sessionId\": \"$SESSION_ID\",
    \"conversationState\": $CONV_STATE
  }")

echo "Response: $(echo "$RESPONSE6" | jq -r '.response' | head -n 3)"
echo "Is Emergency: $(echo "$RESPONSE6" | jq -r '.triageResult.isEmergency')"
echo "Confidence: $(echo "$RESPONSE6" | jq -r '.triageResult.confidence')"
echo "Is Complete: $(echo "$RESPONSE6" | jq -r '.isComplete')"
echo ""

# Test 7: Non-emergency flow
echo "Test 7: Non-emergency symptoms"
echo "------------------------------"
# Start fresh conversation for non-emergency test
RESPONSE7=$(curl -s -X POST "$API_ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello"
  }')

# Skip through basic info quickly
SESSION_ID2=$(echo "$RESPONSE7" | jq -r '.sessionId')

# Provide all info at once and test non-emergency symptoms
CONV_STATE=$(echo "$RESPONSE7" | jq '.conversationState')

# Simulate completing basic info
curl -s -X POST "$API_ENDPOINT" \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"Sarah Johnson\", \"sessionId\": \"$SESSION_ID2\", \"conversationState\": $CONV_STATE}" > /dev/null

# Continue with age, gender, conditions, and finally non-emergency symptoms
FINAL_RESPONSE=$(curl -s -X POST "$API_ENDPOINT" \
  -H "Content-Type: application/json" \
  -d "{
    \"message\": \"I have a mild headache that started yesterday\",
    \"sessionId\": \"$SESSION_ID2\"
  }")

echo "Non-emergency example completed"
echo ""

echo "✅ All tests completed successfully!"
echo ""
echo "🌐 Visit the demo page at: $SERVER_URL/conversational-triage"
echo "📖 Check the README at: CONVERSATIONAL_TRIAGE_README.md"