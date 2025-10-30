#!/bin/bash

# CodeGuardian AWS Deployment Script
# This script builds Docker images and pushes them to AWS ECR

set -e

# Configuration
AWS_REGION="${AWS_REGION:-us-east-1}"
AWS_ACCOUNT_ID="${AWS_ACCOUNT_ID:-YOUR_ACCOUNT_ID}"
ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

# Services to deploy
SERVICES=("repo-service" "ai-review-service" "metrics-service" "notification-service" "insight-service")
ECR_REPOS=("codeguardian-repo" "codeguardian-ai" "codeguardian-metrics" "codeguardian-notify" "codeguardian-insight")

echo "=========================================="
echo "CodeGuardian AWS Deployment"
echo "=========================================="
echo "AWS Region: $AWS_REGION"
echo "AWS Account: $AWS_ACCOUNT_ID"
echo ""

# Login to ECR
echo "Logging in to Amazon ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY

# Create ECR repositories if they don't exist
echo ""
echo "Creating ECR repositories..."
for repo in "${ECR_REPOS[@]}"; do
    echo "  Checking repository: $repo"
    aws ecr describe-repositories --repository-names $repo --region $AWS_REGION 2>/dev/null || \
    aws ecr create-repository --repository-name $repo --region $AWS_REGION --image-scanning-configuration scanOnPush=true
done

# Build and push each service
echo ""
echo "Building and pushing Docker images..."
for i in "${!SERVICES[@]}"; do
    SERVICE="${SERVICES[$i]}"
    ECR_REPO="${ECR_REPOS[$i]}"
    IMAGE_TAG="${ECR_REGISTRY}/${ECR_REPO}:latest"
    
    echo ""
    echo "----------------------------------------"
    echo "Building $SERVICE..."
    echo "----------------------------------------"
    
    cd $SERVICE
    docker build -t $ECR_REPO:latest .
    docker tag $ECR_REPO:latest $IMAGE_TAG
    
    echo "Pushing $IMAGE_TAG..."
    docker push $IMAGE_TAG
    
    cd ..
done

echo ""
echo "=========================================="
echo "Deployment Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Update aws-ecs-task-definition.json with your AWS Account ID"
echo "2. Create AWS RDS MySQL instance for metrics database"
echo "3. Run the schema.sql on your RDS instance"
echo "4. Store secrets in AWS Secrets Manager"
echo "5. Create ECS cluster and service using the task definition"
echo ""
echo "Useful commands:"
echo "  aws ecs register-task-definition --cli-input-json file://aws-ecs-task-definition.json"
echo "  aws ecs create-service --cluster codeguardian --service-name codeguardian --task-definition codeguardian-services"
echo ""
