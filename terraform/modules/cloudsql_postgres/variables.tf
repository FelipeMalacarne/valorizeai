variable "project_id" {
  description = "GCP project where the instance will be created."
  type        = string
}

variable "region" {
  description = "Region for the Cloud SQL instance."
  type        = string
}

variable "instance_name" {
  description = "Name of the Cloud SQL instance."
  type        = string
}

variable "database_name" {
  description = "Name of the default database to create."
  type        = string
}

variable "user_name" {
  description = "Database user that the application will use."
  type        = string
}

variable "user_password" {
  description = "Password for the database user."
  type        = string
  sensitive   = true
}

variable "tier" {
  description = "Machine tier for Cloud SQL."
  type        = string
  default     = "db-custom-2-7680"
}

variable "availability_type" {
  description = "Zonal or Regional availability (REGIONAL recommended)."
  type        = string
  default     = "REGIONAL"
}

variable "disk_size_gb" {
  description = "Initial disk size in GB."
  type        = number
  default     = 50
}

variable "database_version" {
  description = "PostgreSQL version."
  type        = string
  default     = "POSTGRES_16"
}

variable "private_network" {
  description = "Self link of the VPC network for private IP."
  type        = string
}

variable "enable_public_ip" {
  description = "Enable public IPv4 access."
  type        = bool
  default     = false
}

variable "maintenance_window_day" {
  description = "Day of week (1-7, Monday=1) for maintenance."
  type        = number
  default     = 7
}

variable "maintenance_window_hour" {
  description = "Hour of day (0-23) for maintenance."
  type        = number
  default     = 3
}

variable "labels" {
  description = "Labels applied to Cloud SQL resources."
  type        = map(string)
  default     = {}
}
