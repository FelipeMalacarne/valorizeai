output "service_name" {
  description = "Name of the Cloud Run service"
  value       = google_cloud_run_v2_service.valorizeai_api.name
}

output "service_url" {
  description = "URL of the Cloud Run service"
  value       = google_cloud_run_v2_service.valorizeai_api.uri
}

output "job_name" {
  description = "Name of the Cloud Run job"
  value       = google_cloud_run_v2_job.artisan_job.name
}
