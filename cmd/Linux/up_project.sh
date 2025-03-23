#!/bin/sh

echo "Starting NodeJS..."
cd ../../fabric-samples/contract/application
node server.js &

echo "Starting Go..."
cd ../../../server
go run . &

echo "Starting Vite..."
cd ../
npm run dev &