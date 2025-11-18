# ValorizeAI v2

ValorizeAI v2 é a base de código do meu Trabalho de Conclusão de Curso (TCC), combinando Laravel 12, Inertia.js v2 e React 19 para entregar uma plataforma full-stack moderna com PostgreSQL, Redis, MinIO e Typesense. Toda a fundamentação teórica, resultados e contexto acadêmico do projeto estão descritos em `docs/article/article.tex`.

## Conteúdo acadêmico
- **Artigo do TCC**: compile o material em `docs/article/article.tex` (por exemplo, com `latexmk -pdf article.tex`) para acessar o texto completo, metodologia e referências utilizadas na monografia.

## Stack em destaque
- Backend: Laravel 12 + Laravel Octane (FrankenPHP), Spatie Laravel Data, Sanctum, Horizon, Reverb e integração com Google Cloud Tasks e Resend.
- Frontend: Inertia.js + React 19 + Tailwind CSS 4 + Vite, com toolchain de lint (`npm run lint`), formatação (`npm run format`) e geração de tipos (`npm run types`).
- Infraestrutura local via Docker Compose configurado para Laravel Sail, incluindo PostgreSQL 17, Redis, MinIO, Mailpit, Typesense, workers de fila, Reverb e Nightwatch.
- Deploy em produção com Terraform + Google Cloud (Cloud SQL, Memorystore, Cloud Run, Cloud Tasks, Cloudflare DNS) e pipeline `gcloud` descrita no `Makefile`.

## Ambiente de desenvolvimento (Docker Compose + Laravel Sail)
### Pré-requisitos
- Docker Desktop 4.30+ com suporte a BuildKit e Docker Compose v2.
- PHP 8.3+ e Composer 2 caso deseje executar comandos fora do Sail.
- Node.js 20+ e npm 10+ para rodar utilitários locais (opcional, já que a stack de containers contém um serviço `frontend`).

### Primeira execução
1. **Copie e ajuste o `.env`**:
   ```bash
   cp .env.example .env
   ```
   - Configure `APP_NAME`, `APP_URL=http://localhost`, e execute `php artisan key:generate` (ou `./vendor/bin/sail artisan key:generate` após subir os containers).
   - Ajuste o banco para o PostgreSQL do Compose:
     ```env
     DB_CONNECTION=pgsql
     DB_HOST=pgsql
     DB_PORT=5432
     DB_DATABASE=valorizeai
     DB_USERNAME=sail
     DB_PASSWORD=password
     QUEUE_CONNECTION=database
     SESSION_DRIVER=database
     ```
   - Configure integrações locais: `REDIS_HOST=redis`, `MAIL_MAILER=smtp` com `MAIL_HOST=mailpit`, `MAIL_PORT=1025`, `AWS_ACCESS_KEY_ID=sail`, `AWS_SECRET_ACCESS_KEY=password`, `AWS_BUCKET=valorizeai-local`, `FILESYSTEM_DISK=s3`, `TYPESENSE_API_KEY=xyz`, etc.

2. **Instale as dependências para habilitar o Sail**:
   ```bash
   composer install
   npm install
   ```

3. **Suba os containers do Sail** (o Compose já possui serviços auxiliares para `composer` e `npm`):
   ```bash
   ./vendor/bin/sail up --build -d
   ```
   - O serviço `laravel.test` expõe a aplicação Octane/FrankenPHP na porta `APP_PORT` (padrão 80). Ajuste `APP_PORT` no `.env` se precisar de outra porta.
   - O serviço `frontend` executa `npm run dev` e expõe o Vite em `VITE_PORT` (padrão 5173) com HMR.

4. **Prepare o banco e os assets**:
   ```bash
   ./vendor/bin/sail artisan migrate --seed
   ./vendor/bin/sail artisan storage:link
   ```

### Fluxo diário
- Inicie os containers: `./vendor/bin/sail up -d` (ou `docker compose up -d` caso prefira o CLI nativo).
- Execute comandos no container com `./vendor/bin/sail <comando>` (artisan, npm, composer, etc.).
- Derrube tudo com `./vendor/bin/sail down` ou `./vendor/bin/sail down -v` para recriar volumes.

