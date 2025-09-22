module "cloudrun" {
  count                      = var.enable_gcp_infra ? 1 : 0
  source                     = "./modules/cloudrun"
  project_id                 = var.gcp_project_id
  region                     = var.gcp_region
  pgsql_host                 = var.pgsql_host
  pgsql_database             = var.pgsql_database
  pgsql_username             = var.pgsql_username
  pgsql_password_secret_name = google_secret_manager_secret.pgsql_password[0].secret_id
  image                      = "southamerica-east1-docker.pkg.dev/valorizeai/valorize-repo/valorizeai:latest"
  enable_public_access       = true
  min_instances              = 0
  domain                     = var.domain
}

module "load_balancer" {
  count                  = var.enable_gcp_infra ? 1 : 0
  source                 = "./modules/load-balancer"
  project_id             = var.gcp_project_id
  region                 = var.gcp_region
  cloud_run_service_name = module.cloudrun[0].service_name
  domains                = [var.domain]
  enable_cdn             = true
  enable_logging         = false
}

module "swarm" {
  source  = "./modules/swarm"
  app_key = var.laravel_app_key
  resend_api_key = var.resend_api_key
}
