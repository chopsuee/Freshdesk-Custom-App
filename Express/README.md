# Express.js on AWS ECS with Terraform

Deploy a containerized Express.js application to AWS ECS Fargate using Terraform.

## Prerequisites

- AWS CLI configured with credentials
- Docker Desktop installed and running
- Terraform installed (>= 1.5.0)
- Node.js 18+ (for local development)

## Project Structure

```
Express/
├── index.js              # Express.js application
├── package.json          # Node.js dependencies
├── dockerfile            # Docker configuration
├── deploy.bat            # Build and push script
├── main.tf               # Terraform root configuration
├── providers.tf          # AWS provider configuration
├── outputs.tf            # Terraform outputs
└── modules/              # Terraform modules
    ├── vpc/              # VPC and networking
    ├── security/         # Security groups
    ├── ecr/              # Container registry
    └── ecs/              # ECS cluster and services
```

## Quick Start

### 1. Deploy Infrastructure

```bash
# Initialize Terraform
terraform init

# Deploy AWS resources
terraform apply
```

### 2. Build and Deploy Application

```bash
# Build Docker image and push to ECR
call deploy.bat

# Update ECS service with new image
terraform apply
```

### 3. Access Application

Get the application URL:
```bash
terraform output app_url
```

## API Endpoints

- `GET /orders/101` - Get order by ID
- `PUT /orders/101/status` - Update order status

Example:
```bash
curl http://your-alb-url/orders/101
curl -X PUT http://your-alb-url/orders/101/status -H "Content-Type: application/json" -d '{"status":"delivered"}'
```

## Architecture

- **ECS Fargate**: Serverless container hosting
- **Application Load Balancer**: Traffic distribution
- **ECR**: Private container registry
- **VPC**: Isolated network with public subnets
- **Security Groups**: Port 80 (HTTP) and 3000 (app) access

## Commands

### Development
```bash
# Run locally
npm install
node index.js
```

### Deployment
```bash
# Full deployment
terraform apply && call deploy.bat && terraform apply

# Destroy infrastructure
terraform destroy
```

### Troubleshooting
```bash
# Check ECS service status
aws ecs describe-services --cluster ecs-express-cluster --services express-service

# View container logs
aws logs describe-log-groups --log-group-name-prefix /ecs/express-task
```

## Configuration

- **Region**: ap-southeast-1 (Singapore)
- **Container**: 256 CPU, 512 MB memory
- **Port**: Application runs on 3000, accessible via port 80

## Cleanup

```bash
terraform destroy -auto-approve
```

This removes all AWS resources and stops billing.