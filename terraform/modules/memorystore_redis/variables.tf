variable "project_id" {
  description = "GCP project ID."
  type        = string
}

variable "region" {
  description = "Region for the Redis instance."
  type        = string
}

variable "instance_name" {
  description = "Name of the Memorystore instance."
  type        = string
}

variable "tier" {
  description = "Tier type (BASIC or STANDARD_HA)."
  type        = string
  default     = "STANDARD_HA"
}

variable "memory_size_gb" {
  description = "Memory size in GB."
  type        = number
  default     = 5
}

variable "redis_version" {
  description = "Redis version (e.g., REDIS_7_0)."
  type        = string
  default     = "REDIS_7_0"
}

variable "authorized_network" {
  description = "Self link of the VPC network allowed to access Redis."
  type        = string
}

variable "labels" {
  description = "Labels applied to the Redis instance."
  type        = map(string)
  default     = {}
}

variable "maintenance_window_day" {
  description = "Day of maintenance window."
  type        = string
  default     = "SUNDAY"
}

variable "maintenance_window_hour" {
  description = "Hour (0-23) for maintenance."
  type        = number
  default     = 4
}

variable "replica_count" {
  description = "Replica count (only for STANDARD_HA)."
  type        = number
  default     = 1
}
