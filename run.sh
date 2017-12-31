#!/bin/sh
parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

npm run build
cp saved_matrix.js dist/Matrix.js
cd "$parent_path"/browser&&./build_client.sh
cd ..
python3 -m http.server 8000