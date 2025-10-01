module "vpc" {
  source = "./modules/vpc"
}

module "security" {
  source = "./modules/security"
  vpc_id = module.vpc.vpc_id
}

module "dynamodb" {
  source = "./modules/dynamodb"
}

module "iam" {
  source = "./modules/iam"
  dynamodb_table_arn = module.dynamodb.table_arn
}

module "ecr" {
  source = "./modules/ecr"
}

module "ecs" {
  source = "./modules/ecs"
  vpc_id = module.vpc.vpc_id
  subnets = module.vpc.public_subnets
  security_group_id = module.security.ecs_security_group_id
  app_image = "${module.ecr.repository_url}:latest"
  task_execution_role_arn = module.iam.ecs_task_execution_role_arn
  task_role_arn = module.iam.ecs_task_role_arn
  dynamodb_table_name = module.dynamodb.table_name
}