resource "random_password" "postgres_password" {
  length  = 32
  special = false
}

resource "helm_release" "postgres" {
  name       = "postgres"
  repository = "https://charts.bitnami.com/bitnami"
  chart      = "postgresql"
  version    = "12.2.5"

  set {
    name  = "global.postgresql.auth.postgresPassword"
    value = random_password.postgres_password.result
  }
  set {
    name  = "primary.persistence.enabled"
    value = "true"
  }
}

resource "random_password" "redis_password" {
  length  = 32
  special = false
}

resource "helm_release" "redis" {
  name       = "redis"
  repository = "https://charts.bitnami.com/bitnami"
  chart      = "redis"
  version    = "17.3.2"

  set {
    name  = "global.redis.password"
    value = random_password.redis_password.result
  }
  set {
    name  = "master.persistence.enabled"
    value = "true"
  }
}

resource "random_string" "minio_root_user" {
  length  = 16
  special = false
}

resource "random_password" "minio_root_password" {
  length  = 32
  special = false
}

resource "helm_release" "minio" {
  name       = "minio"
  repository = "https://charts.min.io/"
  chart      = "minio"
  version    = "4.0.6"

  set {
    name  = "rootUser"
    value = random_string.minio_root_user.result
  }
  set {
    name  = "rootPassword"
    value = random_password.minio_root_password.result
  }
  set {
    name  = "persistence.enabled"
    value = "true"
  }
}

resource "random_password" "typesense_api_key" {
  length  = 32
  special = false
}

resource "helm_release" "typesense" {
  name       = "typesense"
  repository = "https://typesense.github.io/helm-charts/"
  chart      = "typesense"
  version    = "0.6.0"

  set {
    name  = "apiKey"
    value = random_password.typesense_api_key.result
  }
  set {
    name  = "persistence.enabled"
    value = "true"
  }
}
