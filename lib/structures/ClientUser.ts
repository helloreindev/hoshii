import { Base, BaseData } from "./Base";
import { Client } from "../Client";

export interface ClientUserData extends BaseData<string> {
    botID: string;
    createdAt: Date;
    createdBy: string;
    name: string;
    type: string;
}

export interface RawClientUser {
    user: {
        botId: string;
        createdAt: string;
        createdBy: string;
        id: string;
        name: string;
    };
}

/**
 * Represents a client user
 */
export class ClientUser extends Base<string> {
    /**
     * The ID of the bot
     */
    public botID: string;

    /**
     * The date the bot was created at
     */
    public createdAt: Date;

    /**
     * The ID of the user who created the bot
     */
    public createdBy: string;

    /**
     * The name of the bot
     */
    public name: string;

    /**
     * The type of the user
     */
    public type: string;

    /**
     * Create a new ClientUser
     * @param data The raw data of the client user
     * @param client The client
     */
    public constructor(data: RawClientUser["user"], client: Client) {
        super(data.id, client);

        this.botID = data.botId;
        this.createdAt = new Date(data.createdAt);
        this.createdBy = data.createdBy;
        this.type = "bot";
        this.name = data.name;

        this.update(data);
    }

    /**
     * Whether the user is a bot
     */
    public get bot(): boolean {
        return true;
    }

    public override toJSON(): ClientUserData {
        return {
            ...super.toJSON(),
            botID: this.botID,
            createdAt: this.createdAt,
            createdBy: this.createdBy,
            name: this.name,
            type: this.type,
        };
    }

    protected override update(data: RawClientUser["user"]): void {
        if (data.botId !== undefined) {
            this.botID = data.botId;
        }

        if (data.createdAt !== undefined) {
            this.createdAt = new Date(data.createdAt);
        }

        if (data.createdBy !== undefined) {
            this.createdBy = data.createdBy;
        }

        if (data.id !== undefined) {
            this.id = data.id;
        }

        if (data.name !== undefined) {
            this.name = data.name;
        }
    }
}
