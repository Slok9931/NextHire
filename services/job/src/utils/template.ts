export const jobStatusTemplate = (name: string, title: string, company_name: string, location: string, date: string, role: string, link: string): string => {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Job Application Update - NextHire</title>
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
                            <h1 style="color: #333333; font-size: 24px; margin: 0 0 20px; text-align: center;">Application Update</h1>
                            
                            <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 0 0 20px;">Dear [CANDIDATE_NAME],</p>
                            
                            <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 0 0 30px;">Thank you for your interest in the following position with our company. We wanted to update you on the status of your application.</p>
                            
                            <!-- Job Details Box -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="padding: 25px; background-color: #f8f9fa; border-radius: 6px; margin-bottom: 20px;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td style="padding-bottom: 15px; border-bottom: 2px solid #0033A0;">
                                                    <p style="color: #0033A0; font-size: 20px; font-weight: bold; margin: 0;">[JOB_TITLE]</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding-top: 15px;">
                                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                        <tr>
                                                            <td style="width: 50%; padding-bottom: 8px;">
                                                                <p style="color: #999999; font-size: 12px; margin: 0 0 3px; text-transform: uppercase; letter-spacing: 0.5px;">Company</p>
                                                                <p style="color: #333333; font-size: 14px; margin: 0; font-weight: 500;">[COMPANY_NAME]</p>
                                                            </td>
                                                            <td style="width: 50%; padding-bottom: 8px;">
                                                                <p style="color: #999999; font-size: 12px; margin: 0 0 3px; text-transform: uppercase; letter-spacing: 0.5px;">Location</p>
                                                                <p style="color: #333333; font-size: 14px; margin: 0; font-weight: 500;">[JOB_LOCATION]</p>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="padding-top: 8px;">
                                                                <p style="color: #999999; font-size: 12px; margin: 0 0 3px; text-transform: uppercase; letter-spacing: 0.5px;">Applied On</p>
                                                                <p style="color: #333333; font-size: 14px; margin: 0; font-weight: 500;">[APPLICATION_DATE]</p>
                                                            </td>
                                                            <td style="padding-top: 8px;">
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
                            
                            <!-- Action Button (For acceptance/interviews) -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="padding: 30px 0 10px; text-align: center;">
                                        <a href="[ACTION_LINK]" style="display: inline-block; padding: 14px 40px; background-color: #0033A0; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 5px;">See Here</a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="color: #666666; font-size: 15px; line-height: 24px; margin: 30px 0 0; padding-top: 20px; border-top: 1px solid #eeeeee;">We truly appreciate the time and effort you invested in your application and the opportunity to learn more about your qualifications.</p>
                            
                            <p style="color: #666666; font-size: 15px; line-height: 24px; margin: 20px 0 0;">If you have any questions, please feel free to contact us.</p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 40px; background-color: #f8f8f8; border-radius: 0 0 8px 8px; border-top: 1px solid #eeeeee;">
                            <p style="color: #999999; font-size: 12px; line-height: 18px; margin: 20px 0 0; text-align: center;">Questions? Contact us at <a href="mailto:support@nexthire.com" style="color: #0033A0; text-decoration: none;">support@nexthire.com</a></p>
                            
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
      .replace("[APPLICATION_DATE]", date)
      .replace("[ROLE]", role)
      .replace("[ACTION_LINK]", link);
}