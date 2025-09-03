variable "stack_name" {
  description = "Name of the Swarm stack"
  type        = string
}

variable "compose_files" {
  description = "List of Compose files to deploy as a Swarm stack"
  type        = list(string)
}

variable "with_registry_auth" {
  description = "Pass registry auth when deploying the stack"
  type        = bool
  default     = true
}

variable "prune" {
  description = "Prune services not referenced in the compose files"
  type        = bool
  default     = true
}

variable "db_password" {
  description = "Postgres password for the DB user"
  type        = string
  sensitive   = true
}

variable "db_name" {
  description = "Postgres database name"
  type        = string
}

variable "db_user" {
  description = "Postgres username"
  type        = string
}

variable "db_published_port" {
  description = "Host port to publish Postgres on the VM"
  type        = number
  default     = 5432
}

variable "db_data_volume" {
  description = "Name of the external Docker volume for Postgres data"
  type        = string
}

variable "db_password_secret_name" {
  description = "Name of the Docker secret that stores the Postgres password"
  type        = string
}

variable "postgres_image" {
  description = "Postgres image to deploy"
  type        = string
}

variable "app_key" {
  description = "Optional Laravel APP_KEY secret for future app stack"
  type        = string
  sensitive   = true
  default     = ""
}

