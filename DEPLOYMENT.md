# LinksGo Deployment Guide

This guide provides detailed instructions for deploying LinksGo using AWS Amplify.

## Prerequisites

Before deploying, ensure you have:

1. An AWS account with appropriate permissions
2. A Supabase project set up
3. The AWS Amplify CLI installed
4. Your environment variables ready

## Environment Variables

Set up the following environment variables in AWS Amplify Console:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_APP_URL=your-amplify-app-url
NEXT_PUBLIC_APP_DOMAIN=your-amplify-domain
```

## Deployment Steps

### 1. Initial Setup

1. Install AWS Amplify CLI:
   ```bash
   npm install -g @aws-amplify/cli
   ```

2. Configure Amplify:
   ```bash
   amplify configure
   ```

### 2. Connect Your Repository

1. Go to AWS Amplify Console
2. Click "New app" → "Host web app"
3. Choose GitHub as your repository
4. Select the LinksGo repository
5. Choose the `main` branch for production

### 3. Build Settings

Your `amplify.yml` should look like this:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### 4. Environment Variables

1. In Amplify Console, go to App settings → Environment variables
2. Add all required environment variables
3. Save and deploy

### 5. Domain Setup

1. Go to Domain Management in Amplify Console
2. Add your custom domain if needed
3. Update DNS records as instructed

## Monitoring and Maintenance

1. Monitor application logs in Amplify Console
2. Check Supabase dashboard for database activity
3. Regularly update dependencies
4. Monitor error rates and performance

## Troubleshooting

Common issues and solutions:

1. Build Failures
   - Check build logs
   - Verify node version
   - Check dependencies

2. Environment Variables
   - Verify all required variables
   - Check for typos
   - Ensure correct formatting

3. Database Connection
   - Verify Supabase credentials
   - Check permissions
   - Verify network access

## Support

For deployment issues:

1. Check AWS Amplify Documentation
2. Visit Supabase Documentation
3. Open an issue in our GitHub repository
