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
