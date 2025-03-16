'use strict'

const TokenERC20Contract = require("./tokenERC20");

const balancePrefix = 'balance';
const totalSupplyKey = 'totalSupply';


class MyToken extends TokenERC20Contract {
    async Initialize(ctx, name, symbol, decimals, users) {
        await super.Initialize(ctx, name, symbol, decimals)

        let totalSupply = 0;
        for (const user of users) {
            const balanceKey = ctx.stub.createCompositeKey(balancePrefix, [user.id])
            var balance
            if (user.status === "bank") {
                balance = 1000
            } else if (user.status !== "database") {
                balance = 50
            } else {
                continue
            }
            await ctx.stub.putState(balanceKey, Buffer.from(balance.toString()))
            totalSupply += balance;
        }
        await ctx.stub.putState(totalSupplyKey, Buffer.from(totalSupply.toString()))
    }

    async BalanceOf(ctx, owner) {
        await this.CheckInitialized(ctx);

        const balanceKey = ctx.stub.createCompositeKey(balancePrefix, [owner]);

        const balanceBytes = await ctx.stub.getState(balanceKey);
        if (!balanceBytes || balanceBytes.length === 0) {
            throw new Error(`the account ${owner} does not exist`);
        }
        const balance = parseInt(balanceBytes.toString());

        return balance;
    }

    async Transfer(ctx, from, to, value) {
        await this.CheckInitialized(ctx);

        const transferResp = await this._transfer(ctx, from, to, value);
        if (!transferResp) {
            throw new Error('Failed to transfer');
        }

        const transferEvent = { from, to, value: parseInt(value) };
        ctx.stub.setEvent('Transfer', Buffer.from(JSON.stringify(transferEvent)));

        return true;
    }

    async Mint(ctx, minter, amount) {
        await this.CheckInitialized(ctx);

        const amountInt = parseInt(amount);
        if (amountInt <= 0) {
            throw new Error('mint amount must be a positive integer');
        }

        const balanceKey = ctx.stub.createCompositeKey(balancePrefix, [minter]);

        const currentBalanceBytes = await ctx.stub.getState(balanceKey);
        let currentBalance;
        if (!currentBalanceBytes || currentBalanceBytes.length === 0) {
            currentBalance = 0;
        } else {
            currentBalance = parseInt(currentBalanceBytes.toString());
        }
        const updatedBalance = this.add(currentBalance, amountInt);
        const asd =
            await ctx.stub.putState(balanceKey, Buffer.from(updatedBalance.toString()));

        const totalSupplyBytes = await ctx.stub.getState(totalSupplyKey);
        let totalSupply;
        if (!totalSupplyBytes || totalSupplyBytes.length === 0) {
            console.log('Initialize the tokenSupply');
            totalSupply = 0;
        } else {
            totalSupply = parseInt(totalSupplyBytes.toString());
        }
        totalSupply = this.add(totalSupply, amountInt);
        await ctx.stub.putState(totalSupplyKey, Buffer.from(totalSupply.toString()));

        const transferEvent = { from: '0x0', to: minter, value: amountInt };
        ctx.stub.setEvent('Transfer', Buffer.from(JSON.stringify(transferEvent)));

        console.log(`minter account ${minter} balance updated from ${currentBalance} to ${updatedBalance}`);
        return true;
    }
}

module.exports = MyToken