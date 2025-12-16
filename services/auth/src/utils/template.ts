export const welcomeTemplate = (name: string): string => {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to NextHire</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Header with Logo and Welcome Banner -->
                    <tr>
                        <td style="padding: 40px 40px 0; text-align: center; background: linear-gradient(135deg, #0033A0 0%, #0052CC 100%); border-radius: 8px 8px 0 0;">
                            <img src="https://res.cloudinary.com/goalslibrary/image/upload/v1765604322/NextHire_bv5jne.webp" alt="NextHire Logo" style="max-width: 200px; height: auto; display: block; margin: 0 auto 20px;">
                            <h1 style="color: #ffffff; font-size: 32px; margin: 0 0 10px; font-weight: bold;">Welcome to NextHire!</h1>
                            <p style="color: #E6F0FF; font-size: 18px; margin: 0 0 30px;">We're excited to have you on board</p>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 40px 40px 30px;">
                            <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 0 0 20px;">Hi <strong style="color: #333333;">[USER_NAME]</strong>,</p>
                            
                            <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 0 0 20px;">Thank you for joining NextHire! Your account has been successfully created, and you're now part of our growing community of professionals and employers.</p>
                            
                            <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 0 0 30px;">We're here to help you find your next great opportunity or connect with top talent.</p>
                            
                            <!-- Quick Start Guide -->
                            <h2 style="color: #333333; font-size: 20px; margin: 0 0 20px; border-bottom: 2px solid #0033A0; padding-bottom: 10px;">Quick Start Guide</h2>
                            
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <!-- Step 1 -->
                                <tr>
                                    <td style="padding: 15px 0; vertical-align: top; width: 40px;">
                                        <div style="width: 32px; height: 32px; background-color: #0033A0; color: #ffffff; border-radius: 50%; text-align: center; line-height: 32px; font-weight: bold; font-size: 16px;">1</div>
                                    </td>
                                    <td style="padding: 15px 0 15px 15px; vertical-align: top;">
                                        <h3 style="color: #333333; font-size: 16px; margin: 0 0 5px; font-weight: bold;">Complete Your Profile</h3>
                                        <p style="color: #666666; font-size: 14px; line-height: 20px; margin: 0;">Add your skills, profile picture and professional details to stand out.</p>
                                    </td>
                                </tr>
                                
                                <!-- Step 2 -->
                                <tr>
                                    <td style="padding: 15px 0; vertical-align: top; width: 40px;">
                                        <div style="width: 32px; height: 32px; background-color: #0033A0; color: #ffffff; border-radius: 50%; text-align: center; line-height: 32px; font-weight: bold; font-size: 16px;">2</div>
                                    </td>
                                    <td style="padding: 15px 0 15px 15px; vertical-align: top;">
                                        <h3 style="color: #333333; font-size: 16px; margin: 0 0 5px; font-weight: bold;">Explore Opportunities</h3>
                                        <p style="color: #666666; font-size: 14px; line-height: 20px; margin: 0;">Browse thousands of job listings tailored to your preferences.</p>
                                    </td>
                                </tr>
                                
                                <!-- Step 3 -->
                                <tr>
                                    <td style="padding: 15px 0; vertical-align: top; width: 40px;">
                                        <div style="width: 32px; height: 32px; background-color: #0033A0; color: #ffffff; border-radius: 50%; text-align: center; line-height: 32px; font-weight: bold; font-size: 16px;">3</div>
                                    </td>
                                    <td style="padding: 15px 0 15px 15px; vertical-align: top;">
                                        <h3 style="color: #333333; font-size: 16px; margin: 0 0 5px; font-weight: bold;">Start Applying</h3>
                                        <p style="color: #666666; font-size: 14px; line-height: 20px; margin: 0;">Apply to jobs with just one click and track your applications easily.</p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Support Section -->
                            <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 30px 0 20px;">Have questions? Our support team is here to help! Feel free to reach out anytime.</p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 40px; background-color: #f8f8f8; border-radius: 0 0 8px 8px; border-top: 1px solid #eeeeee;">
                            <p style="color: #999999; font-size: 14px; line-height: 20px; margin: 0 0 10px; text-align: center;">Best regards,<br>The NextHire Team</p>
                            
                            <p style="color: #999999; font-size: 12px; line-height: 18px; margin: 20px 0 0; text-align: center;">Questions? Contact us at <a href="mailto:support@nexthire.com" style="color: #0033A0; text-decoration: none;">support@nexthire.com</a></p>
                            
                            <p style="color: #cccccc; font-size: 11px; line-height: 16px; margin: 20px 0 0; text-align: center;">© 2025 NextHire. All rights reserved.<br>
                            <a href="[UNSUBSCRIBE_LINK]" style="color: #cccccc; text-decoration: underline;">Unsubscribe</a> | <a href="[PRIVACY_POLICY_LINK]" style="color: #cccccc; text-decoration: underline;">Privacy Policy</a></p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`.replace("[USER_NAME]", name);
}

export const verifyEmailTemplate = (otp: string): string => {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification - NextHire</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Header with Logo -->
                    <tr>
                        <td style="padding: 40px 40px 30px; text-align: center; background-color: #ffffff; border-radius: 8px 8px 0 0;">
                            <!-- Replace the src with your logo URL or base64 encoded image -->
                            <img src="https://res.cloudinary.com/goalslibrary/image/upload/v1765604322/NextHire_bv5jne.webp" alt="NextHire Logo" style="max-width: 200px; height: auto; display: block; margin: 0 auto;">
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 0 40px 40px;">
                            <h1 style="color: #333333; font-size: 24px; margin: 0 0 20px; text-align: center;">Verify Your Email Address</h1>
                            
                            <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 0 0 20px;">Hello,</p>
                            
                            <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 0 0 20px;">Thank you for signing up with NextHire! To complete your registration, please use the verification code below:</p>
                            
                            <!-- OTP Box -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="padding: 30px 0; text-align: center;">
                                        <div style="display: inline-block; background-color: #f8f9fa; border: 2px dashed #0033A0; border-radius: 8px; padding: 20px 40px;">
                                            <p style="color: #999999; font-size: 12px; margin: 0 0 10px; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
                                            <p style="color: #0033A0; font-size: 36px; font-weight: bold; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">[OTP_CODE]</p>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 0 0 20px; text-align: center;">Enter this code in the registration page to verify your email address.</p>
                            
                            <!-- Important Info Box -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="padding: 20px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
                                        <p style="color: #856404; font-size: 14px; line-height: 20px; margin: 0;"><strong>Important:</strong> This code will expire in <strong>10 minutes</strong> for security reasons.</p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Security Tips -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="padding: 20px 0; border-top: 1px solid #eeeeee;">
                                        <p style="color: #999999; font-size: 13px; line-height: 20px; margin: 0 0 10px;"><strong style="color: #666666;">Security Tips:</strong></p>
                                        <ul style="color: #999999; font-size: 13px; line-height: 20px; margin: 0; padding-left: 20px;">
                                            <li style="margin-bottom: 5px;">Never share this code with anyone</li>
                                            <li style="margin-bottom: 5px;">NextHire will never ask for this code via phone or email</li>
                                            <li>If you suspect suspicious activity, change your password immediately</li>
                                        </ul>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 40px; background-color: #f8f8f8; border-radius: 0 0 8px 8px; border-top: 1px solid #eeeeee;">
                            <p style="color: #999999; font-size: 14px; line-height: 20px; margin: 0 0 10px; text-align: center;">Best regards,<br>The NextHire Team</p>
                            
                            <p style="color: #999999; font-size: 12px; line-height: 18px; margin: 20px 0 0; text-align: center;">Need help? Contact us at <a href="mailto:support@nexthire.com" style="color: #0033A0; text-decoration: none;">support@nexthire.com</a></p>
                            
                            <p style="color: #cccccc; font-size: 11px; line-height: 16px; margin: 20px 0 0; text-align: center;">© 2025 NextHire. All rights reserved.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`.replace("[OTP_CODE]", otp);
}

