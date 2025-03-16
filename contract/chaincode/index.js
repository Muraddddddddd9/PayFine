'use strict'

const MyContract = require("./lib/MyContract")
const MyToken = require("./lib/MyToken")

module.exports.MyContract = MyContract
module.exports.MyToken = MyToken
module.exports.contracts = [MyContract, MyToken] 