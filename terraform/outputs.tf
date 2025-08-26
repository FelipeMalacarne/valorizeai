# Cloud Run outputs
output "cloud_run_service_url" {
  description = "URL of the Cloud Run service"
  value       = module.cloudrun.service_url
}

output "cloud_run_service_name" {
  description = "Name of the Cloud Run service"
  value       = module.cloudrun.service_name
}

# Load Balancer outputs
output "load_balancer_ip" {
  description = "Static IP address of the load balancer"
  value       = module.load_balancer.load_balancer_ip
}

output "application_url" {
  description = "HTTPS URL for the application"
  value       = module.load_balancer.https_url
}

output "ssl_certificate_status" {
  description = "Status of the managed SSL certificate"
  value       = module.load_balancer.ssl_certificate_status
}

output "domains_configured" {
  description = "Domains configured for SSL certificate"
  value       = module.load_balancer.domains
}

# DNS setup instructions
output "dns_setup_instructions" {
  description = "Instructions for setting up DNS"
  value       = <<-EOT
    To complete domain setup, add the following DNS records:
    1. Add an A record pointing ${var.domain} to ${module.load_balancer.load_balancer_ip}
    2. SSL certificate will be automatically provisioned once DNS is configured
    3. The certificate status can be checked with: gcloud compute ssl-certificates list

    Once DNS propagates (5-30 minutes), your app will be available at:
    https://${var.domain}
  EOT
}

output "github_actions_service_account_key" {
  description = "The service account key for GitHub Actions."
  value       = base64decode(google_service_account_key.github_actions.private_key)
  sensitive   = true
}
