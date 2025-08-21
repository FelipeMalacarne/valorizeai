variable "project_id" {
  description = "Google Cloud project ID"
  type        = string
}
variable "region" {
  description = "Google Cloud region for the Cloud Run service"
  type        = string
}

variable "pgsql_host" {
  description = "Hostname of the PostgreSQL database"
  type        = string
}

variable "pgsql_database" {
  description = "Name of the PostgreSQL database"
  type        = string
}

variable "pgsql_username" {
  description = "Username for the PostgreSQL database"
  type        = string
}

variable "pgsql_password_secret_name" {
  description = "Password for the PostgreSQL database"
  type        = string
  sensitive   = true
}

variable "concurrency" {
  description = "Concurrency setting for the Cloud Run service"
  type        = number
  default     = 80
}

variable "max_instances" {
  description = "Maximum number of instances for the Cloud Run service"
  type        = number
  default     = 100
}

variable "cpu" {
  description = "CPU allocation for the Cloud Run service"
  type        = number
  default     = 1
}

variable "memory" {
  description = "Memory allocation for the Cloud Run service"
  type        = string
  default     = "1Gi"
}

variable "image" {
  description = "Container image for the Cloud Run service"
  type        = string
}

variable "job_max_retries" {
  type    = number
  default = 1
}
variable "job_memory" {
  type    = string
  default = "512Mi"
}
variable "job_cpu" {
  type    = string
  default = "1"
}
variable "job_timeout" {
  type    = string
  default = "36000s"
}

locals {
  common_env_vars = [
    {
      name  = "APP_URL"
      value = "https://valorize-api-567577815977.southamerica-east1.run.app"
    },
    {
      name  = "APP_NAME"
      value = "ValorizeAI"
    },
    {
      name  = "APP_KEY"
      value = "base64:p6/uv9f4zbL+enWMAKerD0UuZd9+bAx4GEEzkf2SSeU="
    },
    {
      name  = "APP_ENV"
      value = "production"
    },
    {
      name  = "APP_DEBUG"
      value = true
    },
    {
      name  = "APP_LOCALE"
      value = "pt_BR"
    },
    {
      name  = "APP_FALLBACK_LOCALE"
      value = "en_US"
    },
    {
      name  = "BCRYPT_ROUNDS"
      value = 12
    },
    {
      name  = "LOG_CHANNEL"
      value = "stderr"
    },
    {
      name  = "LOG_LEVEL"
      value = "debug"
    },
    {
      name  = "DB_CONNECTION"
      value = "pgsql"
    },
    {
      name  = "DB_HOST"
      value = var.pgsql_host
    },
    {
      name  = "DB_PORT"
      value = "5432"
    },
    {
      name  = "DB_DATABASE"
      value = var.pgsql_database
    },
    {
      name  = "DB_USERNAME"
      value = var.pgsql_username
    },
    {
      name  = "SESSION_DRIVER"
      value = "database"
    },
    {
      name  = "SESSION_ENCRYPT"
      value = false
    },
    {
      name  = "SESSION_PATH"
      value = "/"
    },
    {
      name  = "SESSION_DOMAIN"
      value = null
    },
    {
      name  = "SESSION_LIFETIME"
      value = 120
    },
    {
      name  = "BROADCAST_CONNECTION"
      value = "log"
    },
    {
      name  = "FILESYSTEM_DISK"
      value = "local"
    },
    {
      name  = "QUEUE_CONNECTION"
      value = "database"
    },
    {
      name  = "CACHE_STORE"
      value = "array"
    },
    {
      name  = "OCTANE_SERVER"
      value = "frankenphp"
    },
  ]

  # Secret-based environment variables
  secret_env_vars = [
    {
      name   = "DB_PASSWORD"
      secret = var.pgsql_password_secret_name
    },
  ]
}
