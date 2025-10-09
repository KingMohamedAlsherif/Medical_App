# 🧪 Testing Scenarios for Cleveland Clinic Agent System

## Quick Test Cases for Each Flow Path

---

## 🚨 EMERGENCY SCENARIOS (Should trigger Emergency Detection Agent)

### Test Case 1: Cardiac Emergency
**User Input:**
```
"I'm having severe chest pain that's spreading to my left arm. I'm 52 years old and I have hypertension."
```

**Expected Behavior:**
- ✅ Emergency Detection Agent activates immediately
- ✅ `isEmergency = true`
- ✅ `confidence >= 0.95`
- ✅ `reason = "Possible cardiac emergency"`
- ✅ Display: "⚠️ Go to ER immediately or call 998"
- ✅ Flow STOPS (no specialty classification)
- ✅ Pre-arrival alert created

**Audit Log Should Show:**
```json
{
  "agent": "Emergency Detection Agent",
  "action": "Emergency flagged",
  "reasoning": "Cardiac symptoms with high-risk profile (age 52, hypertension)",
  "confidence": 0.98
}
```

---

### Test Case 2: Respiratory Emergency
**User Input:**
```
"I can't breathe properly. My lips are turning blue and I'm gasping for air."
```

**Expected Behavior:**
- ✅ Emergency flag: `isEmergency = true`
- ✅ `reason = "Severe respiratory distress"`
- ✅ Immediate emergency message
- ✅ No further questions asked

---

### Test Case 3: Neurological Emergency (Stroke)
**User Input:**
```
"My husband can't speak properly, his face is drooping on one side, and he seems confused. This started 20 minutes ago."
```

**Expected Behavior:**
- ✅ Emergency flag: `isEmergency = true`
- ✅ `reason = "Possible stroke symptoms"`
- ✅ `confidence >= 0.95`
- ✅ Immediate action message

---

### Test Case 4: Mental Health Crisis
**User Input:**
```
"I've been having thoughts of ending my life. I don't know what to do anymore."
```

**Expected Behavior:**
- ✅ Emergency flag: `isEmergency = true`
- ✅ `reason = "Mental health emergency"`
- ✅ Display: "Call 988 (Suicide Prevention) or 998"
- ✅ Immediate intervention message

---

## 🟢 NON-EMERGENCY SCENARIOS (Full Flow)

### Test Case 5: Neurology - Headaches
**User Input (Step by Step):**
```
User: "I've been having recurring headaches and feeling very tired lately."
Bot: "I'm here to help. Can you tell me your age and gender?"
User: "I'm 29 years old, female."
Bot: "Do you have any known medical conditions?"
User: "No, none."
Bot: "How long have you been experiencing these symptoms?"
User: "About 2 weeks now."
Bot: "On a scale, would you say the severity is mild, moderate, or severe?"
User: "I'd say moderate."
```

**Expected Flow:**
1. ✅ Intake Agent collects all data
2. ✅ Emergency Agent: `isEmergency = false` (confidence: 0.85)
3. ✅ Specialty Agent recommends: **Neurology** (confidence: 0.85)
4. ✅ Bot asks: "Would you like to book with a Neurologist?"
5. ✅ Booking Agent simulates appointment
6. ✅ Summary Agent provides confirmation

**Session Context (Final):**
```json
{
  "user": {
    "name": "Not provided",
    "age": 29,
    "gender": "female",
    "knownConditions": []
  },
  "intake": {
    "symptoms": "recurring headaches and feeling very tired",
    "duration": "2 weeks",
    "severity": "moderate",
    "redFlagsDetected": false
  },
  "triage": {
    "isEmergency": false,
    "reason": "No life-threatening symptoms detected",
    "confidence": 0.85,
    "recommendedSpecialty": "Neurology"
  }
}
```

---

### Test Case 6: Gastroenterology - Digestive Issues
**User Input:**
```
"I'm a 45-year-old man with frequent stomach pain and nausea after eating. This has been going on for about a month. The pain is moderate, usually in my upper abdomen."
```

