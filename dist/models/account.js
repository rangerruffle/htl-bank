"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sum_1 = __importDefault(require("lodash/sum"));
class Account {
    constructor(owner, balance, accountType, transactions, investmentType) {
        this.owner = owner;
        this.balance = balance;
        this.accountType = accountType;
        this.investmentType = investmentType;
        this.transactions = transactions;
        this.withdrawalForDay = 0;
    }
    getOwner() {
        return this.owner;
    }
    getBalance() {
        return this.balance;
    }
    setBalance(balance) {
        this.balance = balance;
    }
    getAccountType() {
        return this.accountType;
    }
    getInvestmentType() {
        return this.investmentType;
    }
    getTransactions() {
        return this.transactions;
    }
    addNewTransaction(transaction) {
        this.transactions.push(transaction);
    }
    getWithdrawalForDay() {
        return this.withdrawalForDay;
    }
    setWithdrawalForDay(withdrawalAmount) {
        this.withdrawalForDay = withdrawalAmount;
    }
    isAccountBalanced() {
        return ((0, sum_1.default)(this.transactions.map((transaction) => transaction.getAmount())) === this.balance);
    }
}
exports.default = Account;
//# sourceMappingURL=account.js.map