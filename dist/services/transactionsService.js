"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transfer = exports.withdrawal = exports.deposit = void 0;
const transactionTypes_1 = require("../models/enums/transactionTypes");
const transaction_1 = __importDefault(require("../models/transaction"));
const deposit = (depositAmount, description, account) => {
    if (depositAmount <= 0) {
        throw new Error("Deposit value must be positive");
    }
    account.setBalance(account.getBalance() + depositAmount);
    account.addNewTransaction(new transaction_1.default(transactionTypes_1.TransactionTypes.Deposit, depositAmount, description));
    return account.getBalance();
};
exports.deposit = deposit;
const withdrawal = (withdrawalAmount, description, account, bank) => {
    if (withdrawalAmount <= 0) {
        throw new Error("Withdrawal value must be positive");
    }
    if (withdrawalAmount > account.getBalance()) {
        throw new Error("Account does not have enough money for withdrawal");
    }
    const withdrawalLimit = bank.getWithdrawalLimitByAccountType(account.getInvestmentType());
    if (withdrawalLimit &&
        withdrawalAmount + account.getWithdrawalForDay() > withdrawalLimit) {
        throw new Error("Account has reached its limit for daily withdrawals");
    }
    account.setBalance(account.getBalance() - withdrawalAmount);
    if (withdrawalLimit) {
        account.setWithdrawalForDay(account.getWithdrawalForDay() + withdrawalAmount);
    }
    account.addNewTransaction(new transaction_1.default(transactionTypes_1.TransactionTypes.Withdrawal, withdrawalAmount, description));
    return account.getBalance();
};
exports.withdrawal = withdrawal;
const transfer = (transferAmount, accountFrom, bankFrom, accountTo) => {
    // TODO: Ask product owners if transfers count as withdrawals
    // Should daily withdrawal limits affect this transaction?
    (0, exports.withdrawal)(transferAmount, `Transfer to ${accountTo.getOwner()}`, accountFrom, bankFrom);
    (0, exports.deposit)(transferAmount, `Transfer from ${accountFrom.getOwner()}`, accountTo);
    return true;
};
exports.transfer = transfer;
//# sourceMappingURL=transactionsService.js.map