import { Address } from "./address";
import { Cart } from "./cart";
import { ContactData } from "./contact-data";
import { Role } from "./role";
import { Transaction } from "./transaction";

export class User {
    id?: string;
    firstName?: string;
    lastName?: string;
    emailVerificationToken?: string;
    emailVerificationStatus?: boolean;
    password?: string;
    roles?: Role[];
    transactions?: Transaction[];
    shippingAddress?: Address;
    billingAddress?: Address;
    contactData?: ContactData;
    created?: Date;
    cart?: Cart;
}
