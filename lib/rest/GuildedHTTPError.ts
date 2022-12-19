import type { Headers, Response } from "undici";
import type { HTTPMethod } from "./Endpoints";

export default class GuildedHTTPError extends Error {
    public method: HTTPMethod;

    public override name: "GuildedHTTPError";

    public res: Response;

    public resBody: Record<string, unknown> | null;

    public constructor(
        res: Response,
        resBody: unknown | null,
        method: HTTPMethod,
        stack?: string
    ) {
        super();

        this.method = method;
        this.resBody = resBody as GuildedHTTPError["resBody"];
        this.res = res;

        let message = `${res.status} ${res.statusText} on ${this.method} ${this.path}`;
        const errors = GuildedHTTPError.flattenErrors(
            resBody as Record<string, unknown>
        );

        if (errors.length !== 0) {
            message += `\n  ${errors.join("\n  ")}`;
        }

        Object.defineProperty(this, "message", {
            enumerable: false,
            value: message,
        });

        if (stack) {
            this.stack = this.name + ": " + this.message + "\n" + stack;
        } else {
            Error.captureStackTrace(this, GuildedHTTPError);
        }
    }

    public static flattenErrors(
        errors: Record<string, unknown>,
        keyPrefix = ""
    ): Array<string> {
        let messages: Array<string> = [];

        for (const fieldName in errors) {
            if (
                !Object.hasOwn(errors, fieldName) ||
                fieldName === "message" ||
                fieldName === "code"
            ) {
                continue;
            }

            if (Array.isArray(errors[fieldName])) {
                messages = messages.concat(
                    (errors[fieldName] as Array<string>).map(
                        (str) => `${`${keyPrefix}${fieldName}`}: ${str}`
                    )
                );
            }
        }

        return messages;
    }

    public get headers(): Headers {
        return this.res.headers;
    }

    public get path(): string {
        return new URL(this.res.url).pathname;
    }

    public get status(): number {
        return this.res.status;
    }

    public get statusText(): string {
        return this.res.statusText;
    }

    public toJSON() {
        return {
            message: this.message,
            method: this.method,
            name: this.name,
            resBody: this.resBody,
            stack: this.stack ?? "",
        };
    }
}
