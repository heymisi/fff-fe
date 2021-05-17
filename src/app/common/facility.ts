import { Address } from "./address";
import { CommentEntity } from "./comment-entity";
import { ContactData } from "./contact-data";
import { FacilityPricing } from "./facility-pricing";
import { Instructor } from "./instructor";
import { OpeningHours } from "./opening-hours";
import { Rating } from "./rating";
import { Sport } from "./sport";

export class Facility {
    id?: string;
    name?: string;
    description?: string;
    address?: Address;
    openingHours?: OpeningHours[];
    contactData?: ContactData;
    availableSports?: Sport[];
    comments?: CommentEntity[];
    instructors?: Instructor[];
    pricing?: FacilityPricing[];
    image?: File;
    isOpenNow?: Boolean = false;
    rating?: Rating;
    profileImageString?: String;
    mapImageString?: String;

}
