# Email Service Setup

Alchemorsel uses a flexible email service that can work with any SMTP provider.

## Development Mode

By default, the application runs in "log mode" where emails are logged to the console instead of being sent. This is perfect for development and testing.

To enable log mode, set:
```bash
EMAIL_MODE=log
```

## Production Setup

### 1. Choose an SMTP Provider

The email service works with any SMTP provider:

- **Gmail** - Free, requires app password
- **SendGrid** - Professional, good deliverability
- **AWS SES** - Cost-effective for high volume
- **Mailgun** - Developer-friendly
- **Any SMTP server** - Including self-hosted

### 2. Configure SMTP Settings

Copy the example secret files:
```bash
cd secrets
cp smtp_host.txt.example smtp_host.txt
cp smtp_port.txt.example smtp_port.txt
cp smtp_username.txt.example smtp_username.txt
cp smtp_password.txt.example smtp_password.txt
cp email_from.txt.example email_from.txt
cp email_from_name.txt.example email_from_name.txt
```

Then edit each file with your SMTP settings.

### 3. Provider-Specific Settings

#### Gmail
```
smtp_host.txt: smtp.gmail.com
smtp_port.txt: 587
smtp_username.txt: your-email@gmail.com
smtp_password.txt: your-app-password (NOT your regular password)
```

**Note**: You need to generate an app password:
1. Enable 2-factor authentication
2. Go to Google Account settings
3. Security → 2-Step Verification → App passwords
4. Generate a new app password for "Mail"

#### SendGrid
```
smtp_host.txt: smtp.sendgrid.net
smtp_port.txt: 587
smtp_username.txt: apikey
smtp_password.txt: your-sendgrid-api-key
```

#### AWS SES
```
smtp_host.txt: email-smtp.us-east-1.amazonaws.com
smtp_port.txt: 587
smtp_username.txt: your-ses-smtp-username
smtp_password.txt: your-ses-smtp-password
```

### 4. Environment Variables (Alternative)

You can also use environment variables instead of secret files:
```bash
export SMTP_HOST=smtp.gmail.com
export SMTP_PORT=587
export SMTP_USERNAME=your-email@gmail.com
export SMTP_PASSWORD=your-app-password
export EMAIL_FROM=noreply@alchemorsel.com
export EMAIL_FROM_NAME=Alchemorsel
```

## Email Templates

The service includes pre-built templates for:
- Password reset emails
- Welcome emails
- Email verification

Templates are HTML with a plain text fallback for better compatibility.

## Testing

To test email configuration:
1. Register a new user
2. Request a password reset
3. Check logs or inbox depending on EMAIL_MODE

## Troubleshooting

### Emails not sending
1. Check SMTP credentials are correct
2. Verify firewall allows outbound SMTP (port 587)
3. Check logs for specific error messages

### Gmail "Less secure app" error
Use an app password instead of your regular password

### Rate limiting
Most providers have sending limits. Consider:
- SendGrid or AWS SES for higher volumes
- Implementing a queue for batch sending
- Rate limiting password reset requests