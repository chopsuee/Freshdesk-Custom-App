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

- `POST /orders` - Create new order (prevents duplicates)
- `GET /orders/:id` - Get order by ID from DynamoDB
- `PUT /orders/:id/status` - Update order status in DynamoDB
- `PUT /orders/:id` - Update product name and/or status
- `DELETE /orders/:id` - Delete order from DynamoDB

Examples:
```bash
# Create order
curl -X POST http://your-alb-url/orders \
  -H "Content-Type: application/json" \
  -d '{"order_id":"103","product_name":"Mouse","status":"pending"}'

# Get order
curl http://your-alb-url/orders/103

# Update status only
curl -X PUT http://your-alb-url/orders/103/status \
  -H "Content-Type: application/json" \
  -d '{"status":"delivered"}'

# Update product (name and/or status)
curl -X PUT http://your-alb-url/orders/103 \
  -H "Content-Type: application/json" \
  -d '{"product_name":"Wireless Mouse","status":"shipped"}'

# Delete order
curl -X DELETE http://your-alb-url/orders/103
```

## Architecture

- **ECS Fargate**: Serverless container hosting
- **Application Load Balancer**: Traffic distribution
- **ECR**: Private container registry
- **DynamoDB**: NoSQL database for order storage (Freshdesk_Table_Orders)
- **VPC**: Isolated network with public subnets
- **Security Groups**: Port 80 (HTTP) and 3000 (app) access
- **IAM Roles**: DynamoDB access permissions for ECS tasks

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
- **Database**: DynamoDB table "Freshdesk_Table_Orders"

## Cleanup

```bash
terraform destroy -auto-approve
```

This removes all AWS resources and stops billing.