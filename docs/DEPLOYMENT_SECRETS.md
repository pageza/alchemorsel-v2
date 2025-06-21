# 🔐 Deployment Secrets & Environment Variables Guide

**Complete reference for all secrets and environment variables required for Alchemorsel deployment.**

---

## 🗂️ **Secrets Directory Structure**

Create this directory structure in your deployment environment:

```
/path/to/alchemorsel-v2/
├── secrets/
│   ├── aws_access_key_id.txt
│   ├── aws_region.txt
│   ├── aws_secret_access_key.txt
│   ├── db_host.txt
│   ├── db_name.txt
│   ├── db_password.txt
│   ├── db_port.txt
│   ├── db_ssl_mode.txt
│   ├── db_user.txt
│   ├── deepseek_api_key.txt
│   ├── email_from.txt
│   ├── email_from_name.txt
│   ├── jwt_secret.txt
│   ├── openai_api_key.txt
│   ├── redis_host.txt
│   ├── redis_password.txt
│   ├── redis_port.txt
│   ├── redis_url.txt
│   ├── s3_bucket_name.txt
│   ├── server_host
│   ├── server_port
│   ├── smtp_host.txt
│   ├── smtp_password.txt
│   ├── smtp_port.txt
│   └── smtp_username.txt
└── docker-compose.yml
```

---

## 🔑 **Required Secrets (28 total)**

### **🗄️ Database Configuration**
```bash
# Database connection details
echo "postgres" > secrets/db_user.txt
echo "your_secure_password_here" > secrets/db_password.txt
echo "alchemorsel" > secrets/db_name.txt
echo "postgres" > secrets/db_host.txt          # Use container name or actual host
echo "5432" > secrets/db_port.txt
echo "disable" > secrets/db_ssl_mode.txt       # Use "require" for production
```

### **🔴 Redis Configuration**
```bash
# Redis connection details
echo "redis" > secrets/redis_host.txt          # Use container name or actual host  
echo "6379" > secrets/redis_port.txt
echo "" > secrets/redis_password.txt           # Empty for no password, or set secure password
echo "redis://redis:6379" > secrets/redis_url.txt
```

### **🤖 AI/LLM API Keys**
```bash
# DeepSeek API (Primary - REQUIRED)
echo "sk-your-deepseek-api-key-here" > secrets/deepseek_api_key.txt

# OpenAI API (Fallback - OPTIONAL)
echo "sk-your-openai-api-key-here" > secrets/openai_api_key.txt
```

### **☁️ AWS S3 Configuration (Profile Pictures)**
```bash
# AWS credentials for S3 profile picture storage
echo "your-aws-access-key-id" > secrets/aws_access_key_id.txt
echo "your-aws-secret-access-key" > secrets/aws_secret_access_key.txt
echo "us-east-1" > secrets/aws_region.txt      # Your preferred AWS region
echo "alchemorsel-profile-pics" > secrets/s3_bucket_name.txt
```

### **🔐 JWT Authentication**
```bash
# Generate a secure random JWT secret
openssl rand -base64 64 > secrets/jwt_secret.txt
```

### **📧 Email/SMTP Configuration**
```bash
# SMTP server details (use Gmail, SendGrid, AWS SES, etc.)
echo "smtp.gmail.com" > secrets/smtp_host.txt
echo "587" > secrets/smtp_port.txt
echo "your-email@gmail.com" > secrets/smtp_username.txt
echo "your-app-password" > secrets/smtp_password.txt
echo "noreply@alchemorsel.com" > secrets/email_from.txt
echo "Alchemorsel" > secrets/email_from_name.txt
```

### **🌐 Server Configuration**
```bash
# Server host and port (usually defaults)
echo "0.0.0.0" > secrets/server_host
echo "8080" > secrets/server_port
```

---

## 🚀 **Environment-Specific Values**

### **🏠 Development/Local**
```bash
# Database
db_host.txt: "postgres"                # Docker container name
redis_host.txt: "redis"               # Docker container name
smtp_host.txt: "smtp.gmail.com"       # Or your dev SMTP

# Server
server_host: "0.0.0.0"               # Accept all connections
```

### **☁️ Production/EC2**
```bash
# Database (if using external DB)
db_host.txt: "your-rds-endpoint.amazonaws.com"
db_ssl_mode.txt: "require"            # Always use SSL in production

# Redis (if using external Redis)
redis_host.txt: "your-redis-cluster.cache.amazonaws.com"
redis_url.txt: "rediss://your-redis-cluster:6380"  # Note: rediss for SSL

# Server
server_host: "0.0.0.0"               # Or specific IP
```

---

## 🔧 **How to Obtain Each Secret**

### **🤖 AI API Keys**
**DeepSeek API Key (REQUIRED):**
1. Go to https://platform.deepseek.com
2. Sign up/login
3. Navigate to API Keys
4. Create new key, copy value

