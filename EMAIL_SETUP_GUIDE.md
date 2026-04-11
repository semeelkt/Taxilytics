# Firebase Cloud Functions - Email Notification Setup

## 📧 How to Set Up Email Notifications

When a client submits their details through the public form, the admin receives an email notification instantly.

---

## Prerequisites

1. **Firebase CLI installed**
   ```bash
   npm install -g firebase-tools
   ```

2. **Admin email configured** in `js/config.js`
   ```javascript
   export const ADMIN_EMAIL = 'your-email@finreg.in';
   ```

---

## Setup Steps

### Option A: Gmail (Easiest)

If you want to use Gmail to send emails:

1. **Enable 2-Factor Authentication on your Gmail account**
   - Go to myaccount.google.com → Security
   - Enable 2-Step Verification

2. **Create an App Password**
   - Go to myaccount.google.com → Security → App passwords
   - Select "Mail" and "Windows Computer"
   - Copy the generated 16-character password

3. **Set environment variables in Firebase:**
   ```bash
   cd functions
   firebase functions:config:set admin.email="your-email@gmail.com"
   firebase functions:config:set admin.email_password="your-app-password"
   ```

4. **Deploy functions:**
   ```bash
   firebase deploy --only functions
   ```

---

### Option B: SendGrid (Recommended for Production)

1. **Create SendGrid account**: https://sendgrid.com

2. **Generate API Key**
   - Go to Settings → API Keys
   - Create new API key
   - Copy the key

3. **Set environment variable:**
   ```bash
   cd functions
   firebase functions:config:set sendgrid.api_key="your-sendgrid-api-key"
   ```

4. **Update `functions/index.js`:**
   - Uncomment the SendGrid configuration
   - Comment out Gmail configuration

5. **Deploy:**
   ```bash
   firebase deploy --only functions
   ```

---

## Deployment

### 1. Navigate to functions directory
```bash
cd functions
```

### 2. Install dependencies
```bash
npm install
```

### 3. Login to Firebase
```bash
firebase login
```

### 4. Deploy functions
```bash
firebase deploy --only functions
```

### 5. Verify deployment
```bash
firebase functions:list
```

You should see `notifyAdminNewSubmission` function listed.

---

## Email Template

The email includes:
- ✅ Client name, email, phone
- ✅ Client notes (if provided)
- ✅ Submission date/time
- ✅ WhatsApp quick link
- ✅ Admin panel link
- ✅ Professional HTML formatting

---

## Troubleshooting

### "Function deployment failed"
- Check Firebase project ID is correct: `firebase list`
- Check Node.js version: `node --version` (should be 16+)

### "Email not sending"
- Check environment variables: `firebase functions:config:get`
- Verify email credentials are correct
- Check Firebase Cloud Functions logs: `firebase functions:log`

### "Permission denied"
- Make sure you're logged in: `firebase login`
- You need Owner or Editor role in Firebase project

---

## Testing

After deployment:

1. Go to public form: `/pages/public-form.html`
2. Submit test data
3. Check your admin email within 30 seconds
4. You should receive notification email

---

## Email Formats

### For Admin Notifications

When admin submits, email includes:
- Client details (name, email, phone)
- Client notes
- Timestamp
- Quick action buttons (WhatsApp, Admin Panel)

### For Client Confirmation (Optional)

You can add a second function to send confirmation email to clients.

---

## Advanced: Custom Email Template

To customize the email template, edit the `html` field in `functions/index.js`

Example variables you can use:
- `${submission.name}` - Client name
- `${submission.email}` - Client email
- `${submission.phone}` - Client phone
- `${submission.notes}` - Client notes
- `${new Date(submission.submittedAt.toDate()).toLocaleString()}` - Timestamp

---

## Cost

- **Gmail**: Free (with app password)
- **SendGrid**: Free tier includes 100 emails/day
- **Firebase Cloud Functions**: Free tier includes 2M invocations/month

---

## Security Notes

✅ Never commit API keys or passwords
✅ Use Firebase environment config for secrets
✅ Enable Cloud Function CORS restrictions
✅ Monitor function logs for errors

---

## Support

For issues:
1. Check Firebase Cloud Functions logs
2. Verify environment variables
3. Test with simple document first
4. Check email spam folder
