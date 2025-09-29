@echo off
echo Building and pushing Express.js app to ECR...

REM Get ECR repository URL
for /f "tokens=*" %%i in ('terraform output -raw ecr_repository_url') do set ECR_URL=%%i

REM Login to ECR
aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin %ECR_URL%

REM Build Docker image
docker build -t express-app .

REM Tag image for ECR
docker tag express-app:latest %ECR_URL%:latest

REM Push to ECR
docker push %ECR_URL%:latest

echo Done! Now run: terraform apply