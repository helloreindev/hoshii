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

export class ChatMessageReactionInfo extends ReactionInfo {
    public messageID: string;

    public type: string;

    public constructor(data: Payload_ChannelMessageReaction, client: Client) {
        super(data, client);
        this.messageID = data.reaction.messageId;
        this.type = "message";
    }

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
