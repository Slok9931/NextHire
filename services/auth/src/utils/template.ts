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
                            
                            <p style="color: #cccccc; font-size: 11px; line-height: 16px; margin: 20px 0 0; text-align: center;">© 2024 NextHire. All rights reserved.</p>
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