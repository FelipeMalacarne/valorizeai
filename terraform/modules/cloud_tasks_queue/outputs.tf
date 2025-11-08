output "project_id" {
  description = "Project ID where the queue lives."
  value       = google_cloud_tasks_queue.this.project
}

output "location" {
  description = "Location/region of the queue."
  value       = google_cloud_tasks_queue.this.location
}

output "queue_name" {
  description = "Name of the queue."
  value       = google_cloud_tasks_queue.this.name
}
