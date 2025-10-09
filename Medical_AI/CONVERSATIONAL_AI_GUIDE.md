# 💬 Conversational AI Agent - Implementation Guide

## 🎯 What Was Fixed

The AI agent has been updated to have a **true conversational flow** where it:
- ✅ Asks **ONE question at a time**
- ✅ Waits for user response before proceeding
- ✅ Follows a structured interview sequence
- ✅ Tracks what data has been collected
- ✅ Provides warm, empathetic responses

---

## 🔄 Conversation Flow

### Step-by-Step Sequence:

```
1. GREETING
   AI: "Hello! I'm here to help you find the right medical care. 
        I'll ask you a few quick questions to understand your situation better. 
        What brings you here today?"

2. SYMPTOMS
   User: "I have headaches"
   AI: "I understand. Headaches can be concerning. Can you tell me your age?"

3. AGE
   User: "29"
   AI: "Thank you. And what is your gender?"

4. GENDER
   User: "Female"
   AI: "Got it. Do you have any existing medical conditions like diabetes, 
        hypertension, or heart disease? If none, just say none."

5. MEDICAL HISTORY
   User: "None"
   AI: "Thank you for sharing. How long have you been experiencing these symptoms?"

6. DURATION
   User: "About 2 weeks"
   AI: "I see. On a scale, would you describe the severity as mild, moderate, or severe?"

7. SEVERITY
   User: "Moderate"
   AI: "Based on your symptoms, I recommend seeing a Neurology specialist. 
        Recurring headaches should be evaluated to determine the underlying cause. 
        Would you like help finding an appointment?"
```

---

## 🛠️ Technical Changes Made

### 1. **Updated System Prompt** (`conversationalTriageAgent.ts`)

**Before:** Generic instructions that led to batch questioning
**After:** Explicit step-by-step instructions with examples

Key sections:
- CRITICAL RULES: Emphasizes ONE question at a time
- CONVERSATION FLOW: Numbered steps for each question
- GUIDELINES: Behavior expectations
- EXAMPLES: Shows exact conversation patterns

### 2. **Added Context Tracking**

New helper methods:
- `getCollectedDataSummary()` - Shows AI what data has already been collected
- `determineNextQuestion()` - Tells AI what to ask next based on current state

### 3. **Enhanced Prompt Building**

The AI now receives:
```
1. System prompt with instructions
2. Current session data collected
3. Conversation history
4. Next action to take (specific instruction)
```

This ensures the AI knows exactly what to do next.

---

## 🧪 Testing the Conversational Flow

### Option 1: Using the Test Script

```bash
# Start your development server
npm run dev

# In another terminal, run the test
./test/conversational-flow-test.sh
```

This will simulate a full conversation and show each exchange.

### Option 2: Manual Testing with cURL

**Step 1 - First Message:**
```bash
curl -X POST http://localhost:3000/api/chat/conversational \
  -H "Content-Type: application/json" \
  -d '{"message": "Hi, I need help"}'
```

Save the `sessionId` and `conversationState` from the response.

**Step 2 - Each Subsequent Message:**
```bash
curl -X POST http://localhost:3000/api/chat/conversational \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I have headaches",
    "sessionId": "YOUR_SESSION_ID",
    "conversationState": {...paste conversationState from previous response...}
  }'
```

### Option 3: Frontend Testing

If you have a chat UI, test the flow naturally:
1. Type: "Hi"
2. Wait for AI response
3. Answer the question it asks
4. Repeat until complete

---

## ✅ Expected Behavior

### What You Should See:

#### ✅ **Good Response (One Question):**
```
"I understand. Headaches can be concerning. Can you tell me your age?"
```

#### ❌ **Bad Response (Multiple Questions):**
```
"I understand. Can you tell me your age, gender, and medical history?"
```

### Conversation Characteristics:

- **Warm & Empathetic:** Uses phrases like "I understand", "Thank you for sharing"
- **Acknowledges Answers:** Brief acknowledgment before next question
- **Natural Flow:** Doesn't sound robotic
- **Follows Sequence:** Always in order: symptoms → age → gender → conditions → duration → severity
- **Single Focus:** Only one question per response

---

## 🚨 Emergency Detection

The AI still immediately detects emergencies:

**User:** "I have severe chest pain radiating to my left arm"

**AI Response (Immediate):**
```
⚠️ MEDICAL EMERGENCY DETECTED

This may be a medical emergency. Please:
🚨 Go to the Emergency Department immediately or
📞 Call 998 (UAE) or 911

Do not wait. Seek immediate medical attention.
```

