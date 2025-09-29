output "app_url" {
  value = "http://${module.ecs.load_balancer_dns}"
}

output "ecr_repository_url" {
  value = module.ecr.repository_url
}