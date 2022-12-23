import { Base, BaseData } from "./Base";
import { ServerChannelCategories } from "../Constants";
import { Client } from "../Client";

export interface RawServerChannel {
    archivedAt?: string;
    archivedBy?: string;
    categoryId?: string;
    createdAt: string;
    createdBy: string;
    groupId: string;
    id: string;
    isPublic?: boolean;
    name: string;
    parentId?: string;
    serverId: string;
    topic?: string;
    type: ServerChannelCategories;
    updatedAt?: string;
}

export interface ServerChannelData extends BaseData<string> {
    archivedAt: Date | null;
    archivedBy: string | null;
    categoryID: string | null;
    createdAt: Date;
    createdBy: string;
    groupID: string;
    isPublic: boolean;
    name: string;
    parentID: string | null;
    serverID: string;
    topic: string | null;
    type: ServerChannelCategories;
    updatedAt: Date | null;
}

export interface ServerChannelEditOptions {
    isPublic?: boolean;
    name?: string;
    topic?: string;
}

export class ServerChannel extends Base<string> {
    /**
     * The date the server channel was archived at
     */
    public archivedAt: Date | null;

    /**
     * The ID of the user that archived the server channel
     */
    public archivedBy: string | null;

    /**
     * The ID of the category the server channel is in
     */
    public categoryID: string | null;

    /**
     * The date the server channel was created at
     */
    public createdAt: Date;

    /**
     * The ID of the user that created the server channel
     */
    public createdBy: string;

    /**
     * The ID of the group the server channel is in
     */
    public groupID: string;

    /**
     * Whether the server channel is public
     */
    public isPublic: boolean;

    /**
     * The name of the server channel
     */
    public name: string;

    /**
     * The ID of the parent the server channel is in
     */
    public parentID: string | null;

    /**
     * The ID of the server the server channel is in
     */
    public serverID: string;

    /**
     * The topic of the server channel
     */
    public topic: string | null;

    /**
     * The type of the server channel
     */
    public type: ServerChannelCategories;

    /**
     * The date the server channel was updated at
     */
    public updatedAt: Date | null;

    /**
     * Create a new ServerChannel
     * @param data The raw data of the server channel
     * @param client The client
     */
    public constructor(data: RawServerChannel, client: Client) {
        super(data.id, client);

        this.archivedAt = data.archivedAt ? new Date(data.archivedAt) : null;
        this.archivedBy = data.archivedBy ?? null;
        this.categoryID = data.categoryId ?? null;
        this.createdAt = new Date(data.createdAt);
        this.createdBy = data.createdBy;
        this.topic = data.topic ?? null;
        this.groupID = data.groupId;
        this.name = data.name;
        this.parentID = data.parentId ?? null;
        this.isPublic = data.isPublic ?? false;
        this.serverID = data.serverId;
        this.type = data.type;
        this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : null;

        this.update(data);
    }

    /**
     * Deletes the server channel
     * @returns {Promise<void>}
     */
    public delete(): Promise<void> {
        return this.client.deleteServerChannel(this.id);
    }

    /**
     * Edits the server channel
     * @param options The options to edit the server channel with
     * @param options The options to edit the server channel with
     * @returns {Promise<ServerChannel>}
     */
    public edit(options: ServerChannelEditOptions): Promise<ServerChannel> {
        return this.client.editServerChannel(this.id, options);
    }

    public override toJSON(): ServerChannelData {
        return {
            ...super.toJSON(),
            archivedAt: this.archivedAt,
            archivedBy: this.archivedBy,
            categoryID: this.categoryID,
            createdAt: this.createdAt,
            createdBy: this.createdBy,
            groupID: this.groupID,
            isPublic: this.isPublic,
            name: this.name,
            parentID: this.parentID,
            serverID: this.serverID,
            topic: this.topic,
            type: this.type,
            updatedAt: this.updatedAt,
        };
    }

    protected override update(data: RawServerChannel): void {
        if (data.archivedAt !== undefined) {
            this.archivedAt = new Date(data.archivedAt);
        }

        if (data.archivedBy !== undefined) {
            this.archivedBy = data.archivedBy;
        }

        if (data.categoryId !== undefined) {
            this.categoryID = data.categoryId;
        }

        if (data.createdAt !== undefined) {
            this.createdAt = new Date(data.createdAt);
        }

        if (data.createdBy !== undefined) {
            this.createdBy = data.createdBy;
        }

        if (data.groupId !== undefined) {
            this.groupID = data.groupId;
        }

        if (data.id !== undefined) {
            this.id = data.id;
        }

        if (data.isPublic !== undefined) {
            this.isPublic = data.isPublic;
        }

        if (data.name !== undefined) {
            this.name = data.name;
        }

        if (data.parentId !== undefined) {
            this.parentID = data.parentId;
        }

        if (data.serverId !== undefined) {
            this.serverID = data.serverId;
        }

        if (data.topic !== undefined) {
            this.topic = data.topic;
        }

        if (data.type !== undefined) {
            this.type = data.type;
        }

        if (data.updatedAt !== undefined) {
            this.updatedAt = new Date(data.updatedAt);
        }
    }
}