No follow-up questions asked - session ends.

---

## 📊 Session Context Tracking

The system tracks what's been collected:

```typescript
sessionContext = {
  user: {
    age: 29,           // ✅ Collected in step 3
    gender: "female",  // ✅ Collected in step 4
    knownConditions: []// ✅ Collected in step 5
  },
  intake: {
    symptoms: "recurring headaches", // ✅ Collected in step 2
    duration: "2 weeks",             // ✅ Collected in step 6
    severity: "moderate",            // ✅ Collected in step 7
    redFlagsDetected: false
  }
}
```

This helps the AI know:
- What questions have been answered
- What to ask next
- When all data is collected

---

## 🔧 Troubleshooting

### Issue: AI asks multiple questions at once

**Possible causes:**
1. System prompt not clear enough
2. AI not receiving context about what's collected
3. Model temperature too high (makes AI more creative/unpredictable)

**Fix:**
Check that `determineNextQuestion()` is returning the right instruction.

---

### Issue: AI repeats questions

**Possible causes:**
1. Data extraction not working
2. Session state not persisting

**Fix:**
Check `extractPatientData()` and `extractIntakeData()` methods are correctly parsing responses.

---

### Issue: AI skips questions

**Possible causes:**
1. Multiple pieces of info provided in one message
2. AI inferring data not explicitly stated

**Example:**
User: "I'm a 29-year-old female with headaches"

This might cause AI to skip age/gender questions since they're already provided.

**This is actually GOOD behavior** - the AI adapts to natural conversation.

---

## 🎨 Customization

### To Change Question Order:

Edit `determineNextQuestion()` method to change the sequence.

### To Add New Questions:

1. Add field to `SessionContext` interface
2. Update `determineNextQuestion()` to check for it
3. Update system prompt with new question

### To Change AI Tone:

Modify the GUIDELINES section in `createSystemPrompt()`.

---

## 📱 Frontend Integration

### Display Current Phase:

```typescript
const phase = conversationState?.currentPhase;

// Show progress: "Collecting Information (Step 3 of 7)"
```

### Show What's Collected:

```typescript
const collected = [
  conversationState?.sessionContext.user.age ? "Age ✓" : "Age",
  conversationState?.sessionContext.user.gender ? "Gender ✓" : "Gender",
  // ... etc
];
```

### Typing Indicator:

While waiting for AI response, show "AI is typing..."

---

## 🚀 Performance

### Response Time:
- Average: 2-4 seconds per message
- Depends on Google AI API latency
- Can be optimized with caching

### Token Usage:
- System prompt: ~800 tokens
- Conversation history: ~50-100 tokens per exchange
- Total per session: ~1500-2000 tokens

---

## 📈 Monitoring

### Track These Metrics:

1. **Average Questions to Complete:** Should be 6-7
2. **Emergency Detection Rate:** % of conversations flagged
3. **Specialty Accuracy:** Does recommendation match symptoms?
4. **User Drop-off Rate:** Where do users stop responding?

---

## 🎯 Success Criteria

Your conversational flow is working if:

- ✅ AI greets warmly on first message
- ✅ Each response contains only ONE question
- ✅ Questions follow the 6-step sequence
- ✅ AI acknowledges answers before next question
- ✅ Emergency cases get immediate response
- ✅ After 6 questions, specialty is recommended
- ✅ Tone is empathetic and natural

---

## 📚 Related Files

- **Main Agent:** `src/lib/conversationalTriageAgent.ts`
- **API Route:** `src/app/api/chat/conversational/route.ts`
- **Test Script:** `test/conversational-flow-test.sh`
- **Types:** `src/types/index.ts`

---

## 💡 Tips for Best Results

1. **Keep Messages Short:** User messages should be brief responses
2. **Natural Language:** Users can say "29" or "I'm 29 years old" - both work
3. **Handle "I don't know":** AI should handle missing data gracefully
4. **Emergency First:** Always check for red flags before asking more questions
5. **Context Matters:** Past messages help AI understand current response

---

## 🆘 Need Help?

If the AI isn't asking questions one at a time:

1. Check the system prompt in `createSystemPrompt()`
2. Verify `determineNextQuestion()` is being called
3. Look at the full prompt being sent to AI (add console.log)
4. Check conversation history is being maintained
5. Ensure session state is persisting between messages

---

**Last Updated:** October 8, 2025  
**Status:** ✅ Conversational Flow Implemented  
**Next Step:** Test with real users!
