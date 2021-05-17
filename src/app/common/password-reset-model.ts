export class PasswordResetModel {
    token: String;
    password: String;
    constructor(token: string, password: string) {
        this.token = token;
        this.password = password;
    }
}
