import TypedEmitter from "./utils/TypedEmitter";
import { WebSocket } from "./gateway/WebSocket";
import {
    AnyChannel,
    AnyTextableChannel,
    CalendarEventResponse,
    CalendarEventRSVPResponse,
    ClientEvents,
    DocResponse,
    ForumTopicCommentResponse,
    ForumTopicResponse,
    GATEWAY_EVENTS,
    ListItemResponse,
    ChannelMessageResponse,
    ServerBanResponse,
    ServerChannelResponse,
    ServerMemberResponse,
    ServerMemberSocialLinkResponse,
    ServerMemberXPBody,
    ServerMemberXPResponse,
    ServerResponse,
    ServerWebhookResponse,
    SocialLink,
    ChannelMessagesResponse,
    DocsResponse,
    ForumTopicsResponse,
    ListItemsResponse,
    CalendarEventsResponse,
    CalendarEventRSVPsResponse,
    ServerWebhooksResponse,
    ServerMembersResponse,
    ForumTopicCommentsResponse,
} from "./Constants";
import { RequestHandler, RESTOptions } from "./rest/RequestHandler";
import TypedCollection from "./utils/TypedCollection";
import { RawUser, User } from "./structures/User";
import { RawServer, Server } from "./structures/Server";
import { ClientUser } from "./structures/ClientUser";
import {
    Webhook,
    WebhookEditOptions,
    WebhookFilter,
} from "./structures/Webhook";
import * as Endpoints from "./rest/Endpoints";
import { GatewayHandler } from "./gateway/GatewayHandler";
import { ServerChannelEditOptions } from "./structures/ServerChannel";
import { Channel } from "./structures/Channel";
import { ServerMemberBan } from "./structures/ServerMemberBan";
import {
    ServerMember,
    ServerMemberEditOptions,
} from "./structures/ServerMember";
import { Util } from "./utils/Util";
import {
    CalendarEvent,
    CalendarEventOptions,
    CalendarEventFilter,
} from "./structures/CalendarEvent";
import {
    CalendarEventRSVP,
    CalendarEventRSVPEditOptions,
} from "./structures/CalendarEventRSVP";
import { Doc, DocOptions, DocsFilter } from "./structures/Doc";
import {
    ChannelMessagesFilter,
    ChatMessage,
    MessageCreateOptions,
    MessageEditOptions,
} from "./structures/ChatMessage";
import { ListItem, ListItemOptions } from "./structures/ListItem";
import {
    ForumTopicComment,
    ForumTopicCommentOptions,
} from "./structures/ForumTopicComment";
import { ForumChannel } from "./structures/ForumChannel";
import {
    ForumTopic,
    ForumTopicsFilter,
    ForumTopicOptions,
} from "./structures/ForumTopic";
import { TextChannel } from "./structures/TextChannel";
import { DocChannel } from "./structures/DocChannel";
import { CalendarChannel } from "./structures/CalendarChannel";

export interface ClientOptions {
    collectionLimits: CollectionLimits;
    compress?: boolean;
    reconnect?: boolean;
    reconnectAttemptLimit?: number;
    replayMissedEvents?: boolean;
    rest?: boolean;
    restOptions?: RESTOptions;
}

export interface CollectionLimits {
    docs?: number;
    messages?: number;
    scheduledEvents?: number;
    scheduledEventsRSVPS?: number;
    topicComments?: number;
    topics?: number;
}

export class Client extends TypedEmitter<ClientEvents> {
    private _gateway: GatewayHandler;

    public options: ClientOptions;

    public requestHandler: RequestHandler;

    public servers: TypedCollection<string, RawServer, Server>;

    public startTime: number;

    public token: string;

    public user: ClientUser;

    public users: TypedCollection<string, RawUser, User>;

    public util: Util;

    public ws: WebSocket;

    public constructor(token: string, options: ClientOptions) {
        if (!token) {
            throw new Error("No token provided");
        }

        super();

        this.options = Object.assign<ClientOptions, ClientOptions>(
            {
                collectionLimits: {
                    docs: 100,
                    messages: 100,
                    scheduledEvents: 100,
                    scheduledEventsRSVPS: 100,
                    topicComments: 100,
                    topics: 100,
                },
                compress: false,
                reconnect: true,
                reconnectAttemptLimit: 1,
                replayMissedEvents: true,
                rest: true,
            },
            options
        );
        this.requestHandler = new RequestHandler(
            this,
            this.options.restOptions
        );
        this.startTime = 0;
        this.servers = new TypedCollection(Server, this);
        this.token = token;
        this.users = new TypedCollection(User, this);
        this.util = new Util(this);
        this.ws = new WebSocket(this);
        this._gateway = new GatewayHandler(this);

        this.options.restOptions = this.requestHandler.options;
    }

    public get uptime(): number {
        return this.startTime ? Date.now() - this.startTime : 0;
    }

    /**
     * Add a reaction emote to a forum topic comment
     * @param channelID The ID of the channel
     * @param topicID The ID of the forum topic
     * @param commentID The ID of the forum topic comment
     * @param emoteID The ID of the emote
     * @returns {Promise<void>}
     */
    public addForumTopicCommentReactionEmote(
        channelID: string,
        topicID: number,
        commentID: number,
        emoteID: number
    ): Promise<void> {
        if (!channelID) {
            throw new Error("No channel ID provided");
        }

        if (!topicID) {
            throw new Error("No topic ID provided");
        }

        if (!commentID) {
            throw new Error("No comment ID provided");
        }

        if (!emoteID) {
            throw new Error("No emote ID provided");
        }

        return this.requestHandler.authRequest<void>({
            endpoint: Endpoints.ForumTopicCommentEmote(
                channelID,
                topicID,
                commentID,
                emoteID
            ),
            method: "PUT",
        });
    }

    /**
     * Add a reaction emote to a forum topic
     * @param channelID The ID of the channel
     * @param topicID The ID of the forum topic
     * @param emoteID The ID of the emote
     * @returns {Promise<void>}
     */
    public addForumTopicReactionEmote(
        channelID: string,
        topicID: number,
        emoteID: number
    ): Promise<void> {
        if (!channelID) {
            throw new Error("No channel ID provided");
        }

        if (!topicID) {
            throw new Error("No topic ID provided");
        }

        if (!emoteID) {
            throw new Error("No emote ID provided");
        }

        return this.requestHandler.authRequest<void>({
            endpoint: Endpoints.ForumTopicEmote(channelID, topicID, emoteID),
            method: "PUT",
        });
    }

    /**
     * Add a reaction emote to any supported content type
     * @param channelID The ID of the channel
     * @param contentID The ID of the content
     * @param emoteID The ID of the emote
     * @returns {Promise<void>}
     */
    public addReactionEmote(
        channelID: string,
        contentID: string,
        emoteID: number
    ): Promise<void> {
        if (!channelID) {
            throw new Error("No channel ID provided");
        }

        if (!contentID) {
            throw new Error("No content ID provided");
        }

        if (!emoteID) {
            throw new Error("No emote ID provided");
        }

        return this.requestHandler.authRequest<void>({
            endpoint: Endpoints.ChannelMessageContentEmote(
                channelID,
                contentID,
                emoteID
            ),
            method: "PUT",
        });
    }

