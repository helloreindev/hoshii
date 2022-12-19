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

export class ClientUser extends Base<string> {
    public botID: string;

    public createdAt: Date;

    public createdBy: string;

    public name: string;

    public type: string;

    public constructor(data: RawClientUser["user"], client: Client) {
        super(data.id, client);

        this.botID = data.botId;
        this.createdAt = new Date(data.createdAt);
        this.createdBy = data.createdBy;
        this.type = "bot";
        this.name = data.name;

        this.update(data);
    }

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
