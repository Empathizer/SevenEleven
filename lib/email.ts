// lib/email.ts - Simple Email Utility for Testing

/**
 * DEMO: Email notification simulation
 * Replace this with real email service in production
 */

export interface EmailData {
  to: string
  subject: string
  html: string
}

/**
 * Simulated email sending (current implementation)
 */
export function sendEmail(data: EmailData): Promise<boolean> {
  return new Promise((resolve) => {
    // Simulate email sending
    console.log('📧 EMAIL SENT:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`To: ${data.to}`)
    console.log(`Subject: ${data.subject}`)
    console.log(`Body: ${data.html}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    // Simulate network delay
    setTimeout(() => {
      resolve(true)
    }, 500)
  })
}

/**
 * Send seller approval email
 */
export async function sendSellerApprovalEmail(seller: {
  email: string
  name: string
  storeName: string
}) {
  const emailData: EmailData = {
    to: seller.email,
    subject: '🎉 Your SevenEleven Seller Account Has Been Approved!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Congratulations!</h1>
          </div>
          <div class="content">
            <h2>Dear ${seller.name},</h2>
            <p>Great news! Your seller account on <strong>SevenEleven</strong> has been approved.</p>
            
            <h3>📦 Store Details:</h3>
            <ul>
              <li><strong>Store Name:</strong> ${seller.storeName}</li>
              <li><strong>Email:</strong> ${seller.email}</li>
              <li><strong>Status:</strong> ✅ Verified</li>
            </ul>
            
            <h3>🚀 What You Can Do Now:</h3>
            <ul>
              <li>✅ Add and manage products</li>
              <li>✅ Receive orders from customers</li>
              <li>✅ Track your earnings</li>
              <li>✅ Manage your wallet</li>
            </ul>
            
            <div style="text-align: center;">
              <a href="http://localhost:3000/login" class="button">Login to Dashboard</a>
            </div>
            
            <p><strong>Need Help?</strong><br>
            Visit our Help Center or contact support@seveneleven.com</p>
            
            <p>Best regards,<br>
            <strong>The SevenEleven Team</strong></p>
          </div>
          <div class="footer">
            <p>© 2025 SevenEleven. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
  
  return await sendEmail(emailData)
}

/**
 * FOR PRODUCTION: Replace with real email service
 * 
 * Example with SendGrid:
 * 
 * import sgMail from '@sendgrid/mail'
 * sgMail.setApiKey(process.env.SENDGRID_API_KEY!)
 * 
 * export async function sendEmail(data: EmailData): Promise<boolean> {
 *   try {
 *     await sgMail.send({
 *       to: data.to,
 *       from: 'noreply@seveneleven.com',
 *       subject: data.subject,
 *       html: data.html
 *     })
 *     return true
 *   } catch (error) {
 *     console.error('Email error:', error)
 *     return false
 *   }
 * }
 */
