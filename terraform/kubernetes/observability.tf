resource "kubernetes_config_map" "prometheus_config" {
  metadata {
    name = "prometheus-config"
    labels = {
      app = "prometheus"
    }
  }

  data = {
    "prometheus.yml" = <<-EOT
      global:
        scrape_interval: 15s

      scrape_configs:
        - job_name: 'otel-collector'
          static_configs:
            - targets: ['otel-collector:8889']
    EOT
  }
}

resource "kubernetes_config_map" "otel_collector_config" {
  metadata {
    name = "otel-collector-config"
    labels = {
      app = "otel-collector"
    }
  }

  data = {
    "otel-collector-config.yml" = <<-EOT
      receivers:
        otlp:
          protocols:
            http:
              endpoint: 0.0.0.0:4318

      exporters:
        prometheus:
          endpoint: "0.0.0.0:8889"
          namespace: "valorizeai"
        otlphttp/tempo:
          endpoint: http://tempo:3200
          tls:
            insecure: true
        otlphttp/loki:
          endpoint: http://loki:3100/otlp
          tls:
            insecure: true

      service:
        pipelines:
          traces:
            receivers: [otlp]
            exporters: [otlphttp/tempo]
          metrics:
            receivers: [otlp]
            exporters: [prometheus]
          logs:
            receivers: [otlp]
            exporters: [otlphttp/loki]
    EOT
  }
}

resource "kubernetes_config_map" "loki_config" {
  metadata {
    name = "loki-config"
    labels = {
      app = "loki"
    }
  }

  data = {
    "loki-config.yaml" = <<-EOT
      auth_enabled: false
      server:
        http_listen_port: 3100
      common:
        path_prefix: /tmp/loki
        storage:
          filesystem:
            chunks_directory: /tmp/loki/chunks
            rules_directory: /tmp/loki/rules
        replication_factor: 1
        ring:
          instance_addr: 127.0.0.1
          kvstore:
            store: inmemory
      schema_config:
        configs:
          - from: 2020-10-24
            store: boltdb-shipper
            object_store: filesystem
            schema: v11
            index:
              prefix: index_
              period: 24h
      analytics:
        reporting_enabled: false
      limits_config:
        allow_structured_metadata: false
    EOT
  }
}

resource "kubernetes_config_map" "tempo_config" {
  metadata {
    name = "tempo-config"
    labels = {
      app = "tempo"
    }
  }

  data = {
    "tempo-config.yaml" = <<-EOT
      server:
        http_listen_port: 3200
      auth_enabled: false
      storage:
        trace:
          backend: local
          local:
            path: /tmp/tempo
      ingester:
        lifecycler:
          address: 127.0.0.1
          ring:
            kvstore:
              store: inmemory
            replication_factor: 1
          final_sleep: 0s
        max_block_duration: 5m
      distributor:
        receivers:
          otlp:
            protocols:
              http:
                endpoint: 0.0.0.0:4319
              grpc:
                endpoint: 0.0.0.0:4317
      compactor:
        compaction:
          compaction_window: 1h
          block_retention: 24h
    EOT
  }
}

resource "kubernetes_config_map" "grafana_datasources_config" {
  metadata {
    name = "grafana-datasources-config"
    labels = {
      app = "grafana"
    }
  }

  data = {
    "loki.yml" = <<-EOT
      apiVersion: 1
      datasources:
        - name: Loki
          type: loki
          access: proxy
          url: http://loki:3100
    EOT

    "prometheus.yml" = <<-EOT
      apiVersion: 1
      datasources:
        - name: Prometheus
          type: prometheus
          access: proxy
          url: http://prometheus:9090
          isDefault: true
    EOT

    "tempo.yml" = <<-EOT
      apiVersion: 1
      datasources:
        - name: Tempo
          type: tempo
          access: proxy
          url: http://tempo:3200
    EOT
  }
}

