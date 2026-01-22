# Payment Gateway Setup Guide - ShriMart

## ✅ Payment Methods Added

1. **💵 Cash on Delivery (COD)** - Pay when you receive
2. **💳 Credit Card** - Via Razorpay
3. **💳 Debit Card** - Via Razorpay
4. **📱 UPI** - Via Razorpay
5. **📷 QR Code** - UPI QR Code for scanning

## 🔧 Setup Instructions

### Step 1: Get Razorpay API Keys

1. Go to https://razorpay.com/
2. Sign up for a free account
3. Go to Dashboard → Settings → API Keys
4. Generate Test/Live API keys:
   - **Key ID**: `rzp_test_xxxxx` (for testing)
   - **Key Secret**: `xxxxx` (keep it secret!)

### Step 2: Update Backend .env File

Add these to `backend/.env`:

```env
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET
RAZORPAY_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET
```

### Step 3: Database Migration

The database schema has been updated automatically. If needed, run:

```bash
cd backend
npm run test-db
```

This will create/update the orders table with:
- New payment methods (COD, Credit Card, Debit Card, UPI, QR Code)
- Razorpay order/payment IDs
- Payment status tracking

### Step 4: Test Payment Gateway

#### Test Mode (Default)
- Uses Razorpay test keys
- Test card: `4111 1111 1111 1111`
- Test UPI: Any UPI ID
- CVV: Any 3 digits
- Expiry: Any future date

#### Live Mode
- Update `.env` with live keys
- Real payments will be processed

## 📱 Payment Flow

### Credit Card / Debit Card / UPI
1. User selects payment method
2. Order created in database
3. Razorpay checkout popup opens
4. User completes payment
5. Payment verified on backend
6. Order status updated to "Processing"

### QR Code
1. User selects "QR Code"
2. QR code generated with UPI details
3. User scans QR code with UPI app
4. Payment completed externally
5. Order created with "Pending" status
6. Admin can manually update status after verification

### COD
1. User selects "Cash on Delivery"
2. Order created with "Pending" payment status
3. Order status: "Pending"
4. Payment collected on delivery

## 🔐 Webhook Setup (Optional)

For automatic payment verification:

1. Go to Razorpay Dashboard → Webhooks
2. Add webhook URL: `https://your-domain.com/api/payment/webhook`
3. Select events: `payment.captured`, `payment.failed`
4. Copy webhook secret to `.env`

## 🧪 Testing

### Test Cards (Razorpay Test Mode)
- **Success**: `4111 1111 1111 1111`
- **Failure**: `4000 0000 0000 0002`
- **CVV**: Any 3 digits
- **Expiry**: Any future date

### Test UPI IDs
- `success@razorpay`
- `failure@razorpay`

## 📝 Notes

- All payment methods are now available in checkout
- QR Code generates UPI payment QR automatically
- Razorpay handles Credit/Debit cards and UPI
- COD requires no payment processing
- Payment status tracked in database
- Webhook support for automatic updates

## 🚀 Production Deployment

Before going live:
1. Get Live API keys from Razorpay
2. Update `.env` with live keys
3. Set up webhooks for production
4. Test all payment methods
5. Enable SSL (HTTPS) for secure payments

---

**Status**: ✅ Payment Gateway Integration Complete!

