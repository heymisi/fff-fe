import { UserRegistrationModel } from "./user-registration-model";

export class InstructorRegistrationModel {
    user: UserRegistrationModel;
    title:String;
    bio:String;
    sportIds:number[];
    facilityId: number;
    constructor(user: UserRegistrationModel, title:string, bio:string,sportIds:number[],facilityId:number){
        this.user = user;
        this.title = title;
        this.bio = bio;
        this.sportIds = sportIds;
        this.facilityId = facilityId;
    }

}
