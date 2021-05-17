import { TransactionItem } from "./transaction-item";
import { User } from "./user";

export class Transaction {
    id?: number;
    purchaser?: User;
    trackingNumber?: string;
    transactionCreated?: Date;
    sumTotal?: number;
    transactionItems?: TransactionItem[] = [];
    status?: string;

    constructor(sumTotal: number, transactionItems: TransactionItem[]){
        this.sumTotal = sumTotal;
        this.transactionItems = transactionItems;
    }
}
