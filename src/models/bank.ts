import Account from "./account";
import { InvestmentTypes } from "./enums/accountTypes";

export default class Bank {
    private name: string;
    private accounts: Account[];
    private withdrawalLimits: Map<InvestmentTypes, number>;

    public constructor(
        name: string,
        accounts: Account[],
        withdrawalLimits: Map<InvestmentTypes, number>
    ) {
        this.name = name;
        this.accounts = accounts;
        this.withdrawalLimits = withdrawalLimits;
    }

    public getName(): string {
        return this.name;
    }

    public getAccounts(): Account[] {
        return this.accounts;
    }

    public getWithdrawalLimits(): Map<InvestmentTypes, number> {
        return this.withdrawalLimits;
    }

    public getWithdrawalLimitByAccountType(
        investmentType: InvestmentTypes
    ): number {
        return this.withdrawalLimits.get(investmentType);
    }

    public getAccountByOwner(owner: string): Account {
        return this.accounts.find((account) => account.getOwner() === owner);
    }
}
