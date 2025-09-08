# PostgreSQL password secret
resource "google_secret_manager_secret" "pgsql_password" {
  count     = var.enable_gcp_infra ? 1 : 0
  secret_id = "pgsql-password"
  project   = var.gcp_project_id

  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "pgsql_password" {
  count       = var.enable_gcp_infra ? 1 : 0
  secret      = google_secret_manager_secret.pgsql_password[0].id
  secret_data = var.pgsql_password
}

# IAM binding to allow Cloud Run service account to access the PostgreSQL password secret
resource "google_secret_manager_secret_iam_member" "pgsql_password_accessor" {
  count    = var.enable_gcp_infra ? 1 : 0
  secret_id = google_secret_manager_secret.pgsql_password[0].secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${data.google_project.current.number}-compute@developer.gserviceaccount.com"
  project   = var.gcp_project_id
}

# Data source to get current project information
data "google_project" "current" {
  project_id = var.gcp_project_id
}
