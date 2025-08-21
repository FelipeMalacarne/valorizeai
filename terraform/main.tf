module "cloudrun" {
  source                     = "./modules/cloudrun"
  project_id                 = var.gcp_project_id
  region                     = var.gcp_region
  pgsql_host                 = var.pgsql_host
  pgsql_database             = var.pgsql_database
  pgsql_username             = var.pgsql_username
  pgsql_password_secret_name = google_secret_manager_secret.pgsql_password.secret_id
  image                      = "southamerica-east1-docker.pkg.dev/valorizeai/valorize-repo/valorizeai:latest"
}
