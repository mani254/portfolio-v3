import dotenv from 'dotenv';
import { z } from 'zod';
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(8080),
  MONGODB_URI: z.string().url(),
  REDIS_URL: z.string().url().default('redis://localhost:6379'),
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),
  ALLOWED_ORIGINS: z.string().transform((str) => str.split(',').map((s) => s.trim())).default(['http://localhost:3000']),

  // Auth
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),

  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_REDIRECT_URI: z.string().url().optional(),

  // Mail
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error('❌ Invalid environment variables:');
  console.error(result.error.flatten().fieldErrors);
  process.exit(1);
}

// todo:write a function get grok api key where it will fetch

export function getGrokApiKey() {
  const environment = process.env.ENVIRONMENT || 'local'
  if (environment === 'production') {
    return process.env.GROQ_CHATAPI_PRODUCTION_API_KEY
  }
  else {
    return process.env.GROQ_CHATAPI_DEVELOPMENT_API_KEY
  }

}

export function getGeminiApiKey() {
  const environment = process.env.ENVIRONMENT || 'local'
  if (environment === 'production') {
    return process.env.GEMINI_CHATAPI_PRODUCTION_API_KEY as string
  }
  else {
    return process.env.GEMINI_CHATAPI_DEVELOPMENT_API_KEY as string
  }

}

export const env = result.data;
