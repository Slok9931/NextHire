import express from 'express'
import { loginUser, registerUser, forgotPassword, resetPassword, requestOTP, verifyOTP } from '../controllers/auth.js'
import uploadFile from '../middleware/multer.js'

const router = express.Router();

router.post('/request-otp', requestOTP);
router.post('/verify-otp', verifyOTP);
router.post('/register', uploadFile, registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router