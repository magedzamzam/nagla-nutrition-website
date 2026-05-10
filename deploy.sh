#!/usr/bin/env bash
# ============================================================
# deploy.sh — Run on OCI Oracle Linux 9 instance
# Bootstraps Docker (if missing) and brings up the stack
# ============================================================
set -euo pipefail

cd "$(dirname "$0")"

# Install Docker if not present
if ! command -v docker &>/dev/null; then
  echo "Installing Docker on Oracle Linux 9…"
  sudo dnf install -y dnf-plugins-core
  sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
  sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
  sudo systemctl enable --now docker
  sudo usermod -aG docker "$USER"
  echo "Docker installed. Please log out and back in, then re-run ./deploy.sh"
  exit 0
fi

# Open firewall ports (Oracle Linux 9 uses firewalld by default)
if command -v firewall-cmd &>/dev/null && sudo systemctl is-active --quiet firewalld; then
  echo "Opening firewall port 80…"
  sudo firewall-cmd --permanent --add-port=80/tcp || true
  sudo firewall-cmd --reload || true
fi

# Ensure .env exists
if [ ! -f .env ]; then
  echo "ERROR: .env file is missing. Copy .env.example to .env and fill it in."
  exit 1
fi

# Build and run
echo "Building containers…"
docker compose build

echo "Starting services…"
docker compose up -d

echo ""
echo "✓ Deployment complete."
echo "  Site is now serving on http://<this-instance>:80"
echo "  Health check: curl http://localhost/healthz"
echo "  Admin panel:  http://<your-domain>/admin"
echo ""
echo "Point your OCI Load Balancer backend at this instance:80 (HTTP)."
echo "Configure the LB listener on 443 with your SSL certificate."
