import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';

// Routes
import authRouter from './routes/auth';
import chatRoute from './routes/chat';
import otpRouter from './routes/otp';
import testRoute from './routes/testRoute';
import chunksRouter from './routes/chunks';

const app = express();

// ---------------------------------------------------------------------------
// CORS — read from ALLOWED_ORIGINS env
// ---------------------------------------------------------------------------
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || env.ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
app.use('/api/test',   testRoute);
app.use('/api/chats',  chatRoute);
app.use('/api/auth',   authRouter);
app.use('/api/otp',    otpRouter);
app.use('/api/chunks', chunksRouter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global error handler — must be last
app.use(errorHandler);

export default app;
