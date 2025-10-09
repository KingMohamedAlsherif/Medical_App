#!/usr/bin/env node
/**
 * Test Google AI API Key
 * Run this to verify your API key is valid before starting the app
 */

require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

async function testApiKey() {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  
  console.log('\n🔍 Checking Google AI API Key...\n');
  
  if (!apiKey) {
    console.log('❌ ERROR: GOOGLE_AI_API_KEY is not set!');
    console.log('\n📝 To fix this:');
    console.log('1. Go to: https://aistudio.google.com/app/apikey');
    console.log('2. Create a new API key');
    console.log('3. Add it to .env.local file like this:');
    console.log('   GOOGLE_AI_API_KEY=your_actual_key_here\n');
    process.exit(1);
  }
  
  console.log('✅ API Key found in environment');
  console.log(`📋 Key preview: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`);
  console.log(`📏 Key length: ${apiKey.length} characters`);
  
  // Test the API key with a simple request
  console.log('\n🧪 Testing API key with Google AI...');
  
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    const result = await model.generateContent('Say "API key is working!" in one short sentence.');
    const response = result.response.text();
    
    console.log('✅ SUCCESS! API key is valid!');
    console.log(`🤖 AI Response: ${response}`);
    console.log('\n✨ You can now start your app with: npm run dev\n');
    
  } catch (error) {
    console.log('❌ ERROR: API key is invalid!');
    console.log(`\n📋 Error message: ${error.message}`);
    console.log('\n📝 To fix this:');
    console.log('1. Go to: https://aistudio.google.com/app/apikey');
    console.log('2. Create a NEW API key');
    console.log('3. Replace the key in .env.local file');
    console.log('4. Run this test again: node test-api-key.js\n');
    process.exit(1);
  }
}

testApiKey().catch(console.error);
