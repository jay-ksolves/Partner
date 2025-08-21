# Partner Platform

A comprehensive partner management platform built with React, Node.js microservices, and deployed on AWS. This platform enables organizations to manage partner onboarding, KYC verification, transactions, and compliance with enterprise-grade security and scalability.

## 🏗️ Architecture

### Frontend
- **Framework**: React 18 + TypeScript + Vite
- **State Management**: Redux Toolkit + TanStack Query
- **Styling**: TailwindCSS with custom Purple theme
- **UI Components**: Custom component library with accessibility
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form + Zod validation
- **Tables**: TanStack Table with full feature set

### Backend
- **Architecture**: Node.js microservices with Express + TypeScript
- **Services**: auth-svc, partners-svc, kyc-svc, tx-svc, files-svc, notifications-svc, audit-svc
- **Database**: MongoDB Atlas with encryption at rest
- **Caching**: ElastiCache Redis
- **File Storage**: AWS S3 with presigned URLs
- **Authentication**: JWT with refresh token rotation

### AWS Infrastructure
- **Compute**: ECS Fargate with auto-scaling
- **Storage**: S3 + CloudFront CDN
- **Database**: MongoDB Atlas M30 with VPC peering
- **Caching**: ElastiCache Redis r6g.large
- **Networking**: VPC with private subnets, ALB, WAF
- **Monitoring**: CloudWatch, X-Ray, GuardDuty

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- AWS account with appropriate permissions
- Redis instance

### Installation

1. **Clone and install dependencies**
```bash
git clone <repository-url>
cd partner-platform
npm install
```

2. **Environment Configuration**
```bash
# Frontend
cp frontend/.env.example frontend/.env
# Edit frontend/.env with your API URL and keys

# Backend services
cp backend/.env.example backend/auth-svc/.env
# Edit with your database URLs, JWT secrets, AWS keys
```

3. **Start Development Environment**
```bash
# Start all services
npm run dev

# Or start individually
npm run dev:frontend  # Frontend on http://localhost:3000
npm run dev:backend   # Auth service on http://localhost:4001
```

### Database Setup

1. Create MongoDB Atlas cluster
2. Set up database user and network access
3. Update connection string in environment files
4. Database collections will be created automatically

## 🎨 Design System

The platform uses the BootstrapDash "Purple" theme with custom color tokens:

- **Primary**: #A05AFF (Purple gradient)
- **Secondary**: #1BCFB4 (Teal)
- **Accent Colors**: Sky (#4BCBEB), Rose (#FE9496)
- **Surface**: #F5F3F8 background, #FFFFFF cards

## 📋 Core Features

### Partner Management
- Self-registration with company details
- Profile management and bank details
- Document upload with S3 presigned URLs
- Status tracking and notifications

### KYC Verification
- Aadhaar OTP verification flow
- PAN verification
- Document validation
- Compliance tracking with audit trails

### Transaction Management
- Real-time transaction monitoring
- Advanced filtering and search
- Export functionality (CSV/XLSX)
- Payment processing integration

### Admin Panel
- User management and approvals
- Reports and analytics
- System monitoring
- Audit log access

### Security Features
- JWT authentication with refresh tokens
- Rate limiting and WAF protection
- PII encryption with AWS KMS
- Field-level masking for sensitive data
- RBAC with role-based access

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests for specific service
npm test --workspace=frontend
npm test --workspace=backend/auth-svc

# E2E tests
npm run test:e2e
```

## 🚢 Deployment

### Frontend (S3 + CloudFront)
```bash
npm run build --workspace=frontend
aws s3 sync frontend/dist/ s3://your-bucket-name
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

### Backend (ECS Fargate)
```bash
# Build and push Docker images
docker build -t partner-platform-auth ./backend/auth-svc
docker tag partner-platform-auth:latest YOUR_ECR_URI/partner-platform-auth:latest
docker push YOUR_ECR_URI/partner-platform-auth:latest

# Update ECS service
aws ecs update-service --cluster partner-platform --service auth-service --force-new-deployment
```

## 📊 Monitoring & Observability

- **Logs**: Structured logging with Winston to CloudWatch
- **Metrics**: Custom CloudWatch metrics for business KPIs
- **Tracing**: AWS X-Ray for distributed tracing
- **Alerts**: CloudWatch alarms for critical thresholds
- **Cost**: AWS Budget alerts and anomaly detection

## 🔧 Development

### Code Quality
- ESLint + Prettier configuration
- Husky pre-commit hooks
- Conventional commit messages
- TypeScript strict mode

### Git Workflow
```bash
# Feature branch
git checkout -b feature/new-feature
git commit -m "feat: add new feature"
git push origin feature/new-feature

# Create PR for review
```

## 📚 Additional Documentation

- [Frontend Development Guide](./FRONTEND_GUIDE.md)
- [Backend Development Guide](./BACKEND_GUIDE.md)
- [API Documentation](./API.md)
- [AWS Deployment Guide](./DEPLOYMENT_AWS.md)
- [Security Guidelines](./SECURITY.md)
- [Runbooks](./RUNBOOKS.md)

## 💰 Cost Optimization

Target monthly costs: ₹2.3-2.5L with optimizations:
- Reserved instances for Redis and RDS
- Savings Plans for ECS Fargate
- VPC endpoints to reduce NAT costs
- CloudFront caching optimization
- Right-sizing based on metrics

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Make changes following the style guide
4. Add tests for new functionality
5. Submit a pull request with detailed description

## 📄 License

This project is proprietary and confidential.

## 🆘 Support

For technical support or questions:
- Create an issue in the repository
- Contact the development team
- Check the runbooks for common issues