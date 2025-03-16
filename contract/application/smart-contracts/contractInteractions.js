const FabricCAServices = require("fabric-ca-client")
const { Wallets, Gateway } = require("fabric-network")
const { buildCCPOrg1, buildCCPOrg2, buildWallet } = require("../utils/AppUtil")
const { buildCAClient, enrollAdmin, registerAndEnrollUser } = require("../utils/CAUtil")
const path = require("path")

const channelName = "blockchain"
const chaincodeName = "MyChaincode"
const MyContractName = "MyContract"
const MyToken = "MyToken"
const orgMspIds = {
    "org1": "Org1MSP",
    "org2": "Org2MSP",
}

function buildCCP(org) {
    return org === "org1" ? buildCCPOrg1() : buildCCPOrg2();
}

function buildWalletPath(org) {
    return path.join(process.cwd(), `wallet/${org}`)
}

async function registerAdmin(org) {
    const ccp = buildCCP(org)
    const caClient = buildCAClient(FabricCAServices, ccp, `ca.${org}.example.com`)
    const wallet = await buildWallet(Wallets, buildWalletPath(org))
    await enrollAdmin(caClient, wallet, orgMspIds[org])
}

async function registerUser(org, userID) {
    const ccp = buildCCP(org)
    const caClient = buildCAClient(FabricCAServices, ccp, `ca.${org}.example.com`)
    const wallet = await buildWallet(Wallets, buildWalletPath(org))
    await registerAndEnrollUser(caClient, wallet, orgMspIds[org], userID, `${org}.department1`)
}

async function getGateway(org, userID) {
    try {
        const ccp = buildCCP(org)
        const wallet = await buildWallet(Wallets, buildWalletPath(org))

        const identity = await wallet.get(userID)
        if (!identity) {
            throw new Error(`User ${userID} is not enrolled. Please enroll the user before retrying`)
        }

        const gatewat = new Gateway()
        await gatewat.connect(ccp, {
            wallet, identity: userID, discovery: { asLocalhost: true, enabled: true }
        })

        return gatewat
    } catch (e) {
        console.error(`Failed to connect: ${e.message}`)
        throw new Error(e)
    }
}

async function getContract(gatewat, contractName) {
    try {
        const network = await gatewat.getNetwork(channelName)
        const contract = network.getContract(chaincodeName, contractName)
        return contract
    } catch (e) {
        console.error(`Failed to get contract ${e}`)
        throw new Error(e)
    }
}

async function postFunc(contractName, org, userID, func, args) {
    try {
        const gatewat = await getGateway(org, userID)
        const contract = await getContract(gatewat, contractName)
        const result = await contract.submitTransaction(func, ...args)
        gatewat.disconnect()
        return result.toString()
    } catch (e) {
        console.error(`Failed to submit transaction: ${e}`)
        throw new Error(e)
    }
}

async function getFunc(contractName, org, userID, func, args) {
    try {
        const gatewat = await getGateway(org, userID)
        const contract = await getContract(gatewat, contractName)
        const result = await contract.evaluateTransaction(func, ...args)
        gatewat.disconnect()
        return result.toString()
    } catch (e) {
        console.error(`Failed to evaluate transaction: ${e}`)
        throw new Error(e)
    }
}

async function ReadData(org, userID, id) {
    return await getFunc(MyContractName, org, userID, "ReadData", [id])
}

async function WriteData(org, userID, id, value) {
    return await postFunc(MyContractName, org, userID, "WriteData", [id, value])
}

async function GetBalance(org, userID, id) {
    return await getFunc(MyToken, org, userID, "BalanceOf", [id])
}

async function MintToken(org, userID, id, amount) {
    return await postFunc(MyToken, org, userID, "Mint", [id, amount])
}

async function TransferToken(org, userID, id, toID, amount) {
    return await postFunc(MyToken, org, userID, "Transfer", [id, toID, amount])
}

module.exports = {
    ReadData,
    WriteData,
    GetBalance,
    MintToken,
    TransferToken,
    registerAdmin,
    registerUser
}