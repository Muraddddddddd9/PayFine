#!/bin/sh

echo "Downloading install-fabric.sh..."
cd ../../
curl -sSLO https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh
chmod +x ./install-fabric.sh

echo "Downloading Hyperledger Fabric..."
./install-fabric.sh

echo "Downloading package in ./contract/application..."
cd ./contract/application
npm install

echo "Downloading package in ./server..."
cd ../../server
go get .

echo "Downloading package for web..."
cd ../
npm install

echo "Moving contract to fabric-samples..."
mv contract fabric-samples/

echo "Create channel and chaincode..."
cd fabric-samples/test-network
./network.sh up createChannel -c blockchain -ca
./network.sh deployCC -ccn MyChaincode -ccl javascript -ccp ../contract/chaincode -c blockchain -cci InitLedger

echo "Starting NodeJS..."
cd ../contract/application
node server.js &

echo "Starting Go..."
cd ../../../server
go run . &

echo "Starting Vite..."
cd ../
npm run dev &

echo "All services started successfully."