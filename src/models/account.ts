import sum from "lodash/sum";
import { AccountTypes, InvestmentTypes } from "./enums/accountTypes";
import Transaction from "./transaction";

export default class Account {
    private owner: string;
    private balance: number;
    private accountType: AccountTypes;
    private investmentType: InvestmentTypes;
    private withdrawalForDay: number;
    private transactions: Transaction[];

    public constructor(
        owner: string,
        balance: number,
        accountType: AccountTypes,
        transactions: Transaction[],
        investmentType?: InvestmentTypes
    ) {
        this.owner = owner;
        this.balance = balance;
        this.accountType = accountType;
        this.investmentType = investmentType;
        this.transactions = transactions;
        this.withdrawalForDay = 0;
    }

    public getOwner(): string {
        return this.owner;
    }

    public getBalance(): number {
        return this.balance;
    }

    public setBalance(balance: number): void {
        this.balance = balance;
    }

    public getAccountType(): AccountTypes {
        return this.accountType;
    }

    public getInvestmentType(): InvestmentTypes {
        return this.investmentType;
    }

    public getTransactions(): Transaction[] {
        return this.transactions;
    }

    public addNewTransaction(transaction: Transaction): void {
        this.transactions.push(transaction);
    }

    public getWithdrawalForDay(): number {
        return this.withdrawalForDay;
    }

    public setWithdrawalForDay(withdrawalAmount: number): void {
        this.withdrawalForDay = withdrawalAmount;
    }

    public isAccountBalanced(): boolean {
        return (
            sum(
                this.transactions.map((transaction: Transaction): number =>
                    transaction.getAmount()
                )
            ) === this.balance
        );
    }
}
