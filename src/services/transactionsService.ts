import Account from "../models/account";
import Bank from "../models/bank";
import { TransactionTypes } from "../models/enums/transactionTypes";
import Transaction from "../models/transaction";

export const deposit = (
    depositAmount: number,
    description: string,
    account: Account
): number => {
    if (depositAmount <= 0) {
        throw new Error("Deposit value must be positive");
    }

    account.setBalance(account.getBalance() + depositAmount);

    account.addNewTransaction(
        new Transaction(TransactionTypes.Deposit, depositAmount, description)
    );

    return account.getBalance();
};

export const withdrawal = (
    withdrawalAmount: number,
    description: string,
    account: Account,
    bank: Bank
): number => {
    if (withdrawalAmount <= 0) {
        throw new Error("Withdrawal value must be positive");
    }

    if (withdrawalAmount > account.getBalance()) {
        throw new Error("Account does not have enough money for withdrawal");
    }

    const withdrawalLimit = bank.getWithdrawalLimitByAccountType(
        account.getInvestmentType()
    );

    if (
        withdrawalLimit &&
        withdrawalAmount + account.getWithdrawalForDay() > withdrawalLimit
    ) {
        throw new Error("Account has reached its limit for daily withdrawals");
    }

    account.setBalance(account.getBalance() - withdrawalAmount);

    if (withdrawalLimit) {
        account.setWithdrawalForDay(
            account.getWithdrawalForDay() + withdrawalAmount
        );
    }

    account.addNewTransaction(
        new Transaction(
            TransactionTypes.Withdrawal,
            withdrawalAmount,
            description
        )
    );

    return account.getBalance();
};

export const transfer = (
    transferAmount: number,
    accountFrom: Account,
    bankFrom: Bank,
    accountTo: Account
): boolean => {
    // TODO: Ask product owners if transfers count as withdrawals
    // Should daily withdrawal limits affect this transaction?
    withdrawal(
        transferAmount,
        `Transfer to ${accountTo.getOwner()}`,
        accountFrom,
        bankFrom
    );

    deposit(
        transferAmount,
        `Transfer from ${accountFrom.getOwner()}`,
        accountTo
    );

    return true;
};
