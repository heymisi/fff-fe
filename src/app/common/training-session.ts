import { Instructor } from "./instructor";
import { User } from "./user";

export class TrainingSession {
    id?: number;
    name?: string;
    trainingSessionType?: string;
    day?: string;
    sessionStart?: number;
    sessionEnd?: number;
    monthlyPrice?: number;
    occasionPrice?: number;
    maxClientNumber?: number;
    instructor?: Instructor;
    client?: User[];

    constructor(name: string, trainingSessionType: string, day: string,sessionStart:number,
        sessionEnd: number,monthlyPrice: number,occasionPrice:number,maxClientNumber:number){
            this.name= name;
            this.trainingSessionType= trainingSessionType;
            this.day= day;
            this.sessionStart= sessionStart;
            this.sessionEnd= sessionEnd;
            this.monthlyPrice= monthlyPrice;
            this.occasionPrice= occasionPrice;
            this.maxClientNumber= maxClientNumber;
    }
}
