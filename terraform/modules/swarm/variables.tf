variable "app_key" {
  description = "Optional Laravel APP_KEY secret for future app stack"
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
