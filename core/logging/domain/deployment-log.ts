export class DeploymentLog {
    timestamp!: Date;
    message!: string;

    constructor(message: string, date: Date) {
        this.message = message;
        this.timestamp = date;
    }
    static createFromJsonObject({
        timestamp,
        message
    }: {
        timestamp: Date | string,
        message: string
    }) {
        try {
            return new this(message, new Date(timestamp))
        } catch (error) {
            throw new Error("invalid timestamp specified");
        }
    }
}