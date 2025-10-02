resource "kubernetes_secret" "minio" {
  metadata {
    name = "minio-secret"
    labels = {
      app = "minio"
    }
  }
  data = {
    MINIO_ROOT_USER     = var.minio_root_user
    MINIO_ROOT_PASSWORD = var.minio_root_password
  }
  type = "Opaque"
}

resource "kubernetes_stateful_set" "minio" {
  metadata {
    name = "minio-statefulset"
    labels = {
      app = "minio"
    }
  }
  spec {
    service_name = "minio"
    replicas     = 1
    selector {
      match_labels = {
        app = "minio"
      }
    }
    template {
      metadata {
        labels = {
          app = "minio"
        }
      }
      spec {
        container {
          name  = "minio"
          image = "minio/minio:latest"
          args  = ["server", "/data", "--console-address", ":8900"]
          port {
            name           = "api"
            container_port = 9000
          }
          port {
            name           = "console"
            container_port = 8900
          }
          env {
            name = "MINIO_ROOT_USER"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.minio.metadata[0].name
                key  = "MINIO_ROOT_USER"
              }
            }
          }
          env {
            name = "MINIO_ROOT_PASSWORD"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.minio.metadata[0].name
                key  = "MINIO_ROOT_PASSWORD"
              }
            }
          }
          volume_mount {
            name       = "minio-storage"
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
            http_get {
              path = "/minio/health/live"
              port = "api"
            }
            initial_delay_seconds = 30
            period_seconds        = 20
          }
          readiness_probe {
            http_get {
              path = "/minio/health/ready"
              port = "api"
            }
            initial_delay_seconds = 30
            period_seconds        = 20
          }
        }
      }
    }
    volume_claim_template {
      metadata {
        name = "minio-storage"
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

resource "kubernetes_service" "minio" {
  metadata {
    name = "minio"
    labels = {
      app = "minio"
    }
  }
  spec {
    port {
      name        = "api"
      port        = 9000
      target_port = "api"
    }
    port {
      name        = "console"
      port        = 8900
      target_port = "console"
    }
    selector = {
      app = "minio"
    }
  }
}
