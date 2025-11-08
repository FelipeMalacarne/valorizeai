output "instance_name" {
  description = "Name of the Cloud SQL instance."
  value       = google_sql_database_instance.this.name
}

output "instance_connection_name" {
  description = "Connection name used by Cloud Run/Cloud SQL connector."
  value       = google_sql_database_instance.this.connection_name
}

output "private_ip_address" {
  description = "Primary private IP assigned to the instance."
  value       = google_sql_database_instance.this.private_ip_address
}

output "database_name" {
  description = "Default database created for the app."
  value       = google_sql_database.default.name
}

output "user_name" {
  description = "Name of the application database user."
  value       = google_sql_user.app.name
}
