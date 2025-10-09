# 📋 Quick Reference Card - Cleveland Clinic Agent System

## 🚀 Quick Start

### What Changed?
All AI agents now follow a **multi-agent supervisor pattern** for safer, more structured patient triage.

### Key Files Modified:
- `src/lib/conversationalTriageAgent.ts` - Main orchestrator
- `src/lib/enhancedTriageAgent.ts` - AI-powered analysis
- `src/lib/triageAgent.ts` - Rule-based backup

---

## 🔁 The 5-Phase Flow

```
1. INTAKE → 2. EMERGENCY → 3. SPECIALTY → 4. BOOKING → 5. SUMMARY
```

| Phase | Goal | Output |
|-------|------|--------|
| 📋 Intake | Collect data | User info + symptoms |
| 🚨 Emergency | Safety check | Emergency flag + confidence |
| 🧬 Specialty | Match symptoms | Recommended specialty |
| 📅 Booking | Schedule | Appointment confirmation |
| 🧾 Summary | Document | Patient + clinician reports |

---

## 🚨 Emergency Keywords (Auto-Trigger)

**Cardiac:**
- chest pain, chest pressure, left arm pain, jaw pain

**Respiratory:**
- can't breathe, difficulty breathing, blue lips, gasping

**Neurological:**
- stroke, seizure, facial drooping, slurred speech, unconscious

**Mental Health:**
- suicide, kill myself, self-harm

**Other:**
- severe bleeding, severe allergic reaction, overdose

**Action:** Immediate stop + display 998/911

---

## 🏥 Specialty Mappings

| Symptoms | Specialty |
|----------|-----------|
| Headache, dizziness, seizure, numbness | Neurology |
| Stomach pain, nausea, vomiting, diarrhea | Gastroenterology |
| Cough, wheezing, shortness of breath (non-emergency) | Pulmonology |
| Rash, itching, acne, skin lesions | Dermatology |
| Joint pain, swelling, stiffness | Rheumatology |
| Back pain, fracture, bone pain | Orthopedics |
| Heart palpitations (non-emergency) | Cardiology |
| Fever, fatigue, general weakness | Internal Medicine |

---

## 📊 Session Context Structure

```typescript
sessionContext = {
  user: { name, age, gender, knownConditions },
  intake: { symptoms, duration, severity, redFlagsDetected },
  triage: { isEmergency, reason, confidence, recommendedSpecialty },
  booking: { doctorName, specialty, date, confirmationId },
  audit: [{ timestamp, agent, action, reasoning, confidence }]
}
```

---

## 🎯 Confidence Scores

| Range | Meaning | Action |
|-------|---------|--------|
| 0.95-1.0 | Very High | Emergency or clear specialty match |
| 0.80-0.94 | High | Confident recommendation |
| 0.60-0.79 | Moderate | Good match, some uncertainty |
| < 0.60 | Low | Consider human review |

---

## ⚡ Quick Decision Tree

```
User Message
    │
    ├─ Contains emergency keyword? → YES → STOP → Display 998/911
    │                              → NO ↓
    │
    ├─ Red flags detected? → YES → Emergency Agent → Assess Risk
    │                      → NO ↓
    │
    ├─ Enough info collected? → NO → Ask more questions
    │                         → YES ↓
    │
    ├─ Specialty clear? → YES → Recommend + Offer booking
    │                   → NO → Ask clarifying questions
    │
    └─ Book appointment? → YES → Simulate booking → Summary
                        → NO → End with advice
```

---

## 🧠 Agent Responsibilities

### 📋 Intake Agent
- Ask structured questions
- Extract age, gender, conditions
- Identify symptoms, duration, severity
- Flag red flags

### 🚨 Emergency Detection Agent
- Check emergency patterns
- Consider age + risk factors
- Assign confidence score
- STOP flow if emergency

### 🧬 Specialty Classifier Agent
- Match symptom patterns
- Consider multiple specialties
- Rank by confidence
- Provide reasoning

### 📅 Booking Agent
- Request patient info (if new)
- Show available doctors
- Generate confirmation ID
- Return booking summary

### 🧾 Summary Agent
- Create patient summary (friendly)
- Create clinician summary (JSON)
- Log final audit entry
- Mark session complete

---

## 🔧 Common Tasks

### How to Test Emergency Detection:
```bash
curl -X POST http://localhost:3000/api/chat/conversational \
  -H "Content-Type: application/json" \
  -d '{"message": "I have severe chest pain"}'
```

