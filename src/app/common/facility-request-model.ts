import { FacilityPricing } from "./facility-pricing";
import { Image } from "./image";
import { OpeningHours } from "./opening-hours";
import { Sport } from "./sport";

export class FacilityRequestModel {
    name: String;
    email: String;
    mobile: String;
    city: String;
    street: String;
    openingHours: OpeningHours[];
    availableSports: Sport[];
    instructors: Number[];
    pricing: FacilityPricing[];
    description: String;
    profileImage: Image;
    mapImage: Image;

    constructor(name: String,
        email: String,
        mobile: String,
        city: String,
        street: String,
        openingHours: OpeningHours[],
        availableSports: Sport[],
        instructors: Number[],
        pricing: FacilityPricing[],
        description: String,
        profileImage: Image,
        mapImage: Image){
            this.name = name;
            this.email = email;
            this.mobile = mobile;
            this.city = city;
            this.street = street;
            this.openingHours = openingHours;
            this.availableSports = availableSports;
            this.instructors = instructors;
            this.pricing = pricing;
            this.description = description;
            this.profileImage = profileImage;
            this.mapImage = mapImage;
    }
}