    /**
     * Add a server member to a group
     * @param groupID The ID of the group
     * @param memberID The ID of the member
     * @returns {Promise<void>}
     */
    public addServerMemberGroup(
        groupID: string,
        memberID: string
    ): Promise<void> {
        if (!groupID) {
            throw new Error("No group ID provided");
        }

        if (!memberID) {
            throw new Error("No member ID provided");
        }

        return this.requestHandler.authRequest<void>({
            endpoint: Endpoints.ServerGroupMember(groupID, memberID),
            method: "POST",
        });
    }

    /**
     * Add a role to a server member
     * @param serverID The ID of the server
     * @param memberID The ID of the member
     * @param roleID The ID of the role
     * @returns {Promise<void>}
     */
    public addServerMemberRole(
        serverID: string,
        memberID: string,
        roleID: number
    ): Promise<void> {
        if (!serverID) {
            throw new Error("No server ID provided");
        }

        if (!memberID) {
            throw new Error("No member ID provided");
        }

        if (!roleID) {
            throw new Error("No role ID provided");
        }

        return this.requestHandler.authRequest<void>({
            endpoint: Endpoints.ServerMemberRole(serverID, memberID, roleID),
            method: "PUT",
        });
    }

    /**
     * Award a server member
     * @param serverID The ID of the server
     * @param memberID The ID of the member
     * @param amount The amount to award
     * @returns
     */
    public awardServerMember(
        serverID: string,
        memberID: string,
        amount: Omit<ServerMemberXPBody["amount"], "total">
    ): Promise<number> {
        if (!serverID) {
            throw new Error("No server ID provided");
        }

        if (!memberID) {
            throw new Error("No member ID provided");
        }

        if (!amount) {
            throw new Error("No amount provided");
        }

        if (typeof amount !== "number") {
            throw new Error("`amount` must be a number");
        }

        return this.requestHandler
            .authRequest<ServerMemberXPResponse>({
                body: { amount },
                endpoint: Endpoints.ServerMemberXP(serverID, memberID),
                method: "POST",
            })
            .then((data) => Number(data.total));
    }

    /**
     * Complete a list item
     * @param channelID The ID of the channel
     * @param itemID The ID of the item
     * @returns {Promise<void>}
     */
    public completeListItem(channelID: string, itemID: string): Promise<void> {
        if (!channelID) {
            throw new Error("No channel ID provided");
        }

        if (!itemID) {
            throw new Error("No item ID provided");
        }

        return this.requestHandler.authRequest<void>({
            endpoint: Endpoints.ListItem(channelID, itemID),
            method: "POST",
        });
    }

    /**
     * Connect the client to the Guilded gateway
     */
    public connect(): void {
        this.ws.connect();
        this.ws.on("GATEWAY_WELCOME", (data) => {
            this.startTime = Date.now();
            this.user = new ClientUser(data.user, this);
            this.emit("ready");
        });

        this.ws.on("disconnect", (err) => {
            this.startTime = 0;
            this.emit("error", err);
        });

        this.ws.on("GATEWAY_PARSED_PACKET", (type, data) => {
            void this._gateway.handleMessage(
                type as keyof GATEWAY_EVENTS,
                data
            );
        });
    }

    /**
     * Create a calendar event
     * @param channelID The ID of the channel
     * @param options The options to create the event with
     * @returns {Promise<CalendarEvent>}
     */
    public createCalendarEvent(
        channelID: string,
        options: CalendarEventOptions
    ): Promise<CalendarEvent> {
        if (!channelID) {
            throw new Error("No channel ID provided");
        }

        if (!options) {
            throw new Error("No options provided");
        }

        if (typeof options !== "object") {
            throw new Error("`options` must be an object");
        }

        return this.requestHandler
            .authRequest<CalendarEventResponse>({
                body: options,
                endpoint: Endpoints.ChannelEvents(channelID),
                method: "POST",
            })
            .then((data) => new CalendarEvent(data.calendarEvent, this));
    }

    /**
     * Create a channel message
     * @param channelID The ID of the channel
     * @param options The message options
     * @returns {Promise<Message<T>>}
     */
    public createChannelMessage<
        T extends AnyTextableChannel = AnyTextableChannel
    >(
        channelID: string,
        options: MessageCreateOptions
    ): Promise<ChatMessage<T>> {
        if (!channelID) {
            throw new Error("No channel ID provided");
        }

        if (!options) {
            throw new Error("No options provided");
        }

        if (typeof options !== "object") {
            throw new Error("`options` must be an object");
        }

        return this.requestHandler
            .authRequest<ChannelMessageResponse>({
                body: {
                    content: options.content,
                    embeds: options.embeds,
                    isPrivate: options.isPrivate,
                    isSlient: options.isSlient,
                    replyMessageIds: options.replyMessageIDs,
                },
                endpoint: Endpoints.ChannelMessages(channelID),
                method: "POST",
            })
            .then((data) => new ChatMessage<T>(data.message, this));
    }

    /**
     * Create a doc
     * @param channelID The ID of the channel
     * @param options The option to create the doc with
     * @returns {Promise<Doc>}
     */
    public createDoc(channelID: string, options: DocOptions): Promise<Doc> {
        if (channelID) {
            throw new Error("No channel ID provided");
        }

        if (!options) {
            throw new Error("No options provided");
        }

        if (typeof options !== "object") {
            throw new Error("`options` must be an object");
        }

        return this.requestHandler
            .authRequest<DocResponse>({
                body: options,
                endpoint: Endpoints.ChannelDocs(channelID),
                method: "POST",
            })
            .then((data) => new Doc(data.doc, this));
    }

    /**
     * Create a forum topic
     * @param channelID The ID of the channel
     * @param options The forum topic options
     * @returns {Promise<ForumTopic<T>>}
     */
    public createForumTopic<T extends ForumChannel = ForumChannel>(
        channelID: string,
        options: ForumTopicOptions
    ): Promise<ForumTopic<T>> {
        if (!channelID) {
            throw new Error("No channel ID provided");
        }

        if (!options) {
            throw new Error("No options provided");
        }

        if (typeof options !== "object") {
            throw new Error("`options` must be an object");
        }

        return this.requestHandler
            .authRequest<ForumTopicResponse>({
                body: options,
                endpoint: Endpoints.ForumTopics(channelID),
                method: "POST",
            })
            .then((data) => new ForumTopic<T>(data.forumTopic, this));
    }

