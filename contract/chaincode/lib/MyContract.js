'use strict'

const { Contract } = require("fabric-contract-api")
const MyToken = require("./MyToken")

class MyContract extends Contract {
    async InitLedger(ctx) {
        const users = [
            {
                id: "db",
                name: "database",
                status: "database",
                allPenalty: []
            },
            {
                id: "bank",
                name: "Bank",
                status: "bank"
            }
        ]

        for (const user of users) {
            await ctx.stub.putState(user.id, Buffer.from(JSON.stringify(user)))
        }

        const token = new MyToken();
        await token.Initialize(ctx, "BlockCoin", "BLOCK", "18", users)
    }

    async WriteData(ctx, id, value) {
        try {
            value = JSON.stringify(value)
        } catch {
            value = value.toString()
        }

        await ctx.stub.putState(id, Buffer.from(value))
    }

    async ReadData(ctx, id) {
        const result = await ctx.stub.getState(id)
        return result.toString()
    }
}

module.exports = MyContract