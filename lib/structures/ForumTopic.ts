import { Base, BaseData } from "./Base";
import { Client } from "../Client";
import { AnyTextableChannel, Mentions } from "../Constants";
import { ForumChannel } from "./ForumChannel";
import { Server } from "./Server";
import {
    ForumTopicComment,
    ForumTopicCommentData,
    ForumTopicCommentOptions,
    RawForumTopicComment,
} from "./ForumTopicComment";
import TypedCollection from "../utils/TypedCollection";

export interface ForumTopicData extends BaseData<number> {
    bumpedAt?: Date | null;
    channelID: string;
    comments: Array<ForumTopicCommentData>;
    content: string;
    createdAt: Date;
    createdBy: string;
    createdByWebhookID?: string;
    isLocked?: boolean;
    isPinned?: boolean;
    mentions?: Mentions | null;
    serverID: string;
    title: string;
    updatedAt?: Date | null;
}

export interface ForumTopicOptions {
    content: string;
    title: string;
}

export interface ForumTopicsFilter {
    before?: string;
    limit?: number;
}

export interface RawForumTopic {
    bumpedAt?: string;
    channelId: string;
    content: string;
    createdAt: string;
    createdBy: string;
    createdByWebhookId?: string;
    id: number;
    isLocked?: boolean;
    isPinned?: boolean;
    mentions?: Mentions;
    serverId: string;
    title: string;
    updatedAt?: string;
}

/**
 * Represents a forum topic
 */
export class ForumTopic<
    T extends ForumChannel = ForumChannel
