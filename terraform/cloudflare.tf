resource "cloudflare_record" "application" {
  count   = var.cloudflare_zone_id != "" && var.cloudflare_api_token != "" ? 1 : 0
  zone_id = var.cloudflare_zone_id
  name    = local.cloudflare_record
  type    = "A"
  value   = module.load_balancer.load_balancer_ip
  ttl     = 300
  proxied = false

  depends_on = [module.load_balancer]
}
