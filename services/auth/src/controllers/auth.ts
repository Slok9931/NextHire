import axios from "axios"
import getBuffer from "../utils/buffer.js"
import { sql } from "../utils/db.js"
import ErrorHandler from "../utils/errorHandler.js"
import { tryCatch } from "../utils/tryCatch.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { forgetPasswordTemplate, verifyEmailTemplate, welcomeTemplate } from "../utils/template.js"
import { publishToTopic } from "../producer.js"
import { redisClient } from "../index.js"

export const requestOTP = tryCatch(async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        throw new ErrorHandler("Please provide email", 400);
    }

    const existingUser = await sql`SELECT user_id FROM users WHERE email = ${email}`;
    if (existingUser.length > 0) {
        throw new ErrorHandler("User with this email already exists", 409);
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Hash the otp before storing
    const hashedOTP = await bcrypt.hash(otp, 10);

    await redisClient.setEx(`otp:${email}`, 10 * 60, hashedOTP);

    const message = {
        to: email,
        subject: "Email Verification - NextHire",
        html: verifyEmailTemplate(otp)
    };

    publishToTopic('send-mail', message);

    res.status(200).json({
        success: true,
        message: "OTP has been sent to your email",
        data: { email }
    });
});

export const verifyOTP = tryCatch(async (req, res, next) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        throw new ErrorHandler("Please provide email and OTP", 400);
    }

    const storedOTP = await redisClient.get(`otp:${email}`);
    if (!storedOTP) {
        throw new ErrorHandler("OTP has expired or doesn't exist", 400);
    }

    // Compare the hashed OTPs
    const isOTPValid = await bcrypt.compare(otp, storedOTP);

    if (!isOTPValid) {
        throw new ErrorHandler("Invalid OTP", 400);
    }

    await redisClient.setEx(`verified:${email}`, 15 * 60, "true");
    
    await redisClient.del(`otp:${email}`);

    res.status(200).json({
        success: true,
        message: "Email verified successfully. You can now register.",
        data: { email }
    });
});

export const registerUser = tryCatch(async (req, res, next) => {
    const { name, email, password, phone_number, role, bio } = req.body;
    if(!name || !email || !password || !phone_number || !role) {
        throw new ErrorHandler("Please fill all required fields", 400);
    }

    const isEmailVerified = await redisClient.get(`verified:${email}`);
    if (!isEmailVerified) {
        throw new ErrorHandler("Please verify your email first", 400);
    }

    const existingUser = await sql`SELECT user_id FROM users WHERE email = ${email}`;

    if(existingUser.length > 0) {
        throw new ErrorHandler("User with this email already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    let registeredUser;

    if (role === 'recruiter') {
        const [user] = await sql`
            INSERT INTO users (name, email, password, phone_number, role)
            VALUES (${name}, ${email}, ${hashedPassword}, ${phone_number}, ${role})
            RETURNING user_id, name, email, phone_number, role, created_at
        `
        registeredUser = user
    }
    else if (role === 'jobseeker') { 
        const file = req.file;

        if(!file) {
            throw new ErrorHandler("Please upload your resume", 400);
        }

        const fileBuffer = getBuffer(file);
        
        if (!fileBuffer || !fileBuffer.content) {
            throw new ErrorHandler("Error processing the uploaded file", 500);
        }
        
        const { data } = await axios.post(`${process.env.FILE_UPLOAD_SERVICE_URL}/api/utils/upload`, {buffer: fileBuffer.content});
        
        const [user] = await sql`
            INSERT INTO users (name, email, password, phone_number, role, bio, resume, resume_public_id)
            VALUES (${name}, ${email}, ${hashedPassword}, ${phone_number}, ${role}, ${bio}, ${data.url}, ${data.public_id})
            RETURNING user_id, name, email, phone_number, role, bio, resume, created_at
        `
        registeredUser = user
    }

    const message = {
        to: email,
        subject: "Welcome to NextHire!",
        html: welcomeTemplate(registerUser.name)
    }

    publishToTopic('send-mail', message);

    const token = jwt.sign({ user_id: registeredUser?.user_id, role: registeredUser?.role }, process.env.JWT_SECRET as string, { expiresIn: '15d' });

    await redisClient.del(`verified:${email}`);

    res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: registeredUser,
        token: token
    });
})

export const loginUser = tryCatch(async (req, res, next) => {
    const { email, password } = req.body;
    if(!email || !password) {
        throw new ErrorHandler("Please provide email and password", 400);
    }

    // Fetch user along with their skills
    const users = await sql`SELECT u.user_id, u.name, u.email, u.password, u.phone_number, u.role, u.bio, u.resume, u.profile_pic, u.subscription, ARRAY_AGG(s.name) FILTER(WHERE s.name IS NOT NULL) as skills FROM users u LEFT JOIN user_skills us ON u.user_id = us.user_id LEFT JOIN skills s ON us.skill_id = s.skill_id WHERE u.email = ${email} GROUP BY u.user_id`;

    if(users.length === 0) {
        throw new ErrorHandler("Invalid email or password", 401);
    }

    const user = users[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) {
        throw new ErrorHandler("Invalid email or password", 401);
    }

    const userSkills = user.skills || []

    delete user.password;

    const token = jwt.sign({ user_id: user.user_id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '15d' });

    res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: user,
        token: token
    });
})

export const forgotPassword = tryCatch(async (req, res, next) => { 
    const { email } = req.body;
    if(!email) {
        throw new ErrorHandler("Please provide email", 400);
    }

    const users = await sql`SELECT user_id, email FROM users WHERE email = ${email}`;

    if(users.length === 0) {
        return res.status(200).json({
            success: true,
            message: "If an account with that email exists, a password reset link has been sent.",
            data: {}
        });
    }

    const user = users[0];

    const resetToken = jwt.sign({ user_id: user.user_id, email: user.email, type: 'reset' }, process.env.JWT_SECRET as string, { expiresIn: '15m' });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    await redisClient.set(`forgot:${email}`, resetToken, { EX: 15 * 60 }); // 15 minutes expiration
    
    const message = {
        to: email,
        subject: "Password Reset Request - NextHire",
        html: forgetPasswordTemplate(resetUrl)
    }

    publishToTopic('send-mail', message);

    res.status(200).json({
        success: true,
        message: "If an account with that email exists, a password reset link has been sent.",
        data: {}
    });
})

export const resetPassword = tryCatch(async (req, res, next) => { 
    const { token } = req.params;
    const { password } = req.body;
    if(!token || !password) {
        throw new ErrorHandler("Invalid request", 400);
    }

    let decoded: any;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    } catch (err) {
        throw new ErrorHandler("Invalid or expired token", 400);
    }

    if(decoded.type !== 'reset') {
        throw new ErrorHandler("Invalid token type", 400);
    }

    const storedToken = await redisClient.get(`forgot:${decoded.email}`);
    if(!storedToken || storedToken !== token) {
        throw new ErrorHandler("Invalid or expired token", 400);
    }

    const users = await sql`SELECT user_id FROM users WHERE user_id = ${decoded.user_id}`;

    if(users.length === 0) {
        throw new ErrorHandler("User not found", 404);
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    await sql`UPDATE users SET password = ${hashedPassword} WHERE user_id = ${decoded.user_id}`;

    await redisClient.del(`forgot:${decoded.email}`);

    res.status(200).json({
        success: true,
        message: "Password has been reset successfully",
        data: {}
    });
})