# AWS EC2 Simple Deployment Guide

**✅ AWS CLI CONFIGURED**: Access key ending in WXMD, region us-west-2

## Simple EC2 + Docker Compose Approach

Since we're starting simple, we'll use a single EC2 instance with docker-compose.

### Prerequisites
- AWS CLI configured ✅
- SSH key pair for EC2 access
- Docker Compose configuration

## EC2 Instance Setup

### 1. Create Security Group

```bash
# Create security group for web application
aws ec2 create-security-group \
    --group-name alchemorsel-sg \
    --description "Security group for Alchemorsel application" \
    --region us-west-2

# Add inbound rules
aws ec2 authorize-security-group-ingress \
    --group-name alchemorsel-sg \
    --protocol tcp \
    --port 22 \
    --cidr YOUR_IP/32 \
    --region us-west-2  # SSH access (replace YOUR_IP with your actual IP)

aws ec2 authorize-security-group-ingress \
    --group-name alchemorsel-sg \
    --protocol tcp \
    --port 80 \
    --cidr 0.0.0.0/0 \
    --region us-west-2  # HTTP access

aws ec2 authorize-security-group-ingress \
    --group-name alchemorsel-sg \
    --protocol tcp \
    --port 443 \
    --cidr 0.0.0.0/0 \
    --region us-west-2  # HTTPS access

aws ec2 authorize-security-group-ingress \
    --group-name alchemorsel-sg \
    --protocol tcp \
    --port 8080 \
    --cidr 0.0.0.0/0 \
    --region us-west-2  # Backend API port
```

### 2. Create Key Pair

```bash
# Create SSH key pair
aws ec2 create-key-pair \
    --key-name alchemorsel-key \
    --query 'KeyMaterial' \
    --output text \
    --region us-west-2 > ~/.ssh/alchemorsel-key.pem

# Set proper permissions
chmod 400 ~/.ssh/alchemorsel-key.pem
```

### 3. Launch EC2 Instance

```bash
# Get latest Ubuntu AMI ID for us-west-2
AMI_ID=$(aws ec2 describe-images \
    --owners 099720109477 \
    --filters "Name=name,Values=ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*" \
    --query 'Images | sort_by(@, &CreationDate) | [-1].ImageId' \
    --output text \
    --region us-west-2)

# Launch instance
aws ec2 run-instances \
    --image-id $AMI_ID \
    --count 1 \
    --instance-type t3.micro \
    --key-name alchemorsel-key \
    --security-groups alchemorsel-sg \
    --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=alchemorsel}]' \
    --region us-west-2
```

## Server Setup

### Connect to Instance

```bash
# Get instance public IP
INSTANCE_ID=$(aws ec2 describe-instances \
    --filters "Name=tag:Name,Values=alchemorsel" "Name=instance-state-name,Values=running" \
    --query 'Reservations[0].Instances[0].InstanceId' \
    --output text \
    --region us-west-2)

PUBLIC_IP=$(aws ec2 describe-instances \
    --instance-ids $INSTANCE_ID \
    --query 'Reservations[0].Instances[0].PublicIpAddress' \
    --output text \
    --region us-west-2)

echo "Instance ID: $INSTANCE_ID"
echo "Public IP: $PUBLIC_IP"

# SSH into instance
ssh -i ~/.ssh/alchemorsel-key.pem ubuntu@$PUBLIC_IP
```

### Install Dependencies (on EC2 instance)

```bash
# Update system
sudo apt-get update -y

# Install Docker
sudo apt-get install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Git
sudo apt-get install -y git

# Create application directory
sudo mkdir -p /opt/alchemorsel
sudo chown ubuntu:ubuntu /opt/alchemorsel

# Logout and log back in for docker group to take effect
exit
```

## Application Deployment

### 1. Deploy Application (reconnect to EC2)

```bash
# SSH back into instance
ssh -i ~/.ssh/alchemorsel-key.pem ubuntu@$PUBLIC_IP

cd /opt/alchemorsel

# Clone repository (replace with your repo URL)
git clone https://github.com/your-username/alchemorsel-v2.git .

# Create production environment file
cp .env.example .env.production
# Edit with production values using nano/vim
```

### 2. Production Environment Variables

Create `.env.production`:
```env
# Database
DB_HOST=postgres
DB_PORT=5432
DB_NAME=alchemorsel_prod
DB_USER=alchemorsel
DB_PASSWORD=your_secure_password

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# JWT
JWT_SECRET=your_secure_jwt_secret_at_least_32_chars

# LLM
LLM_PROVIDER=deepseek
DEEPSEEK_API_KEY=your_deepseek_key

# AWS S3 (for profile pictures)
AWS_REGION=us-west-2
AWS_S3_BUCKET=alchemorsel-uploads
AWS_ACCESS_KEY_ID=your_s3_access_key
AWS_SECRET_ACCESS_KEY=your_s3_secret_key
```

### 3. Start Application

```bash
# Build and start services
docker-compose -f docker-compose.yml up -d --build

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

## Management Commands

### Application Monitoring
```bash
# View logs
docker-compose logs -f

# Check service status
docker-compose ps

# Restart services
docker-compose restart

# Update application
git pull origin main
docker-compose down
docker-compose up -d --build
```

### System Monitoring
```bash
# Check disk space
df -h

# Check memory usage
free -h

# Check running processes
htop
```

## Security & Maintenance

### 1. Secure SSH Access
```bash
# Restrict SSH to your IP only
YOUR_IP=$(curl -s ifconfig.me)
aws ec2 authorize-security-group-ingress \
    --group-name alchemorsel-sg \
    --protocol tcp \
    --port 22 \
    --cidr $YOUR_IP/32 \
    --region us-west-2

# Revoke open SSH access (if previously configured)
aws ec2 revoke-security-group-ingress \
    --group-name alchemorsel-sg \
    --protocol tcp \
    --port 22 \
    --cidr PREVIOUS_OPEN_ACCESS/0 \
    --region us-west-2
```

### 2. Regular Maintenance
```bash
# System updates
sudo apt-get update && sudo apt-get upgrade -y

# Database backup
docker-compose exec postgres pg_dump -U alchemorsel alchemorsel_prod > backup_$(date +%Y%m%d_%H%M%S).sql

# Docker cleanup
docker system prune -f
```

## Useful AWS Commands

```bash
# Check instance status
aws ec2 describe-instances --instance-ids $INSTANCE_ID --region us-west-2

# Start/stop instance
aws ec2 start-instances --instance-ids $INSTANCE_ID --region us-west-2
aws ec2 stop-instances --instance-ids $INSTANCE_ID --region us-west-2

# Get current public IP (changes on restart)
aws ec2 describe-instances \
    --instance-ids $INSTANCE_ID \
    --query 'Reservations[0].Instances[0].PublicIpAddress' \
    --output text \
    --region us-west-2
```

## Future Migration Path

When ready to scale:
1. Use AWS MCP servers for infrastructure automation
2. Migrate to ECS/Fargate for container management  
3. Move to RDS for managed database
4. Add ElastiCache for Redis
5. Implement CloudFront CDN
6. Set up proper SSL with ACM