export const submitApplicationTemplate = (name: string, title: string, company_name: string, location: string, date: string, role: string, link: string): string => {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application Received - NextHire</title>
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
                            <h1 style="color: #28a745; font-size: 26px; margin: 0 0 10px; text-align: center; font-weight: bold;">Application Successfully Submitted!</h1>
                            
                            <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 0 0 30px; text-align: center;">Thank you for applying. We've received your application.</p>
                            
                            <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 0 0 30px;">Dear [CANDIDATE_NAME],</p>
                            
                            <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 0 0 30px;">Thank you for your interest in joining our team! Your application has been successfully submitted and is now being reviewed by our hiring team.</p>
                            
                            <!-- Job Details Box -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="padding: 25px; background-color: #f8f9fa; border-radius: 6px; margin-bottom: 20px;">
                                        <p style="color: #999999; font-size: 12px; margin: 0 0 15px; text-transform: uppercase; letter-spacing: 1px; text-align: center;">Application Details</p>
                                        
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td style="padding-bottom: 15px; border-bottom: 2px solid #0033A0;">
                                                    <p style="color: #0033A0; font-size: 20px; font-weight: bold; margin: 0; text-align: center;">[JOB_TITLE]</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding-top: 15px;">
                                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                        <tr>
                                                            <td style="width: 50%; padding-bottom: 12px;">
                                                                <p style="color: #999999; font-size: 12px; margin: 0 0 3px; text-transform: uppercase; letter-spacing: 0.5px;">Company</p>
                                                                <p style="color: #333333; font-size: 14px; margin: 0; font-weight: 500;">[COMPANY_NAME]</p>
                                                            </td>
                                                            <td style="width: 50%; padding-bottom: 12px;">
                                                                <p style="color: #999999; font-size: 12px; margin: 0 0 3px; text-transform: uppercase; letter-spacing: 0.5px;">Location</p>
                                                                <p style="color: #333333; font-size: 14px; margin: 0; font-weight: 500;">[JOB_LOCATION]</p>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="padding-bottom: 12px;">
                                                                <p style="color: #999999; font-size: 12px; margin: 0 0 3px; text-transform: uppercase; letter-spacing: 0.5px;">Submitted On</p>
                                                                <p style="color: #333333; font-size: 14px; margin: 0; font-weight: 500;">[SUBMISSION_DATE]</p>
                                                            </td>
                                                            <td style="padding-bottom: 12px;">
                                                                <p style="color: #999999; font-size: 12px; margin: 0 0 3px; text-transform: uppercase; letter-spacing: 0.5px;">Role</p>
                                                                <p style="color: #333333; font-size: 14px; margin: 0; font-weight: 500;">[ROLE]</p>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- What Happens Next Section -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 30px;">
                                <tr>
                                    <td style="padding: 25px; background-color: #e8f4f8; border-radius: 6px;">
                                        <p style="color: #0066A0; font-size: 18px; font-weight: bold; margin: 0 0 15px;">📋 What Happens Next?</p>
                                        <ul style="color: #555555; font-size: 14px; line-height: 24px; margin: 0; padding-left: 20px;">
                                            <li style="margin-bottom: 10px;">Our hiring team will carefully review your application and qualifications</li>
                                            <li style="margin-bottom: 10px;">You'll receive an email notification about your application status</li>
                                            <li style="margin-bottom: 10px;">If your profile matches our requirements, we'll contact you for the next steps</li>
                                            <li>Please keep an eye on your email (including spam folder) for updates</li>
                                        </ul>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Track Application Button -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="padding: 30px 0 10px; text-align: center;">
                                        <a href="[TRACKING_LINK]" style="display: inline-block; padding: 14px 40px; background-color: #0033A0; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 5px;">Track Application Status</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 40px; background-color: #f8f8f8; border-radius: 0 0 8px 8px; border-top: 1px solid #eeeeee;">
                            <p style="color: #cccccc; font-size: 11px; line-height: 16px; margin: 20px 0 0; text-align: center;">© 2025 NextHire. All rights reserved.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`
      .replace("[CANDIDATE_NAME]", name)
      .replace("[JOB_TITLE]", title)
      .replace("[COMPANY_NAME]", company_name)
      .replace("[JOB_LOCATION]", location)
      .replace("[SUBMISSION_DATE]", date)
      .replace("[ROLE]", role)
      .replace("[TRACKING_LINK]", link);
}