    /**
     * Create a forum topic comment
     * @param channelID The ID of the channel
     * @param topicID The ID of the forum topic
     * @param options The comment options
     * @returns {Promise<ForumTopicComment>}
     */
    public createForumTopicComment(
        channelID: string,
        topicID: number,
        options: ForumTopicCommentOptions
    ): Promise<ForumTopicComment> {
        if (!channelID) {
            throw new Error("No channel ID provided");
        }

        if (!topicID) {
            throw new Error("No topic ID provided");
        }

        if (!options) {
            throw new Error("No options provided");
        }

        if (typeof options !== "object") {
            throw new Error("`options` must be an object");
        }

        return this.requestHandler
            .authRequest<ForumTopicCommentResponse>({
                body: options,
                endpoint: Endpoints.ForumTopicComments(channelID, topicID),
                method: "POST",
            })
            .then(
                (data) => new ForumTopicComment(data.forumTopicComment, this)
            );
    }

    /**
     * Create a list item
     * @param channelID The ID of the channel
     * @param options The list item options
     * @returns {Promise<ListItem>}
     */
    public createListItem(
        channelID: string,
        options: ListItemOptions
    ): Promise<ListItem> {
        if (!channelID) {
            throw new Error("No channel ID provided");
        }

        if (!options) {
            throw new Error("No options provided");
        }

        if (typeof options !== "object") {
            throw new Error("`options` must be an object");
        }

        return this.requestHandler
            .authRequest<ListItemResponse>({
                body: options,
                endpoint: Endpoints.ListItems(channelID),
                method: "POST",
            })
            .then((data) => new ListItem(data.listItem, this));
    }

    /**
     * Create a server member ban
     * @param serverID The ID of the server
     * @param memberID The Id othe member
     * @param reason The reason for the ban
     * @returns {Promise<ServerMemberBan>}
     */
    public createServerMemberBan(
        serverID: string,
        memberID: string,
        reason?: string
    ): Promise<ServerMemberBan> {
        if (!serverID) {
            throw new Error("No server ID provided");
        }

        if (!memberID) {
            throw new Error("No member ID provided");
        }

        if (typeof reason !== "string") {
            throw new Error("`reason` must be a string");
        }

        return this.requestHandler
            .authRequest<ServerBanResponse>({
                body: { reason },
                endpoint: Endpoints.ServerBan(serverID, memberID),
                method: "POST",
            })
            .then(
                (data) =>
                    new ServerMemberBan(data.serverMemberBan, this, serverID)
            );
    }

    /**
     * Delete a calender event
     * @param channelID The ID of the channel
     * @param eventID The ID of the event
     * @returns {Promise<void>}
     */
    public deleteCalendarEvent(
        channelID: string,
        eventID: number
    ): Promise<void> {
        if (!channelID) {
            throw new Error("No channel ID provided");
        }

        if (!eventID) {
            throw new Error("No event ID provided");
        }

        return this.requestHandler.authRequest<void>({
            endpoint: Endpoints.ChannelEvent(channelID, eventID),
            method: "DELETE",
        });
    }

    /**
     * Delete a calendar event RSVP
     * @param channelID The ID of the channel
     * @param eventID The ID of the event
     * @param memberID The ID of the member
     * @returns {Promise<void>}
     */
    public deleteCalendarEventRSVP(
        channelID: string,
        eventID: number,
        memberID: string
    ): Promise<void> {
        if (!channelID) {
            throw new Error("No channel ID provided");
        }

        if (!eventID) {
            throw new Error("No event ID provided");
        }

        if (!memberID) {
            throw new Error("No member ID provided");
        }

        return this.requestHandler.authRequest<void>({
            endpoint: Endpoints.ChannelEventRSVP(channelID, eventID, memberID),
            method: "DELETE",
        });
    }

    /**
     * Delete a channel message
     * @param channelID The ID of the channel
     * @param messageID The ID of the message
     * @returns {Promise<void>}
     */
    public deleteChannelMessage(
        channelID: string,
        messageID: string
    ): Promise<void> {
        if (!channelID) {
            throw new Error("No channel ID provided");
        }

        if (!messageID) {
            throw new Error("No message ID provided");
        }

        return this.requestHandler.authRequest<void>({
            endpoint: Endpoints.ChannelMessage(channelID, messageID),
            method: "DELETE",
        });
    }

    /**
     * Delete a doc
     * @param channelID The ID of the channel
     * @param docID The ID of the doc
     * @returns {Promise<void>}
     */
    public deleteDoc(channelID: string, docID: number): Promise<void> {
        if (!channelID) {
            throw new Error("No channel ID provided");
        }

        if (!docID) {
            throw new Error("No doc ID provided");
        }

        return this.requestHandler.authRequest<void>({
            endpoint: Endpoints.ChannelDoc(channelID, docID),
            method: "DELETE",
        });
    }

    /**
     * Delete a forum topic
     * @param channelID The ID of the channel
     * @param topicID The ID of the forum topic
     * @returns {Promise<void>}
     */
    public deleteForumTopic(channelID: string, topicID: number): Promise<void> {
        if (!channelID) {
            throw new Error("No channel ID provided");
        }

        if (!topicID) {
            throw new Error("No topic ID provided");
        }

        return this.requestHandler.authRequest<void>({
            endpoint: Endpoints.ForumTopic(channelID, topicID),
            method: "DELETE",
        });
    }

    /**
     * Delete a forum topic comment
     * @param channelID The ID of the channel
     * @param topicID The ID of the forum topic
     * @param commentID The ID of the forum comment
     * @returns {Promise<void>}
     */
    public deleteForumTopicComment(
        channelID: string,
        topicID: number,
        commentID: number
    ): Promise<void> {
        if (!channelID) {
            throw new Error("No channel ID provided");
        }

        if (!topicID) {
            throw new Error("No topic ID provided");
        }

        if (!commentID) {
            throw new Error("No comment ID provided");
        }

        return this.requestHandler.authRequest<void>({
            endpoint: Endpoints.ForumTopicComment(
                channelID,
                topicID,
                commentID
            ),
            method: "DELETE",
        });
    }

    /**
     * Delete a reaction emote from a forum topic comment
     * @param channelID The ID of the channel
     * @param topicID The ID of the forum topic
     * @param commentID The ID of the forum topic comment
     * @param emoteID The ID of the emote
     * @returns {Promise<void>}
     */
    public deleteForumTopicCommentReactionEmote(
        channelID: string,
        topicID: number,
        commentID: number,
        emoteID: number
    ): Promise<void> {
        if (!channelID) {
            throw new Error("No channel ID provided");
        }

        if (!topicID) {
            throw new Error("No topic ID provided");
        }

        if (!commentID) {
            throw new Error("No comment ID provided");
        }

        if (!emoteID) {
            throw new Error("No emote ID provided");
        }

        return this.requestHandler.authRequest<void>({
            endpoint: Endpoints.ForumTopicCommentEmote(
                channelID,
                topicID,
                commentID,
                emoteID
            ),
            method: "DELETE",
        });
    }

