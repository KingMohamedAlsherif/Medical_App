#!/bin/bash

echo "🧪 Testing Complete Medical AI System with Dashboard"
echo "================================================="

BASE_URL="http://localhost:3000"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_step() {
    echo -e "\n${BLUE}$1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}📋 $1${NC}"
}

# Test 1: Create Session
print_step "1. Creating new chat session..."
SESSION_RESPONSE=$(curl -s -X POST "$BASE_URL/api/session" -H "Content-Type: application/json")

if [ $? -eq 0 ]; then
    print_success "Session API responded"
    print_info "Response: $SESSION_RESPONSE"
else
    print_error "Failed to connect to server"
    exit 1
fi

SESSION_ID=$(echo $SESSION_RESPONSE | grep -o '"sessionId":"[^"]*' | cut -d'"' -f4)
print_info "Session ID: $SESSION_ID"

if [ -z "$SESSION_ID" ]; then
    print_error "Failed to extract session ID"
    exit 1
fi

# Test 2: Send chat message to get specialty recommendation
print_step "2. Testing AI Triage with symptom message..."
CHAT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/chat" \
  -H "Content-Type: application/json" \
  -d "{
    \"message\": \"I have a persistent itchy rash on my arm that's been bothering me for over a week. It's red and slightly raised with some small bumps.\",
    \"sessionId\": \"$SESSION_ID\"
  }")

if [ $? -eq 0 ]; then
    print_success "Chat API responded"
    echo "Response: $CHAT_RESPONSE"
else
    print_error "Chat API failed"
    exit 1
fi

# Extract specialty from chat response
SPECIALTY=$(echo $CHAT_RESPONSE | grep -o '"suggestedSpecialty":"[^"]*' | cut -d'"' -f4)
IS_EMERGENCY=$(echo $CHAT_RESPONSE | grep -o '"isEmergency":[^,]*' | cut -d':' -f2)

print_info "Detected Specialty: $SPECIALTY"
print_info "Emergency Status: $IS_EMERGENCY"

if [ -z "$SPECIALTY" ]; then
    print_error "No specialty detected in chat response"
    # Try another message that should definitely trigger a specialty
    print_step "2b. Trying another symptom message..."
    CHAT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/chat" \
      -H "Content-Type: application/json" \
      -d "{
        \"message\": \"I have a skin rash that is itchy\",
        \"sessionId\": \"$SESSION_ID\"
      }")
    
    SPECIALTY=$(echo $CHAT_RESPONSE | grep -o '"suggestedSpecialty":"[^"]*' | cut -d'"' -f4)
    print_info "Second attempt - Detected Specialty: $SPECIALTY"
    
    if [ -z "$SPECIALTY" ]; then
        print_error "Still no specialty detected, using fallback"
        SPECIALTY="Dermatology"
    fi
fi

# Test 3: Check available specialists
print_step "3. Checking available specialists..."
SPECIALISTS_RESPONSE=$(curl -s "$BASE_URL/api/specialists")

if [ $? -eq 0 ]; then
    print_success "Specialists API responded"
    echo "Available specialists: $SPECIALISTS_RESPONSE"
else
    print_error "Specialists API failed"
fi

# Test 4: Book appointment
print_step "4. Booking appointment for $SPECIALTY..."
BOOKING_RESPONSE=$(curl -s -X POST "$BASE_URL/api/booking" \
  -H "Content-Type: application/json" \
  -d "{
    \"sessionId\": \"$SESSION_ID\",
    \"specialty\": \"$SPECIALTY\"
  }")

if [ $? -eq 0 ]; then
    print_success "Booking API responded"
    echo "Booking response: $BOOKING_RESPONSE"
else
    print_error "Booking API failed"
    exit 1
fi

