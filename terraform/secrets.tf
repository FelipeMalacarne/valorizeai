# PostgreSQL password secret
resource "random_password" "pgsql" {
  length  = 32
  special = true
}

resource "google_secret_manager_secret" "pgsql_password" {
  secret_id = "pgsql-password"
  project   = var.gcp_project_id

  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "pgsql_password" {
  secret      = google_secret_manager_secret.pgsql_password.id
  secret_data = random_password.pgsql.result
}

resource "google_secret_manager_secret" "cloud_run_credentials" {
  secret_id = "cloud-run-runtime-credentials"
  project   = var.gcp_project_id

  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "cloud_run_credentials" {
  secret      = google_secret_manager_secret.cloud_run_credentials.id
  secret_data = base64decode(google_service_account_key.cloud_run_runtime.private_key)
}

resource "google_secret_manager_secret" "resend_api_key" {
  secret_id = "resend-api-key"
  project   = var.gcp_project_id

  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "resend_api_key" {
  secret      = google_secret_manager_secret.resend_api_key.id
  secret_data = var.resend_api_key
}
