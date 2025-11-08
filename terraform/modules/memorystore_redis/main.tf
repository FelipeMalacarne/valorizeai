terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 6.29.0"
    }
  }
}

resource "google_redis_instance" "this" {
  name                    = var.instance_name
  project                 = var.project_id
  region                  = var.region
  tier                    = var.tier
  memory_size_gb          = var.memory_size_gb
  redis_version           = var.redis_version
  authorized_network      = var.authorized_network
  display_name            = var.instance_name
  labels                  = var.labels
  transit_encryption_mode = "DISABLED"
  replica_count           = var.tier == "STANDARD_HA" ? var.replica_count : null

  maintenance_policy {
    weekly_maintenance_window {
      day = var.maintenance_window_day
      start_time {
        hours = var.maintenance_window_hour
      }
    }
  }
}
