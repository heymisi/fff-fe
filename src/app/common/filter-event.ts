import { ProductCategory } from "./product-category";
import { Sport } from "./sport";

export class FilterEvent {
    categoryFilter?: ProductCategory;
    sportFilter?: Sport;
    priceMin?: number;
    priceMax?: number;

    constructor(category: ProductCategory, sport: Sport,  priceMin: number,priceMax: number){
        this.sportFilter = sport;
        this.categoryFilter = category;
        this.priceMin = priceMin;
        this.priceMax = priceMax;
    }
}