### Serviços inclusos e portas
| Serviço          | Porta(s)          | Descrição |
| ---------------- | ----------------- | --------- |
| `laravel.test`   | `APP_PORT` (80)   | App Laravel via Octane/FrankenPHP.
| `frontend`       | `VITE_PORT` (5173)| Vite dev server com HMR.
| `pgsql`          | 5432              | PostgreSQL 17 (volume `sail-pgsql`).
| `redis`          | 6379              | Cache/fila Redis.
| `worker`         | —                 | `php artisan queue:listen` (usa os mesmos volumes, reinicia automaticamente).
| `reverb`         | 8080              | WebSocket com `php artisan reverb:start`.
| `nightwatch`     | 2407              | Agente Nightwatch observability.
| `minio`          | 9000 / 8900       | Compatível com S3. Console em `http://localhost:8900` (`sail` / `password`).
| `mailpit`        | 1025 / 8025       | SMTP fake + dashboard.
| `typesense`      | 8108              | Engine de busca vectorial/instantânea.

### Comandos úteis no Sail
```bash
./vendor/bin/sail artisan test           # Executa a suíte Pest
./vendor/bin/sail artisan queue:work     # Worker adicional em modo manual
./vendor/bin/sail artisan horizon        # Dashboard de filas, se habilitado
./vendor/bin/sail npm run lint           # ESLint
./vendor/bin/sail npm run format         # Prettier
./vendor/bin/sail npm run build          # Build de produção
./vendor/bin/sail artisan octane:status  # Saúde do servidor Octane
```
- Rode `composer test` fora dos containers se preferir usar a stack local.
- Formate o PHP com `./vendor/bin/pint --dirty` antes de abrir PR.

## Terraform e deploy na Google Cloud
### Preparação
1. Instale o Terraform CLI (>=1.9) e autentique no Google Cloud (`gcloud auth application-default login`).
2. Gere e disponibilize o JSON da service account com permissões em Cloud Run, Cloud SQL, Secret Manager, Artifact Registry, Cloud Tasks e Cloudflare (se usar DNS gerenciado).
3. Export `GOOGLE_APPLICATION_CREDENTIALS=/caminho/service-account.json` antes de rodar o Terraform (ou configure na CLI).

### Arquivos de variáveis e segredos
- Copie `terraform/terraform.tfvars.example` para `terraform/terraform.tfvars` e preencha:
  - `pgsql_database`, `pgsql_username` e valores customizados de domínio (`domain`/`custom_domain`).
  - Segredos obrigatórios: `laravel_app_key`, `resend_api_key`, `cloudflare_api_token`, `cloudflare_zone_id` (caso use domínio no Cloudflare).
  - Overrides opcionais (`cloudsql_tier`, `redis_memory_size_gb`, `google_credentials_path`, etc.).
- O Terraform cria segredos no Secret Manager para `pgsql_password`, `cloud_run_credentials` e `resend_api_key`. O `random_password.pgsql` garante que a senha do banco não seja exposta.

### Fluxo de provisionamento
```bash
cd terraform
terraform init
terraform plan -var-file=terraform.tfvars
terraform apply -var-file=terraform.tfvars
```
- O módulo cria: rede serverless dedicada, Cloud SQL Postgres privado, Memorystore Redis, Cloud Tasks, serviço Cloud Run com domínio customizado, load balancer HTTP(S) e registros DNS via Cloudflare.
- Após o `apply`, atualize o container de aplicação:
  ```bash
  make deploy             # Equivalente a submit + update_service + update_artisan
  make run_migration      # Executa migrations no Cloud Run Job valorizeai-artisan
  ```
- Use `make terraform_plan` / `make terraform_apply` como atalhos se preferir rodar o Terraform via Makefile.
- Logs e status:
  ```bash
  make status             # Mostra URL do Cloud Run e imagem em uso
  gcloud run services logs tail valorizeai --region southamerica-east1
  ```

### Checklist pós-deploy
- Confirme que os segredos esperados aparecem no Secret Manager.
- Valide que o DNS do Cloudflare aponta para o load balancer criado pelo Terraform.
- Rode `php artisan config:cache` e `php artisan queue:restart` via Cloud Run Job se alterar configurações.

## Qualidade e automação
- **Testes**: `composer test` (ou `./vendor/bin/sail artisan test`) executa Pest + PHPUnit. Crie testes em `tests/Feature` ou `tests/Unit` para novas features.
- **Lint/format**: `npm run lint`, `npm run format`, `npm run format:check`, `./vendor/bin/pint --dirty`.
- **Dev scripts**: `composer dev` (ou `composer dev:ssr`) inicia simultaneamente servidor HTTP, queue listener, logs `pail` e Vite para quem prefere rodar tudo fora dos containers.

## Próximos passos
- Leia o artigo do TCC em `docs/article/article.tex` para entender os objetivos acadêmicos e métricas adotadas.
- Atualize `.env.example` ao introduzir novos segredos ou integrações para manter o onboarding simples.
- Quando precisar publicar uma nova versão, rode `npm run build` + `php artisan config:cache` e gere uma imagem nova com `make submit` antes de atualizar o serviço.
