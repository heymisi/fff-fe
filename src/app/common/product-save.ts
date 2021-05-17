import { ProductCategory } from "./product-category";
import { Sport } from "./sport";

export class ProductSave {
    name?: string;
    price?: number;
    unitsInStock?: number;
    description?: string;
    category?: ProductCategory;
    sportType?: Sport;
    file?: FormData;
}
