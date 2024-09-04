"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Bank {
    constructor(name, accounts, withdrawalLimits) {
        this.name = name;
        this.accounts = accounts;
        this.withdrawalLimits = withdrawalLimits;
    }
    getName() {
        return this.name;
    }
    getAccounts() {
        return this.accounts;
    }
    getWithdrawalLimits() {
        return this.withdrawalLimits;
    }
    getWithdrawalLimitByAccountType(investmentType) {
        return this.withdrawalLimits.get(investmentType);
    }
    getAccountByOwner(owner) {
        return this.accounts.find((account) => account.getOwner() === owner);
    }
}
exports.default = Bank;
//# sourceMappingURL=bank.js.map