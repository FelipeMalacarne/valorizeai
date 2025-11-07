resource "google_cloud_tasks_queue" "this" {
  name     = var.queue_name
  project  = var.project_id
  location = var.location
}

resource "google_cloud_tasks_queue_iam_member" "enqueuer" {
  project  = google_cloud_tasks_queue.this.project
  location = google_cloud_tasks_queue.this.location
  name     = google_cloud_tasks_queue.this.name
  role     = "roles/cloudtasks.enqueuer"
  member   = "serviceAccount:${var.service_account_email}"
}

resource "google_cloud_tasks_queue_iam_member" "viewer" {
  project  = google_cloud_tasks_queue.this.project
  location = google_cloud_tasks_queue.this.location
  name     = google_cloud_tasks_queue.this.name
  role     = "roles/cloudtasks.viewer"
  member   = "serviceAccount:${var.service_account_email}"
}

# resource "google_cloud_tasks_queue_iam_member" "deleter" {
#   project  = google_cloud_tasks_queue.this.project
#   location = google_cloud_tasks_queue.this.location
#   name     = google_cloud_tasks_queue.this.name
#   role     = "roles/cloudtasks.deleter"
#   member   = "serviceAccount:${var.service_account_email}"
# }
