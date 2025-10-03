#!/bin/bash

# Navigate to the project directory
cd /home/ubuntu/htk-production/

# Ensure nvm is sourced if available
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# Use the Node.js version specified in .nvmrc
nvm use

echo "--- Node.js and npm versions before build ---"
node -v
npm -v

echo "--- Running npm install --legacy-peer-deps ---"
npm install --legacy-peer-deps

echo "--- Running npm run build ---"
npm run build

if [ $? -eq 0 ]; then
  echo "Build successful!"
else
  echo "Build failed!"
  exit 1
fi

