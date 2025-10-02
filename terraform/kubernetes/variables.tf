variable "pgsql_password" {
  description = "Password for the PostgreSQL database."
  type        = string
  sensitive   = true
}

variable "minio_root_user" {
  description = "Root user for Minio."
  type        = string
  sensitive   = true
}

variable "minio_root_password" {
  description = "Root password for Minio."
  type        = string
  sensitive   = true
}

variable "app_key" {
  description = "Laravel application key."
  type        = string
  sensitive   = true
}

variable "typesense_api_key" {
  description = "Typesense API key."
  type        = string
  sensitive   = true
}

variable "resend_api_key" {
  description = "Resend API key."
  type        = string
  sensitive   = true
}

variable "nightwatch_token" {
  description = "Nightwatch token."
  type        = string
  sensitive   = true
}
