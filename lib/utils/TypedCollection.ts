import Collection from "./Collection";
import type { Client } from "../Client";
import { Base } from "../structures/Base";

export type AnyClass<T, I, E extends Array<unknown>> = new (
    data: T,
    client: Client,
    ...extra: E
) => I;

export default class TypedCollection<
    K extends string | number,
    M extends Record<string, any>,
    C extends Base,
    E extends Array<unknown> = []
> extends Collection<K, C> {
    private _baseObject: AnyClass<M, C, E>;

    private _client: Client;

    public limit: number;

    public constructor(
        baseObject: AnyClass<M, C, E>,
        client: Client,
        limit = Infinity
    ) {
        super();

        if (!(baseObject.prototype instanceof Base)) {
            throw new TypeError("baseObject must be an extended Base class");
        }

        this._baseObject = baseObject;
        this._client = client;
        this.limit = limit;
    }

    /** @hidden */
    public add<T extends C>(value: T): T {
        if ("id" in value) {
            if (this.limit === 0) {
                return value;
            }

            this.set(value.id as K, value);

            if (this.limit && this.size > this.limit) {
                const iter = this.keys();

                while (this.size > this.limit) {
                    this.delete(iter.next().value as K);
                }
            }

            return value;
        } else {
            const err = new Error(
                `${this.constructor.name}#add: value must have an id property`
            );
            Object.defineProperty(err, "_object", { value });
            throw err;
        }
    }

    /** @hidden */
    public update(value: C | (Partial<M> & { id?: K }), ...extra: E): C {
        if (value instanceof this._baseObject) {
            if ("update" in value) {
                value["update"].call(value, value);
            }

            return value;
        }

        // if the object does not have a direct id, we're forced to construct a whole new object
        let item =
            "id" in value && value.id ? this.get(value.id as K) : undefined;

        if (!item) {
            item = this.add(
                new this._baseObject(value as M, this._client, ...extra)
            );
        } else if ("update" in item) {
            item["update"].call(item, value);
        }

        return item;
    }
}
