import { CartItem } from "./cart-item";
import { Product } from "./product";
import { Transaction } from "./transaction";

export class TransactionItem {
    id?: number;
    shopItem?: Product;
    quantity?: number;
    price?: number;
}
