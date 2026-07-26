import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const requiredEnvVars = ['MONGO_URL'];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`[CRITICAL] Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  mongoUrl: process.env.MONGO_URL,
  jwt: {
    secret: process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  ai: {
    geminiKey: process.env.Devixa_Gemini_API_Key || '',
    groqKey: process.env.Devixa_Groq_API_Key || '',
    openRouterKey: process.env.Devixa_OpenRouter_API_Key || process.env.Devixa_BaazarLink_API_Key || '',
  },
  cloudinary: {
    cloudName: process.env.Cloud_Name || process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.Cloudinary_API_Key || process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.API_Secret || process.env.CLOUDINARY_API_SECRET || '',
    cloudinaryUrl: process.env.CLOUDINARY_URL || '',
  },
  corsOrigin: process.env.CORS_ORIGIN || '*',
};
