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

output "cloudsql_connection_name" {
  description = "Cloud SQL connection name used by Cloud Run."
  value       = var.enable_cloudsql ? module.cloudsql[0].instance_connection_name : null
}

output "cloudsql_instance_name" {
  description = "Name of the Cloud SQL instance."
  value       = var.enable_cloudsql ? module.cloudsql[0].instance_name : null
}

output "redis_host" {
  description = "Primary host of the Memorystore instance."
  value       = var.enable_redis ? module.memorystore[0].host : var.redis_host_override
}

output "redis_port" {
  description = "Port of the Memorystore instance."
  value       = var.enable_redis ? module.memorystore[0].port : var.redis_port_override
}

# DNS setup instructions
output "dns_setup_instructions" {
  description = "Instructions for setting up DNS"
  value = join("\n", [
    "To complete domain setup, add the following DNS records:",
    format("1. Add an A record pointing %s to %s", var.domain, module.load_balancer.load_balancer_ip),
    "2. SSL certificate will be automatically provisioned once DNS is configured",
    "3. The certificate status can be checked with: gcloud compute ssl-certificates list",
    "",
    "Once DNS propagates (5-30 minutes), your app will be available at:",
    format("https://%s", var.domain),
  ])
}
