variable "project_id" {
  description = "Google Cloud project ID"
  type        = string
}

variable "region" {
  description = "Google Cloud region for the GKE cluster"
  type        = string
}

variable "cluster_name" {
  description = "The name for the GKE cluster"
  type        = string
  default     = "valorizeai-autopilot-cluster"
}

variable "domain" {
  description = "Custom domain for the application"
  type        = string
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