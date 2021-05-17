import { User } from "./user";

export class CommentEntity {
    id?: number;
    commenter?: User;
    text?: string;
    created?: Date;
    rate?:number;
}
