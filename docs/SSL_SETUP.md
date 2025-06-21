# 🔒 SSL/TLS Certificate Setup Guide

**Complete guide for setting up SSL certificates for Alchemorsel production deployment.**

---

## 🎯 **SSL Options Overview**

### **Option 1: Let's Encrypt (Free - Recommended)**
- ✅ Free SSL certificates
- ✅ Auto-renewal with Certbot
- ✅ Widely trusted
- ⚠️ Requires domain name

### **Option 2: Cloudflare SSL (Free - Easy)**
- ✅ Free SSL termination
- ✅ CDN benefits
- ✅ No server-side certificate management
- ⚠️ Requires Cloudflare account

### **Option 3: AWS Certificate Manager (AWS-only)**
- ✅ Free for AWS resources
- ✅ Auto-renewal
- ❌ Only works with AWS Load Balancer/CloudFront

### **Option 4: Self-Signed (Testing only)**
- ✅ Works immediately
- ❌ Browser warnings
- ❌ Not recommended for production

---

## 🚀 **Option 1: Let's Encrypt Setup (Recommended)**

### **Prerequisites**
- Domain name pointing to your EC2 instance
- Ports 80 and 443 open in security group

### **Step 1: Install Certbot**
```bash
# On Ubuntu/Debian
sudo apt update
sudo apt install certbot python3-certbot-nginx

# On Amazon Linux 2
sudo yum install certbot python3-certbot-nginx
```

### **Step 2: Install Nginx (if not using Docker version)**
```bash
sudo apt install nginx
```

### **Step 3: Get SSL Certificate**
```bash
# Replace YOUR_DOMAIN with your actual domain
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Follow the prompts:
# - Enter email for renewal notifications
# - Agree to terms
# - Choose redirect option (recommended)
```

### **Step 4: Update Docker Compose for SSL**
Use the enhanced production compose file:

```yaml
# docker-compose.ssl.yml
services:
  nginx-proxy:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx-ssl.conf:/etc/nginx/conf.d/default.conf
      - /etc/letsencrypt:/etc/letsencrypt:ro
    depends_on:
      - frontend
      - backend

  frontend:
    image: alchemorsel/frontend:v1.2.0
    # Remove ports - accessed via nginx proxy
    depends_on:
      - backend

  # ... rest of services
```

### **Step 5: Create Nginx SSL Config**
```nginx
# nginx-ssl.conf
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # SSL Security
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;

    # Frontend
    location / {
        proxy_pass http://frontend:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api/ {
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### **Step 6: Auto-Renewal Setup**
```bash
# Test renewal
sudo certbot renew --dry-run

# Add to crontab for auto-renewal
sudo crontab -e

# Add this line:
0 12 * * * /usr/bin/certbot renew --quiet && docker-compose restart nginx-proxy
```

---

## 🌩️ **Option 2: Cloudflare SSL (Easiest)**

### **Step 1: Add Domain to Cloudflare**
1. Sign up at cloudflare.com
2. Add your domain
3. Update nameservers to Cloudflare's

### **Step 2: Enable SSL**
1. Go to SSL/TLS tab
2. Set SSL/TLS encryption mode to "Full (strict)"
3. Enable "Always Use HTTPS"

### **Step 3: Create Origin Certificate**
1. Go to SSL/TLS → Origin Server
2. Create Certificate
3. Save certificate and private key

### **Step 4: Configure Server**
```bash
# Save Cloudflare origin certificate
sudo mkdir -p /etc/ssl/cloudflare
sudo nano /etc/ssl/cloudflare/cert.pem
# Paste certificate

sudo nano /etc/ssl/cloudflare/key.pem
# Paste private key

