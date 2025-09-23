terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "3.6.2"
    }
  }
}

# PostgreSQL
resource "random_password" "postgres" {
  length           = 32
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "docker_secret" "postgres_password" {
  name = "valorize_postgres_password"
  data = base64encode(random_password.postgres.result)
}

resource "docker_volume" "db_data" {
  name = "valorize_postgres_data"
}

# Minio
resource "random_password" "minio_password" {
  length           = 32
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "random_string" "minio_user" {
  length  = 16
  special = false
}

resource "docker_secret" "minio_root_user" {
  name = "valorize_minio_root_user"
  data = base64encode(random_string.minio_user.result)
}

resource "docker_secret" "minio_root_password" {
  name = "valorize_minio_root_password"
  data = base64encode(random_password.minio_password.result)
}

resource "docker_volume" "minio_data" {
  name = "valorize_minio_data"
}

# Typesense
resource "random_password" "typesense_api_key" {
  length           = 32
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "docker_secret" "typesense_api_key" {
  name = "valorize_typesense_api_key"
  data = base64encode(random_password.typesense_api_key.result)
}

resource "docker_volume" "typesense_data" {
  name = "valorize_typesense_data"
}

# Redis
resource "docker_volume" "redis_data" {
  name = "valorize_redis_data"
}

# App
resource "docker_secret" "app_key" {
  name = "valorize_app_key"
  data = base64encode(var.app_key)
}

resource "docker_secret" "resend_api_key" {
  name = "valorize_resend_api_key"
  data = base64encode(var.resend_api_key)
}

resource "docker_secret" "nightwatch_token" {
  name = "valorize_nightwatch_token"
  data = base64encode(var.nightwatch_token)
}
