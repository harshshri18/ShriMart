# SMS & Email Notifications Setup

## Features
- ✅ Order confirmation emails & SMS when order is placed
- ✅ Status update notifications (Pending → Processing → Shipped → Delivered)
- ✅ Special shipping notification with tracking details
- ✅ Cancellation notifications

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install nodemailer
```

### 2. Email Configuration (Gmail Example)

Add to your `.env` file:

```env
# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM="ShriMart" <your-email@gmail.com>
FRONTEND_URL=http://localhost:3000

# SMS Configuration (Mock - Replace with actual provider)
SMS_SERVICE_ENABLED=false
```

### 3. Gmail App Password Setup

1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Go to "App passwords"
4. Generate a new app password for "Mail"
5. Use this password in `SMTP_PASS`

### 4. Alternative Email Providers

**Outlook/Hotmail:**
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
```

**Yahoo:**
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
```

**SendGrid:**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

### 5. SMS Integration (Optional)

Currently SMS is in mock mode. To enable real SMS:

**Option 1: Twilio**
```bash
npm install twilio
```

Update `backend/services/notificationService.js`:
```javascript
const twilio = require('twilio');
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

await client.messages.create({
  body: message,
  from: process.env.TWILIO_PHONE_NUMBER,
  to: phone
});
```

Add to `.env`:
```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
SMS_SERVICE_ENABLED=true
```

**Option 2: AWS SNS**
```bash
npm install aws-sdk
```

**Option 3: Keep Mock Mode**
- Set `SMS_SERVICE_ENABLED=false` in `.env`
- SMS will be logged to console only

## Testing

### Test Email
1. Place a new order
2. Check user's email inbox
3. Check backend console for email logs

### Test SMS
1. Place a new order
2. Check backend console for SMS logs
3. If SMS service enabled, check user's phone

## Notification Triggers

- **Order Placed**: When order is created
- **Status Update**: When admin changes order status
  - Pending → Processing
  - Processing → Shipped
  - Shipped → Delivered
  - Any → Cancelled

## Email Templates

All emails are HTML formatted with:
- Order confirmation
- Status updates
- Tracking information
- Links to order tracking page

## Troubleshooting

**Email not sending:**
- Check SMTP credentials
- Verify Gmail app password is correct
- Check firewall/network restrictions
- Check backend console for error logs

**SMS not working:**
- Verify SMS service is enabled
- Check phone number format (should include country code)
- Check SMS provider credentials

