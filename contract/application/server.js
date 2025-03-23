const grpc = require("@grpc/grpc-js")
const protoLoader = require("@grpc/proto-loader")
const { registerAdmin, registerUser, ReadData, WriteData, GetBalance, MintToken, TransferToken } = require("./smart-contracts/contractInteractions")

const PROTO_PATH = "./service.proto";
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const serviceProto = grpc.loadPackageDefinition(packageDefinition).service;
const server = new grpc.Server();

async function RegAdminForOrg() {
    try {
        await registerAdmin("org1")
        await registerAdmin("org2")
    } catch (e) {
        console.error(e)
    }
}

async function RegUsersForOrg() {
    const users = [
        { org: "org2", userID: "bank" },
        { org: "org1", userID: "dps" },
        { org: "org1", userID: "driver" },
    ]
    try {
        for (const user of users) {
            await registerUser(user.org, user.userID)
        }
    } catch (e) {
        console.error(e)
    }
}

async function StartProgram() {
    try {
        await RegAdminForOrg()
        await RegUsersForOrg()
    } catch (e) {
        console.error(e)
    }
}

StartProgram()

server.addService(serviceProto.ContractService.service, {
    ReadData: async (call, callback) => {
        try {
            const car = call.request.car
            const status = call.request.status

            const org = status === "bank" ? "org2" : "org1"

            var db = await ReadData(org, status, "db")
            var carFine = []

            var dbParse

            try {
                dbParse = JSON.parse(JSON.parse(db))
            } catch {
                dbParse = JSON.parse(db)
            }

            if (dbParse.allPenalty.length !== undefined) {
                carFine = dbParse.allPenalty.filter(penalty => penalty.car === car);
            }

            const userResponse = {
                userData: JSON.stringify(carFine)
            };

            callback(null, userResponse);
        } catch (err) {
            callback({
                message: `Failed read data: ${err}`,
                status: grpc.status.NOT_FOUND
            });
        }
    },

    SendFine: async (call, callback) => {
        try {
            const car = call.request.car
            const price = call.request.price
            const reason = call.request.reason
            const date = call.request.date
            const status = call.request.status

            if (status === "driver") {
                throw new Error("Permission denied")
            }
            const org = status === "bank" ? "org2" : "org1"

            var db = await ReadData(org, status, "db")
            console.log("db: ", db)
            try {
                db = JSON.parse(JSON.parse(db))
            } catch {
                db = JSON.parse(db)
            }
            console.log("dbPars: ", db)

            var newFine = {
                id: Math.round(Math.random() * Date.now()),
                car: car,
                price: price,
                reason: reason,
                date: date
            }

            db.allPenalty.push(newFine)

            result = await WriteData(org, status, "db", JSON.stringify(db))

            const resultResponse = {
                result: true
            }

            callback(null, resultResponse)
        } catch (err) {
            callback({
                message: `Failed send fine: ${err}`,
                status: grpc.status.NOT_FOUND
            });
        }
    },

    BalanceOf: async (call, callback) => {
        try {
            const id = call.request.id
            const status = call.request.status

            const org = status === "bank" ? "org2" : "org1"
            const result = await GetBalance(org, status, id)

            const balanceResponse = {
                balance: result
            }

            callback(null, balanceResponse)
        } catch (err) {
            callback({
                message: `Failed get balance: ${err}`,
                status: grpc.status.NOT_FOUND
            });
        }
    },

    Mint: async (call, callback) => {
        try {
            const minter = call.request.minter
            const amount = call.request.amount
            const status = call.request.status

            if (status !== "bank") {
                throw new Error("Permission denied")
            }

            const result = await MintToken("org2", status, minter, amount)

            var resultResponse = {
                result: result
            }

            callback(null, resultResponse)
        } catch (err) {
            callback({
                message: `Failed mint toke: ${err}`,
                status: grpc.status.NOT_FOUND
            });
        }
    },

    Transfer: async (call, callback) => {
        try {
            const idFine = call.request.idFine
            const from = call.request.from
            const status = call.request.status

            var db = await ReadData("org1", status, "db")

            console.log("db: ", db)

            try {
                db = JSON.parse(JSON.parse(db))
            } catch {
                db = JSON.parse(db)
            }

            console.log("dbPars: ", db)


            carFine = db.allPenalty.filter(penalty => penalty.id === Number(idFine))[0];
            const result = await TransferToken("org1", status, from, "bank", String(carFine.price))
            console.log("dbPars: ", carFine)

            db.allPenalty = db.allPenalty.filter(penalty => penalty.id !== Number(idFine));
            console.log("db: ", db)
            var resultWrite = await WriteData("org1", status, "db", JSON.stringify(db))

            var resultResponse = {
                result: result
            }

            callback(null, resultResponse)
        } catch (err) {
            callback({
                message: `Failed transfer: ${err}`,
                status: grpc.status.NOT_FOUND
            });
        }
    },
});

server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), () => {
    console.log("gRPC-server started on port 50051");
});