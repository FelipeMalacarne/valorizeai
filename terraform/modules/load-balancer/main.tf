terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 6.29.0"
    }
  }
}

resource "google_compute_global_address" "default" {
  name         = "${var.project_name}-lb-ip"
  ip_version   = "IPV4"
  address_type = "EXTERNAL"
}

resource "google_compute_managed_ssl_certificate" "default" {
  name = "${var.project_name}-ssl-cert"

  managed {
    domains = var.domains
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "google_compute_region_network_endpoint_group" "cloudrun_neg" {
  name                  = "${var.project_name}-cloudrun-neg"
  network_endpoint_type = "SERVERLESS"
  region                = var.region

  cloud_run {
    service = var.cloud_run_service_name
  }
}

resource "google_compute_backend_service" "default" {
  name                  = "${var.project_name}-backend"
  protocol              = "HTTP"
  port_name             = "http"
  load_balancing_scheme = "EXTERNAL_MANAGED"
  timeout_sec           = 30
  enable_cdn            = var.enable_cdn

  backend {
    group = google_compute_region_network_endpoint_group.cloudrun_neg.id
  }

  # Health check is not needed for Cloud Run NEG
  # Cloud Run handles health checks internally

  # CDN configuration for static assets
  dynamic "cdn_policy" {
    for_each = var.enable_cdn ? [1] : []
    content {
      cache_mode        = "CACHE_ALL_STATIC"
      default_ttl       = 3600
      max_ttl           = 86400
      negative_caching  = true
      serve_while_stale = 86400

      cache_key_policy {
        include_host         = true
        include_protocol     = true
        include_query_string = false
      }
    }
  }

  log_config {
    enable      = true
    sample_rate = var.enable_logging ? 1.0 : 0.1
  }
}

resource "google_compute_url_map" "default" {
  name            = "${var.project_name}-url-map"
  default_service = google_compute_backend_service.default.id

  dynamic "path_matcher" {
    for_each = var.path_rules
    content {
      name            = path_matcher.value.name
      default_service = google_compute_backend_service.default.id

      dynamic "path_rule" {
        for_each = path_matcher.value.rules
        content {
          paths   = path_rule.value.paths
          service = path_rule.value.service
        }
      }
    }
  }
}

resource "google_compute_target_https_proxy" "default" {
  name             = "${var.project_name}-https-proxy"
  url_map          = google_compute_url_map.default.id
  ssl_certificates = [google_compute_managed_ssl_certificate.default.id]
}

resource "google_compute_url_map" "https_redirect" {
  name = "${var.project_name}-https-redirect"

  default_url_redirect {
    https_redirect         = true
    redirect_response_code = "MOVED_PERMANENTLY_DEFAULT"
    strip_query            = false
  }
}

resource "google_compute_target_http_proxy" "https_redirect" {
  name    = "${var.project_name}-http-proxy"
  url_map = google_compute_url_map.https_redirect.id
}

resource "google_compute_global_forwarding_rule" "https" {
  name                  = "${var.project_name}-https-rule"
  ip_protocol           = "TCP"
  load_balancing_scheme = "EXTERNAL_MANAGED"
  port_range            = "443"
  target                = google_compute_target_https_proxy.default.id
  ip_address            = google_compute_global_address.default.id
}

resource "google_compute_global_forwarding_rule" "http" {
  name                  = "${var.project_name}-http-rule"
  ip_protocol           = "TCP"
  load_balancing_scheme = "EXTERNAL_MANAGED"
  port_range            = "80"
  target                = google_compute_target_http_proxy.https_redirect.id
  ip_address            = google_compute_global_address.default.id
}

resource "google_cloud_run_service_iam_member" "lb_invoker" {
  project  = var.project_id
  location = var.region
  service  = var.cloud_run_service_name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
