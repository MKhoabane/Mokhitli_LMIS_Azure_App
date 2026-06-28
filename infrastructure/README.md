# Infrastructure Structure

This directory scaffolds the QCTO Enterprise Suite infrastructure concerns.
Use it for container images, Kubernetes manifests, service configuration, Azure assets, and CI/CD pipelines.
Existing deployment assets in k8s, docker-compose.yml, and terraform remain valid and can be migrated into this layout over time.

## Production Deployment Package

- `docker/`: production image, compose stack, startup helpers, and Docker Nginx config
- `nginx/`: standalone Nginx domain-hosting template for a VPS or reverse proxy
- `azure/`: Azure App Service deployment script and example settings
- `vps/`: Docker-based VPS deployment script and optional systemd unit
- `ci-cd/`: GitHub Actions release and deployment automation guidance
