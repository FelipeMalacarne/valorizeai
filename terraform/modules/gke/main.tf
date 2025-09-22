terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 6.29.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = ">= 2.11"
    }
    helm = {
      source  = "hashicorp/helm"
      version = ">= 2.5"
    }
    random = {
      source  = "hashicorp/random"
      version = "3.6.2"
    }
  }
}

resource "google_container_cluster" "autopilot_cluster" {
  name     = var.cluster_name
  location = var.region
  project  = var.project_id

  # Enable Autopilot for a hands-off Kubernetes experience
  enable_autopilot = true
}

data "google_client_config" "default" {}

provider "kubernetes" {
  host                   = "https://\${google_container_cluster.autopilot_cluster.endpoint}"
  token                  = data.google_client_config.default.access_token
  cluster_ca_certificate = base64decode(google_container_cluster.autopilot_cluster.master_auth[0].cluster_ca_certificate)
}

provider "helm" {
  kubernetes {
    host                   = "https://\${google_container_cluster.autopilot_cluster.endpoint}"
    token                  = data.google_client_config.default.access_token
    cluster_ca_certificate = base64decode(google_container_cluster.autopilot_cluster.master_auth[0].cluster_ca_certificate)
  }
}