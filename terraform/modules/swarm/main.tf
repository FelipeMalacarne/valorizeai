
terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

locals {
  // Root should provide compose files with absolute paths (e.g., using path.root)
  compose_files = var.compose_files
}

resource "docker_secret" "postgres_password" {
  name = var.db_password_secret_name
  data = var.db_password
}

resource "docker_secret" "app_key" {
  count = var.app_key == "" ? 0 : 1
  name  = "app_key"
  data  = var.app_key
}

resource "docker_volume" "db_data" {
  name = var.db_data_volume
}

resource "docker_stack" "this" {
  name               = var.stack_name
  compose_files      = local.compose_files
  with_registry_auth = var.with_registry_auth
  prune              = var.prune

  env = [
    "DB_NAME=${var.db_name}",
    "DB_USER=${var.db_user}",
    "DB_PUBLISHED_PORT=${var.db_published_port}",
    "DB_DATA_VOLUME=${var.db_data_volume}",
    "POSTGRES_PASSWORD_SECRET_NAME=${var.db_password_secret_name}",
    "POSTGRES_IMAGE=${var.postgres_image}",
  ]

  depends_on = [
    docker_secret.postgres_password,
    docker_volume.db_data,
  ]
}
