#!/bin/bash
cd android/

echo "# Cleaning local build cache..."
rm -rf ./build
rm -rf ./app/build

echo "# Building app via gradle..."
./gradlew assemble release
