# PayFine

PayFine is a project that allows users to view and pay fines through HyperLedger's blockchain. Basic information about users is stored in the database.

## Technologies Used

- **HyperLedger**: Private Blockchain.
- **PostgreSQL**: Database for storing user data.
- **Vite+ReactJS**: User Interface.
- **Golang + Fiber**: Writing APIs for interacting with PostgreSQL and gRPC with JavaScript backend
- **JavaScript**: Writing functions to interact directly with HyperLedger
- **Docker + WSL + Ubuntu**: Raising a custom channel and network
- **gRPC**: Interaction between Go - backend and JS - backend

## Getting Started

### Prerequisites

- PostgreSQL installed on your machine + pgAdmin 4(recommended) (version 17 or higher recommended).
- NodeJS installed on your machine (version 18.17.0 or higher recommended).
- Golang installed on your machine (version 1.23.0  or higher recommended).
- Docker installed on your machine (version 27.5.1 or higher recommended).
- WSL installed on your machine (version 2 or higher recommended).
- Ubuntu installed on your machine.
- CURL installed on your machine (version 8.10.1 or higher recommended).

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Muraddddddddd9/payfine.git
   ```
2. Go to the ***server\config\config*** section.go and replace with your own data:
3. Opent docker
4. From the ***sql*** folder, you need to take SQL-scripts for creating a database 
5. Enter the start command
   ```bash
   ./start.bat
   ```
   or
   ```bash
   ./start.sh
   ```

### Warning:

- If you want to rebuild HyperLedger, go to the ***fabric-samples/test-network*** directory and enter the command:
```bash
./network.sh down
```
- To raise the network again, you need to write the following command in the fabric-samples/test-network directory:
```bash
./network.sh up createChannel -c blockchain -ca
```
and
```bash
./network.sh deployCC -ccn MyChaincode -ccl javascript -ccp ../contract/chaincode -c blockchain -cci InitLedger
```
- If you change the *proto* file, then you need to copy this proto file to the ***fabric-samples/contract/application*** folder.