**Expected Flow:**
1. ✅ Intake extracts: age=45, gender=male, symptoms=stomach pain/nausea
2. ✅ Emergency: `isEmergency = false`
3. ✅ Specialty: **Gastroenterology** (confidence: 0.80-0.88)
4. ✅ Recommendation: "See a Gastroenterologist"

---

### Test Case 7: Dermatology - Skin Condition
**User Input:**
```
"I'm 35, female. I have an itchy rash on my arms that's been there for 5 days. It's mildly annoying but not severe."
```

**Expected Flow:**
1. ✅ Intake collects data
2. ✅ Emergency: `isEmergency = false`
3. ✅ Specialty: **Dermatology** (confidence: 0.88+)
4. ✅ Keywords matched: "rash", "itchy", "skin"

---

### Test Case 8: Rheumatology - Joint Pain
**User Input:**
```
"My joints have been swollen and stiff, especially in the mornings. I'm 58 years old with a history of arthritis. The pain has gotten worse over the past 3 weeks."
```

**Expected Flow:**
1. ✅ Intake: age=58, history=arthritis
2. ✅ Emergency: `isEmergency = false`
3. ✅ Specialty: **Rheumatology** (confidence: 0.85+)
4. ✅ Associated symptoms: "swelling", "stiffness", "morning stiffness"

---

### Test Case 9: Pulmonology - Respiratory (Non-Emergency)
**User Input:**
```
"I'm 42, male. I've had a persistent cough for 2 weeks with some chest tightness when I breathe deeply. I have asthma. It's not severe, just bothersome."
```

**Expected Flow:**
1. ✅ Intake: identifies "cough", "chest tightness", "asthma"
2. ✅ Emergency: `isEmergency = false` (not severe breathing difficulty)
3. ✅ Specialty: **Pulmonology** (confidence: 0.85+)
4. ✅ Note: Asthma history considered but not emergency level

---

### Test Case 10: Internal Medicine - General Symptoms
**User Input:**
```
"I've had a fever and body aches for 3 days. I'm 25 years old with no medical history. The fever is around 100°F. I feel tired and weak."
```

**Expected Flow:**
1. ✅ Intake: fever, body aches, fatigue
2. ✅ Emergency: `isEmergency = false`
3. ✅ Specialty: **Internal Medicine** (confidence: 0.75-0.82)
4. ✅ General symptoms → general specialist

---

## 🔄 EDGE CASES

### Test Case 11: Ambiguous Symptoms (Low Confidence)
**User Input:**
```
"I just don't feel right. Something's off but I can't explain it."
```

**Expected Behavior:**
- ⚠️ Confidence score: < 0.6
- ✅ Bot asks follow-up questions
- ✅ May trigger Human Review Agent
- ✅ Defaults to: **Internal Medicine**

---

### Test Case 12: Multiple Specialty Matches
**User Input:**
```
"I have back pain that shoots down my leg, and my skin feels numb in that area."
```

**Expected Behavior:**
- ✅ Two specialties detected: Orthopedics (back pain) + Neurology (numbness)
- ✅ System recommends: **Neurology** (numbness = neurological priority)
- ✅ Confidence: 0.70-0.80
- ✅ May mention: "Could also involve orthopedic evaluation"

---

### Test Case 13: Borderline Emergency
**User Input:**
```
"I have chest discomfort, but it's mild and comes and goes. I'm 35 with no health issues."
```

**Expected Behavior:**
- ⚠️ System may show caution
- ✅ Emergency Agent assesses: Likely NOT emergency (young, mild, intermittent)
- ✅ BUT recommends: **Cardiology** evaluation soon
- ✅ Confidence: 0.70-0.80 (not emergency but needs attention)
- ✅ Adds note: "Chest symptoms should be evaluated promptly"

---

### Test Case 14: Incomplete Information
**User Input:**
```
"I don't feel well."
```

**Expected Behavior:**
- ✅ Intake Agent asks follow-up questions:
  - "Can you describe what symptoms you're experiencing?"
  - "Where do you feel discomfort?"
  - "How long have you felt this way?"
- ✅ Continues gathering data until sufficient for triage

---

## 🧪 API Testing Commands

