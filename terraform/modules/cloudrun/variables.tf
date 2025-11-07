variable "project_id" {
  description = "Google Cloud project ID"
  type        = string
}

variable "service_name" {
  description = "Base name for the primary Cloud Run service."
  type        = string
  default     = "valorizeai"
}

variable "deployment_kind" {
  description = "Type of Cloud Run workload to create (service or job)."
  type        = string
  default     = "service"
  validation {
    condition     = contains(["service", "job"], lower(var.deployment_kind))
    error_message = "deployment_kind must be either \"service\" or \"job\"."
  }
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

variable "command" {
  description = "Optional override for the container entrypoint command."
  type        = list(string)
  default     = []
}

variable "args" {
  description = "Optional arguments passed to the container."
  type        = list(string)
  default     = []
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

variable "env_overrides" {
  description = "Map of environment variables that should override the defaults."
  type        = map(any)
  default     = {}
}

variable "additional_env_vars" {
  description = "Additional environment variables to append to the defaults."
  type = list(object({
    name  = string
    value = any
  }))
  default = []
}

variable "additional_secret_env_vars" {
  description = "Additional secret-backed environment variables."
  type = list(object({
    name    = string
    secret  = string
    version = optional(string, "latest")
  }))
  default = []
}

locals {
  is_service = lower(var.deployment_kind) == "service"
  is_job     = lower(var.deployment_kind) == "job"

  base_env_vars = [
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
      name  = "CLOUD_TASKS_DISABLE_TASK_HANDLER"
      value = false
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
  base_secret_env_vars = [
    {
      name    = "DB_PASSWORD"
      secret  = var.pgsql_password_secret_name
      version = "latest"
    },
    {
      name    = "RESEND_API_KEY"
      secret  = var.resend_key_secret_name
      version = "latest"
    }
  ]

  env_override_map = { for k, v in var.env_overrides : k => tostring(v) }

  base_env_map = { for env in local.base_env_vars : env.name => tostring(env.value) }

  merged_env_vars = [
    for name, value in merge(local.base_env_map, local.env_override_map) : {
      name  = name
      value = value
    }
  ]

  env_vars = concat(
    local.merged_env_vars,
    [for env in var.additional_env_vars : {
      name  = env.name
      value = tostring(env.value)
    }]
  )

  secret_env_vars = concat(
    [for env in local.base_secret_env_vars : env if env.secret != null],
    [for env in var.additional_secret_env_vars : {
      name    = env.name
      secret  = env.secret
      version = coalesce(env.version, "latest")
    }]
  )

  container_command = length(var.command) > 0 ? var.command : null
  job_command       = length(var.command) > 0 ? var.command : ["php", "artisan"]
}
