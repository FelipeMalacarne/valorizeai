resource "kubernetes_secret" "pgsql" {
  metadata {
    name = "pgsql-secret"
    labels = {
      app = "pgsql"
    }
  }
  data = {
    POSTGRES_PASSWORD = var.pgsql_password
  }
  type = "Opaque"
}

resource "kubernetes_persistent_volume_claim" "pgsql" {
  metadata {
    name = "pgsql-pvc"
    labels = {
      app = "pgsql"
    }
  }
  spec {
    access_modes = ["ReadWriteOnce"]
    resources {
      requests = {
        storage = "10Gi"
      }
    }
  }
}

resource "kubernetes_stateful_set" "pgsql" {
  metadata {
    name = "pgsql-statefulset"
    labels = {
      app = "pgsql"
    }
  }
  spec {
    service_name = "pgsql"
    replicas     = 1
    selector {
      match_labels = {
        app = "pgsql"
      }
    }
    template {
      metadata {
        labels = {
          app = "pgsql"
        }
      }
      spec {
        container {
          name  = "pgsql"
          image = "postgres:17.2"
          port {
            container_port = 5432
          }
          env {
            name  = "POSTGRES_DB"
            value = "valorizeai"
          }
          env {
            name  = "POSTGRES_USER"
            value = "laravel"
          }
          env {
            name = "POSTGRES_PASSWORD"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.pgsql.metadata[0].name
                key  = "POSTGRES_PASSWORD"
              }
            }
          }
          env {
            name  = "PGDATA"
            value = "/var/lib/postgresql/data/pgdata"
          }
          volume_mount {
            name       = "pgsql-storage"
            mount_path = "/var/lib/postgresql/data/pgdata"
          }
          resources {
            requests = {
              cpu    = "500m"
              memory = "1Gi"
            }
            limits = {
              cpu    = "1500m"
              memory = "2Gi"
            }
          }
          liveness_probe {
            exec {
              command = ["pg_isready", "-U", "laravel", "-d", "valorizeai"]
            }
            initial_delay_seconds = 30
            period_seconds        = 10
            timeout_seconds       = 5
            failure_threshold     = 3
          }
        }
      }
    }
    volume_claim_template {
      metadata {
        name = "pgsql-storage"
      }
      spec {
        access_modes = ["ReadWriteOnce"]
        resources {
          requests = {
            storage = "10Gi"
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "pgsql" {
  metadata {
    name = "pgsql"
    labels = {
      app = "pgsql"
    }
  }
  spec {
    port {
      port = 5432
    }
    selector = {
      app = "pgsql"
    }
    cluster_ip = "None" # For headless service
  }
}
