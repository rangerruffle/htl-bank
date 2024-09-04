import Bank from '../src/models/bank';
import Account from '../src/models/account';
import {
    AccountTypes,
    InvestmentTypes,
} from '../src/models/enums/accountTypes';
import { TransactionTypes } from '../src/models/enums/transactionTypes';
import {
    deposit,
    withdrawal,
    transfer,
} from '../src/services/transactionsService';
import Transaction from '../src/models/transaction';

describe('Transaction Service tests', () => {
    let testBank1: Bank;
    let testBank2: Bank;

    beforeEach(() => {
        testBank1 = new Bank(
            'HTL Bank',
            [
                new Account(
                    'Russ',
                    6500,
                    AccountTypes.Investment,
                    [
                        new Transaction(
                            TransactionTypes.Deposit,
                            6500,
                            'Initial deposit'
                        ),
                    ],
                    InvestmentTypes.Individual
                ),
                new Account('Struggling', -100, AccountTypes.Checking, [
                    new Transaction(
                        TransactionTypes.Deposit,
                        600,
                        'Initial deposit'
                    ),
                    new Transaction(
                        TransactionTypes.Withdrawal,
                        300,
                        'Living expenses'
                    ),
                    new Transaction(
                        TransactionTypes.Withdrawal,
                        400,
                        'Large withdrawal'
                    ),
                ]),
                new Account(
                    'HTL',
                    1000000,
                    AccountTypes.Investment,
                    [
                        new Transaction(
                            TransactionTypes.Deposit,
                            50000,
                            'Startup money'
                        ),
                        new Transaction(
                            TransactionTypes.Withdrawal,
                            25000,
                            'Office remodel'
                        ),
                        new Transaction(
                            TransactionTypes.Withdrawal,
                            10000,
                            'Developer signing bonus'
                        ),
                        new Transaction(
                            TransactionTypes.Deposit,
                            1000000,
                            'Massive profits'
                        ),
                        new Transaction(
                            TransactionTypes.Withdrawal,
                            15000,
                            'Developer paycheck'
                        ),
                    ],
                    InvestmentTypes.Corporate
                ),
            ],
            new Map<InvestmentTypes, number>([
                [InvestmentTypes.Individual, 500],
            ])
        );

        testBank2 = new Bank(
            'Openlane Bank',
            [
                new Account(
                    'Scott',
                    1500,
                    AccountTypes.Investment,
                    [
                        new Transaction(
                            TransactionTypes.Deposit,
                            1000,
                            'Initial deposit'
                        ),
                        new Transaction(
                            TransactionTypes.Deposit,
                            500,
                            'Pay check'
                        ),
                    ],
                    InvestmentTypes.Individual
                ),
                new Account(
                    'Openlane',
                    200000000,
                    AccountTypes.Investment,
                    [
                        new Transaction(
                            TransactionTypes.Deposit,
                            200000000,
                            'Changed banks'
                        ),
                    ],
                    InvestmentTypes.Corporate
                ),
            ],
            new Map<InvestmentTypes, number>([
                [InvestmentTypes.Individual, 300],
                [InvestmentTypes.Corporate, 20000],
            ])
        );
    });

    describe('Deposit tests', () => {
        test('Regular deposit', () => {
            const account = testBank1.getAccountByOwner('Russ');

            const newBalance = deposit(100, 'Pay check', account);

            expect(newBalance).toBe(account.getBalance());
            expect(account.getBalance()).toBe(6600);
            expect(account.isAccountBalanced()).toBeTruthy();
            expect(account.getTransactions().length).toBe(2);
            expect(account.getTransactions()[1].getAmount()).toBe(100);
            expect(account.getTransactions()[1].getTransactionType()).toBe(
                TransactionTypes.Deposit
            );
            expect(account.getTransactions()[1].getDescription()).toBe(
                'Pay check'
            );
        });

        test('Negative to positive', () => {
            const account = testBank1.getAccountByOwner('Struggling');

            const newBalance = deposit(200, 'Got paid', account);

            expect(newBalance).toBe(account.getBalance());
            expect(account.getBalance()).toBe(100);
            expect(account.isAccountBalanced()).toBeTruthy();
            expect(account.getTransactions().length).toBe(4);
            expect(account.getTransactions()[3].getAmount()).toBe(200);
            expect(account.getTransactions()[3].getTransactionType()).toBe(
                TransactionTypes.Deposit
            );
            expect(account.getTransactions()[3].getDescription()).toBe(
                'Got paid'
            );
        });

        test('Negative deposit', () => {
            const account = testBank1.getAccountByOwner('Russ');

            expect(() => {
                deposit(-100, 'Pay check', account);
            }).toThrow(Error);
            expect(() => {
                deposit(-100, 'Pay check', account);
            }).toThrow('Deposit value must be positive');
        });
    });

    describe('Withdrawal tests', () => {
        test('Regular withdrawal', () => {
            const account = testBank1.getAccountByOwner('Russ');

            const newBalance = withdrawal(100, 'Groceries', account, testBank1);

            expect(newBalance).toBe(account.getBalance());
            expect(account.getBalance()).toBe(6400);
            expect(account.getWithdrawalForDay()).toBe(100);
            expect(account.isAccountBalanced()).toBeTruthy();
            expect(account.getTransactions().length).toBe(2);
            expect(account.getTransactions()[1].getAmount()).toBe(-100);
            expect(account.getTransactions()[1].getTransactionType()).toBe(
                TransactionTypes.Withdrawal
            );
            expect(account.getTransactions()[1].getDescription()).toBe(
                'Groceries'
            );
        });

        test('No withdrawal limit', () => {
            const account = testBank1.getAccountByOwner('HTL');

            const newBalance = withdrawal(
                500,
                'Paying employee',
                account,
                testBank1
            );

            expect(newBalance).toBe(account.getBalance());
            expect(account.getBalance()).toBe(999500);
            expect(account.getWithdrawalForDay()).toBe(0);
            expect(account.isAccountBalanced()).toBeTruthy();
            expect(account.getTransactions().length).toBe(6);
            expect(account.getTransactions()[5].getAmount()).toBe(-500);
            expect(account.getTransactions()[5].getTransactionType()).toBe(
                TransactionTypes.Withdrawal
            );
            expect(account.getTransactions()[5].getDescription()).toBe(
                'Paying employee'
            );

            const newBalance2 = withdrawal(
                501,
                'Paying employee again',
                account,
                testBank1
            );

            expect(newBalance2).toBe(account.getBalance());
            expect(account.getBalance()).toBe(998999);
            expect(account.getWithdrawalForDay()).toBe(0);
            expect(account.isAccountBalanced()).toBeTruthy();
            expect(account.getTransactions().length).toBe(7);
            expect(account.getTransactions()[6].getAmount()).toBe(-501);
            expect(account.getTransactions()[6].getTransactionType()).toBe(
                TransactionTypes.Withdrawal
            );
            expect(account.getTransactions()[6].getDescription()).toBe(
                'Paying employee again'
            );
        });

        test('Withdrawal limit hit', () => {
            const account = testBank1.getAccountByOwner('Russ');

            const newBalance = withdrawal(100, 'Groceries', account, testBank1);

            expect(newBalance).toBe(account.getBalance());
            expect(account.getBalance()).toBe(6400);
            expect(account.getWithdrawalForDay()).toBe(100);
            expect(account.isAccountBalanced()).toBeTruthy();
            expect(account.getTransactions().length).toBe(2);
            expect(account.getTransactions()[1].getAmount()).toBe(-100);
            expect(account.getTransactions()[1].getTransactionType()).toBe(
                TransactionTypes.Withdrawal
            );
            expect(account.getTransactions()[1].getDescription()).toBe(
                'Groceries'
            );

            const newBalance2 = withdrawal(
                400,
                'Car Payment',
                account,
                testBank1
            );

            expect(newBalance2).toBe(account.getBalance());
            expect(account.getBalance()).toBe(6000);
            expect(account.getWithdrawalForDay()).toBe(500);
            expect(account.isAccountBalanced()).toBeTruthy();
            expect(account.getTransactions().length).toBe(3);
            expect(account.getTransactions()[2].getAmount()).toBe(-400);
            expect(account.getTransactions()[2].getTransactionType()).toBe(
                TransactionTypes.Withdrawal
            );
            expect(account.getTransactions()[2].getDescription()).toBe(
                'Car Payment'
            );

            expect(() => {
                withdrawal(100, 'Too many withdrawals', account, testBank1);
            }).toThrow(Error);
            expect(() => {
                withdrawal(100, 'Too many withdrawals', account, testBank1);
            }).toThrow('Account has reached its limit for daily withdrawals');
        });

        test('Withdrawal amount is more than money in account', () => {
            const account = testBank1.getAccountByOwner('Russ');

            expect(() => {
                withdrawal(6600, 'Emptying account', account, testBank1);
            }).toThrow(Error);
            expect(() => {
                withdrawal(6600, 'Emptying account', account, testBank1);
            }).toThrow('Account does not have enough money for withdrawal');
        });

        test('Withdrawing from account with negative balance', () => {
            const account = testBank1.getAccountByOwner('Struggling');

            expect(() => {
                withdrawal(100, 'Emptying account', account, testBank1);
            }).toThrow(Error);
            expect(() => {
                withdrawal(100, 'Emptying account', account, testBank1);
            }).toThrow('Account does not have enough money for withdrawal');
        });

        test('Negative withdrawal', () => {
            const account = testBank1.getAccountByOwner('Russ');

            expect(() => {
                withdrawal(-200, 'Emptying account', account, testBank1);
            }).toThrow(Error);
            expect(() => {
                withdrawal(-200, 'Emptying account', account, testBank1);
            }).toThrow('Withdrawal value must be positive');
        });
    });

    describe('Transfer tests', () => {
        test('Regular transfer', () => {
            const accountFrom = testBank1.getAccountByOwner('HTL');
            const accountTo = testBank2.getAccountByOwner('Openlane');

            const success = transfer(25000, accountFrom, testBank1, accountTo);

            expect(success).toBeTruthy();

            expect(accountFrom.getBalance()).toBe(975000);
            expect(accountFrom.getWithdrawalForDay()).toBe(0);
            expect(accountFrom.isAccountBalanced()).toBeTruthy();
            expect(accountFrom.getTransactions().length).toBe(6);
            expect(accountFrom.getTransactions()[5].getAmount()).toBe(-25000);
            expect(accountFrom.getTransactions()[5].getTransactionType()).toBe(
                TransactionTypes.Withdrawal
            );
            expect(accountFrom.getTransactions()[5].getDescription()).toBe(
                'Transfer to Openlane'
            );

            expect(accountTo.getBalance()).toBe(200025000);
            expect(accountTo.isAccountBalanced()).toBeTruthy();
            expect(accountTo.getTransactions().length).toBe(2);
            expect(accountTo.getTransactions()[1].getAmount()).toBe(25000);
            expect(accountTo.getTransactions()[1].getTransactionType()).toBe(
                TransactionTypes.Deposit
            );
            expect(accountTo.getTransactions()[1].getDescription()).toBe(
                'Transfer from HTL'
            );
        });

        test('Too large of a transfer', () => {
            const accountFrom = testBank1.getAccountByOwner('Russ');
            const accountTo = testBank2.getAccountByOwner('Scott');

            expect(() => {
                transfer(600, accountFrom, testBank1, accountTo);
            }).toThrow(Error);
            expect(() => {
                transfer(600, accountFrom, testBank1, accountTo);
            }).toThrow('Account has reached its limit for daily withdrawals');
        });

        test('Too large of a transfer for second bank', () => {
            const accountFrom = testBank2.getAccountByOwner('Scott');
            const accountTo = testBank1.getAccountByOwner('Russ');

            expect(() => {
                transfer(400, accountFrom, testBank2, accountTo);
            }).toThrow(Error);
            expect(() => {
                transfer(400, accountFrom, testBank2, accountTo);
            }).toThrow('Account has reached its limit for daily withdrawals');
        });

        test('Too large of a corporate transfer', () => {
            const accountFrom = testBank2.getAccountByOwner('Openlane');
            const accountTo = testBank1.getAccountByOwner('HTL');

            expect(() => {
                transfer(25000, accountFrom, testBank2, accountTo);
            }).toThrow(Error);
            expect(() => {
                transfer(25000, accountFrom, testBank2, accountTo);
            }).toThrow('Account has reached its limit for daily withdrawals');
        });

        test('Account has too few funds', () => {
            const accountFrom = testBank1.getAccountByOwner('Struggling');
            const accountTo = testBank2.getAccountByOwner('Scott');

            expect(() => {
                transfer(600, accountFrom, testBank1, accountTo);
            }).toThrow(Error);
            expect(() => {
                transfer(600, accountFrom, testBank1, accountTo);
            }).toThrow('Account does not have enough money for withdrawal');
        });

        test('Negative transfer amount', () => {
            const accountFrom = testBank1.getAccountByOwner('Russ');
            const accountTo = testBank2.getAccountByOwner('Scott');

            expect(() => {
                transfer(-600, accountFrom, testBank1, accountTo);
            }).toThrow(Error);
            expect(() => {
                transfer(-600, accountFrom, testBank1, accountTo);
            }).toThrow('Withdrawal value must be positive');
        });
    });
});
