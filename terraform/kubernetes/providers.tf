terraform {
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = ">= 2.11.0"
    }
  }
}

provider "kubernetes" {
  # Your Kubernetes cluster configuration goes here.
  # By default, it will try to use the configuration from your local kubeconfig file (~/.kube/config).
  # You can also configure it explicitly with a host, token, and certificate.
}
