@echo off

echo Downloading install-fabric.sh...
cd ../../
curl -sSLO https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh
wsl chmod +x ./install-fabric.sh

echo Downloading Hyperledger Fabric...
wsl ./install-fabric.sh

echo Downloading package in ./contract/application...
cd ./contract/application
cmd /c "npm install"

echo Downloading package in ./server...
cd ../../server
cmd /c "go get ."

echo Downloading package for web...
cd ../
cmd /c "npm install"

echo Moving contract to fabric-samples...
move contract fabric-samples\

echo Create channel and chaincode...
cd fabric-samples/test-network
wsl ./network.sh up createChannel -c blockchain -ca
wsl ./network.sh deployCC -ccn MyChaincode -ccl javascript -ccp ../contract/chaincode -c blockchain -cci InitLedger

echo Starting NodeJS...
cd ../contract/application
start node server.js

echo Starting Go...
cd ../../../server
start go run .

echo Starting Vite...
cd ../
start npm run dev

echo All services started successfully.