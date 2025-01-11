export class DeploymentLog {
    timestamp!: Date;
    message!: string;

    constructor(message: string, date: Date) {
        this.message = message;
        this.timestamp = date;
    }
}