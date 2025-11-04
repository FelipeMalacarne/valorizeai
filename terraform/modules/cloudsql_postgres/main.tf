terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 6.29.0"
    }
  }
}

resource "google_sql_database_instance" "this" {
  name             = var.instance_name
  project          = var.project_id
  region           = var.region
  database_version = var.database_version

  settings {
    tier              = var.tier
    availability_type = var.availability_type
    disk_size         = var.disk_size_gb
    disk_autoresize   = true
    disk_type         = "PD_SSD"
    activation_policy = "ALWAYS"

    backup_configuration {
      enabled                        = true
      point_in_time_recovery_enabled = true
      backup_retention_settings {
        retained_backups = 7
      }
    }

    ip_configuration {
      ipv4_enabled                                  = var.enable_public_ip
      private_network                               = var.private_network
      enable_private_path_for_google_cloud_services = true
    }

    maintenance_window {
      day  = var.maintenance_window_day
      hour = var.maintenance_window_hour
    }

    insights_config {
      query_insights_enabled = true
    }

    user_labels = var.labels
  }

  deletion_protection = false
}

resource "google_sql_database" "default" {
  name      = var.database_name
  project   = var.project_id
  instance  = google_sql_database_instance.this.name
  charset   = "UTF8"
  collation = "en_US.UTF8"
}

resource "google_sql_user" "app" {
  name     = var.user_name
  project  = var.project_id
  instance = google_sql_database_instance.this.name
  password = var.user_password
}
