import { Base, BaseData } from "./Base";
import { Client } from "../Client";
import { Mentions } from "../Constants";

export interface ForumTopicCommentData extends BaseData<number> {
    channelID: string;
    content: string;
    createdAt: Date;
    createdBy: string;
    forumTopicID: number;
    mentions?: Mentions | null;
    updatedAt?: Date | null;
}

export interface ForumTopicCommentOptions {
    content: string;
}

export interface RawForumTopicComment {
    channelId: string;
    content: string;
    createdAt: string;
    createdBy: string;
    forumTopicId: number;
    id: number;
    mentions?: Mentions;
    updatedAt?: string;
}

export class ForumTopicComment extends Base<number> {
    public channelID: string;

    public content: string;

    public createdAt: Date;

    public createdBy: string;

    public forumTopicID: number;

    public mentions?: Mentions | null;

    public updatedAt?: Date | null;

    constructor(data: RawForumTopicComment, client: Client) {
        super(data.id, client);

        this.channelID = data.channelId;
        this.content = data.content;
        this.createdAt = new Date(data.createdAt);
        this.createdBy = data.createdBy;
        this.forumTopicID = data.forumTopicId;
        this.mentions = data.mentions ?? null;
        this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : null;

        this.update(data);
    }

    /**
     * Add a reaction emote to the forum topic comment
     * @param emoteID The ID of the emote
     * @returns {Promise<void>}
     */
    public addReactionEmote(emoteID: number): Promise<void> {
        return this.client.addForumTopicCommentReactionEmote(
            this.channelID,
            this.forumTopicID,
            this.id,
            emoteID
        );
    }

    /**
     * Delete the forum topic comment
     * @returns {Promise<ForumTopicComment>}
     */
    public delete(): Promise<void> {
        return this.client.deleteForumTopicComment(
            this.channelID,
            this.forumTopicID,
            this.id
        );
    }

    /**
     * Delete a reaction emote from the forum topic comment
     * @param emoteID The ID of the emote
     * @returns {Promise<void>}
     */
    public deleteReactionEmote(emoteID: number): Promise<void> {
        return this.client.deleteForumTopicCommentReactionEmote(
            this.channelID,
            this.forumTopicID,
            this.id,
            emoteID
        );
    }

    /**
     * Edit the forum topic comment
     * @param options The options to edit the forum topic comment with
     * @returns {Promise<ForumTopicComment>}
     */
    public edit(options: ForumTopicCommentOptions): Promise<ForumTopicComment> {
        return this.client.editForumTopicComment(
            this.channelID,
            this.forumTopicID,
            this.id,
            options
        );
    }

    public override toJSON(): ForumTopicCommentData {
        return {
            ...super.toJSON(),
            channelID: this.channelID,
            content: this.content,
            createdAt: this.createdAt,
            createdBy: this.createdBy,
            forumTopicID: this.forumTopicID,
            mentions: this.mentions,
            updatedAt: this.updatedAt,
        };
    }

    protected override update(data: RawForumTopicComment): void {
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

        if (data.forumTopicId !== undefined) {
            this.forumTopicID = data.forumTopicId;
        }

        if (data.id !== undefined) {
            this.id = data.id;
        }

        if (data.mentions !== undefined) {
            this.mentions = data.mentions ?? null;
        }

        if (data.updatedAt !== undefined) {
            this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : null;
        }
    }
}
