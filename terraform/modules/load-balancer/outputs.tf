output "load_balancer_ip" {
  description = "Static IP address of the load balancer"
  value       = google_compute_global_address.default.address
}

output "ssl_certificate_status" {
  description = "Status of the managed SSL certificate"
  value       = google_compute_managed_ssl_certificate.default.managed[0]
}

output "domains" {
  description = "Domains configured for SSL certificate"
  value       = google_compute_managed_ssl_certificate.default.managed[0].domains
}

output "https_url" {
  description = "HTTPS URL for the application"
  value       = "https://${var.domains[0]}"
}

output "load_balancer_url_map" {
  description = "URL map resource name"
  value       = google_compute_url_map.default.name
}

output "backend_service_name" {
  description = "Backend service name"
  value       = google_compute_backend_service.default.name
}
