terraform {
  required_version = ">= 1.5.0"

  backend "gcs" {
    bucket = "valorize-tf-state"
    prefix = "terraform/state"
  }

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "6.49.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "3.6.2"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

provider "google" {
  project = var.gcp_project_id
  region  = var.gcp_region
  zone    = var.gcp_zone
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}
