import { Client } from "../Client";
import {
    RawServerChannel,
    ServerChannel,
    ServerChannelData,
} from "./ServerChannel";
import TypedCollection from "../utils/TypedCollection";
import {
    ChatMessage,
    MessageCreateOptions,
    MessageEditOptions,
    ChatMessageData,
    RawChatMessage,
} from "./ChatMessage";
import { AnyTextableChannel } from "../Constants";

export interface TextChannelData extends ServerChannelData {
    messages: Array<ChatMessageData>;
}

export class TextChannel extends ServerChannel {
    public messages: TypedCollection<
        string,
        RawChatMessage,
        ChatMessage<AnyTextableChannel>
    >;

    public constructor(data: RawServerChannel, client: Client) {
        super(data, client);

        this.messages = new TypedCollection(
            ChatMessage,
            client,
            client.options.collectionLimits?.messages
        );

        this.update(data);
    }

    /**
     * Create a message
     * @param channelID The ID of the channel
     * @param options The message options
     * @returns {Promise<Message<T>>}
     */
    public createMessage<T extends AnyTextableChannel = AnyTextableChannel>(
        options: MessageCreateOptions
    ): Promise<ChatMessage<T>> {
        return this.client.createChannelMessage(this.id, options);
    }

    /**
     * Delete a message
     * @param messageID The ID of the message
     * @returns {Promise<void>}
     */
    public deleteMessage(messageID: string): Promise<void> {
        return this.client.deleteChannelMessage(this.id, messageID);
    }

    /**
     * Edit a message
     * @param messageID The ID of the message
     * @param options The new message options
     * @returns {Promise<Message<T>>}
     */
    public editMessage<T extends AnyTextableChannel = AnyTextableChannel>(
        messageID: string,
        options: MessageEditOptions
    ): Promise<ChatMessage<T>> {
        return this.client.editChannelMessage(this.id, messageID, options);
    }

    public override toJSON(): TextChannelData {
        return {
            ...super.toJSON(),
            messages: this.messages.map((message) => message.toJSON()),
        };
    }
}