### Test Emergency Detection API
```bash
curl -X POST http://localhost:3000/api/chat/conversational \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I have severe chest pain radiating to my left arm",
    "conversationState": null
  }'
```

**Expected Response:**
```json
{
  "response": "⚠️ **MEDICAL EMERGENCY DETECTED**...",
  "triageResult": {
    "isEmergency": true,
    "confidence": 0.98,
    "reason": "Possible cardiac emergency"
  },
  "isComplete": true
}
```

---

### Test Non-Emergency Flow
```bash
curl -X POST http://localhost:3000/api/chat/conversational \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I have a headache and feel tired",
    "conversationState": null
  }'
```

**Expected Response:**
```json
{
  "response": "I'm here to help...",
  "newState": {
    "sessionContext": {
      "intake": {
        "symptoms": "headache and feel tired",
        "redFlagsDetected": false
      }
    },
    "currentPhase": "intake"
  },
  "isComplete": false
}
```

---

## 📊 Validation Checklist

### For Each Test:
- [ ] Correct agent activated
- [ ] Confidence score in expected range
- [ ] Audit log entries created
- [ ] Session context properly updated
- [ ] User message appropriate for severity
- [ ] Emergency cases stop flow immediately
- [ ] Non-emergency cases complete full flow
- [ ] Specialty recommendation makes sense
- [ ] Medical disclaimer included

### Emergency Cases:
- [ ] Emergency flag set correctly
- [ ] 998/911 number displayed
- [ ] Pre-arrival alert data structure created
- [ ] No booking attempt made
- [ ] Clear, urgent but calm language

### Non-Emergency Cases:
- [ ] All 5 phases completed
- [ ] Specialty matches symptom pattern
- [ ] Booking simulation runs
- [ ] Confirmation ID generated
- [ ] Patient and clinician summaries created

---

## 🎯 Success Criteria

### Overall System:
- ✅ 95%+ accuracy on emergency detection
- ✅ 80%+ accuracy on specialty recommendation
- ✅ 0% false negatives on life-threatening symptoms
- ✅ All audit logs complete and accurate
- ✅ Session context maintains integrity
- ✅ Appropriate medical disclaimers shown
- ✅ User experience is empathetic and clear

---

## 🐛 Known Issues to Watch For

1. **Multiple Emergency Keywords:**
   - Input: "I have chest pain and a headache"
   - Should prioritize: Chest pain (cardiac emergency)
   
2. **Negation Handling:**
   - Input: "I don't have chest pain"
   - Should NOT trigger emergency

3. **Context Carryover:**
   - Ensure previous messages don't pollute new sessions
   - Reset session context properly

4. **Age Boundary Cases:**
   - Age < 18: Pediatric consideration
   - Age > 65: Higher risk threshold
   - Age not provided: Default risk assessment

---

## 📝 Manual Testing Script

### Complete Non-Emergency Flow Test:
```
Test User: Fatima (Neurology Case)

1. Start conversation:
   User: "Hi, I need help with some health concerns."
   ✓ Check: Bot greets warmly

2. Symptom description:
   User: "I've been having recurring headaches and fatigue."
   ✓ Check: Bot asks for age/gender

3. Provide demographics:
   User: "I'm 29 years old, female."
   ✓ Check: Bot asks about medical conditions

4. Medical history:
   User: "No known conditions."
   ✓ Check: Bot asks about duration

5. Duration:
   User: "About 2 weeks."
   ✓ Check: Bot asks about severity

6. Severity:
   User: "I'd say moderate."
   ✓ Check: Bot analyzes and recommends Neurology

7. Booking:
   User: "Yes, I'd like to book an appointment."
   ✓ Check: Bot shows available doctors

8. Confirm:
   User: "I'll take the appointment with Dr. Al-Hassan on Oct 12."
   ✓ Check: Bot confirms with ID, summary shown

9. Complete:
   ✓ Check: Session stored
   ✓ Check: Audit log has 5 entries
   ✓ Check: All session context fields filled
```

---

**Testing Document Version:** 1.0  
**Last Updated:** October 8, 2025  
**Next Review:** After first round of testing
