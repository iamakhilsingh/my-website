#!/bin/zsh
cd "/Users/akhilsingh/my-website/medtreatindia-new-site" || exit 1
echo "Starting MedTreat India website at http://localhost:8080"
echo "Keep this Terminal window open while previewing the site."
python3 -m http.server 8080 --bind 127.0.0.1