    /**
     * Delete a reaction emote from a forum topic
     * @param channelID The ID of the channel
     * @param topicID The ID of the forum topic
     * @param emoteID The ID of the emote
     * @returns {Promise<void>}
     */
    public deleteForumTopicReactionEmote(
        channelID: string,
        topicID: number,
        emoteID: number
    ): Promise<void> {
        if (!channelID) {
            throw new Error("No channel ID provided");
        }

        if (!topicID) {
            throw new Error("No topic ID provided");
        }

        if (!topicID) {
            throw new Error("No reaction ID provided");
        }

        if (!emoteID) {
            throw new Error("No emote ID provided");
        }

        return this.requestHandler.authRequest<void>({
            endpoint: Endpoints.ForumTopicEmote(channelID, topicID, emoteID),
            method: "DELETE",
        });
    }

    /**
     * Delete a list item
     * @param channelID The ID of the channel
     * @param itemID The ID of the item
     * @returns {Promise<void>}
     */
    public deleteListItem(channelID: string, itemID: string): Promise<void> {
        if (!channelID) {
            throw new Error("No channel ID provided");
        }

        if (!itemID) {
            throw new Error("No item ID provided");
        }

        return this.requestHandler.authRequest<void>({
            endpoint: Endpoints.ListItem(channelID, itemID),
            method: "DELETE",
        });
    }

    /**
     * Delete a reaction emote
     * @param channelID The ID of the channel
     * @param contentID The ID of the content
     * @param emoteID The ID of the emote
     * @returns {Promise<void>}
     */
    public deleteReactionEmote(
        channelID: string,
        contentID: string,
        emoteID: number
    ): Promise<void> {
        if (!channelID) {
            throw new Error("No channel ID provided");
        }

        if (!contentID) {
            throw new Error("No content ID provided");
        }

        if (!emoteID) {
            throw new Error("No emote ID provided");
        }

        return this.requestHandler.authRequest<void>({
            endpoint: Endpoints.ChannelMessageContentEmote(
                channelID,
                contentID,
                emoteID
            ),
            method: "DELETE",
        });
    }

    /**
     * Delete a server channel
     * @param channelID The ID of the channel
     * @returns {Promise<void>}
     */
    public deleteServerChannel(channelID: string): Promise<void> {
        if (!channelID) {
            throw new Error("No channel ID provided");
        }

        return this.requestHandler.authRequest<void>({
            endpoint: Endpoints.Channel(channelID),
            method: "DELETE",
        });
    }

    /**
     * Delete a server webhook
     * @param serverID The ID of the server
     * @param webhookID The ID of the webhook
     * @returns {Promise<void>}
     */
    public deleteServerWebhook(
        serverID: string,
        webhookID: string
    ): Promise<void> {
        if (!serverID) {
            throw new Error("No server ID provided");
        }

        if (!webhookID) {
            throw new Error("No webhook ID provided");
        }

        return this.requestHandler.authRequest<void>({
            endpoint: Endpoints.ServerWebhook(serverID, webhookID),
            method: "DELETE",
        });
    }

    /**
     * Disconnect the client from the Guilded gateway
     */
    public disconnect(): void {
        if (!this.ws.alive) {
            this.ws.disconnect(false);
        }
    }

    /**
     * Edit a calendar event
     * @param channelID The ID of the channel
     * @param eventID The ID of the calendar event
     * @param options The options to edit the calendar event with
     * @returns {Promise<CalendarEvent>}
     */
    public editCalendarEvent(
        channelID: string,
        eventID: number,
        options: CalendarEventOptions
    ): Promise<CalendarEvent> {
        if (!channelID) {
            throw new Error("No channel ID provided");
        }

        if (!eventID) {
            throw new Error("No event ID provided");
        }

        if (!options) {
            throw new Error("No options provided");
        }

        if (typeof options !== "object") {
            throw new Error("`options` must be an object");
        }

        return this.requestHandler
            .authRequest<CalendarEventResponse>({
                body: options,
                endpoint: Endpoints.ChannelEvent(channelID, eventID),
                method: "PATCH",
            })
            .then((data) => new CalendarEvent(data.calendarEvent, this));
    }

    /**
     * Edit a calendar event RSVP
     * @param channelID The ID of the channel
     * @param eventID The ID of the event
     * @param memberID The ID of the member
     * @param options The options to edit the RSVP with
     * @returns {Promise<CalendarEventRSVP>}
     */
    public editCalendarEventRSVP(
        channelID: string,
        eventID: number,
        memberID: string,
        options: CalendarEventRSVPEditOptions
    ): Promise<CalendarEventRSVP> {
        if (!channelID) {
            throw new Error("No channel ID provided");
        }

        if (!eventID) {
            throw new Error("No event ID provided");
        }

        if (!memberID) {
            throw new Error("No member ID provided");
        }

        if (!options) {
            throw new Error("No options provided");
        }

        if (typeof options !== "object") {
            throw new Error("`options` must be an object");
        }

        return this.requestHandler
            .authRequest<CalendarEventRSVPResponse>({
                body: options,
                endpoint: Endpoints.ChannelEventRSVP(
                    channelID,
                    eventID,
                    memberID
                ),
                method: "PUT",
            })
            .then(
                (data) => new CalendarEventRSVP(data.calendarEventRsvp, this)
            );
    }

    /**
     * Edit a channel message
     * @param channelID The ID of the channel
     * @param messageID The ID of the message
     * @param options The new message options
     * @returns {Promise<Message<T>>}
     */
    public editChannelMessage<
        T extends AnyTextableChannel = AnyTextableChannel
    >(
        channelID: string,
        messageID: string,
        options: MessageEditOptions
    ): Promise<ChatMessage<T>> {
        if (!channelID) {
            throw new Error("No channel ID provided");
        }

        if (!messageID) {
            throw new Error("No message ID provided");
        }

        if (!options) {
            throw new Error("No options provided");
        }

        if (typeof options !== "object") {
            throw new Error("`options` must be an object");
        }

        return this.requestHandler
            .authRequest<ChannelMessageResponse>({
                body: options,
                endpoint: Endpoints.ChannelMessage(channelID, messageID),
                method: "PUT",
            })
            .then((data) => new ChatMessage<T>(data.message, this));
    }

    /**
     * Edit a doc
     * @param channelID The ID of the channel
     * @param docID The ID of the doc
     * @param options The options to edit the doc with
     * @returns {Promise<Doc>}
     */
    public editDoc(
        channelID: string,
        docID: number,
        options: DocOptions
    ): Promise<Doc> {
        if (!channelID) {
            throw new Error("No channel ID provided");
        }

        if (!docID) {
            throw new Error("No doc ID provided");
        }

        if (!options) {
            throw new Error("No options provided");
        }

        if (typeof options !== "object") {
            throw new Error("`options` must be an object");
        }

        return this.requestHandler
            .authRequest<DocResponse>({
                body: options,
                endpoint: Endpoints.ChannelDoc(channelID, docID),
                method: "PATCH",
            })
            .then((data) => new Doc(data.doc, this));
    }