export const forgetPasswordTemplate = (resetLink: string): string => { 
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password - NextHire</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Header with Logo -->
                    <tr>
                        <td style="padding: 40px 40px 30px; text-align: center; background-color: #ffffff; border-radius: 8px 8px 0 0;">
                            <!-- Replace the src with your logo URL or base64 encoded image -->
                            <img src="https://res.cloudinary.com/goalslibrary/image/upload/v1765604322/NextHire_bv5jne.webp" alt="NextHire Logo" style="max-width: 200px; height: auto; display: block; margin: 0 auto;">
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 0 40px 40px;">
                            <h1 style="color: #333333; font-size: 24px; margin: 0 0 20px; text-align: center;">Reset Your Password</h1>
                            
                            <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 0 0 20px;">Hello,</p>
                            
                            <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 0 0 20px;">We received a request to reset your password for your NextHire account. Click the button below to create a new password:</p>
                            
                            <!-- Reset Button -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="padding: 20px 0; text-align: center;">
                                        <a href="[RESET_PASSWORD_LINK]" style="display: inline-block; padding: 14px 40px; background-color: #0033A0; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 5px;">Reset Password</a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 0 0 20px;">This link will expire in 15 minutes for security reasons.</p>
                            
                            <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 0 0 20px;">If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
                            
                            <p style="color: #666666; font-size: 14px; line-height: 20px; margin: 30px 0 0; padding-top: 20px; border-top: 1px solid #eeeeee;">If the button doesn't work, copy and paste this link into your browser:</p>
                            <p style="color: #0033A0; font-size: 14px; line-height: 20px; margin: 10px 0 0; word-break: break-all;">[RESET_PASSWORD_LINK]</p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 40px; background-color: #f8f8f8; border-radius: 0 0 8px 8px; border-top: 1px solid #eeeeee;">
                            <p style="color: #999999; font-size: 14px; line-height: 20px; margin: 0 0 10px; text-align: center;">Best regards,<br>The NextHire Team</p>
                            
                            <p style="color: #999999; font-size: 12px; line-height: 18px; margin: 20px 0 0; text-align: center;">If you have any questions, please contact us at <a href="mailto:support@nexthire.com" style="color: #0033A0; text-decoration: none;">support@nexthire.com</a></p>
                            
                            <p style="color: #cccccc; font-size: 11px; line-height: 16px; margin: 20px 0 0; text-align: center;">© 2025 NextHire. All rights reserved.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.replace(/\[RESET_PASSWORD_LINK\]/g, resetLink);
}