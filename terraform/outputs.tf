# Cloud Run outputs
output "cloud_run_service_url" {
  description = "URL of the Cloud Run service"
  value       = module.cloudrun_api.service_url
}

output "cloud_run_service_name" {
  description = "Name of the Cloud Run service"
  value       = module.cloudrun_api.service_name
}

output "cloud_run_artisan_job_name" {
  description = "Name of the Cloud Run job used for artisan runs"
  value       = module.cloudrun_artisan.job_name
}

output "cloud_run_worker_service_url" {
  description = "URL of the worker Cloud Run service"
  value       = module.cloudrun_worker.service_url
}

output "cloud_run_worker_service_name" {
  description = "Name of the worker Cloud Run service"
  value       = module.cloudrun_worker.service_name
}

output "cloud_run_reverb_service_url" {
  description = "URL of the Reverb Cloud Run service"
  value       = module.cloudrun_reverb.service_url
}

output "cloud_run_reverb_service_name" {
  description = "Name of the Reverb Cloud Run service"
  value       = module.cloudrun_reverb.service_name
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
  value       = module.cloudsql.instance_connection_name
}

output "cloudsql_instance_name" {
  description = "Name of the Cloud SQL instance."
  value       = module.cloudsql.instance_name
}

output "redis_host" {
  description = "Primary host of the Memorystore instance."
  value       = module.memorystore.host
}

output "redis_port" {
  description = "Port of the Memorystore instance."
  value       = module.memorystore.port
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
