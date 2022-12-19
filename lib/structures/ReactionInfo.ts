import { Client } from "../Client";
import { ServerMember } from "./ServerMember";
import { RawEmote } from "./ChatMessage";
import {
    Payload_ChannelMessageReaction,
    Payload_ForumTopicReaction,
} from "../Constants";

export class ReactionInfo {
    public channelID: string;

    public client!: Client;

    public createdBy: string;

    public data: Payload_ChannelMessageReaction | Payload_ForumTopicReaction;

    public emote: RawEmote;

    public constructor(
        data: Payload_ChannelMessageReaction | Payload_ForumTopicReaction,
        client: Client
    ) {
        this.channelID = data.reaction.channelId;
        this.createdBy = data.reaction.createdBy;
        this.data = data;
        this.emote = {
            id: data.reaction.emote.id,
            name: data.reaction.emote.name,
            url: data.reaction.emote.url,
        };
        Object.defineProperty(this, "client", {
            configurable: false,
            enumerable: false,
            value: client,
            writable: false,
        });
    }

    get creator(): ServerMember | { id: string } {
        return (
            this.client.servers
                .get(this.data.serverId)
                ?.members.get(this.data.reaction.createdBy) ?? {
                id: this.data.reaction.createdBy,
            }
        );
    }
}
