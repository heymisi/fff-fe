import { Product } from "./product";

export class CartItem {

    id?: string;
    name?: string;
    unitPrice?: number;
    quantity?: number;

    constructor(product: Product){
        this.id = product.id;
        this.name = product.name;
        this.unitPrice = product.price;
        this.quantity = 1;
    }
}
