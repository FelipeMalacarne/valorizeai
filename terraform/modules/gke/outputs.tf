output "cluster_name" {
  description = "The name of the GKE cluster."
  value       = google_container_cluster.autopilot_cluster.name
}

output "cluster_endpoint" {
  description = "The endpoint of the GKE cluster."
  value       = google_container_cluster.autopilot_cluster.endpoint
  sensitive   = true
}

output "cluster_ca_certificate" {
  description = "The CA certificate of the GKE cluster."
  value       = base64decode(google_container_cluster.autopilot_cluster.master_auth[0].cluster_ca_certificate)
  sensitive   = true
}
