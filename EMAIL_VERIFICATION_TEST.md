# 📧 Email Verification Test Guide

## How to Verify Email is Sent

### Method 1: Browser Console (Current)

**Steps:**
1. Open browser (Chrome/Firefox/Edge)
2. Press `F12` to open Developer Tools
3. Click on **Console** tab
4. Login as admin: `admin@seveneleven.com` / `admin123`
5. Go to `/admin/sellers`
6. Click **Approve** on any pending seller
7. Check console output

**Expected Output:**
```
📧 EMAIL SENT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
To: techwear@seveneleven.com
Subject: 🎉 Your SevenEleven Seller Account Has Been Approved!
Body: [HTML email content]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Also Check:**
- ✅ Toast notification: "Seller approved! Email sent to..."
- ✅ Seller status changes to "approved"
- ✅ Seller can now login
- ✅ Seller sees "Verified ✓" badge

---

### Method 2: Network Tab

**Steps:**
1. Open Developer Tools (F12)
2. Go to **Network** tab
3. Approve a seller
4. Look for API calls
5. Check response data

---

### Method 3: Test with Real Email (Production)

#### Option A: SendGrid (Recommended)

**1. Install SendGrid:**
```bash
npm install @sendgrid/mail
```

**2. Get API Key:**
- Sign up at https://sendgrid.com
- Get free API key (100 emails/day)

**3. Update `lib/email.ts`:**
```typescript
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY!)

export async function sendEmail(data: EmailData): Promise<boolean> {
  try {
    await sgMail.send({
      to: data.to,
      from: 'noreply@seveneleven.com', // Verify this email in SendGrid
      subject: data.subject,
      html: data.html
    })
    console.log('✅ Real email sent to:', data.to)
    return true
  } catch (error) {
    console.error('❌ Email error:', error)
    return false
  }
}
```

**4. Add to `.env.local`:**
```env
NEXT_PUBLIC_SENDGRID_API_KEY=your_sendgrid_api_key_here
```

**5. Test:**
- Approve a seller
- Check your real email inbox
- Verify email received

---

#### Option B: Mailtrap (Testing)

**For testing without sending real emails:**

**1. Sign up:** https://mailtrap.io (free)

**2. Install:**
```bash
npm install nodemailer
```

**3. Update `lib/email.ts`:**
```typescript
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransporter({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  }
})

export async function sendEmail(data: EmailData): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: 'noreply@seveneleven.com',
      to: data.to,
      subject: data.subject,
      html: data.html
    })
    console.log('✅ Test email sent to Mailtrap')
    return true
  } catch (error) {
    console.error('❌ Email error:', error)
    return false
  }
}
```

**4. Check Mailtrap inbox** - See all test emails

---

## Current Implementation Status

### ✅ What's Working:
- Email notification triggered on approval
- Console logging with full email details
- Toast notification to admin
- Email verification status updated
- Seller sees verified badge
- Email template ready

### 🔄 What's Simulated:
- Actual email sending (uses console.log)
- SMTP/API connection

### 🚀 Production Ready:
- Email template designed
- HTML email with styling
- Error handling ready
- Just needs API key

---

## Quick Test Checklist

- [ ] Open browser console (F12)
- [ ] Login as admin
- [ ] Go to `/admin/sellers`
- [ ] Find pending seller (TechWear Co)
- [ ] Click "Approve" button
- [ ] Check console for email log
- [ ] See toast: "Seller approved! Email sent to..."
- [ ] Login as that seller
- [ ] Go to `/seller/store`
- [ ] See "Verified ✓" badge
- [ ] See no "Unverified" warning

---

## Email Content Preview

**Subject:** 🎉 Your SevenEleven Seller Account Has Been Approved!

**Body:**
```
Congratulations!

Dear [Seller Name],

Great news! Your seller account on SevenEleven has been approved.

📦 Store Details:
- Store Name: [Store Name]
- Email: [Email]
- Status: ✅ Verified

🚀 What You Can Do Now:
✅ Add and manage products
✅ Receive orders from customers
✅ Track your earnings
✅ Manage your wallet

[Login to Dashboard Button]

Need Help?
Visit our Help Center or contact support@seveneleven.com

Best regards,
The SevenEleven Team
```

---

## Verification Screenshots

### 1. Console Output
Look for:
```
📧 EMAIL SENT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
To: seller@email.com
Subject: Your account has been approved
Body: [HTML content]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 2. Toast Notification
Look for green toast:
```
✅ Seller approved! Email sent to seller@email.com
```

### 3. Seller Profile
Look for green badge:
```
✅ Verified
```

---

## Troubleshooting

**Email not showing in console?**
- Check if console is open (F12)
- Check if approval button was clicked
- Refresh page and try again

**Toast not appearing?**
- Check if Sonner is working
- Look for any JavaScript errors

**Verified badge not showing?**
- Logout and login again as seller
- Check if emailVerified is true in store

---

## Next Steps for Production

1. Choose email service (SendGrid recommended)
2. Get API key
3. Update `lib/email.ts` with real implementation
4. Add API key to environment variables
5. Test with real email address
6. Monitor delivery rates
7. Set up email templates in service dashboard

---

## Cost Estimates

- **SendGrid:** Free (100 emails/day)
- **Mailtrap:** Free (testing only)
- **AWS SES:** $0.10 per 1,000 emails
- **Mailgun:** Free (5,000 emails/month)

---

**Current Status:** ✅ Email system is working (simulated)
**Production Ready:** 🔄 Just needs API key integration
**Testing:** ✅ Can verify via console logs
