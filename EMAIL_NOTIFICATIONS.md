# Email Notification System

## Overview
When admin approves a seller, an email notification is automatically sent to inform them.

## Current Implementation (Demo)
- Email notification is simulated via console.log
- Toast notification shows "Email sent to [seller-email]"
- Seller's `emailVerified` status is set to `true`

## Email Template

### Subject: 
**Your SevenEleven Seller Account Has Been Approved! 🎉**

### Body:
```
Dear [Seller Name],

Congratulations! Your seller account on SevenEleven has been approved.

Store Details:
- Store Name: [Store Name]
- Email: [Email]
- Status: Verified ✓

You can now:
✅ Add and manage products
✅ Receive orders from customers
✅ Track your earnings
✅ Manage your wallet

Get Started:
1. Login to your account: https://seveneleven.com/login
2. Go to Seller Dashboard
3. Add your first product
4. Start selling!

Need Help?
Visit our Help Center or contact support@seveneleven.com

Best regards,
The SevenEleven Team
```

---

## Production Integration

### Option 1: SendGrid (Recommended)

**Install:**
```bash
npm install @sendgrid/mail
```

**Setup:**
```javascript
// server/utils/email.js
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendSellerApprovalEmail(seller) {
  const msg = {
    to: seller.email,
    from: 'noreply@seveneleven.com',
    subject: 'Your SevenEleven Seller Account Has Been Approved!',
    html: `
      <h1>Congratulations ${seller.name}!</h1>
      <p>Your seller account has been approved.</p>
      <p><strong>Store Name:</strong> ${seller.storeName}</p>
      <p><a href="https://seveneleven.com/login">Login Now</a></p>
    `
  };
  
  await sgMail.send(msg);
}

module.exports = { sendSellerApprovalEmail };
```

**Usage in Controller:**
```javascript
// server/controllers/adminController.js
const { sendSellerApprovalEmail } = require('../utils/email');

exports.approveSeller = async (req, res) => {
  try {
    const seller = await Seller.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    ).populate('userId');
    
    await User.findByIdAndUpdate(seller.userId, { 
      status: 'active',
      emailVerified: true 
    });
    
    // Send email
    await sendSellerApprovalEmail({
      email: seller.userId.email,
      name: seller.userId.name,
      storeName: seller.storeName
    });
    
    res.json({ success: true, seller });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

---

### Option 2: Nodemailer (SMTP)

**Install:**
```bash
npm install nodemailer
```

**Setup:**
```javascript
// server/utils/email.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function sendSellerApprovalEmail(seller) {
  await transporter.sendMail({
    from: '"SevenEleven" <noreply@seveneleven.com>',
    to: seller.email,
    subject: 'Your Seller Account Has Been Approved!',
    html: `
      <h1>Congratulations ${seller.name}!</h1>
      <p>Your seller account has been approved.</p>
    `
  });
}

module.exports = { sendSellerApprovalEmail };
```

---

### Option 3: AWS SES

**Install:**
```bash
npm install @aws-sdk/client-ses
```

**Setup:**
```javascript
// server/utils/email.js
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

const sesClient = new SESClient({ 
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

async function sendSellerApprovalEmail(seller) {
  const params = {
    Source: 'noreply@seveneleven.com',
    Destination: {
      ToAddresses: [seller.email]
    },
    Message: {
      Subject: {
        Data: 'Your Seller Account Has Been Approved!'
      },
      Body: {
        Html: {
          Data: `<h1>Congratulations ${seller.name}!</h1>`
        }
      }
    }
  };
  
  await sesClient.send(new SendEmailCommand(params));
}

module.exports = { sendSellerApprovalEmail };
```

---

## Environment Variables

Add to `.env`:
```env
# SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key

# OR Nodemailer SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# OR AWS SES
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

---

## Email Types to Implement

1. **Seller Approval** ✅ (Current)
2. **Seller Rejection** - Notify seller with reason
3. **New Order** - Notify seller of new order
4. **Order Status Update** - Notify customer
5. **Password Reset** - Send reset link
6. **Welcome Email** - After registration
7. **Wallet Deposit** - Notify seller of deposit
8. **Low Stock Alert** - Notify seller

---

## Testing

### Development:
Use [Mailtrap](https://mailtrap.io/) to test emails without sending real emails.

```javascript
const transporter = nodemailer.createTransporter({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "your_mailtrap_user",
    pass: "your_mailtrap_pass"
  }
});
```

### Production:
- Use real email service
- Monitor delivery rates
- Handle bounces and complaints
- Implement retry logic

---

## Current Features

✅ **Validation on Registration Form:**
- Name minimum 3 characters
- Password minimum 6 characters
- Store name minimum 3 characters
- ID number required
- ID image upload required
- Address minimum 10 characters
- Terms acceptance required
- Real-time validation feedback

✅ **Email Verification Status:**
- `emailVerified` field in User model
- Verified badge on seller profile
- Unverified warning message
- Status shown in admin panel

✅ **Auto Email on Approval:**
- Console log simulation (demo)
- Toast notification to admin
- Sets `emailVerified` to true
- Ready for production email integration

---

## Next Steps

1. Choose email service (SendGrid recommended)
2. Get API key
3. Add to environment variables
4. Implement email utility
5. Update admin controller
6. Test with real emails
7. Monitor delivery

---

## Cost Estimates

- **SendGrid:** Free tier (100 emails/day)
- **AWS SES:** $0.10 per 1,000 emails
- **Mailgun:** Free tier (5,000 emails/month)
- **Nodemailer (SMTP):** Free (use your email provider)

---

For production implementation, follow the integration guide above based on your chosen email service.
