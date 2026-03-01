const nodemailer = require('nodemailer');

let transporter;

const createTransporter = async () => {
  if (transporter) return transporter;
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_USER === 'your-email@gmail.com') {
    // Use Ethereal for testing
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    console.log('Using Ethereal test email:', testAccount.user);
  } else {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }
  
  return transporter;
};

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transport = await createTransporter();
    
    const info = await transport.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || 'SevenEleven'}" <${process.env.EMAIL_USER || 'noreply@seveneleven.com'}>`,
      to,
      subject,
      html
    });
    
    console.log('Email sent to:', to);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    
    return { success: true, previewUrl: nodemailer.getTestMessageUrl(info) };
  } catch (error) {
    console.error('Email error:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { sendEmail };
