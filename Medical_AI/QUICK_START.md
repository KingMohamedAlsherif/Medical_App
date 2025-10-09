# 🚀 Quick Start Guide - AI Conversational Triage

## ✅ Your Setup is Complete!

Your `.env` file is detected and the Google AI API key is configured.

---

## 🎯 How to Use

### Start the Application
```bash
npm run dev
```

### Access the AI Triage Assistant
Open your browser and visit:
```
http://localhost:3000/conversational-triage
```

---

## 💬 Try These Example Conversations

### Example 1: Emergency Case
```
You: "I'm having severe chest pain and shortness of breath"

AI: Will immediately recognize this as an emergency and 
recommend calling 911
```

### Example 2: Routine Checkup
```
You: "I've had a mild headache for a few days"

AI: Will ask natural follow-up questions:
- When did it start?
- How severe is it?
- Any other symptoms?
- What's your name and age?
Then recommend appropriate care
```

### Example 3: Natural Conversation
```
You: "Hi, I'm not feeling well"

AI: "Hello! I'm sorry to hear you're not feeling well. 
I'm here to help. Can you tell me more about what's 
bothering you? What symptoms are you experiencing?"
```

---

## 🎨 How the AI Works

### The AI Will:
✅ **Naturally ask questions** based on what you say
✅ **Remember context** from previous messages
✅ **Extract information** automatically (name, age, symptoms)
✅ **Detect emergencies** and recommend immediate action
✅ **Suggest specialists** based on symptoms
✅ **Provide empathetic responses** that feel human

### The AI Won't:
❌ Ask rigid, form-like questions
❌ Force you through a step-by-step process
❌ Ignore context from previous messages
❌ Give scripted, robotic responses

---

## 🔑 Key Features

### 1. **Natural Language Understanding**
The AI understands:
- "I'm 35" = Age is 35
- "My name is John" = Name is John
- "I have diabetes" = Chronic condition detected

### 2. **Smart Emergency Detection**
Automatically detects critical symptoms:
- Chest pain
- Severe bleeding
- Difficulty breathing
- Stroke signs
- Suicidal thoughts

### 3. **Dynamic Questioning**
AI asks relevant follow-up questions based on:
- Previous answers
- Symptom type
- Severity indicators
- Patient age/history

### 4. **Specialist Recommendations**
Suggests appropriate specialists:
- Cardiology (heart issues)
- Neurology (brain/nervous system)
- Orthopedics (bones/joints)
- Dermatology (skin)
- Gastroenterology (digestive)
- And more...

---

## 🛠️ Troubleshooting

### If the AI doesn't respond:
1. Check the browser console for errors (F12)
2. Verify your API key in `.env`:
   ```bash
   cat .env | grep GOOGLE_AI_API_KEY
   ```
3. Restart the dev server:
   ```bash
   npm run dev
   ```

### If responses are slow:
- This is normal for the first request
- Google AI free tier has rate limits
- Consider upgrading to paid tier for faster responses

### If you get API errors:
- Check your API key is valid
- Verify you haven't exceeded rate limits
- Visit https://ai.google.dev/ to check your quota

---

## 📊 API Testing

### Test the API directly with curl:
```bash
curl -X POST http://localhost:3000/api/chat/conversational \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I have a headache",
    "sessionId": null,
    "conversationState": {
      "patientData": {},
      "conversationHistory": []
    }
  }'
```

### Expected Response:
```json
{
  "sessionId": "abc123...",
  "response": "I'm sorry to hear you have a headache...",
  "conversationState": {
    "patientData": {...},
    "conversationHistory": [...]
  },
  "isComplete": false
}
```

---

## 🎓 Understanding the Code

### Main File: `src/lib/conversationalTriageAgent.ts`

**Key Methods:**
- `processMessage()` - Main AI conversation handler
- `createSystemPrompt()` - Defines how AI behaves
- `extractPatientData()` - Extracts info automatically
- `analyzeForEmergency()` - Detects critical symptoms
- `generateTriageResult()` - Creates final assessment

### Customizing AI Behavior:
Edit the system prompt in `createSystemPrompt()` to change:
- Tone (formal/casual/empathetic)
- Question types
- Emergency criteria
- Specialist categories

---

## 📝 Environment Variables

Your `.env` file should contain:

```bash
# Google AI API Key (get from https://ai.google.dev/)
GOOGLE_AI_API_KEY=your_actual_api_key_here

# Alternative name (both work)
GEMINI_API_KEY=your_actual_api_key_here
```

**Note:** Only one is needed, but both are supported.

---

## 🔒 Security Features

✅ Rate limiting on API calls
✅ Input sanitization
✅ Crisis detection (suicide/self-harm)
✅ Medical disclaimer on all assessments
✅ Session-based conversations

---

## 📚 Additional Resources

- **Full Setup Guide:** `AI_CONVERSATIONAL_SETUP.md`
- **Transformation Details:** `TRANSFORMATION_COMPLETE.md`
- **Google AI Docs:** https://ai.google.dev/docs
- **Test Script:** `./test-ai-setup.sh`

---

## 🎉 You're Ready!

Start the app and have natural conversations with your AI medical triage assistant!

```bash
npm run dev
# Visit http://localhost:3000/conversational-triage
```

---

**Questions?** Check the documentation files or the code comments in `conversationalTriageAgent.ts`.

**Happy Coding!** 🚀