> extends Base<number> {
    /**
     * The cached channel the forum topic is in
     */
    private _cachedChannel?: T extends AnyTextableChannel ? T : undefined;

    /**
     * The cached server the forum topic is in
     */
    private _cachedServer?: T extends Server ? Server : Server | null;

    /**
     * The date the forum topic was last bumped
     */
    public bumpedAt?: Date | null;

    /**
     * The ID of the channel the forum topic is in
     */
    public channelID: string;

    /**
     * A collection of cached comments
     */
    public comments: TypedCollection<
        number,
        RawForumTopicComment,
        ForumTopicComment
    >;

    /**
     * The content of the forum topic
     */
    public content: string;

    /**
     * The date the forum topic was created at
     */
    public createdAt: Date;

    /**
     * The ID of the user who created the forum topic
     */
    public createdBy: string;

    /**
     * The ID of the webhook that created the forum topic
     */
    public createdByWebhookID?: string;

    /**
     * Whether the forum topic is locked
     */
    public isLocked?: boolean;

    /**
     * Whether the forum topic is pinned
     */
    public isPinned?: boolean;

    /**
     * The mentions in the forum topic
     */
    public mentions?: Mentions | null;

    /**
     * The ID of the server the forum topic is in
     */
    public serverID: string;

    /**
     * The title of the forum topic
     */
    public title: string;

    /**
     * The date the forum topic was last updated
     */
    public updatedAt?: Date | null;

    /**
     * Create a new forum topic
     * @param data The raw data of the forum topic
     * @param client The client
     */
    public constructor(data: RawForumTopic, client: Client) {
        super(data.id, client);

        this.bumpedAt = data.bumpedAt ? new Date(data.bumpedAt) : null;
        this.channelID = data.channelId;
        this.comments = new TypedCollection(
            ForumTopicComment,
            client,
            client.options.collectionLimits?.topicComments
        );
        this.content = data.content;
        this.createdAt = new Date(data.createdAt);
        this.createdBy = data.createdBy;
        this.createdByWebhookID = data.createdByWebhookId ?? null;
        this.isLocked = data.isLocked ?? false;
        this.isPinned = data.isPinned ?? false;
        this.mentions = data.mentions ?? null;
        this.serverID = data.serverId;
        this.title = data.title;
        this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : null;

        this.update(data);
    }

    /**
     * The channel the forum topic is in
     */
    public get channel(): T extends AnyTextableChannel ? T : undefined {
        return (
            this._cachedChannel ??
            (this._cachedChannel = this.client.servers
                .get(this.serverID)
                .channels.get(this.channelID) as T extends AnyTextableChannel
                ? T
                : undefined)
        );
    }

    /**
     * The server the forum topic is in
     */
    public get server(): T extends Server ? Server : Server | null {
        if (!this._cachedServer) {
            this._cachedServer = this.client.servers.get(this.serverID);

            if (!this._cachedServer) {
                throw new Error(
                    `Unable to retrieve cached server from ${this.constructor.name}#serverID`
                );
            }
        }

        return this._cachedServer as T extends Server ? Server : Server | null;
    }

    /**
     * Add a reaction emote to the forum topic
     * @param emoteID The ID of the emote
     * @returns {Promise<void>}
     */
    public addReactionEmote(emoteID: number): Promise<void> {
        return this.client.addForumTopicReactionEmote(
            this.channelID,
            this.id,
            emoteID
        );
    }

    /**
     * Create a forum comment in this thread
     * @param options The options for the comment
     * @returns {Promise<ForumTopicComment>}
     */
    public createComment(
        options: ForumTopicCommentOptions
    ): Promise<ForumTopicComment> {
        return this.client.createForumTopicComment(
            this.channelID,
            this.id,
            options
        );
    }

    /**
     * Delete the forum topic
     * @returns {Promise<void>}
     */
    public delete(): Promise<void> {
        return this.client.deleteForumTopic(this.channelID, this.id);
    }

    /**
     * Delete a reaction emote from the forum topic
     * @param emoteID The ID of the emote
     * @returns
     */
    public deleteReactionEmote(emoteID: number): Promise<void> {
        return this.client.deleteForumTopicReactionEmote(
            this.channelID,
            this.id,
            emoteID
        );
    }

    /**
     * Edit the forum topic
     * @param options The options for the topic
     * @returns {Promise<ForumTopic>}
     */
    public edit<T extends ForumChannel = ForumChannel>(
        options: ForumTopicOptions
    ): Promise<ForumTopic<T>> {
        return this.client.editForumTopic(this.channelID, this.id, options);
    }

    /**
     * Lock the forum topic
     * @returns {Promise<void>}
     */
    public lock(): Promise<void> {
        return this.client.lockForumTopic(this.channelID, this.id);
    }

    /**
     * Pin the forum topic
     * @returns {Promise<void>}
     */
    public pin(): Promise<void> {
        return this.client.pinForumTopic(this.channelID, this.id);
    }

    public override toJSON(): ForumTopicData {
        return {
            ...super.toJSON(),
            bumpedAt: this.bumpedAt,
            channelID: this.channelID,
            comments: this.comments.map((comment) => comment.toJSON()),
            content: this.content,
            createdAt: this.createdAt,
            createdBy: this.createdBy,
            createdByWebhookID: this.createdByWebhookID,
            isLocked: this.isLocked,
            isPinned: this.isPinned,
            mentions: this.mentions,
            serverID: this.serverID,
            title: this.title,
            updatedAt: this.updatedAt,
        };
    }

    /**
     * Unlock the forum topic
     * @returns {Promise<void>}
     */
    public unlock(): Promise<void> {
        return this.client.unlockForumTopic(this.channelID, this.id);
    }

    /**
     * Unpin the forum topic
     * @returns {Promise<void>}
     */
    public unpin(): Promise<void> {
        return this.client.unpinForumTopic(this.channelID, this.id);
    }

    protected update(data: RawForumTopic): void {
        if (data.bumpedAt !== undefined) {
            this.bumpedAt = data.bumpedAt ? new Date(data.bumpedAt) : null;
        }

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

        if (data.createdByWebhookId !== undefined) {
            this.createdByWebhookID = data.createdByWebhookId ?? null;
        }

        if (data.id !== undefined) {
            this.id = data.id;
        }

        if (data.isLocked !== undefined) {
            this.isLocked = data.isLocked ?? false;
        }

        if (data.isPinned !== undefined) {
            this.isPinned = data.isPinned ?? false;
        }

        if (data.mentions !== undefined) {
            this.mentions = data.mentions ?? null;
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
    }
}
