# LinksGo Deployment Checklist

## Pre-deployment Steps

### 1. Environment Variables
- [ ] Generate new NEXTAUTH_SECRET (run: `openssl rand -base64 32`)
- [ ] Set up Google OAuth credentials for production domain
- [ ] Create AWS IAM user with required permissions
- [ ] Create production S3 bucket
- [ ] Create production DynamoDB table
- [ ] Update all variables in `.env.production`

### 2. AWS Setup
- [ ] Create AWS account if not exists
- [ ] Install AWS CLI
- [ ] Configure AWS credentials (`aws configure`)
- [ ] Install Elastic Beanstalk CLI (`pip install awsebcli`)
- [ ] Create Elastic Beanstalk application (`eb init`)
- [ ] Create environment (`eb create`)

### 3. Database Setup
- [ ] Create DynamoDB tables with proper indexes
  - Links table
  - Users table
  - Analytics table
- [ ] Set up backup policy
- [ ] Configure auto-scaling (if needed)

### 4. Storage Setup
- [ ] Create S3 bucket for assets
- [ ] Configure CORS policy
- [ ] Set up lifecycle rules
- [ ] Enable versioning (if needed)

### 5. Security Checks
- [ ] Review AWS IAM permissions
- [ ] Check security group configurations
- [ ] Enable HTTPS/SSL
- [ ] Configure CSP headers
- [ ] Set up rate limiting
- [ ] Review authentication flow

### 6. Performance Optimization
- [ ] Enable gzip compression
- [ ] Configure caching headers
- [ ] Set up CDN (if needed)
- [ ] Optimize images and assets
- [ ] Enable PWA features

### 7. Monitoring Setup
- [ ] Set up AWS CloudWatch
- [ ] Configure error logging
- [ ] Set up performance monitoring
- [ ] Create alert notifications
- [ ] Configure backup alerts

## Deployment Steps

1. Build the application:
   ```bash
   npm run build
   ```

2. Set environment variables:
   ```bash
   eb setenv $(cat .env.production | grep -v '^#' | xargs)
   ```

3. Deploy to AWS:
   ```bash
   npm run deploy:aws
   ```

4. Verify deployment:
   ```bash
   eb status
   eb health
   ```

## Managing Production Environment

### Pausing the Environment

To temporarily pause your production environment (useful for maintenance or cost saving):

```bash
# Save the current configuration
eb config save production --cfg initial-config

# Stop all instances in the environment
eb scale 0
```

This will:
- Stop all EC2 instances
- Maintain your environment configuration
- Keep your environment URL reserved
- Reduce costs while paused
- Preserve your data in DynamoDB and S3

### Resuming the Environment

To resume your paused environment:

```bash
# Scale back to your desired instance count (e.g., 1 for single instance)
eb scale 1
```

### Complete Shutdown

If you need to completely shut down the production environment:

```bash
# Terminate the entire environment
eb terminate LinksGo-env

# Optional: Remove the application version
eb delete LinksGo
```

⚠️ **Warning**:
- Termination is irreversible
- All EC2 instances will be terminated
- Environment URL will be released
- Application version will be deleted
- You'll need to create a new environment to redeploy

### Maintenance Mode

To put the application in maintenance mode without stopping instances:

1. Create a maintenance page in S3:
```bash
aws s3 cp maintenance.html s3://your-bucket/maintenance.html
```

2. Update nginx configuration:
```bash
# In .platform/nginx/conf.d/maintenance.conf
if (-f /var/app/maintenance.flag) {
    return 503;
}
```

3. Enable maintenance mode:
```bash
# Create maintenance flag
eb ssh -c "sudo touch /var/app/maintenance.flag"
```

4. Disable maintenance mode:
```bash
# Remove maintenance flag
eb ssh -c "sudo rm /var/app/maintenance.flag"
```

### Cost Management During Pause

While the environment is paused (scaled to 0):
- EC2 costs: $0
- Load Balancer costs: Still incur charges
- S3/DynamoDB: Normal charges apply
- Reserved URL: No charge

### Monitoring Stopped Environment

Even when paused, you can:
```bash
# Check environment status
eb status

# View recent logs
eb logs

# Monitor health
eb health
```

### Best Practices

1. **Before Pausing:**
   - Notify users in advance
   - Choose low-traffic time
   - Backup important data
   - Document current configuration

2. **During Pause:**
   - Monitor remaining AWS services
   - Keep backup of environment configuration
   - Maintain DNS records
   - Keep domain registration active

3. **Before Resuming:**
   - Check for pending updates
   - Verify database connections
   - Test environment variables
   - Update SSL certificates if needed

## AWS Free Tier Deployment

### Free Tier Limits

AWS Free Tier includes:
- EC2: 750 hours/month of t2.micro instance
- S3: 5GB storage, 20,000 GET requests, 2,000 PUT requests
- DynamoDB: 25GB storage, 25 WCU/RCU
- CloudWatch: 10 metrics, 1M API requests
- Data Transfer: 100GB outbound

### Cost-Free Configuration

1. **EC2 Instance Setup**
```bash
# Initialize with t2.micro
eb init LinksGo \
  --platform node.js-18 \
  --region us-east-1

# Create single instance environment (NO LOAD BALANCER)
eb create LinksGo-env \
  --single \
  --instance-type t2.micro \
  --service-role aws-elasticbeanstalk-service-role
```

