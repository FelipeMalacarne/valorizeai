# Cloud Run outputs
output "cloud_run_service_url" {
  description = "URL of the Cloud Run service"
  value       = var.enable_gcp_infra ? module.cloudrun[0].service_url : null
}

output "cloud_run_service_name" {
  description = "Name of the Cloud Run service"
  value       = var.enable_gcp_infra ? module.cloudrun[0].service_name : null
}

# Load Balancer outputs
output "load_balancer_ip" {
  description = "Static IP address of the load balancer"
  value       = var.enable_gcp_infra ? module.load_balancer[0].load_balancer_ip : null
}

output "application_url" {
  description = "HTTPS URL for the application"
  value       = var.enable_gcp_infra ? module.load_balancer[0].https_url : null
}

output "ssl_certificate_status" {
  description = "Status of the managed SSL certificate"
  value       = var.enable_gcp_infra ? module.load_balancer[0].ssl_certificate_status : null
}

output "domains_configured" {
  description = "Domains configured for SSL certificate"
  value       = var.enable_gcp_infra ? module.load_balancer[0].domains : []
}

# DNS setup instructions
output "dns_setup_instructions" {
  description = "Instructions for setting up DNS"
  value       = var.enable_gcp_infra ? join("\n", [
    "To complete domain setup, add the following DNS records:",
    format("1. Add an A record pointing %s to %s", var.domain, module.load_balancer[0].load_balancer_ip),
    "2. SSL certificate will be automatically provisioned once DNS is configured",
    "3. The certificate status can be checked with: gcloud compute ssl-certificates list",
    "",
    "Once DNS propagates (5-30 minutes), your app will be available at:",
    format("https://%s", var.domain),
  ]) : null
}

output "github_actions_service_account_key" {
  description = "The service account key for GitHub Actions."
  value       = base64decode(google_service_account_key.github_actions.private_key)
  sensitive   = true
}

# GKE outputs
output "gke_cluster_name" {
  description = "Name of the GKE cluster"
  value       = var.enable_gke_infra ? module.gke[0].cluster_name : null
}

output "gke_cluster_endpoint" {
  description = "Endpoint of the GKE cluster"
  value       = var.enable_gke_infra ? module.gke[0].cluster_endpoint : null
  sensitive   = true
}
