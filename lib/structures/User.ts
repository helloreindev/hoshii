import { Client } from "../Client";
import { Base, BaseData } from "./Base";
import { UserTypes } from "../Constants";
import { RawServerMember } from "./ServerMember";

export interface RawUser {
    avatar?: string;
    banner?: string;
    createdAt: string;
    id: string;
    name: string;
    type?: UserTypes;
}

export interface RawUserSummary {
    avatar?: string;
    id: string;
    name: string;
    type?: UserTypes;
}

export interface UserData extends BaseData<string> {
    avatar?: string;
    banner?: string;
    bot: boolean;
    createdAt: Date;
    name: string;
    type?: UserTypes;
}

/**
 * Represents a user
 */
export class User extends Base<string> {
    /**
     * The avatar of the user
     */
    public avatar: string | null;

    /**
     * The banner of the user
     */
    public banner: string | null;

    /**
     * Whether the user is a bot
     */
    public bot: boolean;

    /**
     * The date the user was created at
     */
    public createdAt: Date;

    /**
     * The name of the user
     */
    public name: string;

    /**
     * The type of the user
     */
    public type: UserTypes | null;

    /**
     * Create a new User
     * @param data The raw data of the user
     * @param client The client
     */
    public constructor(data: RawUser, client: Client) {
        super(data.id, client);

        this.avatar = data.avatar ?? null;
        this.banner = data.banner ?? null;
        this.bot = data.type === "bot" ? true : false;
        this.createdAt = new Date(data.createdAt);
        this.type = data.type ?? "user";
        this.name = data.name;

        this.update(data);
    }

    public override toJSON(): UserData {
        return {
            ...super.toJSON(),
            avatar: this.avatar,
            banner: this.banner,
            bot: this.bot,
            createdAt: this.createdAt,
            name: this.name,
            type: this.type,
        };
    }

    protected override update(
        raw: RawServerMember | RawUser | RawUserSummary
    ): void {
        const data = raw as RawUser;

        if (data.avatar !== undefined) {
            this.avatar = data.avatar ?? null;
        }

        if (data.banner !== undefined) {
            this.banner = data.banner ?? null;
        }

        if (data.createdAt !== undefined) {
            this.createdAt = new Date(data.createdAt);
        }

        if (data.id !== undefined) {
            this.id = data.id;
        }

        if (data.name !== undefined) {
            this.name = data.name;
        }

        if (data.type !== undefined) {
            this.type = data.type ?? null;
        }
    }
}