    /**
     * Edit a forum topic
     * @param channelID The ID of the channel
     * @param topicID The ID of the forum topic
     * @param options The options to edit the forum topic with
     * @returns {Promise<ForumTopic<T>>}
     */
    public editForumTopic<T extends ForumChannel = ForumChannel>(
        channelID: string,
        topicID: number,
        options: ForumTopicOptions
    ): Promise<ForumTopic<T>> {
        if (!channelID) {
            throw new Error("No channel ID provided");
        }

        if (!topicID) {
            throw new Error("No topic ID provided");
        }

        if (!options) {
            throw new Error("No options provided");
        }

        if (typeof options !== "object") {
            throw new Error("`options` must be an object");
        }

        return this.requestHandler
            .authRequest<ForumTopicResponse>({
                body: options,
                endpoint: Endpoints.ForumTopic(channelID, topicID),
                method: "PATCH",
            })
            .then((data) => new ForumTopic<T>(data.forumTopic, this));
    }

    /**
     * Edit a forum topic comment
     * @param channelID The ID of the channel
     * @param topicID The ID of the forum topic
     * @param commentID The ID of the forum comment
     * @param options The comment options
     * @returns
     */
    public editForumTopicComment(
        channelID: string,
        topicID: number,
        commentID: number,
        options: ForumTopicCommentOptions
    ): Promise<ForumTopicComment> {
        if (!channelID) {
            throw new Error("No channel ID provided");
        }

        if (!topicID) {
            throw new Error("No topic ID provided");
        }

        if (!commentID) {
            throw new Error("No comment ID provided");
        }

        if (!options) {
            throw new Error("No options provided");
        }

        if (typeof options !== "object") {
            throw new Error("`options` must be an object");
        }

        return this.requestHandler
            .authRequest<ForumTopicCommentResponse>({
                body: options,
                endpoint: Endpoints.ForumTopicComment(
                    channelID,
                    topicID,
                    commentID
                ),
                method: "PATCH",
            })
            .then(
                (data) => new ForumTopicComment(data.forumTopicComment, this)
            );
    }

    /**
     * Edit a list item
     * @param channelID The ID of the channel
     * @param itemID The ID of the item
     * @param options The options to edit the list item with
     * @returns {Promise<ListItem>}
     */
    public editListItem(
        channelID: string,
        itemID: string,
        options: ListItemOptions
    ): Promise<ListItem> {
        if (!channelID) {
            throw new Error("No channel ID provided");
        }

        if (!itemID) {
            throw new Error("No item ID provided");
        }

        if (!options) {
            throw new Error("No options provided");
        }

        if (typeof options !== "object") {
            throw new Error("`options` must be an object");
        }

        return this.requestHandler
            .authRequest<ListItemResponse>({
                body: options,
                endpoint: Endpoints.ListItem(channelID, itemID),
                method: "PATCH",
            })
            .then((data) => new ListItem(data.listItem, this));
    }

    /**
     * Edit the server channel
     * @param channelID The ID of the channel
     * @param options The options to edit the channel with
     * @param options.isPublic Whether the channel is public or not
     * @param options.name The name of the channel
     * @param options.topic The topic of the channel
     * @returns {Promise<T>}
     */
    public editServerChannel<T extends AnyChannel = AnyChannel>(
        channelID: string,
        options: ServerChannelEditOptions
    ): Promise<T> {
        if (!channelID) {
            throw new Error("No channel ID provided");
        }

        if (!options) {
            throw new Error("No options provided");
        }

        if (options.isPublic && typeof options.isPublic !== "boolean") {
            throw new Error("`options.isPublic` must be a boolean");
        }

        if (options.name && typeof options.name !== "string") {
            throw new Error("`options.name` must be a string");
        }

        if (options.topic && typeof options.topic !== "string") {
            throw new Error("`options.topic` must be a string");
        }

        return this.requestHandler
            .authRequest<ServerChannelResponse>({
                body: options,
                endpoint: Endpoints.Channel(channelID),
                method: "PATCH",
            })
            .then((data) => Channel.from<T>(data.channel, this));
    }

    /**
     * Edit a server member
     * @param serverID The ID of the server
     * @param memberID The ID of the member
     * @param options The options to edit the member with
     * @param options.nickname The nickname to set
     * @returns {Promise<void>}
     */
    public editServerMember(
        serverID: string,
        memberID: string,
        options: ServerMemberEditOptions
    ): Promise<void> {
        if (options.nickname) {
            return this.requestHandler.authRequest<void>({
                body: options,
                endpoint: Endpoints.ServerMemberNickname(serverID, memberID),
                method: "PUT",
            });
        } else {
            return this.requestHandler.authRequest<void>({
                endpoint: Endpoints.ServerMemberNickname(serverID, memberID),
                method: "DELETE",
            });
        }
    }

    /**
     * Edit a server webhook
     * @param serverID The ID of the server
     * @param webhookID The ID of the webhook
     * @param options The options to edit the webhook with
     * @param options.channelID The ID of the channel to edit the webhook in
     * @param options.name The name of the webhook
     * @returns {Promise<Webhook>}
     */
    public editServerWebhook(
        serverID: string,
        webhookID: string,
        options: WebhookEditOptions
    ): Promise<Webhook> {
        if (!serverID) {
            throw new Error("No server ID provided");
        }

        if (!webhookID) {
            throw new Error("No webhook ID provided");
        }

        if (!options) {
            throw new Error("No options provided");
        }

        if (options.channelID && typeof options.channelID !== "string") {
            throw new Error("`options.channelID` must be a string");
        }

        if (options.name && typeof options.name !== "string") {
            throw new Error("`options.name` must be a string");
        }

        return this.requestHandler
            .authRequest<ServerWebhookResponse>({
                body: options,
                endpoint: Endpoints.ServerWebhook(serverID, webhookID),
                method: "PUT",
            })
            .then((data) => new Webhook(data.webhook, this));
    }

    /**
     * Get a calendar event
     * @param channelID The ID of the channel
     * @param eventID The ID of the event
     * @returns {Promise<CalendarEvent>}
     */
    public getCalendarEvent(
        channelID: string,
        eventID: number
    ): Promise<CalendarEvent> {
        if (!channelID) {
            throw new Error("No channel ID provided");
        }

        if (!eventID) {
            throw new Error("No event ID provided");
        }

        return this.requestHandler
            .authRequest<CalendarEventResponse>({
                endpoint: Endpoints.ChannelEvent(channelID, eventID),
                method: "GET",
            })
            .then((data) => new CalendarEvent(data.calendarEvent, this));
    }

