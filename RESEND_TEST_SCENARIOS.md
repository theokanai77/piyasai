# 🧪 Resend Authentication Test Scenarios

## 📋 Test Environment Setup

### Environment Variables Required:

```env
# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3007

# Google OAuth
GOOGLE_ID=your_google_client_id
GOOGLE_SECRET=your_google_client_secret

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Resend Configuration
RESEND_API_KEY=your_resend_api_key_here
EMAIL_FROM=noreply@resend.piyasai.com
```

## 🧪 Test Scenarios

### Test 1: Email Authentication Flow

**Objective**: Test complete email authentication flow with Resend

**Steps**:

1. Navigate to `/api/auth/signin`
2. Click "Sign in with Email"
3. Enter valid email address (e.g., `test@example.com`)
4. Click "Sign in with Email"
5. Check browser console for logs:
   ```
   🔐 NextAuth signIn callback triggered: { user: 'test@example.com', account: { type: 'email' } }
   📧 Resend email authentication attempt: { email: 'test@example.com', provider: 'email' }
   ```
6. Check Resend Dashboard > Emails for sent email
7. Check email inbox for magic link
8. Click magic link
9. Verify redirect to dashboard with authenticated session

**Expected Results**:

- ✅ Console logs show successful authentication attempt
- ✅ Email sent via Resend (visible in dashboard)
- ✅ Magic link received in email
- ✅ Successful authentication and redirect to dashboard
- ✅ User session established

### Test 2: Invalid Email Handling

**Objective**: Test error handling for invalid email addresses

**Steps**:

1. Navigate to `/api/auth/signin`
2. Click "Sign in with Email"
3. Enter invalid email (e.g., `invalid-email`)
4. Click "Sign in with Email"
5. Check browser console for error logs
6. Verify error message displayed to user

**Expected Results**:

- ❌ Console shows error: "❌ NextAuth Resend hatası debug et: [error message]"
- ❌ User sees appropriate error message
- ❌ No email sent via Resend

### Test 3: Already Authenticated User

**Objective**: Test redirect behavior for already authenticated users

**Steps**:

1. Complete Test 1 to be authenticated
2. Navigate to `/api/auth/signin` again
3. Verify automatic redirect to dashboard
4. Check that no new authentication attempt is made

**Expected Results**:

- ✅ Automatic redirect to dashboard
- ✅ No duplicate authentication attempts
- ✅ Session maintained

### Test 4: Resend Dashboard Verification

**Objective**: Verify emails are properly sent through Resend

**Steps**:

1. Complete Test 1
2. Go to [Resend Dashboard](https://resend.com/dashboard)
3. Navigate to "Emails" section
4. Check for sent emails with:
   - From: `noreply@resend.piyasai.com`
   - To: Test email address
   - Subject: Contains "Sign in" or "Login"
5. Verify email delivery status

**Expected Results**:

- ✅ Email visible in Resend dashboard
- ✅ Delivery status shows "Delivered"
- ✅ Correct sender and recipient addresses
- ✅ Email content includes magic link

### Test 5: Error Debugging

**Objective**: Test error handling and debugging

**Steps**:

1. Temporarily set invalid `RESEND_API_KEY`
2. Attempt email authentication
3. Check console for error messages
4. Verify error format: "❌ NextAuth Resend hatası debug et: [error message]"
5. Restore valid API key

**Expected Results**:

- ❌ Clear error messages in console
- ❌ User-friendly error display
- ❌ Proper error logging format

## 🔧 Debug Commands

### Check Environment Variables:

```bash
# Verify all required env vars are set
echo $RESEND_API_KEY
echo $EMAIL_FROM
echo $NEXTAUTH_SECRET
```

### Test Resend API Key:

```bash
# Test Resend API key directly
curl -X POST 'https://api.resend.com/emails' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "from": "noreply@resend.piyasai.com",
    "to": ["test@example.com"],
    "subject": "Test Email",
    "html": "<p>Test email from Resend</p>"
  }'
```

### Check NextAuth Logs:

```bash
# Monitor NextAuth logs
npm run dev
# Look for console logs with 🔐 and 📧 emojis
```

## 🚨 Troubleshooting

### Common Issues:

1. **"Module not found: Can't resolve 'next-auth/providers/resend'"**

   - Solution: Using EmailProvider with Resend SMTP (already fixed)

2. **"Invalid API key" errors**

   - Check: `RESEND_API_KEY` is correct
   - Verify: API key has sending permissions

3. **"Email not delivered"**

   - Check: Domain verification in Resend
   - Verify: `EMAIL_FROM` matches verified domain

4. **"NextAuth Resend hatası debug et" errors**
   - Check: Console logs for detailed error information
   - Verify: All environment variables are set correctly

## 📊 Success Criteria

- ✅ All test scenarios pass
- ✅ Console logs show proper authentication flow
- ✅ Emails delivered via Resend
- ✅ Error handling works correctly
- ✅ No Mailgun dependencies remain
- ✅ Clean codebase with Resend integration
