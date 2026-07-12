import path from 'path';
import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Load Firebase configuration
const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
let firebaseConfig: any = null;
let db: any = null;

if (fs.existsSync(configPath)) {
  try {
    firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const firebaseApp = initializeApp(firebaseConfig);
    db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
    console.log('[ShopEZ Backend] Firebase initialized successfully. Connected to database ID:', firebaseConfig.firestoreDatabaseId);
  } catch (err) {
    console.error('[ShopEZ Backend] Failed to initialize Firebase on server:', err);
  }
} else {
  console.warn('[ShopEZ Backend] firebase-applet-config.json not found! Server will run with local in-memory fallback.');
}

// System Token Parsing
let SYSTEM_TOKEN = (process.env.SYSTEM_TOKEN || 'shopez_secure_backend_system_token_2026').trim();
if ((SYSTEM_TOKEN.startsWith('"') && SYSTEM_TOKEN.endsWith('"')) || 
    (SYSTEM_TOKEN.startsWith("'") && SYSTEM_TOKEN.endsWith("'"))) {
  SYSTEM_TOKEN = SYSTEM_TOKEN.substring(1, SYSTEM_TOKEN.length - 1).trim();
}

// Initialize Gemini API
let geminiApiKey = process.env.GEMINI_API_KEY?.trim();
if (geminiApiKey) {
  if ((geminiApiKey.startsWith('"') && geminiApiKey.endsWith('"')) || 
      (geminiApiKey.startsWith("'") && geminiApiKey.endsWith("'"))) {
    geminiApiKey = geminiApiKey.substring(1, geminiApiKey.length - 1).trim();
  }
}
let ai: GoogleGenAI | null = null;

if (geminiApiKey && geminiApiKey !== 'MY_GEMINI_API_KEY' && geminiApiKey !== '') {
  try {
    ai = new GoogleGenAI({ 
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log('Gemini API initialized successfully in backend with aistudio-build telemetry.');
  } catch (error) {
    console.error('Failed to initialize Gemini API:', error);
  }
} else {
  console.warn('GEMINI_API_KEY is not configured or contains the default placeholder. AI Assistant will run in simulated mode.');
}

export { db, firebaseConfig, SYSTEM_TOKEN, ai };
