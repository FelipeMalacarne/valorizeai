variable "project_id" {
  type        = string
  description = "GCP project ID that owns the Cloud Tasks queue."
}

variable "location" {
  type        = string
  description = "Region/location for the Cloud Tasks queue (e.g., southamerica-east1)."
}

variable "queue_name" {
  type        = string
  description = "Name of the Cloud Tasks queue."
}

variable "service_account_email" {
  type        = string
  description = "Service account email authorized to act on behalf of the queue (for OIDC push)."
}
