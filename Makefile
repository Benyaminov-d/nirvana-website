# Nirvana Website - Makefile
# Repository: nirvana-website

.PHONY: help setup dev build start stop clean install test lint

# Default target
help:
	@echo "Nirvana Website - Development Commands"
	@echo "======================================"
	@echo "Available targets:"
	@echo "  setup       - Setup development environment"
	@echo "  dev         - Start development server with hot reload"
	@echo "  build       - Build production assets"
	@echo "  start       - Start production server"
	@echo "  stop        - Stop all services"
	@echo "  install     - Install dependencies"
	@echo "  test        - Run tests"
	@echo "  lint        - Run linting"
	@echo "  clean       - Clean build artifacts and node_modules"
	@echo ""
	@echo "Prerequisites:"
	@echo "  - Node.js 18+ installed"
	@echo "  - Docker and Docker Compose (optional)"
	@echo "  - Backend API running (for full functionality)"

# Setup development environment
setup:
	@echo "=== Setting up Nirvana Website ==="
	@if [ ! -f ".env" ]; then \
		echo "Creating .env from template..."; \
		cp nirvana-website.env.template .env; \
		echo "Please edit .env file with your backend API URL"; \
	fi
	@echo "Installing dependencies..."
	@cd spa && npm install
	@echo "Setup complete!"

# Install dependencies
install:
	@echo "=== Installing Dependencies ==="
	@cd spa && npm install

# Start development server with hot reload
dev:
	@echo "=== Starting Development Server ==="
	@echo "Frontend will be available at: http://localhost:5173"
	@echo "Press Ctrl+C to stop"
	@cd spa && npm run dev

# Build production assets
build:
	@echo "=== Building Production Assets ==="
	@cd spa && npm run build
	@echo "Build complete! Assets in spa/dist/"

# Start production server (Docker)
start:
	@echo "=== Starting Production Server ==="
	@docker-compose up -d frontend
	@echo "Frontend available at: http://localhost:3000"

# Start development server (Docker)
dev-docker:
	@echo "=== Starting Development Server (Docker) ==="
	@docker-compose up -d frontend-dev
	@echo "Frontend dev server available at: http://localhost:5173"

# Stop all services
stop:
	@echo "=== Stopping Services ==="
	@docker-compose down

# Run tests
test:
	@echo "=== Running Tests ==="
	@cd spa && npm run test

# Run linting
lint:
	@echo "=== Running Linting ==="
	@cd spa && npm run lint

# Clean build artifacts and node_modules
clean:
	@echo "=== Cleaning Build Artifacts ==="
	@cd spa && rm -rf dist/ node_modules/
	@docker-compose down -v
	@echo "Cleanup complete"

# Build Docker images
docker-build:
	@echo "=== Building Docker Images ==="
	@docker-compose build --no-cache

# Show logs
logs:
	@docker-compose logs -f frontend

# Development with backend
dev-full:
	@echo "=== Starting Full Development Environment ==="
	@echo "Make sure backend is running on http://localhost:8000"
	@cd spa && npm run dev

# Production build and serve
prod:
	@echo "=== Production Build and Serve ==="
	@cd spa && npm run build
	@cd spa && npm run preview

# Health check
health:
	@echo "=== Frontend Health Check ==="
	@curl -s http://localhost:3000 | head -n 5 || echo "Frontend not responding"

# Update dependencies
update:
	@echo "=== Updating Dependencies ==="
	@cd spa && npm update
	@echo "Dependencies updated"