    /**
     * Get a calendar event RSVP
     * @param channelID The ID of the channel
     * @param eventID The ID of the event
     * @param memberID The ID of the member
     * @returns {Promise<CalendarEventRSVP>}
     */
    public getCalendarEventRSVP(
        channelID: string,
        eventID: number,
        memberID: string
    ): Promise<CalendarEventRSVP> {
        if (!channelID) {
            throw new Error("No channel ID provided");
        }

        if (!eventID) {
            throw new Error("No event ID provided");
        }

        if (!memberID) {
            throw new Error("No member ID provided");
        }

        return this.requestHandler
            .authRequest<CalendarEventRSVPResponse>({
                endpoint: Endpoints.ChannelEventRSVP(
                    channelID,
                    eventID,
                    memberID
                ),
                method: "GET",
            })
            .then(
                (data) =>
                    (
                        this.servers
                            .get(data.calendarEventRsvp.serverId)
                            .channels.get(channelID) as CalendarChannel
                    )?.scheduledEvents
                        .get(eventID)
                        ?.rsvps.update(data.calendarEventRsvp) ??
                    new CalendarEventRSVP(data.calendarEventRsvp, this)
            );
    }

    /**
     * Get calendar event RSVPs
     * @param channelID The ID of the channel
     * @param eventID The ID of the event
     * @returns {Promise<Array<CalendarEventRSVP>>}
     */
    public getCalendarEventRSVPs(
        channelID: string,
        eventID: number
    ): Promise<Array<CalendarEventRSVP>> {
        if (!channelID) {
            throw new Error("No channel ID provided");
        }

        if (!eventID) {
            throw new Error("No event ID provided");
        }

        return this.requestHandler
            .authRequest<CalendarEventRSVPsResponse>({
                endpoint: Endpoints.ChannelEventRSVPS(channelID, eventID),
                method: "GET",
            })
            .then((data) =>
                data.calendarEventRsvps.map(
                    (event) =>
                        (
                            this.servers
                                .get(event.serverId)
                                .channels.get(channelID) as CalendarChannel
                        )?.scheduledEvents
                            .get(eventID)
                            ?.rsvps.update(event) ??
                        new CalendarEventRSVP(event, this)
                )
            );
    }

    /**
     * Get calendar events
     * @param channelID The ID of the channel
     * @param filter The options to filter the output
     * @returns {Promise<Array<CalendarEvent>>}
     */
    public getCalendarEvents(
        channelID: string,
        filter: CalendarEventFilter
    ): Promise<Array<CalendarEvent>> {
        if (!channelID) {
            throw new Error("No channel ID provided");
        }

        const query = new URLSearchParams();

        if (filter) {
            if (filter.after) query.set("after", filter.after.toString());
            if (filter.before) query.set("before", filter.before.toString());
            if (filter.limit) query.set("limit", filter.limit.toString());
        }

        return this.requestHandler
            .authRequest<CalendarEventsResponse>({
                endpoint: Endpoints.ChannelEvents(channelID),
                method: "GET",
                query,
            })
            .then((data) =>
                data.calendarEvents.map(
                    (event) =>
                        (
                            this.servers
                                .get(event.serverId)
                                .channels.get(channelID) as CalendarChannel
                        )?.scheduledEvents.update(event) ??
                        new CalendarEvent(event, this)
                )
            );
    }

    /**
     * Get a channel message
     * @param channelID The ID of the channel
     * @param messageID The ID of the message
     * @returns {Promise<ChatMessage<T>>}
     */
    public getChannelMessage<T extends AnyTextableChannel = AnyTextableChannel>(
        channelID: string,
        messageID: string
    ): Promise<ChatMessage<T>> {
        if (!channelID) {
            throw new Error("No channel ID provided");
        }

        if (!messageID) {
            throw new Error("No message ID provided");
        }

        return this.requestHandler
            .authRequest<ChannelMessageResponse>({
                endpoint: Endpoints.ChannelMessage(channelID, messageID),
                method: "GET",
            })
            .then(
                (data) =>
                    ((
                        this.servers
                            .get(data.message.serverId)
                            .channels.get(channelID) as TextChannel
                    )?.messages.update(data.message) as ChatMessage<T>) ??
                    new ChatMessage<T>(data.message, this)
            );
    }

    /**
     * Get channel messages
     * @param channelID The ID of the channel
     * @param filter The options to filter the output
     * @returns {Promise<Array<ChatMessage<T>>>}
     */
    public getChannelMessages<
        T extends AnyTextableChannel = AnyTextableChannel
    >(
        channelID: string,
        filter: ChannelMessagesFilter
    ): Promise<Array<ChatMessage<T>>> {
        if (!channelID) {
            throw new Error("No channel ID provided");
        }

        const query = new URLSearchParams();

        if (filter) {
            if (filter.after) query.set("after", filter.after.toString());
            if (filter.before) query.set("before", filter.before.toString());
            if (filter.includePrivate)
                query.set("includePrivate", filter.includePrivate.toString());
            if (filter.limit) query.set("limit", filter.limit.toString());
        }

        return this.requestHandler
            .authRequest<ChannelMessagesResponse>({
                endpoint: Endpoints.ChannelMessages(channelID),
                method: "GET",
                query,
            })
            .then((data) =>
                data.messages.map(
                    (message) =>
                        ((
                            this.servers
                                .get(message.serverId)
                                .channels.get(channelID) as TextChannel
                        )?.messages.update(message) as ChatMessage<T>) ??
                        new ChatMessage<T>(message, this)
                )
            );
    }

    /**
     * Get a doc
     * @param channelID The ID of the channel
     * @param docID The ID of the doc
     * @returns {Promise<Doc>}
     */
    public getDoc(channelID: string, docID: number): Promise<Doc> {
        if (!channelID) {
            throw new Error("No channel ID provided");
        }

        if (!docID) {
            throw new Error("No doc ID provided");
        }

        return this.requestHandler
            .authRequest<DocResponse>({
                endpoint: Endpoints.ChannelDoc(channelID, docID),
                method: "GET",
            })
            .then(
                (data) =>
                    (
                        this.servers
                            .get(data.doc.serverId)
                            .channels.get(channelID) as DocChannel
                    )?.docs.update(data.doc) ?? new Doc(data.doc, this)
            );
    }

    /**
     * Get docs
     * @param channelID The ID of the channel
     * @param filter The options to filter the output
     * @returns {Promise<Array<Doc>>}
     */
    public getDocs(channelID: string, filter: DocsFilter): Promise<Array<Doc>> {
        if (!channelID) {
            throw new Error("No channel ID provided");
        }

        const query = new URLSearchParams();

        if (filter) {
            if (filter.before) query.set("before", filter.before.toString());
            if (filter.limit) query.set("limit", filter.limit.toString());
        }

        return this.requestHandler
            .authRequest<DocsResponse>({
                endpoint: Endpoints.ChannelDocs(channelID),
                method: "GET",
                query,
            })
            .then((data) =>
                data.docs.map(
                    (data) =>
                        (
                            this.servers
                                .get(data.serverId)
                                .channels.get(channelID) as DocChannel
                        )?.docs.update(data) ?? new Doc(data, this)
                )
            );
    }

