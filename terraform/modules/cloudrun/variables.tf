variable "project_id" {
  description = "Google Cloud project ID"
  type        = string
}

variable "service_name" {
  description = "Base name for the primary Cloud Run service."
  type        = string
  default     = "valorizeai"
}

variable "vpc_network" {
  description = "VPC network self link for direct Cloud Run attachment."
  type        = string
}

variable "vpc_subnetwork" {
  description = "Subnetwork self link for direct Cloud Run attachment."
  type        = string
}

variable "region" {
  description = "Google Cloud region for the Cloud Run service"
  type        = string
}

variable "redis_host" {
  description = "Hostname/IP for Redis (Memorystore)."
  type        = string
}

variable "redis_port" {
  description = "Port for Redis."
  type        = number
  default     = 6379
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
  description = "Maximum number of instances for the Cloud Run service (Cloud Run + VPC direct attachment supports at most 10)."
  type        = number
  default     = 10
}

variable "min_instances" {
  description = "Minimum number of instances for the Cloud Run service (helps reduce cold starts)"
  type        = number
  default     = 0
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

variable "service_account_email" {
  description = "Service account email used by Cloud Run service and jobs."
  type        = string
}

variable "domain" {
  description = "Custom domain for the application"
  type        = string
  default     = "valorizeai.felipemalacarne.com.br"
}

variable "cloud_tasks_queue" {
  description = "Primary Cloud Tasks queue name."
  type        = string
  default     = ""
}

variable "google_credentials_secret_name" {
  description = "Secret Manager name that stores service account JSON for GOOGLE_APPLICATION_CREDENTIALS."
  type        = string
}

variable "resend_key_secret_name" {
    description = "Secret Manager name that stores Resend API key."
    type        = string
}

variable "google_credentials_path" {
  description = "Path inside container where GOOGLE_APPLICATION_CREDENTIALS JSON will be mounted."
  type        = string
  default     = "/var/secrets/google/credentials.json"
}

variable "cloud_sql_instances" {
  description = "Optional list of Cloud SQL instance connection names to mount."
  type        = list(string)
  default     = []
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
      value = "https://${var.domain}"
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
      value = false
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
      value = "redis"
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
      value = ".${var.domain}"
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
      value = "cloudtasks"
    },
    {
      name  = "CACHE_STORE"
      value = "redis"
    },
    {
      name  = "REDIS_HOST"
      value = var.redis_host
    },
    {
      name  = "REDIS_PORT"
      value = tostring(var.redis_port)
    },
    {
      name  = "OCTANE_SERVER"
      value = "frankenphp"
    },
    {
      name  = "TRUSTED_PROXIES"
      value = "*"
    },
    {
      name  = "TRUSTED_HOSTS"
      value = var.domain
    },
    {
      name  = "CLOUD_TASKS_PROJECT"
      value = var.project_id
    },
    {
      name  = "CLOUD_TASKS_LOCATION"
      value = var.region
    },
    {
      name  = "CLOUD_TASKS_QUEUE"
      value = var.cloud_tasks_queue
    },
    {
      name  = "CLOUD_TASKS_SERVICE_EMAIL"
      value = var.service_account_email
    },
    {
      name = "MAIL_MAILER"
      value = "resend"
    },
    {
      name  = "MAIL_FROM_NAME"
      value = "valorizeai"
    },
    {
      name  = "MAIL_FROM_ADDRESS"
      value = "contato@transactional.felipemalacarne.com.br"
    },
  ]

  # Secret-based environment variables
  secret_env_vars = [
    {
      name   = "DB_PASSWORD"
      secret = var.pgsql_password_secret_name
    },
    {
      name   = "RESEND_API_KEY"
      secret = var.resend_key_secret_name
    }
  ]
}
