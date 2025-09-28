# Resend Email Configuration Test

## Environment Variables Required:
RESEND_API_KEY=your_resend_api_key_here
EMAIL_FROM=noreply@resend.kaplanokan.com

## Testing Steps:
1. Get your API key from resend.com dashboard
2. Add the environment variables to .env.local
3. Test in Resend Dashboard > Emails > Send Test
4. Test email authentication in your app

## Resend SMTP Configuration:
- Host: smtp.resend.com
- Port: 587
- User: resend
- Password: your_resend_api_key

## NextAuth EmailProvider Configuration:
- Uses Resend SMTP server
- Sends magic link emails for authentication
- Configured with your domain email address