resource "kubernetes_stateful_set" "loki" {
  metadata {
    name = "loki-statefulset"
    labels = {
      app = "loki"
    }
  }
  spec {
    service_name = "loki"
    replicas     = 1
    selector {
      match_labels = {
        app = "loki"
      }
    }
    template {
      metadata {
        labels = {
          app = "loki"
        }
      }
      spec {
        container {
          name  = "loki"
          image = "grafana/loki:latest"
          args  = ["-config.file=/etc/loki/loki-config.yaml"]
          port {
            container_port = 3100
          }
          volume_mount {
            name       = "loki-config"
            mount_path = "/etc/loki"
          }
          volume_mount {
            name       = "loki-storage"
            mount_path = "/tmp/loki"
          }
          resources {
            requests = {
              cpu    = "300m"
              memory = "1Gi"
            }
            limits = {
              cpu    = "1"
              memory = "2Gi"
            }
          }
        }
        volume {
          name = "loki-config"
          config_map {
            name = kubernetes_config_map.loki_config.metadata[0].name
          }
        }
      }
    }
    volume_claim_template {
      metadata {
        name = "loki-storage"
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

resource "kubernetes_service" "loki" {
  metadata {
    name = "loki"
    labels = {
      app = "loki"
    }
  }
  spec {
    port {
      port = 3100
    }
    selector = {
      app = "loki"
    }
  }
}

resource "kubernetes_stateful_set" "tempo" {
  metadata {
    name = "tempo-statefulset"
    labels = {
      app = "tempo"
    }
  }
  spec {
    service_name = "tempo"
    replicas     = 1
    selector {
      match_labels = {
        app = "tempo"
      }
    }
    template {
      metadata {
        labels = {
          app = "tempo"
        }
      }
      spec {
        container {
          name  = "tempo"
          image = "grafana/tempo:latest"
          args  = ["-config.file=/etc/tempo/tempo-config.yaml"]
          port {
            container_port = 3200
          }
          port {
            container_port = 4317
          }
          port {
            container_port = 4319
          }
          volume_mount {
            name       = "tempo-config"
            mount_path = "/etc/tempo"
          }
          volume_mount {
            name       = "tempo-storage"
            mount_path = "/tmp/tempo"
          }
          resources {
            requests = {
              cpu    = "300m"
              memory = "1Gi"
            }
            limits = {
              cpu    = "1"
              memory = "2Gi"
            }
          }
        }
        volume {
          name = "tempo-config"
          config_map {
            name = kubernetes_config_map.tempo_config.metadata[0].name
          }
        }
      }
    }
    volume_claim_template {
      metadata {
        name = "tempo-storage"
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

resource "kubernetes_service" "tempo" {
  metadata {
    name = "tempo"
    labels = {
      app = "tempo"
    }
  }
  spec {
    port {
      name = "http"
      port = 3200
    }
    port {
      name = "otlp-grpc"
      port = 4317
    }
    port {
      name = "otlp-http"
      port = 4319
    }
    selector = {
      app = "tempo"
    }
  }
}

resource "kubernetes_deployment" "prometheus" {
  metadata {
    name = "prometheus-deployment"
    labels = {
      app = "prometheus"
    }
  }
  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "prometheus"
      }
    }
    template {
      metadata {
        labels = {
          app = "prometheus"
        }
      }
      spec {
        container {
          name  = "prometheus"
          image = "prom/prometheus:latest"
          args  = ["--config.file=/etc/prometheus/prometheus.yml"]
          port {
            container_port = 9090
          }
          volume_mount {
            name       = "prometheus-config"
            mount_path = "/etc/prometheus"
          }
          resources {
            requests = {
              cpu    = "300m"
              memory = "1Gi"
            }
            limits = {
              cpu    = "1"
              memory = "2Gi"
            }
          }
        }
        volume {
          name = "prometheus-config"
          config_map {
            name = kubernetes_config_map.prometheus_config.metadata[0].name
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "prometheus" {
  metadata {
    name = "prometheus"
    labels = {
      app = "prometheus"
    }
  }
  spec {
    port {
      port = 9090
    }
    selector = {
      app = "prometheus"
    }
  }
}

resource "kubernetes_deployment" "otel_collector" {
  metadata {
    name = "otel-collector-deployment"
    labels = {
      app = "otel-collector"
    }
  }
  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "otel-collector"
      }
    }
    template {
      metadata {
        labels = {
          app = "otel-collector"
        }
      }
      spec {
        container {
          name  = "otel-collector"
          image = "otel/opentelemetry-collector-contrib:latest"
          command = ["--config=/etc/otel-collector/otel-collector-config.yml"]
          port {
            container_port = 4318
          }
          port {
            container_port = 8889
          }
          volume_mount {
            name       = "otel-collector-config"
            mount_path = "/etc/otel-collector"
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
        }
        volume {
          name = "otel-collector-config"
          config_map {
            name = kubernetes_config_map.otel_collector_config.metadata[0].name
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "otel_collector" {
  metadata {
    name = "otel-collector"
    labels = {
      app = "otel-collector"
    }
  }
  spec {
    port {
      name = "otlp-http"
      port = 4318
    }
    port {
      name = "prometheus"
      port = 8889
    }
    selector = {
      app = "otel-collector"
    }
  }
}

resource "kubernetes_persistent_volume_claim" "grafana" {
  metadata {
    name = "grafana-pvc"
    labels = {
      app = "grafana"
    }
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

resource "kubernetes_deployment" "grafana" {
  metadata {
    name = "grafana-deployment"
    labels = {
      app = "grafana"
    }
  }
  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "grafana"
      }
    }
    template {
      metadata {
        labels = {
          app = "grafana"
        }
      }
      spec {
        container {
          name  = "grafana"
          image = "grafana/grafana:latest"
          port {
            container_port = 3000
          }
          volume_mount {
            name       = "grafana-storage"
            mount_path = "/var/lib/grafana"
          }
          volume_mount {
            name       = "grafana-datasources-config"
            mount_path = "/etc/grafana/provisioning/datasources"
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
        }
        volume {
          name = "grafana-datasources-config"
          config_map {
            name = kubernetes_config_map.grafana_datasources_config.metadata[0].name
          }
        }
        volume {
          name = "grafana-storage"
          persistent_volume_claim {
            claim_name = kubernetes_persistent_volume_claim.grafana.metadata[0].name
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "grafana" {
  metadata {
    name = "grafana"
    labels = {
      app = "grafana"
    }
  }
  spec {
    port {
      port = 3000
    }
    selector = {
      app = "grafana"
    }
  }
}

resource "kubernetes_persistent_volume_claim" "grafana" {
  metadata {
    name = "grafana-pvc"
    labels = {
      app = "grafana"
    }
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

resource "kubernetes_deployment" "grafana" {
  metadata {
    name = "grafana-deployment"
    labels = {
      app = "grafana"
    }
  }
  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "grafana"
      }
    }
    template {
      metadata {
        labels = {
          app = "grafana"
        }
      }
      spec {
        container {
          name  = "grafana"
          image = "grafana/grafana:latest"
          port {
            container_port = 3000
          }
          volume_mount {
            name       = "grafana-storage"
            mount_path = "/var/lib/grafana"
          }
          volume_mount {
            name       = "grafana-datasources-config"
            mount_path = "/etc/grafana/provisioning/datasources"
          }
          resources {
            requests = {
              cpu    = "250m"
              memory = "512Mi"
            }
            limits = {
              cpu    = "500m"
              memory = "1Gi"
            }
          }
        }
        volume {
          name = "grafana-datasources-config"
          config_map {
            name = kubernetes_config_map.grafana_datasources_config.metadata[0].name
          }
        }
        volume {
          name = "grafana-storage"
          persistent_volume_claim {
            claim_name = kubernetes_persistent_volume_claim.grafana.metadata[0].name
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "grafana" {
  metadata {
    name = "grafana"
    labels = {
      app = "grafana"
    }
  }
  spec {
    port {
      port = 3000
    }
    selector = {
      app = "grafana"
    }
    type = "LoadBalancer"
  }
}
