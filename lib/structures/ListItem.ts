import { Base, BaseData } from "./Base";
import { Client } from "../Client";
import { ListItemBody, Mentions } from "../Constants";
import { ServerMember } from "./ServerMember";

export interface ListItemOptions {
    message: string;
    note?: ListItemBody["note"];
}

export interface ListItemData extends BaseData<string> {
    channelID: string;
    completedAt?: Date | null;
    completedBy?: string | null;
    createdAt?: Date | null;
    createdBy: string;
    createdByWebhookID?: string | null;
    mentions?: Mentions | null;
    message: string;
    parentListItemID?: string | null;
    serverID: string;
    updatedAt?: Date | null;
    updatedBy?: string | null;
}

export interface ListItemNote {
    content: string;
    createdAt: Date;
    createdBy: string;
    mentions: Mentions | null;
    updatedAt: Date | null;
    updatedBy: string | null;
}

export interface RawListItem {
    channelId: string;
    completedAt?: string;
    completedBy?: string;
    createdAt?: string;
    createdBy: string;
    createdByWebhookId?: string;
    id: string;
    mentions?: Mentions;
    message: string;
    note?: ListItemNote;
    parentListItemId?: string;
    serverId: string;
    updatedAt?: string;
    updatedBy?: string;
}

export class ListItem extends Base<string> {
    private _data: RawListItem;

    public channelID: string;

    public completedAt?: Date | null;

    public completedBy?: string | null;

    public createdAt?: Date | null;

    public createdBy: string;

    public createdByWebhookID?: string | null;

    public mentions?: Mentions | null;

    public message: string;

    public parentListItemID?: string | null;

    public serverID: string;

    public updatedAt?: Date | null;

    public updatedBy?: string | null;

    public constructor(data: RawListItem, client: Client) {
        super(data.id, client);

        this.channelID = data.channelId;
        this.completedAt = new Date(data.completedAt) ?? null;
        this.completedBy = data.completedBy ?? null;
        this.createdAt = new Date(data.createdAt) ?? null;
        this.createdBy = data.createdBy;
        this.createdByWebhookID = data.createdByWebhookId ?? null;
        this.mentions = data.mentions ?? null;
        this.message = data.message;
        this.parentListItemID = data.parentListItemId ?? null;
        this.serverID = data.serverId;
        this.updatedAt = new Date(data.updatedAt) ?? null;
        this.updatedBy = data.updatedBy ?? null;

        this.update(data);
    }

    public get member(): ServerMember | Promise<ServerMember> {
        return (
            this.client.servers
                .get(this.serverID)
                .members.get(this.createdBy) ??
            this.client.getServerMember(this.serverID, this.createdBy)
        );
    }

    public get note(): ListItemNote | null {
        return this._data.note
            ? {
                  content: this._data.note.content,
                  createdAt: new Date(this._data.note.createdAt),
                  createdBy: this._data.note.createdBy,
                  mentions: this._data.note.mentions ?? null,
                  updatedAt: new Date(this._data.note.updatedAt) ?? null,
                  updatedBy: this._data.note.updatedBy ?? null,
              }
            : null;
    }

    /**
     * Completes the list item
     * @returns {Promise<void>}
     */
    public complete(): Promise<void> {
        return this.client.completeListItem(this.channelID, this.id);
    }

    /**
     * Delete the list item
     * @returns {Promise<void>}
     */
    public delete(): Promise<void> {
        return this.client.deleteListItem(this.channelID, this.id);
    }

    /**
     * Edit the list item
     * @param options The options to edit the list item with
     * @returns {Promise<ListItem>}
     */
    public edit(options: ListItemOptions): Promise<ListItem> {
        return this.client.editListItem(this.channelID, this.id, options);
    }

    public override toJSON(): ListItemData {
        return {
            ...super.toJSON(),
            channelID: this.channelID,
            completedAt: this.completedAt,
            completedBy: this.completedBy,
            createdAt: this.createdAt,
            createdBy: this.createdBy,
            createdByWebhookID: this.createdByWebhookID,
            mentions: this.mentions,
            message: this.message,
            parentListItemID: this.parentListItemID,
            serverID: this.serverID,
            updatedAt: this.updatedAt,
            updatedBy: this.updatedBy,
        };
    }

    /**
     * Uncomplete the list item
     * @returns {Promise<void>}
     */
    public uncomplete(): Promise<void> {
        return this.client.uncompleteListItem(this.channelID, this.id);
    }

    protected override update(data: RawListItem): void {
        if (data.channelId !== undefined) {
            this.channelID = data.channelId;
        }

        if (data.completedAt !== undefined) {
            this.completedAt = new Date(data.completedAt) ?? null;
        }

        if (data.completedBy !== undefined) {
            this.completedBy = data.completedBy ?? null;
        }

        if (data.createdAt !== undefined) {
            this.createdAt = new Date(data.createdAt) ?? null;
        }

        if (data.createdBy !== undefined) {
            this.createdBy = data.createdBy;
        }

        if (data.createdByWebhookId !== undefined) {
            this.createdByWebhookID = data.createdByWebhookId ?? null;
        }

        if (data.id !== undefined) {
            this.id = data.id;
        }

        if (data.mentions !== undefined) {
            this.mentions = data.mentions ?? null;
        }

        if (data.message !== undefined) {
            this.message = data.message;
        }

        if (data.parentListItemId !== undefined) {
            this.parentListItemID = data.parentListItemId ?? null;
        }

        if (data.serverId !== undefined) {
            this.serverID = data.serverId;
        }

        if (data.updatedAt !== undefined) {
            this.updatedAt = new Date(data.updatedAt) ?? null;
        }

        if (data.updatedBy !== undefined) {
            this.updatedBy = data.updatedBy ?? null;
        }
    }
}
