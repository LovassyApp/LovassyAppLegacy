#!/bin/bash

# The following two NPM links have to be made, in order for the builds to succeed.
# This is because the monorepo manager used in this project (Lerna) doesn't do NPM linking, and Expo has bad monorepo support.
# The linking process thankfully only has to be done once though.

npm link ../../packages/blueboard-client --force
npm link ../../packages/blueboard-client-react --force
