module "cloudsql" {
  source            = "./modules/cloudsql_postgres"
  project_id        = var.gcp_project_id
  region            = var.gcp_region
  instance_name     = var.cloudsql_instance_name
  database_name     = var.pgsql_database
  user_name         = var.pgsql_username
  user_password     = random_password.pgsql.result
  tier              = var.cloudsql_tier
  availability_type = var.cloudsql_availability_type
  disk_size_gb      = var.cloudsql_disk_size_gb
  private_network   = google_compute_network.serverless.self_link
  enable_public_ip  = var.cloudsql_enable_public_ip
  labels            = var.resource_labels
  depends_on        = [google_service_networking_connection.private_vpc_connection]
}

module "memorystore" {
  source             = "./modules/memorystore_redis"
  project_id         = var.gcp_project_id
  region             = var.gcp_region
  instance_name      = var.redis_instance_name
  tier               = var.redis_tier
  memory_size_gb     = var.redis_memory_size_gb
  redis_version      = var.redis_version
  authorized_network = google_compute_network.serverless.self_link
  labels             = var.resource_labels
}

locals {
  db_host             = module.cloudsql.private_ip_address
  cloud_sql_instances = [module.cloudsql.instance_connection_name]
  redis_host          = module.memorystore.host
  redis_port          = module.memorystore.port
  app_domain          = var.custom_domain != "" ? var.custom_domain : var.domain
  cloudflare_record   = var.cloudflare_record_name != "" ? var.cloudflare_record_name : (var.custom_domain != "" ? var.custom_domain : var.domain)
}

module "cloud_tasks" {
  source                = "./modules/cloud_tasks_queue"
  project_id            = var.gcp_project_id
  location              = var.gcp_region
  queue_name            = "default"
  service_account_email = google_service_account.cloud_run_runtime.email
}

module "cloudrun" {
  source                         = "./modules/cloudrun"
  project_id                     = var.gcp_project_id
  region                         = var.gcp_region
  vpc_network                    = google_compute_network.serverless.id
  vpc_subnetwork                 = google_compute_subnetwork.serverless.id
  pgsql_host                     = local.db_host
  pgsql_database                 = var.pgsql_database
  pgsql_username                 = var.pgsql_username
  pgsql_password_secret_name     = google_secret_manager_secret.pgsql_password.secret_id
  nightwatch_token_secret_name   = google_secret_manager_secret.nightwatch_token.secret_id
  image                          = "southamerica-east1-docker.pkg.dev/valorizeaitcc/valorize-repo/valorizeai:latest"
  enable_public_access           = true
  min_instances                  = 0
  domain                         = local.app_domain
  redis_host                     = local.redis_host
  redis_port                     = local.redis_port
  cloud_tasks_project            = module.cloud_tasks.project_id
  cloud_tasks_location           = module.cloud_tasks.location
  cloud_tasks_queue              = module.cloud_tasks.queue_name
  cloud_tasks_service_email      = google_service_account.cloud_run_runtime.email
  cloud_sql_instances            = local.cloud_sql_instances
  service_account_email          = google_service_account.cloud_run_runtime.email
}

module "load_balancer" {
  source                 = "./modules/load-balancer"
  project_id             = var.gcp_project_id
  region                 = var.gcp_region
  cloud_run_service_name = module.cloudrun.service_name
  domains                = [local.app_domain]
  enable_cdn             = true
  enable_logging         = false
}

# module "swarm" {
#   source           = "./modules/swarm"
#   app_key          = var.laravel_app_key
#   resend_api_key   = var.resend_api_key
#   nightwatch_token = var.nightwatch_token
# }
