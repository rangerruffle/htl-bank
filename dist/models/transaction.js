"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transactionTypes_1 = require("./enums/transactionTypes");
class Transaction {
    constructor(transactionType, amount, description) {
        this.transactionType = transactionType;
        this.amount = amount;
        this.description = description;
    }
    getTransactionType() {
        return this.transactionType;
    }
    getAmount() {
        return this.transactionType === transactionTypes_1.TransactionTypes.Deposit
            ? this.amount
            : -1 * this.amount;
    }
    getDescription() {
        return this.description;
    }
}
exports.default = Transaction;
//# sourceMappingURL=transaction.js.map