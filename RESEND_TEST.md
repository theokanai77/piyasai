# Resend Test Configuration

# Add these to your .env.local file

# NextAuth Configuration

NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth

GOOGLE_ID=your_google_client_id
GOOGLE_SECRET=your_google_client_secret

# MongoDB

MONGODB_URI=your_mongodb_connection_string

# Email Server for NextAuth (Resend)

EMAIL_SERVER=smtp://resend
EMAIL_FROM=noreply@piyasai.com

# Resend API Key (get from resend.com dashboard)

RESEND_API_KEY=your_resend_api_key_here

# Test Instructions:

# 1. Go to resend.com and create account

# 2. Get your API key from dashboard

# 3. Add RESEND_API_KEY to .env.local

# 4. Test in Resend Dashboard > Emails > Send Test

# 5. Use from: noreply@piyasai.com

# 6. Test email authentication in your app