    /**
     * Get a forum topic
     * @param channelID The ID of the channel
     * @param topicID The ID of the forum topic
     * @returns {Promise<ForumTopic<ForumChannel>>}
     */
    public getForumTopic(
        channelID: string,
        topicID: number
    ): Promise<ForumTopic<ForumChannel>> {
        if (!channelID) {
            throw new Error("No channel ID provided");
        }

        if (!topicID) {
            throw new Error("No topic ID provided");
        }

        return this.requestHandler
            .authRequest<ForumTopicResponse>({
                endpoint: Endpoints.ForumTopic(channelID, topicID),
                method: "GET",
            })
            .then((data) => this.util.updateForumTopic(data.forumTopic));
    }

    /**
     * Get a forum topic comment
     * @param channelID The ID of the channel
     * @param topicID The ID of the forum topic
     * @param commentID The ID of the forum topic comment
     * @returns {Promise<ForumTopicComment>}
     */
    public getForumTopicComment(
        channelID: string,
        topicID: number,
        commentID: number
    ): Promise<ForumTopicComment> {
        if (!channelID) {
            throw new Error("No channel ID provided");
        }

        if (!topicID) {
            throw new Error("No topic ID provided");
        }

        if (!commentID) {
            throw new Error("No comment ID provided");
        }

        return this.requestHandler
            .authRequest<ForumTopicCommentResponse>({
                endpoint: Endpoints.ForumTopicComment(
                    channelID,
                    topicID,
                    commentID
                ),
                method: "GET",
            })
            .then(
                (data) => new ForumTopicComment(data.forumTopicComment, this)
            );
    }

    /**
     * Get forum topic comments
     * @param channelID The ID of the channel
     * @param topicID The ID of the topic
     * @returns {Promise<Array<ForumTopicComment>>}
     */
    public getForumTopicComments(
        channelID: string,
        topicID: number
    ): Promise<Array<ForumTopicComment>> {
        if (!channelID) {
            throw new Error("No channel ID provided");
        }

        if (!topicID) {
            throw new Error("No topic ID provided");
        }

        return this.requestHandler
            .authRequest<ForumTopicCommentsResponse>({
                endpoint: Endpoints.ForumTopicComments(channelID, topicID),
                method: "GET",
            })
            .then((data) =>
                data.forumTopicComments.map(
                    (comment) => new ForumTopicComment(comment, this)
                )
            );
    }

    /**
     * Get forum topics
     * @param channelID The ID of the channel
     * @param filter The options to filter the output
     * @returns {Promise<Array<ForumTopic<ForumChannel>>>}
     */
    public getForumTopics(
        channelID: string,
        filter: ForumTopicsFilter
    ): Promise<Array<ForumTopic<ForumChannel>>> {
        if (!channelID) {
            throw new Error("No channel ID provided");
        }

        const query = new URLSearchParams();

        if (filter) {
            if (filter.before) query.set("before", filter.before.toString());
            if (filter.limit) query.set("limit", filter.limit.toString());
        }

        return this.requestHandler
            .authRequest<ForumTopicsResponse>({
                endpoint: Endpoints.ForumTopics(channelID),
                method: "GET",
                query,
            })
            .then((data) =>
                data.forumTopics.map((topic) =>
                    this.util.updateForumTopic(topic)
                )
            );
    }

    /**
     * Get a list item
     * @param channelID The ID of the channel
     * @param itemID The ID of the list item
     * @returns {Promise<ListItem>}
     */
    public getListItem(channelID: string, itemID: string): Promise<ListItem> {
        if (!channelID) {
            throw new Error("No channel ID provided");
        }

        if (!itemID) {
            throw new Error("No item ID provided");
        }

        return this.requestHandler
            .authRequest<ListItemResponse>({
                endpoint: Endpoints.ListItem(channelID, itemID),
                method: "GET",
            })
            .then((data) => new ListItem(data.listItem, this));
    }

    /**
     * Get list items
     * @param channelID The ID of the channel
     * @returns {Promise<Array<ListItem>>}
     */
    public getListItems(channelID: string): Promise<Array<ListItem>> {
        if (!channelID) {
            throw new Error("No channel ID provided");
        }

        return this.requestHandler
            .authRequest<ListItemsResponse>({
                endpoint: Endpoints.ListItems(channelID),
                method: "GET",
            })
            .then((data) =>
                data.listItems.map((item) => new ListItem(item, this))
            );
    }

    /**
     * Get a server
     * @param serverID The ID of the server
     * @returns {Promise<Server>}
     */
    public getServer(serverID: string): Promise<Server> {
        if (!serverID) {
            throw new Error("No server ID provided");
        }

        return this.requestHandler
            .authRequest<ServerResponse>({
                endpoint: Endpoints.Server(serverID),
                method: "GET",
            })
            .then((data) => this.util.updateServer(data.server));
    }

    /**
     * Get a server channel
     * @param channelID The ID of the channel
     * @returns {Promise<AnyChannel>}
     */
    public getServerChannel(channelID: string): Promise<AnyChannel> {
        if (!channelID) {
            throw new Error("No channel ID provided");
        }

        return this.requestHandler
            .authRequest<ServerChannelResponse>({
                endpoint: Endpoints.Channel(channelID),
                method: "GET",
            })
            .then((data) => this.util.updateChannel(data.channel));
    }

    /**
     * Get a server member
     * @param serverID The ID of the server
     * @param memberID The ID of the member
     * @returns {Promise<Member>}
     */
    public getServerMember(
        serverID: string,
        memberID: string
    ): Promise<ServerMember> {
        if (!serverID) {
            throw new Error("No server ID provided");
        }

        if (!memberID) {
            throw new Error("No member ID provided");
        }

        return this.requestHandler
            .authRequest<ServerMemberResponse>({
                endpoint: Endpoints.ServerMember(serverID, memberID),
                method: "GET",
            })
            .then((data) =>
                this.util.updateMember(serverID, memberID, data.member)
            );
    }

    /**
     * Get server members
     * @param serverID The ID of the server
     * @returns {Promise<Array<Member>>}
     */
    public getServerMembers(serverID: string): Promise<Array<ServerMember>> {
        if (!serverID) {
            throw new Error("No server ID provided");
        }

        return this.requestHandler
            .authRequest<ServerMembersResponse>({
                endpoint: Endpoints.ServerMembers(serverID),
                method: "GET",
            })
            .then((data) =>
                data.members.map((member) =>
                    this.util.updateMember(serverID, member.user.id, member)
                )
            );
    }

    /**
     * Get a social link of a server member
     * @param serverID The ID of the server
     * @param memberID The ID of the member
     * @param socialMediaName The name of the social media
     * @returns {Promise<SocialLink>}
     */
    public getServerMemberSocialLink(
        serverID: string,
        memberID: string,
        socialMediaName: string
    ): Promise<SocialLink> {
        if (!serverID) {
            throw new Error("No server ID provided");
        }

        if (!memberID) {
            throw new Error("No member ID provided");
        }

        if (!socialMediaName) {
            throw new Error("No social media name provided");
        }

        return this.requestHandler
            .authRequest<ServerMemberSocialLinkResponse>({
                endpoint: Endpoints.ServerMemberSocials(
                    serverID,
                    memberID,
                    socialMediaName
                ),
                method: "GET",
            })
            .then((data) => ({
                handle: data.socialLink.handle,
                serviceID: data.socialLink.serviceId,
                type: data.socialLink.type,
            }));
    }

