output "service_name" {
  description = "Name of the Cloud Run service"
  value       = length(google_cloud_run_v2_service.this) > 0 ? google_cloud_run_v2_service.this[0].name : null
}

output "service_url" {
  description = "URL of the Cloud Run service"
  value       = length(google_cloud_run_v2_service.this) > 0 ? google_cloud_run_v2_service.this[0].uri : null
}

output "job_name" {
  description = "Name of the Cloud Run job"
  value       = length(google_cloud_run_v2_job.this) > 0 ? google_cloud_run_v2_job.this[0].name : null
}
