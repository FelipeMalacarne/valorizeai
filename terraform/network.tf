resource "google_compute_network" "serverless" {
  name                    = var.serverless_network_name
  auto_create_subnetworks = false
  project                 = var.gcp_project_id
  description             = "Dedicated VPC for ValorizeAI serverless resources."
  routing_mode            = "REGIONAL"
}

resource "google_compute_subnetwork" "serverless" {
  name          = "${var.serverless_network_name}-subnet"
  project       = var.gcp_project_id
  region        = var.gcp_region
  ip_cidr_range = var.serverless_subnet_cidr
  network       = google_compute_network.serverless.self_link

  private_ip_google_access = true
}

resource "google_compute_global_address" "private_service_connect" {
  name          = "${var.serverless_network_name}-psc"
  project       = var.gcp_project_id
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 20
  network       = google_compute_network.serverless.self_link
}

resource "google_service_networking_connection" "private_vpc_connection" {
  network                 = google_compute_network.serverless.self_link
  service                 = "services/servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_service_connect.name]

  depends_on = [google_compute_global_address.private_service_connect]
}
