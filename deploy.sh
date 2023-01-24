#!/bin/bash
# Change directory
cd /opt/lovassyapp
# Install dependencies
yarn install
lerna bootstrap
# Turn on maintenance mode
yarn maintenance-down
# Install/update composer dependecies
yarn composer-update
# Run database migrations
yarn migrate
# Clear caches
yarn optimize
# Build warden permission map
yarn warden-build
# Build frontend code
yarn build
# Rebuild Docker
yarn docker-down
yarn docker-build
# Restart Docker containers
yarn docker-start-headless
# Turn off maintenance mode
yarn maintenance-up
