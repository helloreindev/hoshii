import { Client } from "../Client";
import { ServerMember } from "./ServerMember";
import { RawEmote } from "./ChatMessage";
import {
    Payload_ChannelMessageReaction,
    Payload_ForumTopicReaction,
} from "../Constants";

/**
 * Represents a reaction info
 */
export class ReactionInfo {
    /**
     * The ID of the channel the reaction is in
     */
    public channelID: string;

    /**
     * The client
     */
    public client!: Client;

    /**
     * The ID of the user who created the reaction
     */
    public createdBy: string;

    /**
     * The raw data of the reaction
     */
    public data: Payload_ChannelMessageReaction | Payload_ForumTopicReaction;

    /**
     * The raw emote of the reaction
     */
    public emote: RawEmote;

    /**
     * Create a new ReactionInfo
     * @param data The raw data of the reaction
     * @param client The client
     */
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

    /**
     * The creator of the reaction
     */
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
