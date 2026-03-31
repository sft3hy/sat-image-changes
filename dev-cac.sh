#!/bin/bash

# Configuration
PROJECT_ROOT="/Users/samueltownsend/dev/cosmic/sat-image-changes"
PROXY_SCRIPT="ispy/cac-proxy.js"

echo "--------------------------------------------------"
echo "   SatChange Unified Dev Launcher (CAC Mode)      "
echo "--------------------------------------------------"

# 1. Cleanup existing Docker containers to ensure a fresh state
echo "[1/3] Resetting Docker environment..."
docker compose down --remove-orphans

# 2. Start Application Backend & Frontend in Docker
# Note: We skip 'ispy-broker' because we are using the Real iSpy via CAC
echo "[2/3] Starting SatChange (Backend & Frontend) in background..."
docker compose up -d backend frontend

# 3. Start the CAC Proxy on the Host
# This MUST run on the host to access the physical SmartCard reader
echo "[3/3] Starting CAC Proxy..."

# Treat the first argument as the NGA Cookie if provided
if [ ! -z "$1" ]; then
  echo "      (Injecting NGA session cookie...)"
  export NGA_COOKIE="$1"
else
  echo "      (No session cookie provided. Using CAC only.)"
fi

echo "      (Waiting for Docker to initialize...)"
sleep 2

node "$PROJECT_ROOT/$PROXY_SCRIPT"
