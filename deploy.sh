#!/usr/bin/env bash
# ============================================================
# deploy.sh — Run on OCI Oracle Linux 9 instance
#
# This script:
#   1. Installs Docker if missing
#   2. Clones the repo (or pulls latest if already cloned)
#   3. Loads .env from current directory
#   4. Builds and runs the docker compose stack
#
# Usage:
#   First time:    ./deploy.sh
#   Updates:       ./deploy.sh --pull
#   Force rebuild: ./deploy.sh --rebuild
# ============================================================
set -euo pipefail

REPO_URL="https://github.com/magedzamzam/nagla-nutrition-website.git"
REPO_DIR="nagla-nutrition-website"
BRANCH="${BRANCH:-main}"

cd "$(dirname "$0")"
SCRIPT_DIR="$(pwd)"

# ----- Parse flags -----
DO_PULL=false
DO_REBUILD=false
for arg in "$@"; do
  case "$arg" in
    --pull) DO_PULL=true ;;
    --rebuild) DO_REBUILD=true ;;
    --help|-h)
      grep -E "^# " "$0" | head -20 | sed 's/^# //'
      exit 0
      ;;
  esac
done

# ----- Install Docker if missing -----
if ! command -v docker &>/dev/null; then
  echo "Installing Docker on Oracle Linux 9..."
  sudo dnf install -y dnf-plugins-core
  sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
  sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin git
  sudo systemctl enable --now docker
  sudo usermod -aG docker "$USER"
  echo ""
  echo "Docker installed. Log out and back in, then re-run ./deploy.sh"
  exit 0
fi

# ----- Install git if missing -----
if ! command -v git &>/dev/null; then
  echo "Installing git..."
  sudo dnf install -y git
fi

# ----- Open firewall port 80 -----
if command -v firewall-cmd &>/dev/null && sudo systemctl is-active --quiet firewalld; then
  echo "Opening firewall port 80..."
  sudo firewall-cmd --permanent --add-port=80/tcp 2>/dev/null || true
  sudo firewall-cmd --reload 2>/dev/null || true
fi

# ----- Clone or pull the repo -----
if [ ! -d "$REPO_DIR/.git" ]; then
  echo "Cloning $REPO_URL..."
  git clone --branch "$BRANCH" "$REPO_URL" "$REPO_DIR"
elif [ "$DO_PULL" = true ] || [ "$DO_REBUILD" = true ]; then
  echo "Pulling latest from $BRANCH..."
  cd "$REPO_DIR"
  git fetch origin
  git checkout "$BRANCH"
  git reset --hard "origin/$BRANCH"
  cd "$SCRIPT_DIR"
else
  echo "Repo already cloned. Use --pull to fetch the latest commits."
fi

# ----- Ensure .env exists in repo dir -----
# .env lives next to docker-compose.yml inside the repo
if [ ! -f "$REPO_DIR/.env" ]; then
  if [ -f "$SCRIPT_DIR/.env" ]; then
    echo "Copying .env from script dir into repo dir..."
    cp "$SCRIPT_DIR/.env" "$REPO_DIR/.env"
  elif [ -f "$REPO_DIR/.env.example" ]; then
    echo ""
    echo "ERROR: $REPO_DIR/.env is missing."
    echo "  cp $REPO_DIR/.env.example $REPO_DIR/.env"
    echo "  nano $REPO_DIR/.env   # set ADMIN_PASSWORD, JWT_SECRET, PUBLIC_URL"
    echo ""
    echo "Then re-run ./deploy.sh"
    exit 1
  else
    echo "ERROR: No .env or .env.example found. Cannot continue."
    exit 1
  fi
fi

# ----- Build and run -----
cd "$REPO_DIR"

if [ "$DO_REBUILD" = true ]; then
  echo "Force rebuilding (no cache)..."
  docker compose build --no-cache
else
  echo "Building containers..."
  docker compose build
fi

echo "Starting services..."
docker compose up -d

echo ""
echo "================================================================"
echo "Deployment complete."
echo "  Site:        http://<this-instance-ip>:80"
echo "  Health:      curl http://localhost/healthz"
echo "  Admin:       http://<your-domain>/admin"
echo "  Logs:        docker compose -f $REPO_DIR/docker-compose.yml logs -f"
echo ""
echo "Point your OCI Load Balancer backend at this instance:80 (HTTP)."
echo "Configure the LB listener on 443 with your SSL certificate."
echo "================================================================"
