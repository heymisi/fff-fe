export class CommentRequestModel {
    
    message: string;
    rate: number;
    userId: number;

    constructor(message: string,rate: number,userId: number) {
        this.message = message;
        this.rate = rate;
        this.userId = userId
    }
}
