terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 6.29.0"
    }
  }
}

resource "google_cloud_run_v2_service" "this" {
  count    = local.is_service ? 1 : 0
  name     = var.service_name
  location = var.region
  project  = var.project_id
  ingress  = "INGRESS_TRAFFIC_ALL"

  deletion_protection = false

  template {
    max_instance_request_concurrency = var.concurrency

    timeout = "300s"

    vpc_access {
      network_interfaces {
        network    = var.vpc_network
        subnetwork = var.vpc_subnetwork
        tags       = ["valorizeai"]
      }
    }

    scaling {
      max_instance_count = var.max_instances
      min_instance_count = var.min_instances
    }

    service_account = var.service_account_email

    dynamic "volumes" {
      for_each = length(var.cloud_sql_instances) > 0 ? [1] : []
      content {
        name = "cloudsql"
        cloud_sql_instance {
          instances = var.cloud_sql_instances
        }
      }
    }

    dynamic "volumes" {
      for_each = [1]
      content {
        name = "google-credentials"
        secret {
          secret = var.google_credentials_secret_name
          items {
            path    = basename(var.google_credentials_path)
            version = "latest"
          }
        }
      }
    }

    containers {
      image = var.image
      ports {
        container_port = 8080
      }

      command = local.container_command
      args    = length(var.args) > 0 ? var.args : null

      dynamic "env" {
        for_each = local.env_vars
        content {
          name  = env.value.name
          value = env.value.value
        }
      }

      dynamic "env" {
        for_each = local.secret_env_vars
        content {
          name = env.value.name
          value_source {
            secret_key_ref {
              secret  = env.value.secret
              version = env.value.version
            }
          }
        }
      }

      resources {
        cpu_idle          = true
        startup_cpu_boost = true
        limits = {
          cpu    = var.cpu
          memory = var.memory
        }
      }

      liveness_probe {
        timeout_seconds   = 1
        period_seconds    = 10
        failure_threshold = 3
        http_get {
          path = "/up"
          port = 8080
        }
      }

      dynamic "volume_mounts" {
        for_each = length(var.cloud_sql_instances) > 0 ? [1] : []
        content {
          name       = "cloudsql"
          mount_path = "/cloudsql"
        }
      }

      volume_mounts {
        name       = "google-credentials"
        mount_path = dirname(var.google_credentials_path)
      }

      env {
        name  = "GOOGLE_APPLICATION_CREDENTIALS"
        value = var.google_credentials_path
      }
    }
  }
}

resource "google_cloud_run_v2_job" "this" {
  count              = local.is_job ? 1 : 0
  name               = var.service_name
  location           = var.region
  project            = var.project_id
  deletion_protection = false

  template {
    template {
      max_retries     = var.job_max_retries
      timeout         = var.job_timeout
      service_account = var.service_account_email
      vpc_access {
        network_interfaces {
          network    = var.vpc_network
          subnetwork = var.vpc_subnetwork
          tags       = ["${var.service_name}-job"]
        }
      }

      volumes {
        name = "google-credentials"
        secret {
          secret = var.google_credentials_secret_name
          items {
            path    = basename(var.google_credentials_path)
            version = "latest"
          }
        }
      }

      containers {
        image   = var.image
        command = local.job_command
        args    = length(var.args) > 0 ? var.args : null

        dynamic "env" {
          for_each = local.env_vars
          content {
            name  = env.value.name
            value = env.value.value
          }
        }

        dynamic "env" {
          for_each = local.secret_env_vars
          content {
            name = env.value.name
            value_source {
              secret_key_ref {
                secret  = env.value.secret
                version = env.value.version
              }
            }
          }
        }

        resources {
          limits = {
            cpu    = var.job_cpu
            memory = var.job_memory
          }
        }

        volume_mounts {
          name       = "google-credentials"
          mount_path = dirname(var.google_credentials_path)
        }

        env {
          name  = "GOOGLE_APPLICATION_CREDENTIALS"
          value = var.google_credentials_path
        }
      }
    }
  }
}

resource "google_cloud_run_v2_service_iam_member" "public_invoker" {
  count   = local.is_service ? 1 : 0
  name    = google_cloud_run_v2_service.this[count.index].name
  project = var.project_id
  location = var.region
  role    = "roles/run.invoker"
  member  = "allUsers"
}