    /**
     * Get server webhooks
     * @param serverID The ID of the server
     * @param filter The options to filter the output
     * @returns {Promise<Array<Webhook>>}
     */
    public getServerWebhooks(
        serverID: string,
        filter: WebhookFilter
    ): Promise<Array<Webhook>> {
        if (!serverID) {
            throw new Error("No server ID provided");
        }

        const query = new URLSearchParams();

        if (filter) {
            if (filter.channelID) query.set("channelId", filter.channelID);
        }

        return this.requestHandler
            .authRequest<ServerWebhooksResponse>({
                endpoint: Endpoints.ServerWebhooks(serverID),
                method: "GET",
                query,
            })
            .then((data) =>
                data.webhooks.map((webhook) => new Webhook(webhook, this))
            );
    }

    /**
     * Lock a forum topic
     * @param channelID The ID of the channel
     * @param topicID The ID of the forum topic
     * @returns {Promise<void>}
     */
    public lockForumTopic(channelID: string, topicID: number): Promise<void> {
        if (!channelID) {
            throw new Error("No channel ID provided");
        }

        if (!topicID) {
            throw new Error("No topic ID provided");
        }

        return this.requestHandler.authRequest<void>({
            endpoint: Endpoints.ForumTopicLock(channelID, topicID),
            method: "PUT",
        });
    }

    /**
     * Pin a forum topic
     * @param channelID The ID of the channel
     * @param topicID The ID of the forum topic
     * @returns {Promise<void>}
     */
    public pinForumTopic(channelID: string, topicID: number): Promise<void> {
        if (!channelID) {
            throw new Error("No channel ID provided");
        }

        if (!topicID) {
            throw new Error("No topic ID provided");
        }

        return this.requestHandler.authRequest<void>({
            endpoint: Endpoints.ForumTopicPin(channelID, topicID),
            method: "PUT",
        });
    }

    /**
     * Remove a server member
     * @param serverID The ID of the server
     * @param memberID The ID of the member
     * @returns {Promise<void>}
     */
    public removeServerMember(
        serverID: string,
        memberID: string
    ): Promise<void> {
        return this.requestHandler.authRequest<void>({
            endpoint: Endpoints.ServerMember(serverID, memberID),
            method: "DELETE",
        });
    }

    /**
     * Remove a server member ban
     * @param serverID The ID of the server
     * @param memberID The ID of the member
     * @returns {Promise<void>}
     */
    public removeServerMemberBan(
        serverID: string,
        memberID: string
    ): Promise<void> {
        if (!serverID) {
            throw new Error("No server ID provided");
        }

        if (!memberID) {
            throw new Error("No member ID provided");
        }

        return this.requestHandler.authRequest<void>({
            endpoint: Endpoints.ServerBan(serverID, memberID),
            method: "DELETE",
        });
    }

    /**
     * Remove a server member from a group
     * @param groupID The ID of the group
     * @param memberID The Id of the member
     * @returns {Promise<void>}
     */
    public removeServerMemberGroup(
        groupID: string,
        memberID: string
    ): Promise<void> {
        if (!groupID) {
            throw new Error("No group ID provided");
        }

        if (!memberID) {
            throw new Error("No member ID provided");
        }

        return this.requestHandler.authRequest<void>({
            endpoint: Endpoints.ServerGroupMember(groupID, memberID),
            method: "DELETE",
        });
    }

    /**
     * Remove a role from a server member
     * @param serverID The ID of the server
     * @param memberID The ID of the member
     * @param roleID The ID of the role
     * @returns {Promise<void>}
     */
    public removeServerMemberRole(
        serverID: string,
        memberID: string,
        roleID: number
    ): Promise<void> {
        if (!serverID) {
            throw new Error("No server ID provided");
        }

        if (!memberID) {
            throw new Error("No member ID provided");
        }

        if (!roleID) {
            throw new Error("No role ID provided");
        }

        return this.requestHandler.authRequest<void>({
            endpoint: Endpoints.ServerMemberRole(serverID, memberID, roleID),
            method: "DELETE",
        });
    }

    /**
     * Set a server member XP
     * @param serverID The ID of the server
     * @param memberID The ID of the member
     * @param total The total XP
     * @returns {Promise<number>}
     */
    public setServerMemberXP(
        serverID: string,
        memberID: string,
        total: Omit<ServerMemberXPBody["total"], "amount">
    ): Promise<number> {
        if (!serverID) {
            throw new Error("No server ID provided");
        }

        if (!memberID) {
            throw new Error("No member ID provided");
        }

        if (!total) {
            throw new Error("No total provided");
        }

        if (typeof total !== "number") {
            throw new Error("`total` must be a number");
        }

        return this.requestHandler
            .authRequest<ServerMemberXPResponse>({
                body: { total },
                endpoint: Endpoints.ServerMemberXP(serverID, memberID),
                method: "POST",
            })
            .then((data) => Number(data.total));
    }

    /**
     * Uncomplete a list item
     * @param channelID The ID of the channel
     * @param itemID The ID of the item
     * @returns {Promise<void>}
     */
    public uncompleteListItem(
        channelID: string,
        itemID: string
    ): Promise<void> {
        if (!channelID) {
            throw new Error("No channel ID provided");
        }

        if (!itemID) {
            throw new Error("No item ID provided");
        }

        return this.requestHandler.authRequest<void>({
            endpoint: Endpoints.ListItem(channelID, itemID),
            method: "DELETE",
        });
    }

    /**
     * Unlock a forum topic
     * @param channelID The ID of the channel
     * @param topicID The ID of the forum topic
     * @returns
     */
    public unlockForumTopic(channelID: string, topicID: number): Promise<void> {
        if (!channelID) {
            throw new Error("No channel ID provided");
        }

        if (!topicID) {
            throw new Error("No topic ID provided");
        }

        return this.requestHandler.authRequest<void>({
            endpoint: Endpoints.ForumTopicLock(channelID, topicID),
            method: "DELETE",
        });
    }

    /**
     * Unpin a forum topic
     * @param channelID The ID of the channel
     * @param topicID The ID of the forum topic
     * @returns {Promise<void>}
     */
    public unpinForumTopic(channelID: string, topicID: number): Promise<void> {
        if (!channelID) {
            throw new Error("No channel ID provided");
        }

        if (!topicID) {
            throw new Error("No topic ID provided");
        }

        return this.requestHandler.authRequest<void>({
            endpoint: Endpoints.ForumTopicPin(channelID, topicID),
            method: "DELETE",
        });
    }
}
