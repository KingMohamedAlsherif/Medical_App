## 🧠 Cleveland Clinic AI Triage Backend — Implementation Instructions (Updated)

### 🎯 Objective

Implement the **backend logic** for a chat system inside a Next.js application that:

1. Receives messages from users.
2. Detects if the case is **emergency or not**.
3. If non-emergency, identifies **which medical specialty** the user should see.
4. **Simulates appointment booking** with doctors in that specialty.
5. Stores all sessions and AI responses for later analysis.

---

### ⚙️ Step 1: Create the API Endpoints

* Build a `/api/chat` endpoint to handle the user–AI message exchange.
* Build a `/api/session` endpoint to create and manage chat sessions.
* Build a `/api/booking` endpoint that **simulates booking** an appointment (fake database + mock doctors).
* Optionally, add `/api/specialist` to fetch available specialties or doctors.

---

### 🧩 Step 2: Define the Flow of Chat Session

1. Receive user input and session ID.
2. Store the message in session memory or database.
3. Send it to the **triageAgent** logic.
4. AI analyzes it and returns:

   * `emergency` or `non-emergency`.
   * Explanation and reasoning.
   * Suggested **specialty** if not emergency.
5. Response is returned to the frontend chat UI.
6. If specialty is provided → offer the user an option to **book a simulated appointment**.

---

### 🧠 Step 3: Implement the AI Logic (Triage Agent)

* The triage agent combines two tasks:

  1. **Emergency detection** — checks if the case is urgent.
  2. **Specialty classification** — identifies which department to route to.
* The logic starts with **simple rules and keyword detection**, then expands to **AI model inference** for advanced understanding.
* Example flow:

  * If message mentions “chest pain” → classify as emergency.
  * If message mentions “rash” or “skin problem” → classify as dermatologist.

---

### 🩺 Step 4: Define Emergency Detection Rules

* Maintain a list of **red-flag symptoms** (e.g., chest pain, severe bleeding, shortness of breath).
* If any are found → mark as emergency and instruct to visit ER immediately.
* Always err on the side of caution — if uncertain, classify as emergency.

---

### 🏥 Step 5: Specialty Classification

* Define a mapping between **keywords/symptoms** and **specialties**.
* Example:

  * “heart”, “palpitations” → cardiologist
  * “rash”, “skin” → dermatologist
  * “joint pain”, “back pain” → orthopedic
* If no direct match, call a language model to guess the right specialty.
* Return the final specialty name and short reasoning.

---

### 💬 Step 6: Manage Chat Sessions

* Every chat session has a unique ID.
* Maintain a session object with messages and timestamps.
* Store all interactions temporarily (in-memory) for MVP.
* Later, persist to a database for long-term tracking.

---

### 💾 Step 7: Database Integration (Phase 2)

* Use **Prisma + PostgreSQL** to persist sessions, messages, and triage logs.
* Main tables:

  1. **Session** – stores session ID and creation time.
  2. **Message** – stores user/AI messages with timestamps.
  3. **TriageLog** – stores emergency status, specialty, and AI reasoning.
  4. **Appointment** – stores simulated booking details.

---

### 📅 Step 8: Simulated Appointment Booking System

* Instead of connecting to a real FHIR API, simulate the booking process.
* Create a local or mock database of **doctors**, each with:

  * ID, name, specialty, available times.
* The `/api/booking` endpoint should:

  1. Receive the specialty (from the AI result).
  2. Find a matching doctor with available slots.
  3. Assign the first open slot.
  4. Return a booking confirmation (fake appointment).

**Simulated Output Example:**

> “Appointment booked with Dr. Sarah Mitchell (Dermatologist) on October 9 at 10:30 AM.”

This allows the app to behave like a real hospital booking system for demo/testing, without requiring access to Epic or patient data.

---

### 🔒 Step 9: Security & Compliance

* Display disclaimer: *“This AI assistant does not replace a medical professional.”*
* Implement rate-limiting and request validation.
* Encrypt stored data.
* Never store or display personal health information.
* Use anonymous session tokens.
* Ensure every AI message is safe and medically conservative.

---

### 🌐 Step 10: Future Integrations (Optional)

* Add Twilio or WhatsApp for appointment reminders.
* Add clinician dashboard to review triage logs.
* Integrate real hospital APIs later (if approved) — current version stays simulation-only.

---

### 🧭 Step 11: Development Roadmap

| Phase       | Goal              | Deliverables                           |
| ----------- | ----------------- | -------------------------------------- |
| **Phase 1** | Chat MVP          | Chat endpoint + emergency detection    |
| **Phase 2** | Database          | Prisma/PostgreSQL session logging      |
| **Phase 3** | LLM Upgrade       | AI-driven specialty detection          |
| **Phase 4** | Simulated Booking | Doctor database + mock appointments    |
| **Phase 5** | Admin Dashboard   | Review and analytics interface         |
| **Phase 6** | Voice Chat        | Real-time patient conversation support |

---

### ✅ Success Criteria

* Detects emergency cases correctly.
* Suggests correct specialist for non-emergency.
* Simulated booking works end-to-end.
* All chat data safely stored.
* Users receive clear next steps (visit ER or book doctor).

---

### ⚠️ Safety Rules

* Always classify uncertain cases as emergency.
* Include a medical disclaimer in every conversation.
* Log all decisions for human review.
* Never provide direct medical diagnosis.