sudo chmod 600 /etc/ssl/cloudflare/*
```

### **Step 5: Update Nginx Config**
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/ssl/cloudflare/cert.pem;
    ssl_certificate_key /etc/ssl/cloudflare/key.pem;

    # ... rest of config
}
```

---

## 🧪 **Option 3: Self-Signed (Testing Only)**

### **Generate Self-Signed Certificate**
```bash
# Create directory
sudo mkdir -p /etc/ssl/self-signed

# Generate certificate
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/self-signed/nginx-selfsigned.key \
    -out /etc/ssl/self-signed/nginx-selfsigned.crt \
    -subj "/CN=your-domain.com"

# Set permissions
sudo chmod 600 /etc/ssl/self-signed/*
```

### **Use in Nginx Config**
```nginx
ssl_certificate /etc/ssl/self-signed/nginx-selfsigned.crt;
ssl_certificate_key /etc/ssl/self-signed/nginx-selfsigned.key;
```

---

## 🐳 **SSL-Enabled Docker Compose**

### **Complete SSL Production Setup**
```yaml
# docker-compose.ssl.yml
services:
  nginx-proxy:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./config/nginx-ssl.conf:/etc/nginx/conf.d/default.conf:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro  # Let's Encrypt certs
      # OR for Cloudflare:
      # - /etc/ssl/cloudflare:/etc/ssl/cloudflare:ro
    depends_on:
      - frontend
      - backend
    restart: unless-stopped

  frontend:
    image: alchemorsel/frontend:v1.2.0
    environment:
      - NODE_ENV=production
    depends_on:
      - backend
    restart: unless-stopped

  backend:
    image: alchemorsel/backend:v1.2.0
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
      - REDIS_HOST=redis
      - DEEPSEEK_API_KEY_FILE=/run/secrets/deepseek_api_key
    secrets:
      - deepseek_api_key
      - jwt_secret
      # ... all other secrets
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    restart: unless-stopped

  postgres:
    image: ankane/pgvector:latest
    environment:
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_USER=postgres
      - POSTGRES_DB=alchemorsel
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  redis:
    image: redis:latest
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:

secrets:
  # ... all your secrets
```

---

## 🚀 **SSL Deployment Script**

```bash
#!/bin/bash
# scripts/deploy-ssl.sh

set -e

echo "🔒 Setting up SSL deployment..."

# Check if domain is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <your-domain.com>"
    exit 1
fi

DOMAIN=$1

# Install Certbot
sudo apt update
sudo apt install -y certbot nginx

# Get SSL certificate
sudo certbot certonly --standalone -d $DOMAIN

# Create nginx config
envsubst '$DOMAIN' < config/nginx-ssl.template > config/nginx-ssl.conf

# Deploy with SSL
docker-compose -f docker-compose.ssl.yml up -d

echo "✅ SSL deployment complete!"
echo "🌐 Your secure site: https://$DOMAIN"
```

---

## 🔧 **Security Best Practices**

### **SSL Configuration**
```nginx
# Strong SSL configuration
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384;
ssl_prefer_server_ciphers off;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 1d;
ssl_session_tickets off;

# HSTS
add_header Strict-Transport-Security "max-age=63072000" always;

# Security headers
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
```

### **Firewall Configuration**
```bash
# Allow only necessary ports
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP (redirects to HTTPS)
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

---

## 🔍 **SSL Testing & Monitoring**

### **Test SSL Configuration**
```bash
# Check certificate
openssl s_client -connect your-domain.com:443 -servername your-domain.com

# SSL Labs test
# Visit: https://www.ssllabs.com/ssltest/
```

### **Monitor Certificate Expiry**
```bash
# Check expiry date
echo | openssl s_client -servername your-domain.com -connect your-domain.com:443 2>/dev/null | openssl x509 -noout -dates
```

---

## 🚨 **Troubleshooting**

### **Common Issues**

**Certificate not found:**
```bash
# Check certbot certificates
sudo certbot certificates

# Verify file permissions
sudo ls -la /etc/letsencrypt/live/your-domain.com/
```

**Nginx SSL errors:**
```bash
# Test nginx config
sudo nginx -t

# Check nginx error logs
sudo tail -f /var/log/nginx/error.log
```

**Docker container SSL issues:**
```bash
# Check if nginx proxy can access certificates
docker exec nginx-proxy ls -la /etc/letsencrypt/live/
```

---

**📝 Last Updated:** 2025-06-20  
**🔄 Next Review:** Before each deployment  
**👨‍💻 Maintainer:** Security Team