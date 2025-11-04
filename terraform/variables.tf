variable "gcp_project_id" {
  description = "GCP Project ID"
  type        = string
  default     = "valorizeai"
}

variable "gcp_region" {
  description = "GCP Region"
  type        = string
  default     = "southamerica-east1"
}

variable "gcp_zone" {
  description = "Compute Engine zone for zonal resources (VMs)"
  type        = string
  default     = "southamerica-east1-a"
}

variable "pgsql_database" {
  description = "Name of the PostgreSQL database"
  type        = string
}

variable "pgsql_username" {
  description = "Username for the PostgreSQL database"
  type        = string
}

variable "domain" {
  description = "Custom domain for the application"
  type        = string
  default     = "valorizeai.felipemalacarne.com.br"
}

variable "custom_domain" {
  description = "Optional override for the public domain (use if different from default)."
  type        = string
  default     = ""
}

variable "pgsql_host" {
  description = "Optional override for the PostgreSQL host (defaults to Cloud SQL socket)."
  type        = string
  default     = ""
}

variable "laravel_app_key" {
  description = "Laravel encryption app key"
  type        = string
  sensitive   = true
}

variable "resend_api_key" {
  description = "Resend API key for email sending"
  type        = string
  sensitive   = true
}

variable "nightwatch_token" {
  description = "Nightwatch API token for sending logs"
  type        = string
  sensitive   = true
}

variable "serverless_network_name" {
  description = "Name of the dedicated VPC network for serverless resources."
  type        = string
  default     = "valorizeai-serverless"
}

variable "serverless_subnet_cidr" {
  description = "CIDR range for the serverless subnet."
  type        = string
  default     = "10.70.0.0/20"
}
variable "cloudsql_instance_name" {
  description = "Name of the Cloud SQL instance."
  type        = string
  default     = "valorizeai-db"
}

variable "cloudsql_tier" {
  description = "Tier/machine type for Cloud SQL."
  type        = string
  default     = "db-perf-optimized-N-2"
}

variable "cloudsql_disk_size_gb" {
  description = "Initial disk size for Cloud SQL."
  type        = number
  default     = 50
}

variable "cloudsql_availability_type" {
  description = "Availability type for Cloud SQL (ZONAL or REGIONAL)."
  type        = string
  default     = "REGIONAL"
}

variable "cloudsql_enable_public_ip" {
  description = "Whether to enable public IPv4 on the Cloud SQL instance."
  type        = bool
  default     = false
}

variable "redis_instance_name" {
  description = "Name of the Memorystore Redis instance."
  type        = string
  default     = "valorizeai-redis"
}

variable "redis_tier" {
  description = "Memorystore tier (BASIC or STANDARD_HA)."
  type        = string
  default     = "STANDARD_HA"
}

variable "redis_memory_size_gb" {
  description = "Memory size in GB for Redis."
  type        = number
  default     = 5
}

variable "redis_version" {
  description = "Redis version."
  type        = string
  default     = "REDIS_7_0"
}

variable "resource_labels" {
  description = "Labels applied to shared resources (Cloud SQL, Redis, etc.)."
  type        = map(string)
  default = {
    app = "valorizeai"
  }
}

variable "cloudflare_api_token" {
  description = "Cloudflare API token with DNS edit permissions."
  type        = string
  sensitive   = true
  default     = ""
}

variable "cloudflare_zone_id" {
  description = "Cloudflare Zone ID for managing DNS."
  type        = string
  default     = ""
}

variable "cloudflare_record_name" {
  description = "Optional override for the DNS record name (defaults to the application domain)."
  type        = string
  default     = ""
}
