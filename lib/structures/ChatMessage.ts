import { AnyTextableChannel, ChatEmbedOptions, Mentions } from "../Constants";
import { Client } from "../Client";
import { Base, BaseData } from "./Base";
import { MessageCategories } from "../Constants";
import { Server } from "./Server";
import { ServerMember } from "./ServerMember";
import { TextChannel } from "./TextChannel";

export interface MessageCreateOptions {
    content?: string;
    embeds?: Array<ChatEmbedOptions>;
    isPrivate?: boolean;
    isSlient?: boolean;
    replyMessageIDs?: Array<string>;
}

export interface MessageEditOptions {
    content?: string;
    embeds?: Array<ChatEmbedOptions>;
}

export interface ChatMessageData extends BaseData<string> {
    channelID: string;
    content: string | null;
    createdAt: Date;
    createdBy: string;
    createdByWebhookID?: string | null;
    deletedAt: Date | null;
    embeds?: Array<ChatEmbedOptions> | [];
    isPrivate: boolean;
    isSlient: boolean;
    mentions: Mentions;
    replyMessageIDs: Array<string>;
    serverID: string | null;
    type: MessageCategories;
    updatedAt: Date | null;
}

export interface RawEmote {
    id: number;
    name: string;
    url: string;
}

export interface RawChatMessage {
    channelId: string;
    content?: string;
    createdAt: string;
    createdBy: string;
    createdByWebhookId?: string;
    deletedAt?: string;
    embeds?: Array<ChatEmbedOptions>;
    id: string;
    isPrivate: boolean;
    isSilent: boolean;
    mentions: Mentions;
    replyMessageIds: Array<string>;
    serverId?: string;
    type: MessageCategories;
    updatedAt?: string;
}

export class ChatMessage<
    T extends AnyTextableChannel = AnyTextableChannel
