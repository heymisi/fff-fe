export class TransactionItemRequestModel {
    shopItemId: number;
    quantity: number;
    price: number;

    constructor(shopItemId: number,
        quantity: number,
        price: number) {
        this.shopItemId = shopItemId;
        this.quantity = quantity;
        this.price = price;
    }
}
