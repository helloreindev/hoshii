import { Base, BaseData } from "./Base";
import { Client } from "../Client";

export interface RawWebhook {
    channelId: string;
    createdAt: string;
    createdBy: string;
    deletedAt: string;
    id: string;
    name: string;
    serverId: string;
    token?: string;
}

export interface WebhookData extends BaseData<string> {
    channelID: string;
    createdAt: Date;
    createdBy: string;
    deletedAt: Date | null;
    name: string;
    serverID: string;
    token?: string;
}

export interface WebhookEditOptions {
    channelID?: string;
    name: string;
}

export interface WebhookFilter {
    channelID?: string;
}

export class Webhook extends Base<string> {
    public channelID: string;

    public createdAt: Date;

    public createdBy: string;

    public deletedAt: Date | null;

    public name: string;

    public serverID: string;

    public token: string | null;

    public constructor(data: RawWebhook, client: Client) {
        super(data.id, client);

        this.channelID = data.channelId;
        this.createdAt = new Date(data.createdAt);
        this.createdBy = data.createdBy;
        this.deletedAt = data.deletedAt ? new Date(data.deletedAt) : null;
        this.name = data.name;
        this.serverID = data.serverId;
        this.token = data.token ?? null;

        this.update(data);
    }

    /**
     * Delete the webhook
     * @returns {Promise<void>}
     */
    public delete(): Promise<void> {
        return this.client.deleteServerWebhook(this.serverID, this.id);
    }

    /**
     * Edit the webhook
     * @param options The options to edit the webhook with
     * @param options.channelID The ID of the channel to edit the webhook in
     * @param options.name The name of the webhook
     * @returns {Promise<Webhook>}
     */
    public edit(options: WebhookEditOptions): Promise<Webhook> {
        return this.client.editServerWebhook(this.serverID, this.id, options);
    }

    public override toJSON(): WebhookData {
        return {
            ...super.toJSON(),
            channelID: this.channelID,
            createdAt: this.createdAt,
            createdBy: this.createdBy,
            deletedAt: this.deletedAt,
            name: this.name,
            serverID: this.serverID,
            token: this.token,
        };
    }

    protected override update(data: RawWebhook): void {
        if (data.channelId !== undefined) {
            this.channelID = data.channelId;
        }

        if (data.createdAt !== undefined) {
            this.createdAt = new Date(data.createdAt);
        }

        if (data.createdBy !== undefined) {
            this.createdBy = data.createdBy;
        }

        if (data.deletedAt !== undefined) {
            this.deletedAt = new Date(data.deletedAt);
        }

        if (data.id !== undefined) {
            this.id = data.id;
        }

        if (data.name !== undefined) {
            this.name = data.name;
        }

        if (data.serverId !== undefined) {
            this.serverID = data.serverId;
        }

        if (data.token !== undefined) {
            this.token = data.token;
        }
    }
}
