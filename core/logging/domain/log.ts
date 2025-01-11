export class DeploymentLog {
    date!: Date;
    message!: string;

    constructor(message: string, date: Date) {
        this.message = message;
        this.date = date;
    }
}