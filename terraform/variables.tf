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

variable "laravel_app_key" {
  description = "Laravel encryption app key"
  type        = string
  sensitive   = true
}

variable "enable_gcp_infra" {
  description = "Enable provisioning of GCP infrastructure (Cloud Run, Load Balancer, IAM, Secrets). Set to false to keep only Artifact Registry (not managed here)."
  type        = bool
  default     = true
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
