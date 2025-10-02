resource "kubernetes_config_map" "app" {
  metadata {
    name = "app-config"
    labels = {
      app = "valorizeai"
    }
  }

  data = {
    APP_URL             = "https://valorizeai.felipemalacarne.com.br"
    APP_NAME            = "ValorizeAI"
    APP_ENV             = "production"
    APP_DEBUG           = "false"
    APP_LOCALE          = "pt_BR"
    APP_FALLBACK_LOCALE = "en_US"
    BCRYPT_ROUNDS       = "12"
    DB_CONNECTION       = "pgsql"
    DB_HOST             = "pgsql"
    DB_PORT             = "5432"
    DB_DATABASE         = "valorizeai"
    DB_USERNAME         = "laravel"
    SESSION_DRIVER      = "redis"
    SESSION_ENCRYPT     = "false"
    SESSION_PATH        = "/"
    SESSION_DOMAIN      = "valorizeai.felipemalacarne.com.br"
    SESSION_LIFETIME    = "120"
    BROADCAST_CONNECTION = "log"
    FILESYSTEM_DISK     = "s3" # Minio is S3 compatible
    QUEUE_CONNECTION    = "redis"
    CACHE_STORE         = "redis"
    OCTANE_SERVER       = "frankenphp"
    TRUSTED_PROXIES     = "*"
    TRUSTED_HOSTS       = "valorizeai.felipemalacarne.com.br"
    REDIS_HOST          = "redis"
    # S3/Minio Config
    AWS_ENDPOINT                  = "http://minio:9000"
    AWS_USE_PATH_STYLE_ENDPOINT   = "true"
    AWS_BUCKET                    = "default"
    AWS_DEFAULT_REGION            = "us-east-1"
    # Typesense Config
    TYPESENSE_HOST      = "typesense" # We will create this service later
    TYPESENSE_PORT      = "8108"
    TYPESENSE_PROTOCOL  = "http"
    # Logging Config
    LOG_CHANNEL             = "stack"
    LOG_STACK               = "stderr,nightwatch"
    LOG_DEPRECATIONS_CHANNEL = "null"
    LOG_LEVEL               = "debug"
    # Nightwatch Config
    NIGHTWATCH_ENABLED      = "true"
    NIGHTWATCH_INGEST_URI   = "nightwatch:2407" # We will create this service later
    NIGHTWATCH_SERVER       = "nightwatch"
    NIGHTWATCH_REQUEST_SAMPLE_RATE = "0.5"
    NIGHTWATCH_LOG_LEVEL    = "debug"
  }
}

resource "kubernetes_secret" "app" {
  metadata {
    name = "app-secret"
    labels = {
      app = "valorizeai"
    }
  }

  data = {
    APP_KEY                 = var.app_key
    DB_PASSWORD             = var.pgsql_password
    AWS_ACCESS_KEY_ID       = var.minio_root_user
    AWS_SECRET_ACCESS_KEY   = var.minio_root_password
    TYPESENSE_API_KEY       = var.typesense_api_key
    RESEND_API_KEY          = var.resend_api_key
    NIGHTWATCH_TOKEN        = var.nightwatch_token
  }
}

resource "kubernetes_deployment" "app" {
  metadata {
    name = "app-deployment"
    labels = {
      app = "valorizeai"
    }
  }

  spec {
    replicas = 2

    selector {
      match_labels = {
        app = "valorizeai"
      }
    }

    template {
      metadata {
        labels = {
          app = "valorizeai"
        }
      }

      spec {
        container {
          name  = "app"
          image = "southamerica-east1-docker.pkg.dev/valorizeai/valorize-repo/valorizeai:latest"

          port {
            container_port = 8080
          }

          env_from {
            config_map_ref {
              name = kubernetes_config_map.app.metadata[0].name
            }
          }

          env_from {
            secret_ref {
              name = kubernetes_secret.app.metadata[0].name
            }
          }

          resources {
            requests = {
              cpu    = "500m"
              memory = "1Gi"
            }
            limits = {
              cpu    = "1"
              memory = "2Gi"
            }
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "app" {
  metadata {
    name = "app-service"
    labels = {
      app = "valorizeai"
    }
  }
  spec {
    selector = {
      app = "valorizeai"
    }
    port {
      port        = 80
      target_port = 8080
    }
  }
}



resource "kubernetes_deployment" "worker" {
  metadata {
    name = "worker-deployment"
    labels = {
      app = "valorizeai-worker"
    }
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
          name  = "worker"
          image = "southamerica-east1-docker.pkg.dev/valorizeai/valorize-repo/valorizeai:latest"
          command = ["php", "artisan", "horizon"]
          env_from {
            config_map_ref {
              name = kubernetes_config_map.app.metadata[0].name
            }
          }
          env_from {
            secret_ref {
              name = kubernetes_secret.app.metadata[0].name
            }
          }
          resources {
            requests = {
              cpu    = "500m"
              memory = "1Gi"
            }
            limits = {
              cpu    = "1"
              memory = "2Gi"
            }
          }
        }
      }
    }
  }
}

resource "kubernetes_job" "migrate" {
  metadata {
    name = "migrate-job"
  }
  spec {
    template {
      metadata {
        name = "migrate-job"
      }
      spec {
        container {
          name  = "migrate"
          image = "southamerica-east1-docker.pkg.dev/valorizeai/valorize-repo/valorizeai:latest"
          command = ["php", "artisan", "migrate", "--force"]
          env_from {
            config_map_ref {
              name = kubernetes_config_map.app.metadata[0].name
            }
          }
          env_from {
            secret_ref {
              name = kubernetes_secret.app.metadata[0].name
            }
          }
        }
        restart_policy = "OnFailure"
      }
    }
    backoff_limit = 4
  }
}

resource "kubernetes_ingress_v1" "app" {
  metadata {
    name = "app-ingress"
    annotations = {
      "kubernetes.io/ingress.class" = "nginx"
      "cert-manager.io/cluster-issuer" = "letsencrypt-prod"
    }
  }
  spec {
    rule {
      host = "valorizeai.felipemalacarne.com.br"
      http {
        path {
          path = "/"
          path_type = "Prefix"
          backend {
            service {
              name = kubernetes_service.app.metadata[0].name
              port {
                number = 80
              }
            }
          }
        }
      }
    }
    tls {
      hosts = ["valorizeai.felipemalacarne.com.br"]
      secret_name = "valorizeai-tls"
    }
  }
}
