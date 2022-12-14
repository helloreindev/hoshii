import { Base, BaseData } from "./Base";
import { Client } from "../Client";
import { Mentions } from "../Constants";
import { ServerMember } from "./ServerMember";

export interface DocData extends BaseData<number> {
    channelID: string;
    content: string;
    createdAt: Date;
    createdBy: string;
    mentions: Mentions;
    serverID: string;
    title: string;
    updatedAt: Date | null;
    updatedBy: string | null;
}

export interface DocsFilter {
    before?: string;
    limit?: number;
}

export interface DocOptions {
    content: string;
    title: string;
}

export interface RawDoc {
    channelId: string;
    content: string;
    createdAt: string;
    createdBy: string;
    id: number;
    mentions?: Mentions;
    serverId: string;
    title: string;
    updatedAt?: string;
    updatedBy?: string;
}

/**
 * Represents a doc
 */
export class Doc extends Base<number> {
    /**
     * The ID of the channel the doc is in
     */
    public channelID: string;

    /**
     * The content of the doc
     */
    public content: string;

    /**
     * The date the doc was created at
     */
    public createdAt: Date;

    /**
     * The ID of the user who created the doc
     */
    public createdBy: string;

    /**
     * The mentions in the doc
     */
    public mentions: Mentions;

    /**
     * The ID of the server the doc is in
     */
    public serverID: string;

    /**
     * The title of the doc
     */
    public title: string;

    /**
     * The date the doc was last updated
     */
    public updatedAt: Date | null;

    /**
     * The ID of the user who last updated the doc
     */
    public updatedBy: string | null;

    /**
     * Creates a new Doc
     * @param data The raw data of the doc
     * @param client The client
     */
    public constructor(data: RawDoc, client: Client) {
        super(data.id, client);

        this.channelID = data.channelId;
        this.content = data.content;
        this.createdAt = new Date(data.createdAt);
        this.mentions = data.mentions || {};
        this.serverID = data.serverId;
        this.title = data.title;
        this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : null;
        this.updatedBy = data.updatedBy ?? null;

        this.update(data);
    }

    /**
     * The server member who created (or updated) the doc
     */
    public get member(): ServerMember | Promise<ServerMember> {
        return (
            this.client.servers
                .get(this.serverID)
                ?.members.get(this.updatedBy ?? this.createdBy) ??
            this.client.getServerMember(
                this.serverID,
                this.updatedBy ?? this.createdBy
            )
        );
    }

    /**
     * Delete the doc
     * @returns {Promise<void>}
     */
    public delete(): Promise<void> {
        return this.client.deleteDoc(this.channelID, this.id);
    }

    /**
     * Edit the doc
     * @param options The options to edit the doc with
     * @returns {Promise<Doc>}
     */
    public edit(options: DocOptions): Promise<Doc> {
        return this.client.editDoc(this.channelID, this.id, options);
    }

    public override toJSON(): DocData {
        return {
            ...super.toJSON(),
            channelID: this.channelID,
            content: this.content,
            createdAt: this.createdAt,
            createdBy: this.createdBy,
            mentions: this.mentions,
            serverID: this.serverID,
            title: this.title,
            updatedAt: this.updatedAt,
            updatedBy: this.updatedBy,
        };
    }

    protected override update(data: RawDoc): void {
        if (data.channelId !== undefined) {
            this.channelID = data.channelId;
        }

        if (data.content !== undefined) {
            this.content = data.content;
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

        if (data.mentions !== undefined) {
            this.mentions = data.mentions;
        }

        if (data.serverId !== undefined) {
            this.serverID = data.serverId;
        }

        if (data.title !== undefined) {
            this.title = data.title;
        }

        if (data.updatedAt !== undefined) {
            this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : null;
        }

        if (data.updatedBy !== undefined) {
            this.updatedBy = data.updatedBy ?? null;
        }
    }
}
