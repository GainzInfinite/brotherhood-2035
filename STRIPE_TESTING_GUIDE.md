# Stripe Membership Integration - Testing Guide

## Prerequisites

Before testing, you need to configure your Stripe account:

### 1. Get Stripe API Keys
1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy your **Secret key** (starts with `sk_test_`)
3. Add to `.env.local`:
   ```
   STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
   ```

### 2. Create Subscription Product
1. Go to https://dashboard.stripe.com/test/products
2. Click "Add Product"
3. Name: "Brotherhood Elite Membership"
4. Price: $20.35 per month
5. Copy the **Price ID** (starts with `price_`)
6. Add to `.env.local`:
   ```
   STRIPE_PRICE_ID=price_YOUR_PRICE_ID_HERE
   ```

### 3. Setup Webhook (for local testing)
1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Run: `stripe login`
3. Forward webhooks to local server:
   ```bash
   stripe listen --forward-to http://localhost:3000/api/stripe-webhook
   ```
4. Copy the webhook signing secret (starts with `whsec_`)
5. Add to `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE
   ```

## Testing Flow

### Test 1: View Membership Page
```bash
# Visit the membership landing page
open http://localhost:3000/membership
```

**Expected Result:**
- Brotherhood crest displayed
- "Join the Brotherhood" heading
- $20.35/month pricing
- 4 benefits listed with icons
- Gold "Become a Member" button

### Test 2: Create Checkout Session
1. Click "Become a Member" button
2. Should redirect to Stripe Checkout hosted page
3. URL should look like: `https://checkout.stripe.com/c/pay/cs_test_...`

**Test via API:**
```bash
curl -X POST http://localhost:3000/api/checkout
```

**Expected Response:**
```json
{
  "url": "https://checkout.stripe.com/c/pay/cs_test_..."
}
```

### Test 3: Complete Payment (Test Mode)
Use Stripe test card:
- Card number: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

Complete the checkout flow.

**Expected Result:**
- Redirects to `/membership/success`
- "Welcome, Brother" message displayed
- "Enter Command Center" button visible

### Test 4: Verify Membership Activation

**Option A: Check via script**
```bash
node scripts/testTrial.js
```

**Expected Output:**
```
isMember: true
trialEndDate: null
```

**Option B: Check Header Badge**
Visit any page and look at the header. You should see:
- Crown icon + "Elite Member" badge (gold)
- NO trial countdown badge

### Test 5: Verify Middleware Access
```bash
# Set trial to expired
node scripts/expireTrial.js

# Visit command center - should redirect to /trial-ended
curl -I http://localhost:3000/command-center

# Activate membership
node scripts/activateMembership.js

# Visit command center - should allow access (200 OK)
curl -I http://localhost:3000/command-center
```

### Test 6: Verify Modal Behavior
```bash
# Deactivate membership and set to Day 13
node scripts/deactivateMembership.js
node scripts/setTrialDay13.js

# Visit any page - modal should appear
open http://localhost:3000/command-center

# Activate membership
node scripts/activateMembership.js

# Visit any page - modal should NOT appear
open http://localhost:3000/command-center
```

## Webhook Testing

### Simulate Successful Payment
```bash
# Make sure stripe listen is running in another terminal
stripe trigger checkout.session.completed
```

**Expected:**
- Console log: "Membership activated for user: default-user"
- Database updated: `isMember = true`

### Verify Webhook Endpoint
```bash
# Send test event via Stripe CLI
stripe trigger checkout.session.completed \
  --override checkout_session:metadata.userId=default-user

# Check logs
# Should see: "Membership activated for user: default-user"
```

## Helper Scripts

### Activate Membership Manually
```bash
node scripts/activateMembership.js
```

### Deactivate Membership (restore trial)
```bash
node scripts/deactivateMembership.js
```

### View Current Status
```bash
node scripts/testTrial.js
```

## Troubleshooting

### "STRIPE_SECRET_KEY not configured"
- Check `.env.local` has `STRIPE_SECRET_KEY=sk_test_...`
- Restart dev server after adding env vars

### "STRIPE_PRICE_ID not configured"
- Create a product in Stripe Dashboard
- Copy the price ID (not product ID)
- Add to `.env.local`

### Webhook signature verification failed
- Make sure `stripe listen` is running
- Copy the webhook secret from CLI output
- Add to `.env.local` as `STRIPE_WEBHOOK_SECRET`
- Restart dev server

### Checkout redirects to cancel URL
- Test card: `4242 4242 4242 4242`
- Use future expiry date
- Any CVC and ZIP

### Elite Member badge not showing
- Clear browser cache
- Check `/api/trial-info` returns `isMember: true`
- Verify membership activation in database

## Production Deployment

### Stripe Webhook Setup
1. Go to https://dashboard.stripe.com/webhooks
2. Add endpoint: `https://yourdomain.com/api/stripe-webhook`
3. Select event: `checkout.session.completed`
4. Copy webhook signing secret
5. Add to production environment variables

### Environment Variables
Set in Vercel/Railway:
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

**⚠️ Important:** Use live keys (sk_live_) in production, not test keys!
