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

variable "vm_host" {
  description = "Public IP or hostname of the Docker Swarm VM (e.g., 137.131.204.251)"
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

variable "pgsql_password" {
  description = "Password for the PostgreSQL database"
  type        = string
  sensitive   = true
}

variable "domain" {
  description = "Custom domain for the application"
  type        = string
  default     = "valorizeai.felipemalacarne.com.br"
}

# Swarm (DB) configuration
variable "swarm_stack_name" {
  description = "Swarm stack name for Postgres"
  type        = string
  default     = "valorize-db"
}

variable "swarm_compose_files" {
  description = "Compose files for the Swarm stack (absolute paths recommended)"
  type        = list(string)
  default     = []
}

variable "swarm_with_registry_auth" {
  description = "Pass registry auth to stack deploy"
  type        = bool
  default     = true
}

variable "swarm_prune" {
  description = "Prune services not in compose"
  type        = bool
  default     = true
}

variable "swarm_db_published_port" {
  description = "Host port to publish Postgres"
  type        = number
  default     = 5432
}

variable "swarm_db_data_volume" {
  description = "External Docker volume name for Postgres data"
  type        = string
  default     = "postgres_data"
}

variable "swarm_db_password_secret_name" {
  description = "Docker secret name for Postgres password"
  type        = string
  default     = "postgres_password"
}

variable "swarm_postgres_image" {
  description = "Postgres image tag for Swarm"
  type        = string
  default     = "postgres:17.2"
}

