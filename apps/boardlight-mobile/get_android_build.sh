#!/bin/bash
cd android/
current_time=$(date "+%Y.%m.%d-%H.%M.%S")
mv ./app/build/outputs/apk/release/app-release.apk ../"release-$current_time.apk"
cd ..