> extends Base<string> {
    private _cachedChannel!: T extends AnyTextableChannel ? T : undefined;

    private _cachedServer?: T extends Server ? Server : Server | null;

    public channelID: string;

    public content?: string | null;

    public createdAt: Date;

    public createdBy: string;

    public createdByWebhookID?: string | null;

    public deletedAt: Date | null;

    public embeds?: Array<ChatEmbedOptions> | [];

    public isPrivate: boolean;

    public isSilent: boolean;

    public mentions: Mentions;

    public replyMessageIDs: Array<string>;

    public serverID: string | null;

    public type: MessageCategories;

    public updatedAt: Date | null;

    public constructor(data: RawChatMessage, client: Client) {
        super(data.id, client);

        this.channelID = data.channelId;
        this.content = data.content ?? null;
        this.createdAt = new Date(data.createdAt);
        this.createdBy = data.createdBy;
        this.createdByWebhookID = data.createdByWebhookId ?? null;
        this.deletedAt = data["deletedAt" as keyof object]
            ? new Date(data["deletedAt" as keyof object])
            : null;
        this.embeds = data.embeds ?? [];
        this.isPrivate = data.isPrivate;
        this.isSilent = data.isSilent;
        this.mentions = data.mentions;
        this.replyMessageIDs = data.replyMessageIds;
        this.serverID = data.serverId ?? null;
        this.type = data.type;
        this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : null;
    }

    public get channel(): T extends AnyTextableChannel ? T : undefined {
        if (!this.channelID)
            throw new Error(
                `Unable to retrieve channel from ${this.constructor.name}#channelID`
            );
        if (!this.serverID)
            throw new Error(
                `Unable to retrieve channel from ${this.constructor.name}#serverID`
            );

        this._cachedChannel = this.client.servers
            .get(this.serverID)
            .channels.get(this.channelID) as T extends AnyTextableChannel
            ? T
            : undefined;

        return this._cachedChannel ? this._cachedChannel : undefined;
    }

    public get server(): T extends Server ? Server : Server | null {
        if (!this.serverID)
            throw new Error(
                `Unable to retrieve server from ${this.constructor.name}#serverID`
            );

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

    public get member(): T extends Server
        ? ServerMember
        : ServerMember | Promise<ServerMember> | undefined {
        const server = this.client.servers.get(this.serverID);

        if (server?.members?.get(this.createdBy) && this.createdBy) {
            return server?.members.get(this.createdBy) as T extends Server
                ? ServerMember
                : ServerMember | Promise<ServerMember> | undefined;
        } else if (this.createdBy && this.serverID) {
            const member = this.client.getServerMember(
                this.serverID,
                this.createdBy
            );

            void this.setCache(member);

            return (server?.members.get(this.createdBy) ??
                member) as T extends Server
                ? ServerMember
                : ServerMember | Promise<ServerMember> | undefined;
        } else {
            const channel = this.client.servers
                .get(this.serverID)
                .channels.get(this.channelID) as TextChannel;
            const message = channel?.messages?.get(this.id);

            if (
                message instanceof ChatMessage &&
                message.serverID &&
                message.createdBy
            ) {
                const member = this.client.getServerMember(
                    message.serverID,
                    message.createdBy
                );

                void this.setCache(member);

                return undefined as T extends Server ? ServerMember : undefined;
            }
        }
    }

    /**
     * Add a reaction emote to the message
     * @param emoteID The ID of the emote
     * @returns {Promise<void>}
     */
    public addReactionEmote(emoteID: number): Promise<void> {
        return this.client.addReactionEmote(this.channelID, this.id, emoteID);
    }

    /**
     * Delete the message
     * @returns {Promise<void>}
     */
    public delete(): Promise<void> {
        return this.client.deleteChannelMessage(this.channelID, this.id);
    }

    /**
     * Delete a reaction emote from the message
     * @param emoteID The ID of the emote
     * @returns {Promise<void>}
     */
    public deleteReactionEmote(emoteID: number): Promise<void> {
        return this.client.deleteReactionEmote(
            this.channelID,
            this.id,
            emoteID
        );
    }

    /**
     * Edit the message
     * @param options The options to edit the message with
     * @returns {Promise<Message<T>>}
     */
    public edit<T extends AnyTextableChannel = AnyTextableChannel>(
        options: MessageEditOptions
    ): Promise<ChatMessage<T>> {
        return this.client.editChannelMessage(this.channelID, this.id, options);
    }

    private async setCache(
        obj: Promise<ServerMember> | Promise<Server>
    ): Promise<void> {
        const server = this.client.servers.get(this.serverID);
        const awaitObj = await obj;

        if (server && awaitObj instanceof ServerMember) {
            server?.members.add(awaitObj);

            if (awaitObj.user) {
                this.client.users.add(awaitObj.user);
            }
        } else if (awaitObj instanceof Server) {
            this.client.servers.add(awaitObj);
        }
    }

    public override toJSON(): ChatMessageData {
        return {
            ...super.toJSON(),
            channelID: this.channelID,
            content: this.content,
            createdAt: this.createdAt,
            createdBy: this.createdBy,
            createdByWebhookID: this.createdByWebhookID,
            deletedAt: this.deletedAt,
            embeds: this.embeds,
            isPrivate: this.isPrivate,
            isSlient: this.isSilent,
            mentions: this.mentions,
            replyMessageIDs: this.replyMessageIDs,
            serverID: this.serverID,
            type: this.type,
            updatedAt: this.updatedAt,
        };
    }

    protected override update(data: RawChatMessage): void {
        if (data.channelId !== undefined) {
            this.channelID = data.channelId;
        }

        if (data.content !== undefined) {
            this.content = data.content ?? null;
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

        if (data.embeds !== undefined) {
            this.embeds = data.embeds ?? [];
        }

        if (data.id !== undefined) {
            this.id = data.id;
        }

        if (data.isPrivate !== undefined) {
            this.isPrivate = data.isPrivate;
        }

        if (data.isSilent !== undefined) {
            this.isSilent = data.isSilent;
        }

        if (data.mentions !== undefined) {
            this.mentions = data.mentions;
        }

        if (data.replyMessageIds !== undefined) {
            this.replyMessageIDs = data.replyMessageIds;
        }

        if (data.serverId !== undefined) {
            this.serverID = data.serverId ?? null;
        }

        if (data.type !== undefined) {
            this.type = data.type;
        }

        if (data.updatedAt !== undefined) {
            this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : null;
        }
    }
}
