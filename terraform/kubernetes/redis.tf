resource "kubernetes_stateful_set" "redis" {
  metadata {
    name = "redis-statefulset"
    labels = {
      app = "redis"
    }
  }
  spec {
    service_name = "redis"
    replicas     = 1
    selector {
      match_labels = {
        app = "redis"
      }
    }
    template {
      metadata {
        labels = {
          app = "redis"
        }
      }
      spec {
        container {
          name  = "redis"
          image = "redis:alpine"
          port {
            container_port = 6379
          }
          volume_mount {
            name       = "redis-storage"
            mount_path = "/data"
          }
          resources {
            requests = {
              cpu    = "100m"
              memory = "512Mi"
            }
            limits = {
              cpu    = "500m"
              memory = "1Gi"
            }
          }
          liveness_probe {
            exec {
              command = ["redis-cli", "ping"]
            }
            initial_delay_seconds = 20
            period_seconds        = 10
            timeout_seconds       = 5
            failure_threshold     = 3
          }
        }
      }
    }
    volume_claim_template {
      metadata {
        name = "redis-storage"
      }
      spec {
        access_modes = ["ReadWriteOnce"]
        resources {
          requests = {
            storage = "5Gi"
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "redis" {
  metadata {
    name = "redis"
    labels = {
      app = "redis"
    }
  }
  spec {
    port {
      port = 6379
    }
    selector = {
      app = "redis"
    }
  }
}
