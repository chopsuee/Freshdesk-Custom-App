data "aws_caller_identity" "current" {}

variable "vpc_id" {
  type = string
}

variable "subnets" {
  type = list(string)
}

variable "security_group_id" {
  type = string
}

variable "app_image" {
  type = string
}



resource "aws_ecs_cluster" "main" {
  name = "ecs-express-cluster"
}

resource "aws_ecs_task_definition" "express" {
  family                   = "express-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/ecsTaskExecutionRole"


  container_definitions = jsonencode([
    {
      name  = "express"
      image = var.app_image
      portMappings = [
        {
          containerPort = 3000
          protocol      = "tcp"
        }
      ]
    }
  ])
}

resource "aws_ecs_service" "express" {
  name            = "express-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.express.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = var.subnets
    security_groups = [var.security_group_id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.express.arn
    container_name   = "express"
    container_port   = 3000
  }

  depends_on = [aws_lb_listener.http]
}

resource "aws_lb" "app" {
  name               = "express-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.security_group_id]
  subnets            = var.subnets
}

resource "aws_lb_target_group" "express" {
  name     = "express-tg"
  port     = 3000
  protocol = "HTTP"
  vpc_id   = var.vpc_id
  target_type = "ip"

  health_check {
    path                = "/"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
    matcher             = "200"
  }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.app.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.express.arn
  }
}