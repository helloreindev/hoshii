import { Client } from "../Client";
import {
    GATEWAY_EVENTS,
    Payload_BotServerMembershipCreated,
    Payload_BotServerMembershipDeleted,
    Payload_CalendarEvent,
    Payload_CalendarEventRSVP,
    Payload_ChannelMessageReaction,
    Payload_ChatMessage,
    Payload_ChatMessageDeleted,
    Payload_Doc,
    Payload_ForumTopic,
    Payload_ForumTopicComment,
    Payload_ForumTopicCommentReaction,
    Payload_ForumTopicReaction,
    Payload_ListItem,
    Payload_ServerChannel,
    Payload_ServerMemberBan,
    Payload_ServerMemberJoined,
    Payload_ServerMemberRemoved,
    Payload_ServerMemberUpdated,
    Payload_ServerRolesUpdated,
    Payload_ServerWebhook,
} from "../Constants";
import { GatewayEventHandler } from "./GatewayEventHandler";

/**
 * Represents a gateway handler
 */
export class GatewayHandler {
    /**
     * The client
     */
    public client: Client;

    /**
     * The gateway event handler
     */
    public gatewayEventHandler: GatewayEventHandler;

    /* @ts-ignore */
    public readonly toHandlerMap: Record<
        keyof GATEWAY_EVENTS,
        (data: object) => void
    > = {
        BotServerMembershipCreated: (data) =>
            this.gatewayEventHandler.botServerMembershipCreate(
                data as Payload_BotServerMembershipCreated
            ),
        BotServerMembershipDeleted: (data) =>
            this.gatewayEventHandler.botServerMembershipDelete(
                data as Payload_BotServerMembershipDeleted
            ),
        CalendarEventCreated: (data) =>
            this.gatewayEventHandler.calendarEventCreate(
                data as Payload_CalendarEvent
            ),
        CalendarEventDeleted: (data) =>
            this.gatewayEventHandler.calendarEventDelete(
                data as Payload_CalendarEvent
            ),
        CalendarEventRsvpDeleted: (data) =>
            this.gatewayEventHandler.calendarEventRSVPDelete(
                data as Payload_CalendarEventRSVP
            ),
        CalendarEventRsvpUpdated: (data) =>
            this.gatewayEventHandler.calendarEventRSVPUpdate(
                data as Payload_CalendarEventRSVP
            ),
        CalendarEventUpdated: (data) =>
            this.gatewayEventHandler.calendarEventUpdate(
                data as Payload_CalendarEvent
            ),
        ChannelMessageReactionCreated: (data) =>
            this.gatewayEventHandler.channelMessageReactionCreate(
                data as Payload_ChannelMessageReaction
            ),
        ChannelMessageReactionDeleted: (data) =>
            this.gatewayEventHandler.channelMessageReactionDelete(
                data as Payload_ChannelMessageReaction
            ),
        ChatMessageCreated: (data) =>
            this.gatewayEventHandler.chatMessageCreate(
                data as Payload_ChatMessage
            ),
        ChatMessageDeleted: (data) =>
            this.gatewayEventHandler.chatMessageDelete(
                data as Payload_ChatMessageDeleted
            ),
        ChatMessageUpdated: (data) =>
            this.gatewayEventHandler.chatMessageUpdate(
                data as Payload_ChatMessage
            ),
        DocCreated: (data) =>
            this.gatewayEventHandler.docCreate(data as Payload_Doc),
        DocDeleted: (data) =>
            this.gatewayEventHandler.docDelete(data as Payload_Doc),
        DocUpdated: (data) =>
            this.gatewayEventHandler.docUpdate(data as Payload_Doc),
        ForumTopicCommentCreated: (data) =>
            this.gatewayEventHandler.forumTopicCommentCreate(
                data as Payload_ForumTopicComment
            ),
        ForumTopicCommentDeleted: (data) =>
            this.gatewayEventHandler.forumTopicCommentDelete(
                data as Payload_ForumTopicComment
            ),
        ForumTopicCommentReactionCreated: (data) =>
            this.gatewayEventHandler.forumTopicCommentReactionCreate(
                data as Payload_ForumTopicCommentReaction
            ),
        ForumTopicCommentReactionDeleted: (data) =>
            this.gatewayEventHandler.forumTopicCommentReactionDelete(
                data as Payload_ForumTopicCommentReaction
            ),
        ForumTopicCommentUpdated: (data) =>
            this.gatewayEventHandler.forumTopicCommentUpdate(
                data as Payload_ForumTopicComment
            ),
        ForumTopicCreated: (data) =>
            this.gatewayEventHandler.forumTopicCreate(
                data as Payload_ForumTopic
            ),
        ForumTopicDeleted: (data) =>
            this.gatewayEventHandler.forumTopicDelete(
                data as Payload_ForumTopic
            ),
        ForumTopicLocked: (data) =>
            this.gatewayEventHandler.forumTopicLock(data as Payload_ForumTopic),
        ForumTopicPinned: (data) =>
            this.gatewayEventHandler.forumTopicPin(data as Payload_ForumTopic),
        ForumTopicReactionCreated: (data) =>
            this.gatewayEventHandler.forumTopicReactionCreate(
                data as Payload_ForumTopicReaction
            ),
        ForumTopicReactionDeleted: (data) =>
            this.gatewayEventHandler.forumTopicReactionDelete(
                data as Payload_ForumTopicReaction
            ),
        ForumTopicUnlocked: (data) =>
            this.gatewayEventHandler.forumTopicUnlock(
                data as Payload_ForumTopic
            ),
        ForumTopicUnpinned: (data) =>
            this.gatewayEventHandler.forumTopicUnpin(
                data as Payload_ForumTopic
            ),
        ForumTopicUpdated: (data) =>
            this.gatewayEventHandler.forumTopicUpdate(
                data as Payload_ForumTopic
            ),
        ListItemCompleted: (data) =>
            this.gatewayEventHandler.listItemComplete(data as Payload_ListItem),
        ListItemCreated: (data) =>
            this.gatewayEventHandler.listItemCreate(data as Payload_ListItem),
        ListItemDeleted: (data) =>
            this.gatewayEventHandler.listItemDelete(data as Payload_ListItem),
        ListItemUncompleted: (data) =>
            this.gatewayEventHandler.listItemUncomplete(
                data as Payload_ListItem
            ),
        ListItemUpdated: (data) =>
            this.gatewayEventHandler.listItemUpdate(data as Payload_ListItem),
        ServerChannelCreated: (data) =>
            this.gatewayEventHandler.serverChannelCreate(
                data as Payload_ServerChannel
            ),
        ServerChannelDeleted: (data) =>
            this.gatewayEventHandler.serverChannelDelete(
                data as Payload_ServerChannel
            ),
        ServerChannelUpdated: (data) =>
            this.gatewayEventHandler.serverChannelUpdate(
                data as Payload_ServerChannel
            ),
        ServerMemberBanned: (data) =>
            this.gatewayEventHandler.serverMemberBan(
                data as Payload_ServerMemberBan
            ),
        ServerMemberJoined: (data) =>
            this.gatewayEventHandler.serverMemberJoin(
                data as Payload_ServerMemberJoined
            ),
        ServerMemberRemoved: (data) =>
            this.gatewayEventHandler.serverMemberRemove(
                data as Payload_ServerMemberRemoved
            ),
        ServerMemberUnbanned: (data) =>
            this.gatewayEventHandler.serverMemberUnban(
                data as Payload_ServerMemberBan
            ),
        ServerMemberUpdated: (data) =>
            this.gatewayEventHandler.serverMemberUpdate(
                data as Payload_ServerMemberUpdated
            ),
        ServerRolesUpdated: (data) =>
            this.gatewayEventHandler.serverRolesUpdate(
                data as Payload_ServerRolesUpdated
            ),
        ServerWebhookCreated: (data) =>
            this.gatewayEventHandler.serverWebhookCreate(
                data as Payload_ServerWebhook
            ),
        ServerWebhookUpdated: (data) =>
            this.gatewayEventHandler.serverWebhookUpdate(
                data as Payload_ServerWebhook
            ),
    };

    /**
     * Create a new GatewayHandler
     * @param client The client
     */
    public constructor(client: Client) {
        this.client = client;
        this.gatewayEventHandler = new GatewayEventHandler(this.client);
    }

    /**
     * Handles a message from the gateway
     */
    public async handleMessage(
        eventType: keyof GATEWAY_EVENTS,
        eventData: object
    ): Promise<void> {
        if (eventType as keyof GATEWAY_EVENTS) {
            const serverId = "serverId" as keyof object;

            if (
                eventData[serverId] &&
                /* @ts-ignore */
                this.client.servers.get(eventData[serverId]) === undefined
            ) {
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                /* @ts-ignore */
                this.client.servers.add(
                    /* @ts-ignore */
                    await this.client.getServer(eventData[serverId])
                );
            }

            if (
                eventData["message" as keyof object] &&
                eventData["message" as keyof object]["type" as keyof object] ===
                    "system"
            )
                return;
            this.toHandlerMap[eventType]?.(eventData);
        }
    }
}