### How to Check Session State:
Look for `sessionContext` in API response:
```json
{
  "newState": {
    "sessionContext": { ... },
    "currentPhase": "emergency"
  }
}
```

### How to View Audit Log:
```json
"audit": [
  {
    "timestamp": "2025-10-08T14:23:00Z",
    "agent": "Emergency Detection Agent",
    "action": "Emergency flagged",
    "reasoning": "Cardiac symptoms detected",
    "confidence": 0.98
  }
]
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `CLEVELAND_CLINIC_AGENT_INSTRUCTIONS.md` | Full operational guide |
| `AGENT_UPDATE_SUMMARY.md` | What changed and why |
| `MULTI_AGENT_FLOW_DIAGRAM.md` | Visual flow diagram |
| `TESTING_SCENARIOS.md` | Test cases and examples |
| This file | Quick reference |

---

## 🚨 Emergency Response Template

```
⚠️ **MEDICAL EMERGENCY DETECTED**

This may be a medical emergency. Please:
🚨 **Go to the Emergency Department immediately** or
📞 **Call 998** (UAE Emergency Number)

Do not wait. Seek immediate medical attention.
```

---

## ✅ Pre-Flight Checklist

Before deploying:
- [ ] All agents have consistent instructions
- [ ] Emergency keywords tested
- [ ] Specialty mappings validated
- [ ] Audit logging functional
- [ ] Session context persists correctly
- [ ] Medical disclaimers shown
- [ ] Emergency numbers correct (998 for UAE)
- [ ] Confidence scores make sense
- [ ] No false negatives on emergencies

---

## 🐛 Troubleshooting

### Issue: Emergency not detected
- Check: Is keyword exact match? (case-insensitive)
- Check: `analyzeForEmergency()` function
- Check: Emergency threshold settings

### Issue: Wrong specialty recommended
- Check: Symptom keywords in message
- Check: `SPECIALTY_ANALYSIS` patterns
- Check: Pattern matching logic

### Issue: Audit log empty
- Check: Each agent calls `audit.push()`
- Check: Session context preserved

### Issue: Low confidence scores
- Check: Symptom description clarity
- Check: Pattern matching weights
- May trigger human review (expected)

---

## 📞 Emergency Contact Numbers

- **UAE:** 998
- **US:** 911
- **Poison Control (US):** 1-800-222-1222
- **Suicide Prevention:** 988

---

## 🔐 Security Reminders

- ✅ Encrypt all patient data
- ✅ Session data expires in 24h
- ✅ Audit logs are immutable
- ✅ HIPAA compliance required
- ✅ UAE healthcare regulations

---

## 🎓 Best Practices

1. **Always prioritize safety** - False positive > False negative
2. **Log everything** - Every decision needs reasoning
3. **Be empathetic** - Health concerns are stressful
4. **Clear communication** - Avoid medical jargon
5. **No diagnosis** - Recommend specialists, don't diagnose
6. **Document thoroughly** - Audit trails are essential
7. **Test edge cases** - Ambiguous symptoms happen
8. **Human oversight** - Low confidence → escalate

---

## 📈 Success Metrics

- ✅ Emergency detection: 95%+ accuracy
- ✅ Specialty recommendation: 80%+ accuracy
- ✅ Zero false negatives on life-threatening symptoms
- ✅ User satisfaction: Clear next steps
- ✅ Audit completeness: 100%

---

## 🔄 Version Info

**Current Version:** 2.0  
**Last Updated:** October 8, 2025  
**Status:** ✅ Production Ready  
**Next Review:** After first 100 real sessions

---

## 💡 Quick Tips

- Emergency keywords are case-insensitive
- Age > 40 + chest pain = higher risk
- Multiple symptoms = higher confidence
- "Mild" severity rarely triggers emergency
- Always include medical disclaimer
- Keep conversation natural and flowing
- Ask 1-2 questions at a time
- Acknowledge patient concerns

---

## 🆘 Need Help?

1. Read: `CLEVELAND_CLINIC_AGENT_INSTRUCTIONS.md`
2. Check: `TESTING_SCENARIOS.md` for examples
3. Review: `MULTI_AGENT_FLOW_DIAGRAM.md` for visual guide
4. Debug: Check `sessionContext.audit` for decision trail

---

**Print this card and keep it handy! 📋**
