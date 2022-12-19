export default class GatewayError extends Error {
    public code: number;

    public constructor(message: string, code: number) {
        super(message);
        this.code = code;
    }
}
