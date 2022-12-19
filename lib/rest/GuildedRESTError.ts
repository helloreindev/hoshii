import type { Headers, Response } from "undici";
import type { HTTPMethod } from "./Endpoints";

export default class GuildedRESTError extends Error {
    public code: number | null;

    public method: HTTPMethod;

    public override name: "GuildedRESTError";

    public res: Response;

    public resBody: Record<string, unknown> | null;

    public constructor(
        res: Response,
        resBody: Record<string, unknown>,
        method: HTTPMethod,
        stack?: string
    ) {
        super();
        this.code = Number(resBody.code) ?? null;
        this.method = method;
        this.resBody = resBody as GuildedRESTError["resBody"];
        this.res = res;

        let message =
            "message" in resBody
                ? `${(resBody as { message: string }).message} on ${
                      this.method
                  } ${this.path}`
                : `Unknown Error on ${this.method} ${this.path}`;

        if ("errors" in resBody) {
            message += `\n ${GuildedRESTError.flattenErrors(
                (resBody as { errors: Record<string, unknown> }).errors
            ).join("\n ")}`;
        } else {
            const errors = GuildedRESTError.flattenErrors(resBody);

            if (errors.length !== 0) {
                message += `\n ${errors.join("\n ")}`;
            }
        }

        Object.defineProperty(this, "message", {
            enumerable: false,
            value: message,
        });

        if (stack) {
            this.stack = `${this.name}: ${this.message}\n${stack}`;
        } else {
            Error.captureStackTrace(this, GuildedRESTError);
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

            if ("_errors" in (errors[fieldName] as object)) {
                messages = messages.concat(
                    (
                        errors[fieldName] as {
                            _errors: Array<{ message: string }>;
                        }
                    )._errors.map(
                        (err: { message: string }) =>
                            `${`${keyPrefix}${fieldName}`}: ${err.message}`
                    )
                );
            } else if (Array.isArray(errors[fieldName])) {
                messages = messages.concat(
                    (errors[fieldName] as Array<string>).map(
                        (str) => `${`${keyPrefix}${fieldName}`}: ${str}`
                    )
                );
            } else if (typeof errors[fieldName] === "object") {
                messages = messages.concat(
                    GuildedRESTError.flattenErrors(
                        errors[fieldName] as Record<string, unknown>,
                        `${keyPrefix}${fieldName}.`
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

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
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
