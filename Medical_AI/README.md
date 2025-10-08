# 🏥 Cleveland Clinic AI Triage System

A Next.js-based medical triage and appointment booking system with integrated patient dashboard and optional AI enhancement.

## ✨ Features

- **🤖 Smart Triage Assessment**: Rule-based + optional AI-powered symptom analysis
- **🏥 Specialty Detection**: Recommends appropriate medical specialists  
- **📅 Simulated Appointment Booking**: Books appointments with available doctors
- **📊 Patient Dashboard**: Modern interface to manage consultations and appointments
- **💬 Session Management**: Tracks conversations and decisions
- **🛡️ Rate Limiting**: Prevents API abuse
- **📝 Case Updates**: Patients can add symptoms, questions, and progress updates
- **🔀 AI Integration**: Optional Google AI or OpenAI integration for enhanced accuracy

## 🎯 User Flow

1. **Start Consultation** → Patient describes symptoms
2. **AI Triage** → System evaluates emergency vs non-emergency
3. **Specialty Recommendation** → AI suggests appropriate doctor type
4. **Book Appointment** → System finds available doctor and schedules
5. **Access Dashboard** → Patient views appointment details and manages case
6. **Add Updates** → Patient can add new symptoms, questions, or improvements

## 🌐 Pages & Features

### Main Chat Interface (`/`)
- Interactive chat with AI triage assistant
- Real-time emergency detection
- Specialty recommendations
- One-click appointment booking
- Session management

### Patient Dashboard (`/dashboard`)
- **📋 Appointment Details**: Doctor info, time, location
- **🩺 Medical Summary**: Symptoms, AI assessment, case history
- **📝 Case Updates**: Add new symptoms, questions, concerns, improvements
- **⚡ Quick Actions**: Contact doctor, view records, reschedule
- **📊 Session Info**: Track consultation progress

## 📡 API Endpoints

### Core APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/session` | POST | Create new chat session |
| `/api/session` | GET | Get session details with messages |
| `/api/chat` | POST | Send message to AI triage system |
| `/api/booking` | POST/GET/DELETE | Manage appointments |
| `/api/specialists` | GET | List available specialists |

### 📝 Request/Response Examples

**Create Session:**
```bash
curl -X POST http://localhost:3000/api/session
# Returns: {"sessionId": "abc123", "message": "Welcome..."}
```

**Send Chat Message:**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "I have a rash on my arm", "sessionId": "abc123"}'
# Returns: AI response with triage assessment and specialty recommendation
```

**Book Appointment:**
```bash
curl -X POST http://localhost:3000/api/booking \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "abc123", "specialty": "Dermatology"}'
# Returns: Appointment confirmation with doctor details
```

## 🚀 Quick Start

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```

3. **Open Browser:**
   Navigate to `http://localhost:3000`

4. **Optional: Enable AI Enhancement:**
   ```bash
   # Get free API key: https://makersuite.google.com/app/apikey
   echo "GOOGLE_AI_API_KEY=your_api_key_here" > .env.local
   ```

5. **Test Complete Flow:**
   - Click "Start New Chat"
   - Describe symptoms (e.g., "I have a rash on my arm")
   - Click "Book Appointment" when specialty is suggested
   - Click "📊 View Dashboard" to see patient dashboard

## 🧪 Testing

Run the complete test suite:
```bash
chmod +x test/complete-test.sh
./test/complete-test.sh
```

Individual API tests:
```bash
./test/api-test.sh          # Test all endpoints
./test/booking-test.sh      # Test booking flow
```

## 🏗️ Architecture

- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Backend**: Next.js API Routes
- **Storage**: In-memory session store (easily upgradeable to database)
- **AI Logic**: Rule-based triage system with keyword matching
- **Styling**: Tailwind CSS with modern, accessible design
- **State Management**: React hooks + localStorage for persistence

## 🔒 Safety Features

- **Emergency Detection**: Red-flag symptoms trigger immediate ER recommendations
- **Medical Disclaimers**: Clear warnings that AI doesn't replace doctors
- **Conservative Classification**: When uncertain → classified as emergency
- **Rate Limiting**: Prevents API abuse and spam
- **Input Validation**: Sanitized and validated user inputs
- **Session Isolation**: Each session's data is separate and secure

## � Dashboard Features

### Modern, Responsive Design
- **Clean Layout**: Three-column responsive grid
- **Visual Indicators**: Color-coded status indicators and icons
- **Interactive Elements**: Hover effects and smooth transitions
- **Mobile Friendly**: Responsive design for all screen sizes

### Data Visualization
- **Appointment Cards**: Clear display of doctor and appointment info
- **Medical Summary**: Organized symptom history and AI assessments  
- **Timeline View**: Chronological case updates with timestamps
- **Quick Stats**: Session info and update counts

### Patient Interaction
- **Case Updates**: Add new symptoms, questions, concerns, improvements
- **Update Types**: Categorized with icons (🩺 symptoms, ❓ questions, ⚠️ concerns, ✅ improvements)
- **Quick Actions**: One-click access to common tasks
- **Emergency Contact**: Always-visible emergency options

## 🗄️ Mock Data

The system includes:
- **8+ Medical Specialties**: Cardiology, Dermatology, Orthopedics, etc.
- **12+ Mock Doctors**: Realistic names, specialties, and availability
- **Time Slots**: Current week + next few days with realistic scheduling
- **Symptom Database**: Comprehensive mapping of symptoms to specialties
- **Emergency Symptoms**: 20+ red-flag symptoms for immediate ER referral

## 🔮 Future Enhancements

### Phase 1 (Current)
- ✅ Chat-based triage system
- ✅ Appointment booking simulation
- ✅ Patient dashboard with case management

### Phase 2 (Database Integration)
- [ ] Prisma + PostgreSQL for persistence
- [ ] User authentication and profiles  
- [ ] Appointment history and medical records
- [ ] Doctor availability management

### Phase 3 (AI Enhancement)
- [ ] Real LLM integration (OpenAI/Anthropic)
- [ ] Natural language understanding
- [ ] Personalized recommendations
- [ ] Sentiment analysis for case updates

### Phase 4 (Production Features)
- [ ] FHIR API compatibility
- [ ] Integration with real hospital systems
- [ ] Voice chat support
- [ ] Admin dashboard for healthcare providers
- [ ] WhatsApp/SMS notifications
- [ ] Telemedicine integration

### Phase 5 (Advanced Features)
- [ ] Multi-language support
- [ ] Accessibility enhancements
- [ ] Analytics and reporting
- [ ] Machine learning for improved triage
- [ ] Integration with wearable devices

## 🎨 Design Philosophy

The dashboard follows modern healthcare UX principles:
- **Clarity First**: Medical information displayed clearly and unambiguously
- **Accessibility**: High contrast, large touch targets, screen reader friendly
- **Trust Building**: Professional appearance with clear medical disclaimers
- **Efficiency**: Quick access to important actions and information
- **Empathy**: Warm, supportive tone in messaging and interactions

---

**⚠️ Important Disclaimer**: This is a demonstration system for educational and development purposes. It does not provide real medical advice, diagnosis, or treatment. Always consult qualified healthcare professionals for medical concerns. In emergencies, call 911 immediately.
