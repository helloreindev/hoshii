import { Client } from "../Client";
import TypedCollection from "../utils/TypedCollection";
import {
    ForumTopic,
    ForumTopicData,
    ForumTopicOptions,
    RawForumTopic,
} from "./ForumTopic";
import {
    ForumTopicComment,
    ForumTopicCommentOptions,
} from "./ForumTopicComment";
import { ServerChannel, ServerChannelData } from "./ServerChannel";
import { RawServerChannel } from "./ServerChannel";

export interface ForumChannelData extends ServerChannelData {
    topics: Array<ForumTopicData>;
}

export class ForumChannel extends ServerChannel {
    public topics: TypedCollection<
        number,
        RawForumTopic,
        ForumTopic<ForumChannel>
    >;

    public constructor(data: RawServerChannel, client: Client) {
        super(data, client);

        this.topics = new TypedCollection(
            ForumTopic,
            client,
            client.options.collectionLimits?.topics
        );

        this.update(data);
    }

    /**
     * Create a topic
     * @param options The options for the topic
     * @returns {Promise<ForumTopic<ForumChannel>>}
     */
    public createTopic(
        options: ForumTopicOptions
    ): Promise<ForumTopic<ForumChannel>> {
        return this.client.createForumTopic(this.id, options);
    }

    /**
     * Create a topic comment
     * @param topicID The ID of the topic
     * @param options The options for the topic comment
     * @returns {Promise<ForumTopicComment>}
     */
    public createTopicComment(
        topicID: number,
        options: ForumTopicCommentOptions
    ): Promise<ForumTopicComment> {
        return this.client.createForumTopicComment(this.id, topicID, options);
    }

    /**
     * Delete a topic
     * @param topicID The ID of the topic
     * @returns {Promise<void>}
     */
    public deleteTopic(topicID: number): Promise<void> {
        return this.client.deleteForumTopic(this.id, topicID);
    }

    /**
     * Delete a topic comment
     * @param topicID The ID of the topic
     * @param commentID The ID of the topic comment
     * @returns {Promise<void>}
     */
    public deleteTopicComment(
        topicID: number,
        commentID: number
    ): Promise<void> {
        return this.client.deleteForumTopicComment(this.id, topicID, commentID);
    }

    /**
     * Edit a topic
     * @param topicID The ID of the topic
     * @param options The options for the topic
     * @returns {Promise<ForumTopic<ForumChannel>>}
     */
    public editTopic(
        topicID: number,
        options: ForumTopicOptions
    ): Promise<ForumTopic<ForumChannel>> {
        return this.client.editForumTopic(this.id, topicID, options);
    }

    /**
     * Edit a topic comment
     * @param topicID The ID of the topic
     * @param commentID The ID of the topic comment
     * @param options The options for the topic comment
     * @returns {Promise<ForumTopicComment>}
     */
    public editTopicComment(
        topicID: number,
        commentID: number,
        options: ForumTopicCommentOptions
    ): Promise<ForumTopicComment> {
        return this.client.editForumTopicComment(
            this.id,
            topicID,
            commentID,
            options
        );
    }

    public override toJSON(): ForumChannelData {
        return {
            ...super.toJSON(),
            topics: this.topics.map((thread) => thread.toJSON()),
        };
    }
}
