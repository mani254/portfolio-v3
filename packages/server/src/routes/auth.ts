import { Router } from 'express';
import {
    registerUser,
    loginUser,
    handleLogout,
    getMe,
    createRefreshToken,
    initiateGoogleAuth,
    handleGoogleCallback,
} from '../controllers/authController';
import { authGuard } from '../middleware/authGuard';

import { validate } from '../middleware/validate';
import { registerSchema, loginSchema } from '../features/auth/auth.schema';

const authRouter = Router();

authRouter.post('/register',       validate(registerSchema), registerUser);
authRouter.post('/login',          validate(loginSchema),    loginUser);
authRouter.post('/logout',         authGuard, handleLogout);
authRouter.get('/me',              authGuard, getMe);
authRouter.get('/refresh',         createRefreshToken);
authRouter.get('/google',          initiateGoogleAuth);
authRouter.get('/google/callback', handleGoogleCallback);

export default authRouter;
