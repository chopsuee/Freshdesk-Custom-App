module "vpc" {
  source = "./modules/vpc"
}

module "security" {
  source = "./modules/security"
  vpc_id = module.vpc.vpc_id
}

# module "iam" {
#   source = "./modules/iam"
# }

module "ecr" {
  source = "./modules/ecr"
}

module "ecs" {
  source = "./modules/ecs"
  vpc_id = module.vpc.vpc_id
  subnets = module.vpc.public_subnets
  security_group_id = module.security.ecs_security_group_id
  app_image = "${module.ecr.repository_url}:latest"
}