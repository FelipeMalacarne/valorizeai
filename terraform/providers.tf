terraform {
  required_version = ">= 1.5.0"

  backend "gcs" {
    bucket = "valorizeai-tf-state"
    prefix = "terraform/state"
  }

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "6.49.0"
    }
  }
}

provider "google" {
  project = var.gcp_project_id
  region  = var.gcp_region
  zone    = var.gcp_zone
}
