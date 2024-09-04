import { TransactionTypes } from './enums/transactionTypes';

export default class Transaction {
    private transactionType: TransactionTypes;
    private amount: number;
    private description: string;

    public constructor(
        transactionType: TransactionTypes,
        amount: number,
        description: string
    ) {
        this.transactionType = transactionType;
        this.amount = amount;
        this.description = description;
    }

    public getTransactionType(): TransactionTypes {
        return this.transactionType;
    }

    public getAmount(): number {
        return this.transactionType == TransactionTypes.Deposit
            ? this.amount
            : -1 * this.amount;
    }

    public getDescription(): string {
        return this.description;
    }
}
