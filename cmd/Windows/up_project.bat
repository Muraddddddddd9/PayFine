echo Starting NodeJS...
cd ../../fabric-samples/contract/application
start node server.js

echo Starting Go...
cd ../../../server
start go run .

echo Starting Vite...
cd ../
start npm run dev