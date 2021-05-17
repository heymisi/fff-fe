import { FacilityDetailsComponent } from "../component/facility/facility-details/facility-details.component";
import { CommentEntity } from "./comment-entity";
import { Facility } from "./facility";
import { FacilityPricing } from "./facility-pricing";
import { Rating } from "./rating";
import { Sport } from "./sport";
import { TrainingSession } from "./training-session";
import { TrainingSessionDetails } from "./training-session-details";
import { User } from "./user";

export class Instructor {
    id?: number;
    user?: User;
    title?: string;
    bio?: string;
    knownSports?: Sport[];
    rating?: Rating;
    trainingSessions?: TrainingSession[];
    sportFacility?: Facility;
    comments?: CommentEntity[];
    imageString?: String;

}
