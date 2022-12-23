import { Client } from "../Client";
import { ReactionInfo } from "./ReactionInfo";
import { TextChannel } from "./TextChannel";
import { Payload_ChannelMessageReaction } from "../Constants";
import { ChatMessage, RawEmote } from "./ChatMessage";
import { Server } from "./Server";
import { ServerMember } from "./ServerMember";

export interface ChatMessageReactionTypes {
    creator:
        | ServerMember
        | {
              id: string;
          };
    emote: RawEmote;
    message:
        | ChatMessage
        | {
              channelID: string;
              id: string;
              server:
                  | Server
                  | {
                        id?: string;
                    };
          };
}

/**
 * Represents a chat message reaction info
 */
export class ChatMessageReactionInfo extends ReactionInfo {
    /**
     * The ID of the chat message the reaction is in
     */
    public messageID: string;

    /**
     * The type of the chat message reaction
     */
    public type: string;

    /**
     * Create a new ChatMessageReactionInfo
     * @param data The raw data of the reaction
     * @param client The client
     */
    public constructor(data: Payload_ChannelMessageReaction, client: Client) {
        super(data, client);
        this.messageID = data.reaction.messageId;
        this.type = "message";
    }

    /**
     * The message the reaction is in
     */
    public get message(): ChatMessageReactionTypes["message"] {
        const channel = this.client.servers
            .get(this.data.serverId)
            .channels.get(this.data.reaction.channelId) as TextChannel;

        return (
            channel?.messages?.get(this.messageID) ?? {
                channelID: this.data.reaction.channelId,
                id: this.messageID,
                server: this.client.servers.get(this.data.serverId) ?? {
                    id: this.data.serverId,
                },
            }
        );
    }
}
