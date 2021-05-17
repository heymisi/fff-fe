import { CartItem } from "./cart-item";
import { CommentEntity } from "./comment-entity";
import { Image } from "./image";
import { ProductCategory } from "./product-category";
import { Rating } from "./rating";
import { Sport } from "./sport";
import { Transaction } from "./transaction";
import { TransactionItem } from "./transaction-item";

export class Product {
    id?: string;
    name?: string;
    price?: number;
    dateCreated?: Date;
    lastUpdated?: Date;
    unitsInStock?: number;
    description?: string;
    category?: ProductCategory;
    rating?: Rating;
    image?: Image;
    sportType?: Sport;
    transactionItems?: TransactionItem[];
    comments?: CommentEntity[];
    imageString?: String;
}