**OpenAI API Key (OPTIONAL):**
1. Go to https://platform.openai.com
2. Sign up/login → API Keys
3. Create new secret key

### **☁️ AWS Credentials**
**For S3 Profile Pictures:**
1. AWS Console → IAM → Users
2. Create user with S3 access
3. Generate Access Key ID + Secret
4. Create S3 bucket for profile pictures

### **📧 SMTP Configuration**
**Gmail (Easy for testing):**
1. Enable 2FA on Gmail account
2. Generate App Password
3. Use Gmail SMTP settings

**SendGrid (Production):**
1. Sign up at sendgrid.com
2. Create API key
3. Use SendGrid SMTP settings

**AWS SES (Production):**
1. AWS Console → SES
2. Verify domain/email
3. Get SMTP credentials

### **🔐 JWT Secret**
```bash
# Generate secure random string
openssl rand -base64 64
# OR
head -c 64 /dev/urandom | base64
```

---

## 🛡️ **Security Best Practices**

### **🔒 File Permissions**
```bash
# Secure the secrets directory
chmod 700 secrets/
chmod 600 secrets/*.txt
```

### **🚫 Git Safety**
```bash
# Ensure secrets are gitignored
echo "secrets/" >> .gitignore
echo "*.env" >> .gitignore
```

### **🔄 Secret Rotation**
- **JWT Secret**: Rotate monthly
- **API Keys**: Rotate quarterly or if compromised
- **Database Passwords**: Rotate annually
- **SMTP Passwords**: Use app-specific passwords

### **📝 Environment Validation**
```bash
# Check all secrets exist
for secret in secrets/*.txt; do
  if [[ ! -s "$secret" ]]; then
    echo "WARNING: $secret is empty or missing"
  fi
done
```

---

## 🧪 **Testing Secret Configuration**

### **🔍 Quick Validation Script**
```bash
#!/bin/bash
# test-secrets.sh

echo "🔍 Validating deployment secrets..."

# Check secrets directory exists
if [[ ! -d "secrets" ]]; then
  echo "❌ secrets/ directory not found"
  exit 1
fi

# Check critical secrets
critical_secrets=(
  "deepseek_api_key.txt"
  "jwt_secret.txt" 
  "db_password.txt"
)

for secret in "${critical_secrets[@]}"; do
  if [[ ! -s "secrets/$secret" ]]; then
    echo "❌ Critical secret missing: $secret"
    exit 1
  else
    echo "✅ $secret"
  fi
done

echo "🎉 Critical secrets validation passed!"
```

### **🐳 Docker Validation**
```bash
# Test if Docker can access secrets
docker-compose config --quiet && echo "✅ Docker Compose config valid" || echo "❌ Docker Compose config invalid"
```

---

## 🚨 **Critical Dependencies**

### **⚡ Must Have (App won't start)**
1. `deepseek_api_key.txt` - AI recipe generation
2. `jwt_secret.txt` - User authentication  
3. `db_password.txt` - Database access

### **⚠️ Should Have (Features broken)**
1. `smtp_*` secrets - Email verification
2. `aws_*` secrets - Profile picture uploads

### **💡 Nice to Have (Fallbacks available)**
1. `openai_api_key.txt` - Backup LLM
2. `redis_password.txt` - Basic Redis works without

---

## 🚀 **Deployment Checklist**

### **Before Deploy:**
- [ ] All 28 secret files created
- [ ] File permissions set (700/600)
- [ ] Secrets validated with test script
- [ ] .gitignore updated
- [ ] Docker Compose config validates

### **After Deploy:**
- [ ] App starts successfully
- [ ] Database connection works
- [ ] Redis connection works
- [ ] AI recipe generation works
- [ ] Email sending works
- [ ] Profile picture upload works

### **Security Audit:**
- [ ] No secrets in git history
- [ ] No secrets in logs
- [ ] Proper file permissions
- [ ] Network access restricted

---

## 📞 **Troubleshooting**

### **🔥 Common Issues**

**"API Key not found" errors:**
```bash
# Check file exists and has content
ls -la secrets/deepseek_api_key.txt
cat secrets/deepseek_api_key.txt
```

**"Database connection failed":**
```bash
# Verify database secrets
cat secrets/db_*.txt
```

**"SMTP auth failed":**
```bash
# Test SMTP connection
telnet smtp.gmail.com 587
```

**Permission errors:**
```bash
# Fix permissions
sudo chown -R $USER:$USER secrets/
chmod 700 secrets/
chmod 600 secrets/*.txt
```

---

**📝 Last Updated:** 2025-06-20  
**🔄 Next Review:** Before each major deployment  
**👨‍💻 Maintainer:** Deployment Team