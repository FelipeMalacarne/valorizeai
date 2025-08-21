variable "project_id" {
  description = "Google Cloud project ID"
  type        = string
}

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "valorizeai"
}

variable "region" {
  description = "Google Cloud region where the Cloud Run service is deployed"
  type        = string
}

variable "cloud_run_service_name" {
  description = "Name of the Cloud Run service to route traffic to"
  type        = string
}

variable "domains" {
  description = "List of domains for the SSL certificate"
  type        = list(string)
  default     = ["valorizeai.felipemalacarne.com.br"]
}

variable "enable_cdn" {
  description = "Enable Cloud CDN for static content caching"
  type        = bool
  default     = true
}

variable "enable_logging" {
  description = "Enable detailed request logging"
  type        = bool
  default     = false
}

variable "path_rules" {
  description = "Custom path routing rules"
  type = list(object({
    name = string
    rules = list(object({
      paths   = list(string)
      service = string
    }))
  }))
  default = []
}

variable "additional_ssl_certs" {
  description = "Additional SSL certificates to attach"
  type        = list(string)
  default     = []
}