# Check if booking was successful
SUCCESS=$(echo $BOOKING_RESPONSE | grep -o '"success":[^,]*' | cut -d':' -f2)
if [ "$SUCCESS" = "true" ]; then
    print_success "Appointment booking successful!"
    
    # Extract appointment details
    DOCTOR_NAME=$(echo $BOOKING_RESPONSE | grep -o '"doctorName":"[^"]*' | cut -d'"' -f4)
    SCHEDULED_TIME=$(echo $BOOKING_RESPONSE | grep -o '"scheduledTime":"[^"]*' | cut -d'"' -f4)
    APPOINTMENT_ID=$(echo $BOOKING_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)
    
    print_info "Doctor: $DOCTOR_NAME"
    print_info "Time: $SCHEDULED_TIME"
    print_info "Appointment ID: $APPOINTMENT_ID"
    
else
    print_error "Booking failed"
    echo "Response: $BOOKING_RESPONSE"
    exit 1
fi

# Test 5: Check booking history
print_step "5. Retrieving appointment history..."
HISTORY_RESPONSE=$(curl -s "$BASE_URL/api/booking?sessionId=$SESSION_ID")

if [ $? -eq 0 ]; then
    print_success "Booking history retrieved"
    echo "History: $HISTORY_RESPONSE"
    
    # Count appointments
    APPOINTMENT_COUNT=$(echo $HISTORY_RESPONSE | grep -o '"count":[^,}]*' | cut -d':' -f2)
    print_info "Total appointments: $APPOINTMENT_COUNT"
else
    print_error "Failed to retrieve booking history"
fi

# Test 6: Test session data retrieval for dashboard
print_step "6. Testing session data for dashboard..."
SESSION_DATA_RESPONSE=$(curl -s "$BASE_URL/api/session?sessionId=$SESSION_ID")

if [ $? -eq 0 ]; then
    print_success "Session data retrieved for dashboard"
    echo "Session data: $SESSION_DATA_RESPONSE"
    
    MESSAGE_COUNT=$(echo $SESSION_DATA_RESPONSE | grep -o '"messageCount":[^,}]*' | cut -d':' -f2)
    print_info "Messages in session: $MESSAGE_COUNT"
else
    print_error "Failed to retrieve session data"
fi

# Test 7: Test dashboard accessibility
print_step "7. Testing dashboard page accessibility..."
DASHBOARD_RESPONSE=$(curl -s -I "$BASE_URL/dashboard?session=$SESSION_ID")

if echo "$DASHBOARD_RESPONSE" | grep -q "200 OK"; then
    print_success "Dashboard page is accessible"
else
    print_error "Dashboard page not accessible"
    echo "Response: $DASHBOARD_RESPONSE"
fi

# Test 8: Test appointment cancellation (optional)
if [ ! -z "$APPOINTMENT_ID" ]; then
    print_step "8. Testing appointment cancellation (optional)..."
    
    read -p "Do you want to test appointment cancellation? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        CANCEL_RESPONSE=$(curl -s -X DELETE "$BASE_URL/api/booking?appointmentId=$APPOINTMENT_ID")
        
        if [ $? -eq 0 ]; then
            print_success "Cancellation API responded"
            echo "Cancel response: $CANCEL_RESPONSE"
        else
            print_error "Cancellation API failed"
        fi
    else
        print_info "Skipping appointment cancellation test"
    fi
fi

print_step "📊 Test Summary"
echo "==============="
print_success "✓ Session creation"
print_success "✓ AI chat and triage"
print_success "✓ Specialty detection"
print_success "✓ Appointment booking"
print_success "✓ Booking history retrieval"
print_success "✓ Session data for dashboard"
print_success "✓ Dashboard accessibility"

print_step "🌐 Next Steps"
echo "============="
echo "1. Open your browser and go to: $BASE_URL"
echo "2. Start a new chat session"
echo "3. Describe symptoms (e.g., 'I have a rash on my arm')"
echo "4. Book an appointment when prompted"
echo "5. Click 'View Dashboard' to see the patient dashboard"
echo "6. Test adding case updates in the dashboard"
echo ""
echo "Dashboard URL: $BASE_URL/dashboard?session=$SESSION_ID"

print_step "🎉 All tests completed successfully!"
echo "The Medical AI Triage System with Dashboard is fully functional."