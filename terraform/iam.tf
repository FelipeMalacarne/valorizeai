resource "google_service_account" "cloud_run_runtime" {
  account_id   = "valorizeai-runtime"
  display_name = "ValorizeAI Cloud Run Runtime"
  project      = var.gcp_project_id
}

resource "google_project_iam_member" "runtime_cloudsql_client" {
  project = var.gcp_project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.cloud_run_runtime.email}"
}

resource "google_project_iam_member" "runtime_secret_accessor" {
  project = var.gcp_project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.cloud_run_runtime.email}"
}

resource "google_project_iam_member" "runtime_logging" {
  project = var.gcp_project_id
  role    = "roles/logging.logWriter"
  member  = "serviceAccount:${google_service_account.cloud_run_runtime.email}"
}

resource "google_project_iam_member" "runtime_monitoring" {
  project = var.gcp_project_id
  role    = "roles/monitoring.metricWriter"
  member  = "serviceAccount:${google_service_account.cloud_run_runtime.email}"
}

resource "google_project_iam_member" "runtime_tracing" {
  project = var.gcp_project_id
  role    = "roles/cloudtrace.agent"
  member  = "serviceAccount:${google_service_account.cloud_run_runtime.email}"
}

resource "google_service_account_key" "cloud_run_runtime" {
  service_account_id = google_service_account.cloud_run_runtime.name
  # keepers = {
  #   rotation = timestamp()
  # }
}

resource "google_service_account_iam_member" "runtime_self_actas" {
  service_account_id = google_service_account.cloud_run_runtime.name
  role               = "roles/iam.serviceAccountUser"
  member             = "serviceAccount:${google_service_account.cloud_run_runtime.email}"
}
