import { Client } from "../Client";
import {
    Payload_ForumTopicCommentReaction,
    Payload_ForumTopicReaction,
} from "../Constants";
import { ForumChannel } from "./ForumChannel";
import { ForumTopic } from "./ForumTopic";
import { ServerMember } from "./ServerMember";
import { RawEmote } from "./ChatMessage";
import { ReactionInfo } from "./ReactionInfo";
import { Server } from "./Server";

export interface ForumTopicReactionTypes {
    creator:
        | ServerMember
        | {
              id: string;
          };
    emote: RawEmote;
    topic:
        | ForumTopic
        | {
              id: number;
              server:
                  | Server
                  | {
                        id?: string;
                    };
          };
}

/**
 * Represents a forum topic reaction info
 */
export class ForumTopicReactionInfo extends ReactionInfo {
    /**
     * The ID of the forum topic comment the reaction is in
     */
    public commentID?: number | null;

    /**
     * The ID of the forum topic the reaction is in
     */
    public topicID: number;

    /**
     * The type of the forum topic reaction
     */
    public type: string;

    public constructor(
        data: Payload_ForumTopicCommentReaction | Payload_ForumTopicReaction,
        client: Client
    ) {
        super(data, client);

        this.commentID =
            data.reaction["forumTopicCommentId" as keyof object] ?? null;
        this.topicID = data.reaction.forumTopicId;
        this.type = data.reaction["forumTopicCommentId" as keyof object]
            ? "comment"
            : "topic";
    }

    /**
     * The topic the reaction is in
     */
    public get topic(): ForumTopicReactionTypes["topic"] {
        return (
            (
                this.client.servers
                    .get(this.data.serverId)
                    .channels.get(this.data.reaction.channelId) as ForumChannel
            ).topics.get(this.topicID) ?? {
                channelID: this.data.reaction.channelId,
                id: this.topicID,
                server: this.client.servers.get(this.data.serverId) ?? {
                    id: this.data.serverId,
                },
            }
        );
    }
}
