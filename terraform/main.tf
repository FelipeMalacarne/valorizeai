module "cloudrun" {
  source                     = "./modules/cloudrun"
  project_id                 = var.gcp_project_id
  region                     = var.gcp_region
  pgsql_host                 = var.pgsql_host
  pgsql_database             = var.pgsql_database
  pgsql_username             = var.pgsql_username
  pgsql_password_secret_name = google_secret_manager_secret.pgsql_password.secret_id
  image                      = "southamerica-east1-docker.pkg.dev/valorizeai/valorize-repo/valorizeai:latest"
  enable_public_access       = true
  min_instances              = 0
  domain                     = var.domain
}

module "load_balancer" {
  source                 = "./modules/load-balancer"
  project_id             = var.gcp_project_id
  region                 = var.gcp_region
  cloud_run_service_name = module.cloudrun.service_name
  domains                = [var.domain]
  enable_cdn             = true
  enable_logging         = false

  depends_on = [module.cloudrun]
}

module "swarm" {
  source = "./modules/swarm"

  stack_name          = var.swarm_stack_name
  compose_files       = length(var.swarm_compose_files) > 0 ? var.swarm_compose_files : ["${path.root}/docker/stack-db.yml"]
  with_registry_auth  = var.swarm_with_registry_auth
  prune               = var.swarm_prune

  // Map existing pgsql_* vars to DB settings
  db_name                 = var.pgsql_database
  db_user                 = var.pgsql_username
  db_password             = var.pgsql_password
  db_published_port       = var.swarm_db_published_port
  db_data_volume          = var.swarm_db_data_volume
  db_password_secret_name = var.swarm_db_password_secret_name
  postgres_image          = var.swarm_postgres_image
}
