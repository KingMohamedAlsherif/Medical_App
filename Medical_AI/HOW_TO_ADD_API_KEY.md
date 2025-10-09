# 🔑 HOW TO ADD YOUR GOOGLE AI API KEY

## Current Status: ❌ NO API KEY CONFIGURED

Your AI is using the fallback rule-based system because no valid API key is set.

## 📋 Step-by-Step Instructions:

### Step 1: Get Your API Key
1. Open this URL in your browser: **https://aistudio.google.com/app/apikey**
2. Sign in with your Google account
3. Click the blue "Create API Key" button
4. Choose "Create API key in new project" (or select existing project)
5. **Copy the entire key** - it will look something like this:
   ```
   AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```

### Step 2: Add the Key to Your Project
1. Open the file: `.env.local` (in your project root)
2. Find the line that says: `GOOGLE_AI_API_KEY=PASTE_YOUR_API_KEY_HERE`
3. Replace `PASTE_YOUR_API_KEY_HERE` with your actual API key
4. Save the file

**Example - BEFORE:**
```bash
GOOGLE_AI_API_KEY=PASTE_YOUR_API_KEY_HERE
```

**Example - AFTER:**
```bash
GOOGLE_AI_API_KEY=AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### Step 3: Test Your API Key
Run this command in your terminal:
```bash
node test-api-key.js
```

You should see:
```
✅ SUCCESS! API key is valid!
🤖 AI Response: API key is working!
```

### Step 4: Restart Your Development Server
Stop the current server (Ctrl+C) and restart:
```bash
npm run dev
```

## 🎉 Once Complete:
Your AI will use Google Gemini (Gemini 1.5 Flash) for intelligent medical triage responses!

## ❓ Troubleshooting:

**Q: Where do I find the `.env.local` file?**
A: It's in your project root folder: `/home/mohamedalsherif/Desktop/Hackathons/Medical_App/Medical_AI/.env.local`

**Q: The API key doesn't work**
A: Make sure you copied the ENTIRE key, including the `AIzaSy` prefix

**Q: I don't have a Google account**
A: You need a Google account to use Google AI Studio. It's free to create one.

**Q: Is this free?**
A: Yes! Google AI Studio provides free API access with generous quotas.

## 📞 Need Help?
If you're still stuck, share the output of `node test-api-key.js` command.
