import type { Client } from "../Client";
import { inspect } from "node:util";

export interface BaseData<T = string | number> {
    id: T;
}

/** The default base for all structures */
export abstract class Base<T = string | number> {
    /** The bot client */
    public client!: Client;

    /** The ID of the item */
    public id: T;

    public constructor(id: T, client: Client) {
        this.id = id;

        Object.defineProperty(this, "client", {
            configurable: false,
            enumerable: false,
            value: client,
            writable: false,
        });
    }

    /** @hidden */
    [inspect.custom](): this {
        const copy = new { [this.constructor.name]: class {} }[
            this.constructor.name
        ]() as this;

        for (const key in this) {
            if (
                Object.hasOwn(this, key) &&
                !key.startsWith("_") &&
                this[key] !== undefined
            ) {
                copy[key] = this[key];
            }
        }

        return copy;
    }

    public toJSON(): BaseData<T> {
        return {
            id: this.id,
        };
    }

    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    protected update(data: unknown): void {}
}
