import { User } from "./user";

export class LoginRespond {
    token?: string;
    expirationDate?: number;
    user?: User;
}
