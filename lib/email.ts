import nodemailer from 'nodemailer'

export interface EmailData {
  to: string
  subject: string
  html: string
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: parseInt(process.env.EMAIL_PORT || '587') === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function sendEmail(data: EmailData): Promise<boolean> {
  try {
    console.log('📧 Sending email to:', data.to)
    console.log('📧 Email config:', {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      user: process.env.EMAIL_USER,
      hasPass: !!process.env.EMAIL_PASS
    })
    
    await transporter.sendMail({
      from: `${process.env.EMAIL_FROM_NAME || 'SevenEleven'} <${process.env.EMAIL_USER}>`,
      to: data.to,
      subject: data.subject,
      html: data.html,
    })
    console.log(`✅ Email sent successfully to ${data.to}`)
    return true
  } catch (error) {
    console.error('❌ Email error:', error)
    return false
  }
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
    subject: '🎉 Your EsellerStore Seller Account Has Been Approved!',
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
            <p>Great news! Your seller account on <strong>EsellerStore</strong> has been approved.</p>
            
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
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" class="button">Login to Dashboard</a>
            </div>
            
            <p><strong>Need Help?</strong><br>
            Visit our Help Center or contact ${process.env.EMAIL_USER}</p>
            
            <p>Best regards,<br>
            <strong>The EsellerStore Team</strong></p>
          </div>
          <div class="footer">
            <p>© 2025 EsellerStore. All rights reserved.</p>
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
 * Send seller registration email
 */
export async function sendSellerRegistrationEmail(seller: {
  email: string
  name: string
  storeName: string
}) {
  const emailData: EmailData = {
    to: seller.email,
    subject: '📝 Seller Registration Received - EsellerStore',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📝 Registration Received</h1>
          </div>
          <div class="content">
            <h2>Dear ${seller.name},</h2>
            <p>Thank you for registering as a seller on <strong>EsellerStore</strong>!</p>
            
            <h3>📦 Your Registration Details:</h3>
            <ul>
              <li><strong>Store Name:</strong> ${seller.storeName}</li>
              <li><strong>Email:</strong> ${seller.email}</li>
              <li><strong>Status:</strong> ⏳ Pending Approval</li>
            </ul>
            
            <h3>⏳ What Happens Next?</h3>
            <p>Our admin team will review your application. You will receive an email notification once your account is approved.</p>
            
            <p><strong>Need Help?</strong><br>
            Contact us at ${process.env.EMAIL_USER}</p>
            
            <p>Best regards,<br>
            <strong>The EsellerStore Team</strong></p>
          </div>
          <div class="footer">
            <p>© 2025 EsellerStore. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
  
  return await sendEmail(emailData)
}
