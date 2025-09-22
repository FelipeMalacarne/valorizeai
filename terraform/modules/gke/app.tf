resource "kubernetes_secret" "app_secrets" {
  metadata {
    name = "valorizeai-app-secrets"
  }

  data = {
    APP_KEY                        = "base64:${var.laravel_app_key}"
    DB_PASSWORD                    = random_password.postgres_password.result
    REDIS_PASSWORD                 = random_password.redis_password.result
    AWS_ACCESS_KEY_ID              = random_string.minio_root_user.result
    AWS_SECRET_ACCESS_KEY          = random_password.minio_root_password.result
    TYPESENSE_API_KEY              = random_password.typesense_api_key.result
    RESEND_API_KEY                 = var.resend_api_key
  }
}

resource "kubernetes_config_map" "app_config" {
  metadata {
    name = "valorizeai-app-config"
  }

  data = {
    APP_URL                        = "https://\${var.domain}"
    APP_NAME                       = "ValorizeAI"
    APP_ENV                        = "production"
    APP_DEBUG                      = "false"
    LOG_CHANNEL                    = "stderr"
    DB_CONNECTION                  = "pgsql"
    DB_HOST                        = "postgres-postgresql"
    DB_PORT                        = "5432"
    DB_DATABASE                    = "valorizeai"
    DB_USERNAME                    = "postgres"
    REDIS_HOST                     = "redis-master"
    REDIS_PORT                     = "6379"
    FILESYSTEM_DISK                = "s3"
    AWS_ENDPOINT                   = "http://minio:9000"
    AWS_USE_PATH_STYLE_ENDPOINT    = "true"
    AWS_BUCKET                     = "default"
    AWS_DEFAULT_REGION             = "us-east-1"
    TYPESENSE_HOST                 = "typesense"
    TYPESENSE_PORT                 = "8108"
    TYPESENSE_PROTOCOL             = "http"
    QUEUE_CONNECTION               = "redis"
    SESSION_DRIVER                 = "redis"
  }
}

resource "kubernetes_deployment" "app" {
  metadata {
    name = "valorizeai-app"
  }

  spec {
    replicas = 2

    selector {
      match_labels = {
        app = "valorizeai-app"
      }
    }

    template {
      metadata {
        labels = {
          app = "valorizeai-app"
        }
      }

      spec {
        container {
          image = "southamerica-east1-docker.pkg.dev/valorizeai/valorize-repo/valorizeai:latest"
          name  = "valorizeai-app"

          port {
            container_port = 8080
          }

          env_from {
            secret_ref {
              name = kubernetes_secret.app_secrets.metadata[0].name
            }
          }

          env_from {
            config_map_ref {
              name = kubernetes_config_map.app_config.metadata[0].name
            }
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "app" {
  metadata {
    name = "valorizeai-app-service"
  }
  spec {
    selector = {
      app = kubernetes_deployment.app.spec[0].template[0].metadata[0].labels.app
    }
    port {
      port        = 80
      target_port = 8080
    }
  }
}

resource "kubernetes_ingress_v1" "app_ingress" {
  metadata {
    name = "valorizeai-ingress"
    annotations = {
      "kubernetes.io/ingress.class": "gce",
      "kubernetes.io/ingress.global-static-ip-name": "valorizeai-lb-ip" # Assuming you have a static IP named this
    }
  }

  spec {
    default_backend {
      service {
        name = kubernetes_service.app.metadata[0].name
        port {
          number = 80
        }
      }
    }
  }
}

resource "kubernetes_deployment" "worker" {
  metadata {
    name = "valorizeai-worker"
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "valorizeai-worker"
      }
    }

    template {
      metadata {
        labels = {
          app = "valorizeai-worker"
        }
      }

      spec {
        container {
          image   = "southamerica-east1-docker.pkg.dev/valorizeai/valorize-repo/valorizeai:latest"
          name    = "valorizeai-worker"
          command = ["php", "artisan", "horizon"]

          env_from {
            secret_ref {
              name = kubernetes_secret.app_secrets.metadata[0].name
            }
          }

          env_from {
            config_map_ref {
              name = kubernetes_config_map.app_config.metadata[0].name
            }
          }
        }
      }
    }
  }
}

resource "kubernetes_job" "migrate" {
  metadata {
    name = "valorizeai-migrate"
  }

  spec {
    template {
      spec {
        container {
          image   = "southamerica-east1-docker.pkg.dev/valorizeai/valorize-repo/valorizeai:latest"
          name    = "valorizeai-migrate"
          command = ["php", "artisan", "migrate", "--force"]

          env_from {
            secret_ref {
              name = kubernetes_secret.app_secrets.metadata[0].name
            }
          }

          env_from {
            config_map_ref {
              name = kubernetes_config_map.app_config.metadata[0].name
            }
          }
        }
        restart_policy = "OnFailure"
      }
    }
  }

  timeouts {
    create = "5m"
  }
}
