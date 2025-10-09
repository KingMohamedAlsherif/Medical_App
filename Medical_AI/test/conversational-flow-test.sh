#!/bin/bash

# Test Conversational AI Flow
# This tests that the AI asks questions one at a time

API_URL="http://localhost:3000/api/chat/conversational"

echo "==================================="
echo "Testing Conversational AI Flow"
echo "==================================="
echo ""

echo "Step 1: First message (should greet and ask what brings user)"
echo "-----------------------------------"
RESPONSE1=$(curl -s -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hi, I need help"
  }')

echo "Response:"
echo "$RESPONSE1" | jq -r '.response'
echo ""

# Extract sessionId from first response
SESSION_ID=$(echo "$RESPONSE1" | jq -r '.sessionId')
echo "Session ID: $SESSION_ID"
echo ""

echo "Step 2: User describes symptoms (should ask for age)"
echo "-----------------------------------"
RESPONSE2=$(curl -s -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d "{
    \"message\": \"I have been having recurring headaches\",
    \"sessionId\": \"$SESSION_ID\",
    \"conversationState\": $(echo "$RESPONSE1" | jq -c '.conversationState')
  }")

echo "Response:"
echo "$RESPONSE2" | jq -r '.response'
echo ""

echo "Step 3: User provides age (should ask for gender)"
echo "-----------------------------------"
RESPONSE3=$(curl -s -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d "{
    \"message\": \"I'm 29 years old\",
    \"sessionId\": \"$SESSION_ID\",
    \"conversationState\": $(echo "$RESPONSE2" | jq -c '.conversationState')
  }")

echo "Response:"
echo "$RESPONSE3" | jq -r '.response'
echo ""

echo "Step 4: User provides gender (should ask for medical conditions)"
echo "-----------------------------------"
RESPONSE4=$(curl -s -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d "{
    \"message\": \"Female\",
    \"sessionId\": \"$SESSION_ID\",
    \"conversationState\": $(echo "$RESPONSE3" | jq -c '.conversationState')
  }")

echo "Response:"
echo "$RESPONSE4" | jq -r '.response'
echo ""

echo "Step 5: User provides medical history (should ask for duration)"
echo "-----------------------------------"
RESPONSE5=$(curl -s -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d "{
    \"message\": \"None\",
    \"sessionId\": \"$SESSION_ID\",
    \"conversationState\": $(echo "$RESPONSE4" | jq -c '.conversationState')
  }")

echo "Response:"
echo "$RESPONSE5" | jq -r '.response'
echo ""

echo "Step 6: User provides duration (should ask for severity)"
echo "-----------------------------------"
RESPONSE6=$(curl -s -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d "{
    \"message\": \"About 2 weeks\",
    \"sessionId\": \"$SESSION_ID\",
    \"conversationState\": $(echo "$RESPONSE5" | jq -c '.conversationState')
  }")

echo "Response:"
echo "$RESPONSE6" | jq -r '.response'
echo ""

echo "Step 7: User provides severity (should recommend specialty)"
echo "-----------------------------------"
RESPONSE7=$(curl -s -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d "{
    \"message\": \"Moderate\",
    \"sessionId\": \"$SESSION_ID\",
    \"conversationState\": $(echo "$RESPONSE6" | jq -c '.conversationState')
  }")

echo "Response:"
echo "$RESPONSE7" | jq -r '.response'
echo ""

echo "Triage Result:"
echo "$RESPONSE7" | jq '.triageResult'
echo ""

echo "==================================="
echo "Conversation Test Complete"
echo "==================================="
echo ""
echo "✅ Check that:"
echo "  1. Each response asked only ONE question"
echo "  2. Questions followed the sequence: symptoms → age → gender → conditions → duration → severity"
echo "  3. Final response recommended a specialty (likely Neurology for headaches)"
echo "  4. AI was warm and empathetic throughout"
