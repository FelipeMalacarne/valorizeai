output "host" {
  description = "Primary host IP of the Redis instance."
  value       = google_redis_instance.this.host
}

output "port" {
  description = "Port to connect to Redis."
  value       = google_redis_instance.this.port
}

output "instance_name" {
  description = "Name of the Redis instance."
  value       = google_redis_instance.this.name
}
