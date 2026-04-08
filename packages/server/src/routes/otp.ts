import { Router } from 'express';
import { generateOtp, verifyOtp, resendOtp } from '../controllers/otpController';

const otpRouter = Router();

otpRouter.post('/generate', generateOtp);
otpRouter.post('/verify',   verifyOtp);
otpRouter.post('/resend',   resendOtp);

export default otpRouter;