2. **DynamoDB Settings**
```json
{
  "TableName": "linksgo-links-prod",
  "BillingMode": "PROVISIONED",
  "ProvisionedThroughput": {
    "ReadCapacityUnits": 5,
    "WriteCapacityUnits": 5
  }
}
```

3. **S3 Configuration**
```bash
# Create bucket with lifecycle rules
aws s3api create-bucket \
  --bucket linksgo-assets-prod \
  --region us-east-1

# Add lifecycle rule to delete old files
aws s3api put-bucket-lifecycle-configuration \
  --bucket linksgo-assets-prod \
  --lifecycle-configuration file://s3-lifecycle.json
```

4. **CloudWatch Alarms**
```bash
# Set up billing alarm
aws cloudwatch put-metric-alarm \
  --alarm-name billing-alarm \
  --alarm-description "Billing Alert" \
  --metric-name EstimatedCharges \
  --namespace AWS/Billing \
  --statistic Maximum \
  --period 21600 \
  --threshold 1 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 1 \
  --alarm-actions <your-sns-topic-arn>
```

### Required Configuration Files

1. **s3-lifecycle.json**
```json
{
  "Rules": [
    {
      "ID": "DeleteOldFiles",
      "Status": "Enabled",
      "Filter": {
        "Prefix": "temp/"
      },
      "Expiration": {
        "Days": 1
      }
    }
  ]
}
```

2. **.ebextensions/free-tier.config**
```yaml
option_settings:
  aws:autoscaling:asg:
    MaxSize: 1
  aws:autoscaling:launchconfiguration:
    InstanceType: t2.micro
  aws:elasticbeanstalk:environment:
    EnvironmentType: SingleInstance
```

### Cost Prevention Measures

1. **Instance Management**
- Use single instance environment (no load balancer)
- Never exceed one t2.micro instance
- Scale to 0 when not in use

2. **Storage Optimization**
- Implement aggressive image compression
- Set up automatic cleanup for old files
- Use client-side caching

3. **Database Usage**
- Keep provisioned capacity low (5 RCU/WCU)
- Implement caching for frequent queries
- Clean up old/unused data

4. **Monitoring Setup**
```bash
# Set up AWS Budgets
aws budgets create-budget \
  --account-id <your-account-id> \
  --budget file://budget.json \
  --notifications-with-subscribers file://notifications.json
```

### Preventing Accidental Charges

1. **AWS Account Settings**
- [ ] Set up MFA for root account
- [ ] Create IAM user with limited permissions
- [ ] Set up billing alerts
- [ ] Enable AWS Free Tier usage alerts
- [ ] Set service quotas

2. **Application Settings**
- [ ] Implement rate limiting
- [ ] Set maximum file upload size
- [ ] Cache static assets
- [ ] Use compression middleware

3. **Monitoring**
- [ ] Check AWS Cost Explorer daily
- [ ] Monitor Free Tier usage
- [ ] Set up email notifications
- [ ] Review CloudWatch metrics

### Free Tier Maintenance

Monthly checklist to stay within free tier:
- [ ] Check EC2 usage (max 750 hours)
- [ ] Monitor S3 storage (max 5GB)
- [ ] Review DynamoDB capacity
- [ ] Check data transfer metrics
- [ ] Review CloudWatch alarms
- [ ] Clean up unused resources

### Emergency Shutdown

If approaching free tier limits:
```bash
# Immediate environment shutdown
eb scale 0

# Or terminate completely
eb terminate LinksGo-env --force

# Delete S3 objects
aws s3 rm s3://linksgo-assets-prod --recursive

# Scale down DynamoDB
aws dynamodb update-table \
  --table-name linksgo-links-prod \
  --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1
```

## Post-deployment Steps

1. Verify Features:
   - [ ] Authentication works
   - [ ] Link creation works
   - [ ] Profile updates work
   - [ ] File uploads work
   - [ ] Analytics tracking works

2. Performance Testing:
   - [ ] Run Lighthouse audit
   - [ ] Test load times
   - [ ] Verify PWA functionality
   - [ ] Check mobile responsiveness

3. Security Verification:
   - [ ] SSL certificate is valid
   - [ ] Headers are properly set
   - [ ] Rate limiting works
   - [ ] Auth flow is secure

4. Monitoring:
   - [ ] CloudWatch logs are generated
   - [ ] Alerts are working
   - [ ] Metrics are being collected
   - [ ] Error tracking is functional

## Rollback Plan

1. If deployment fails:
   ```bash
   eb rollback
   ```

2. If database issues:
   - Restore from latest backup
   - Switch to read-only mode if needed

3. If security incident:
   - Revoke compromised credentials
   - Rotate secrets
   - Enable maintenance mode

## Cost Management

1. Monitor AWS Free Tier usage:
   - EC2 hours (750/month)
   - S3 storage (5GB)
   - DynamoDB capacity
   - Data transfer

2. Set up billing alerts:
   - Daily cost monitoring
   - Budget thresholds
   - Usage alerts

## Support Information

- AWS Support: https://console.aws.amazon.com/support
- NextAuth Docs: https://next-auth.js.org
- Next.js Docs: https://nextjs.org/docs
- Elastic Beanstalk Docs: https://docs.aws.amazon.com/elasticbeanstalk
