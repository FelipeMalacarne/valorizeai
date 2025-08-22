# Makefile for ValorizeAI deployment

# Configuration
PROJECT_ID := valorizeai
REGION := southamerica-east1
REPOSITORY := valorize-repo
IMAGE_NAME := valorizeai
SERVICE_NAME := valorizeai
JOB_NAME := valorizeai-artisan
TERRAFORM_DIR := terraform

# Image URLs
IMAGE_URL := $(REGION)-docker.pkg.dev/$(PROJECT_ID)/$(REPOSITORY)/$(IMAGE_NAME)
LATEST_IMAGE := $(IMAGE_URL):latest

# Colors for output
RED := \033[0;31m
GREEN := \033[0;32m
YELLOW := \033[1;33m
BLUE := \033[0;34m
NC := \033[0m # No Color

# Default target
.PHONY: help
help:
	@echo "$(BLUE)ValorizeAI Deployment Makefile$(NC)"
	@echo ""
	@echo "$(YELLOW)Available commands:$(NC)"
	@echo "  $(GREEN)submit$(NC)           - Build and push Docker image using Cloud Build"
	@echo "  $(GREEN)update_service$(NC)    - Update Cloud Run service with latest image"
	@echo "  $(GREEN)update_artisan$(NC)    - Update Cloud Run job (artisan) with latest image"
	@echo "  $(GREEN)deploy$(NC)            - Complete deployment (submit + update_service + update_artisan)"
	@echo "  $(GREEN)local_build$(NC)       - Build Docker image locally"
	@echo "  $(GREEN)local_push$(NC)        - Push locally built image to registry"
	@echo "  $(GREEN)terraform_apply$(NC)   - Apply Terraform configuration"
	@echo "  $(GREEN)terraform_plan$(NC)    - Plan Terraform changes"
	@echo "  $(GREEN)status$(NC)            - Check deployment status"
	@echo "  $(GREEN)logs$(NC)              - Show Cloud Run service logs"
	@echo "  $(GREEN)run_migration$(NC)     - Run database migrations using Cloud Run job"
	@echo "  $(GREEN)help$(NC)              - Show this help message"

.PHONY: submit
submit:
	@echo "$(YELLOW)Building and pushing Docker image using Cloud Build...$(NC)"
	@gcloud builds submit \
		--config cloudbuild.yaml \
		--project $(PROJECT_ID) \
		--region $(REGION) \
		.
	@echo "$(GREEN)✓ Image built and pushed successfully$(NC)"

.PHONY: update_service
update_service:
	@echo "$(YELLOW)Updating Cloud Run service...$(NC)"
	@gcloud run services update $(SERVICE_NAME) \
		--image $(LATEST_IMAGE) \
		--region $(REGION) \
		--project $(PROJECT_ID)
	@echo "$(GREEN)✓ Cloud Run service updated successfully$(NC)"

.PHONY: update_artisan
update_artisan:
	@echo "$(YELLOW)Updating Cloud Run job (artisan)...$(NC)"
	@gcloud run jobs update $(JOB_NAME) \
		--image $(LATEST_IMAGE) \
		--region $(REGION) \
		--project $(PROJECT_ID)
	@echo "$(GREEN)✓ Cloud Run job updated successfully$(NC)"

.PHONY: deploy
deploy: submit update_service update_artisan
	@echo "$(GREEN)✓ Complete deployment finished successfully$(NC)"
	@make status

.PHONY: local_build
local_build:
	@echo "$(YELLOW)Building Docker image locally...$(NC)"
	@docker build -f docker/laravel/Dockerfile -t $(LATEST_IMAGE) .
	@echo "$(GREEN)✓ Docker image built locally$(NC)"

.PHONY: local_push
local_push:
	@echo "$(YELLOW)Pushing locally built image to registry...$(NC)"
	@docker push $(LATEST_IMAGE)
	@echo "$(GREEN)✓ Image pushed to registry$(NC)"

.PHONY: terraform_plan
terraform_plan:
	@echo "$(YELLOW)Planning Terraform changes...$(NC)"
	@cd $(TERRAFORM_DIR) && terraform plan

.PHONY: terraform_apply
terraform_apply:
	@echo "$(YELLOW)Applying Terraform configuration...$(NC)"
	@cd $(TERRAFORM_DIR) && terraform apply
	@echo "$(GREEN)✓ Terraform applied successfully$(NC)"

.PHONY: status
status:
	@echo "$(BLUE)Deployment Status:$(NC)"
	@echo ""
	@echo "$(YELLOW)Cloud Run Service:$(NC)"
	@gcloud run services describe $(SERVICE_NAME) \
		--region $(REGION) \
		--project $(PROJECT_ID) \
		--format="table(metadata.name,status.url,status.traffic[0].percent,spec.template.spec.containers[0].image)" \
		2>/dev/null || echo "$(RED)Service not found$(NC)"
	@echo ""
	@echo "$(YELLOW)Cloud Run Job:$(NC)"
	@gcloud run jobs describe $(JOB_NAME) \
		--region $(REGION) \
		--project $(PROJECT_ID) \
		--format="table(metadata.name,spec.template.spec.template.spec.containers[0].image)" \
		2>/dev/null || echo "$(RED)Job not found$(NC)"


.PHONY: run_migration
run_migration:
	@echo "$(YELLOW)Running database migrations...$(NC)"
	@gcloud run jobs execute $(JOB_NAME) \
		--region $(REGION) \
		--project $(PROJECT_ID) \
		--args="migrate,--force"
	@echo "$(GREEN)✓ Migration job executed$(NC)"

.PHONY: setup_artifact_registry
setup_artifact_registry:
	@echo "$(YELLOW)Setting up Artifact Registry repository...$(NC)"
	@gcloud artifacts repositories create $(REPOSITORY) \
		--repository-format=docker \
		--location=$(REGION) \
		--project=$(PROJECT_ID) \
		2>/dev/null && echo "$(GREEN)✓ Repository created$(NC)" || echo "$(YELLOW)Repository already exists$(NC)"
	@gcloud auth configure-docker $(REGION)-docker.pkg.dev

.PHONY: clean
clean:
	@echo "$(YELLOW)Cleaning up local Docker images...$(NC)"
	@docker rmi $(LATEST_IMAGE) 2>/dev/null || echo "$(YELLOW)No local image to clean$(NC)"
	@docker system prune -f

# Advanced deployment with health check
.PHONY: deploy_with_health_check
deploy_with_health_check: submit
	@echo "$(YELLOW)Deploying with health check...$(NC)"
	@make update_service
	@echo "$(YELLOW)Waiting for service to be ready...$(NC)"
	@sleep 30
	@SERVICE_URL=$$(gcloud run services describe $(SERVICE_NAME) --region $(REGION) --project $(PROJECT_ID) --format="value(status.url)"); \
	if curl -f "$$SERVICE_URL/up" > /dev/null 2>&1; then \
		echo "$(GREEN)✓ Service is healthy$(NC)"; \
		make update_artisan; \
	else \
		echo "$(RED)✗ Service health check failed$(NC)"; \
		exit 1; \
	fi

# Run artisan commands
.PHONY: artisan
artisan:
	@if [ -z "$(CMD)" ]; then \
		echo "$(RED)Error: Please provide a command. Usage: make artisan CMD='migrate'$(NC)"; \
		exit 1; \
	fi
	@echo "$(YELLOW)Running artisan command: $(CMD)$(NC)"
	@gcloud run jobs execute $(JOB_NAME) \
		--region $(REGION) \
		--project $(PROJECT_ID) \
		--args="$(CMD)"

# Quick deploy for development (local build + push + update)
.PHONY: quick_deploy
quick_deploy: local_build local_push update_service
	@echo "$(GREEN)✓ Quick deployment completed$(NC)"
