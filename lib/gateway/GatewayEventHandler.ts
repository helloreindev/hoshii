import type { Client } from "../Client";
import {
    Payload_BotServerMembershipCreated,
    Payload_BotServerMembershipDeleted,
    Payload_Doc,
    Payload_ChannelMessageReaction,
    Payload_ChatMessage,
    Payload_ChatMessageDeleted,
    Payload_ServerMemberBan,
    Payload_ServerMemberJoined,
    Payload_ServerMemberRemoved,
    Payload_ServerMemberUpdated,
    Payload_ServerRolesUpdated,
    Payload_ServerWebhook,
    PossiblyUncachedChatMessage,
    Payload_CalendarEvent,
    Payload_CalendarEventRSVP,
    Payload_ServerChannel,
    Payload_ListItem,
    Payload_ForumTopic,
    Payload_ForumTopicComment,
    Payload_ForumTopicCommentReaction,
    Payload_ForumTopicReaction,
} from "../Constants";
import { CalendarChannel } from "../structures/CalendarChannel";
import { CalendarEvent } from "../structures/CalendarEvent";
import { CalendarEventRSVP } from "../structures/CalendarEventRSVP";
import { ChatMessage } from "../structures/ChatMessage";
import { ChatMessageReactionInfo } from "../structures/ChatMessageReactionInfo";
import { Doc } from "../structures/Doc";
import { DocChannel } from "../structures/DocChannel";
import { ForumChannel } from "../structures/ForumChannel";
import { ForumTopic } from "../structures/ForumTopic";
import { ForumTopicComment } from "../structures/ForumTopicComment";
import { ForumTopicReactionInfo } from "../structures/ForumTopicReactionInfo";
import { ListItem } from "../structures/ListItem";
import { Server } from "../structures/Server";
import { ServerMember } from "../structures/ServerMember";
import { ServerMemberBan } from "../structures/ServerMemberBan";
import { ServerMemberUpdateInfo } from "../structures/ServerMemberUpdateInfo";
import { ServerMemberRemoveInfo } from "../structures/ServerMemberRemoveInfo";
import { TextChannel } from "../structures/TextChannel";
import { Webhook } from "../structures/Webhook";

export class GatewayEventHandler {
    public client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    private async ___addServerChannel(
        serverID: string,
        channelID: string,
        topicID?: number
    ): Promise<void> {
        const server = this.client.servers.get(serverID);

        if (server?.channels.get(channelID) === undefined) {
            const channel = await this.client.getServerChannel(channelID);

            server?.channels?.add(channel);
        }

        const conditions =
            server?.channels.get(channelID) !== undefined &&
            (server?.channels.get(channelID) as ForumChannel)?.topics.get(
                topicID
            ) === undefined;

        if (serverID && channelID && topicID && conditions) {
            const topic = await this.client.getForumTopic(channelID, topicID);

            (server?.channels.get(channelID) as ForumChannel)?.topics.add(
                topic
            );
        }
    }

    private async __addServerChannel(
        serverID: string,
        channelID: string,
        eventID?: number
    ): Promise<void> {
        const server = this.client.servers.get(serverID);

        if (server?.channels.get(channelID) === undefined) {
            const channel = await this.client.getServerChannel(channelID);

            server?.channels?.add(channel);
        }

        const conditions =
            server?.channels.get(channelID) !== undefined &&
            (
                server?.channels.get(channelID) as CalendarChannel
            )?.scheduledEvents.get(eventID) === undefined;

        if (serverID && channelID && eventID && conditions) {
            const event = await this.client.getCalendarEvent(
                channelID,
                eventID
            );

            (
                server?.channels.get(channelID) as CalendarChannel
            )?.scheduledEvents.add(event);
        }
    }

    private async _addServerChannel(
        serverID: string,
        channelID: string
    ): Promise<void> {
        if (
            this.client.servers.get(serverID).channels.get(channelID) !==
            undefined
        )
            return;

        const channel = await this.client.getServerChannel(channelID);
        const server = this.client.servers.get(serverID);

        server?.channels?.add(channel);
    }

    public botServerMembershipCreate(
        data: Payload_BotServerMembershipCreated
    ): void {
        const server = new Server(data.server, this.client);

        this.client.servers.add(server);
        this.client.emit("botServerMembershipCreate", server);
    }

    public botServerMembershipDelete(
        data: Payload_BotServerMembershipDeleted
    ): void {
        const server = new Server(data.server, this.client);

        this.client.servers.delete(server.id);
        this.client.emit("botServerMembershipDelete", server);
    }

    public calendarEventCreate(data: Payload_CalendarEvent): void {
        void this.__addServerChannel(
            data.serverId,
            data.calendarEvent.channelId
        );

        const channel = this.client.servers
            .get(data.serverId)
            ?.channels.get(data.calendarEvent.channelId) as CalendarChannel;
        const calendar =
            channel?.scheduledEvents.update(data.calendarEvent) ??
            new CalendarEvent(data.calendarEvent, this.client);

        this.client.emit("calendarEventCreate", calendar);
    }

    public calendarEventDelete(data: Payload_CalendarEvent): void {
        void this.__addServerChannel(
            data.serverId,
            data.calendarEvent.channelId
        );

        const channel = this.client.servers
            .get(data.serverId)
            ?.channels.get(data.calendarEvent.channelId) as CalendarChannel;
        const calendar =
            channel?.scheduledEvents.update(data.calendarEvent) ??
            new CalendarEvent(data.calendarEvent, this.client);

        channel?.scheduledEvents.delete(calendar.id);
        this.client.emit("calendarEventDelete", calendar);
    }

    public calendarEventRSVPDelete(data: Payload_CalendarEventRSVP): void {
        void this.__addServerChannel(
            data.serverId,
            data.calendarEventRsvp.channelId,
            data.calendarEventRsvp.calendarEventId
        );

        const channel = this.client.servers
            .get(data.serverId)
            ?.channels.get(data.calendarEventRsvp.channelId) as CalendarChannel;
        const cache = channel?.scheduledEvents
            .get(data.calendarEventRsvp.calendarEventId)
            ?.rsvps.update(data.calendarEventRsvp);
        const calendar =
            cache ?? new CalendarEventRSVP(data.calendarEventRsvp, this.client);

        this.client.emit("calendarEventRSVPDelete", calendar);
    }

    public calendarEventRSVPUpdate(data: Payload_CalendarEventRSVP): void {
        void this.__addServerChannel(
            data.serverId,
            data.calendarEventRsvp.channelId,
            data.calendarEventRsvp.calendarEventId
        );

        const channel = this.client.servers
            .get(data.serverId)
            ?.channels.get(data.calendarEventRsvp.channelId) as CalendarChannel;
        const cache = channel?.scheduledEvents
            .get(data.calendarEventRsvp.calendarEventId)
            ?.rsvps.update(data.calendarEventRsvp);
        const calendar =
            cache ?? new CalendarEventRSVP(data.calendarEventRsvp, this.client);

        this.client.emit("calendarEventRSVPUpdate", calendar);
    }

    public calendarEventUpdate(data: Payload_CalendarEvent): void {
        void this.__addServerChannel(
            data.serverId,
            data.calendarEvent.channelId
        );

        const channel = this.client.servers
            .get(data.serverId)
            ?.channels.get(data.calendarEvent.channelId) as CalendarChannel;
        const calendar =
            channel?.scheduledEvents.update(data.calendarEvent) ??
            new CalendarEvent(data.calendarEvent, this.client);

        this.client.emit("calendarEventUpdate", calendar);
    }

    public channelMessageReactionCreate(
        data: Payload_ChannelMessageReaction
    ): void {
        if (data.serverId)
            void this._addServerChannel(data.serverId, data.reaction.channelId);

        const reaction = new ChatMessageReactionInfo(data, this.client);
        this.client.emit("channelMessageReactionCreate", reaction);
    }

    public channelMessageReactionDelete(
        data: Payload_ChannelMessageReaction
    ): void {
        if (data.serverId)
            void this._addServerChannel(data.serverId, data.reaction.channelId);

        const reaction = new ChatMessageReactionInfo(data, this.client);
        this.client.emit("channelMessageReactionDelete", reaction);
    }

    public chatMessageCreate(data: Payload_ChatMessage): void {
        void this._addServerChannel(data.serverId, data.message.channelId);

        const channel = this.client.servers
            .get(data.serverId)
            .channels.get(data.message.channelId) as TextChannel;
        const message =
            channel?.messages?.update(data.message) ??
            new ChatMessage(data.message, this.client);
        this.client.emit("chatMessageCreate", message);
    }

    public chatMessageDelete(data: Payload_ChatMessageDeleted): void {
        void this._addServerChannel(data.serverId, data.message.channelId);

        const channel = this.client.servers
            .get(data.serverId)
            .channels.get(data.message.serverId) as TextChannel;
        const message: PossiblyUncachedChatMessage = channel?.messages?.update(
            data.message
        ) ?? {
            channelID: data.message.channelId,
            deletedAt: new Date(data.message.deletedAt),
            id: data.message.id,
            isPrivate: data.message.isPrivate,
            serverID: data.message.serverId,
        };

        this.client.emit("chatMessageDelete", message);
    }

    public chatMessageUpdate(data: Payload_ChatMessage): void {
        void this._addServerChannel(data.serverId, data.message.channelId);

        const channel = this.client.servers
            .get(data.serverId)
            .channels.get(data.message.channelId) as TextChannel;
        const message =
            channel?.messages?.update(data.message) ??
            new ChatMessage(data.message, this.client);
        this.client.emit("chatMessageUpdate", message);
    }

    public docCreate(data: Payload_Doc): void {
        void this._addServerChannel(data.serverId, data.doc.channelId);

        const channel = this.client.servers
            .get(data.serverId)
            .channels.get(data.doc.channelId) as DocChannel;
        const doc =
            channel?.docs.update(data.doc) ?? new Doc(data.doc, this.client);

        this.client.emit("docCreate", doc);
    }

    public docDelete(data: Payload_Doc): void {
        void this._addServerChannel(data.serverId, data.doc.channelId);

        const channel = this.client.servers
            .get(data.serverId)
            .channels.get(data.doc.channelId) as DocChannel;
        const doc =
            channel?.docs.update(data.doc) ?? new Doc(data.doc, this.client);

        channel?.docs.delete(doc.id);

        this.client.emit("docDelete", doc);
    }

    public docUpdate(data: Payload_Doc): void {
        void this._addServerChannel(data.serverId, data.doc.channelId);

        const channel = this.client.servers
            .get(data.serverId)
            .channels.get(data.doc.channelId) as DocChannel;
        const doc =
            channel?.docs.update(data.doc) ?? new Doc(data.doc, this.client);

        this.client.emit("docUpdate", doc);
    }

    public forumTopicCommentCreate(data: Payload_ForumTopicComment): void {
        void this.___addServerChannel(
            data.serverId,
            data.forumTopicComment.channelId,
            data.forumTopicComment.forumTopicId
        );

        const channel = this.client.servers
            .get(data.serverId)
            ?.channels.get(data.forumTopicComment.channelId) as ForumChannel;
        const cache = channel?.topics
            ?.get(data.forumTopicComment.forumTopicId)
            ?.comments.update(data.forumTopicComment);
        const comment =
            cache ?? new ForumTopicComment(data.forumTopicComment, this.client);

        channel?.topics
            ?.get(data.forumTopicComment.forumTopicId)
            ?.comments.add(comment);
        this.client.emit("forumTopicCommentCreate", comment);
    }

    public forumTopicCommentDelete(data: Payload_ForumTopicComment): void {
        void this.___addServerChannel(
            data.serverId,
            data.forumTopicComment.channelId,
            data.forumTopicComment.forumTopicId
        );

        const channel = this.client.servers
            .get(data.serverId)
            ?.channels.get(data.forumTopicComment.channelId) as ForumChannel;
        const cache = channel?.topics
            ?.get(data.forumTopicComment.forumTopicId)
            ?.comments.update(data.forumTopicComment);
        const comment =
            cache ?? new ForumTopicComment(data.forumTopicComment, this.client);

        channel?.topics
            ?.get(data.forumTopicComment.forumTopicId)
            ?.comments.delete(comment.id);
        this.client.emit("forumTopicCommentDelete", comment);
    }

    public forumTopicCommentReactionCreate(
        data: Payload_ForumTopicCommentReaction
    ): void {
        if (data.serverId)
            void this.___addServerChannel(
                data.serverId,
                data.reaction.channelId
            );

        const reaction = new ForumTopicReactionInfo(data, this.client);
        this.client.emit("forumTopicCommentReactionCreate", reaction);
    }

    public forumTopicCommentReactionDelete(
        data: Payload_ForumTopicCommentReaction
    ): void {
        if (data.serverId)
            void this.___addServerChannel(
                data.serverId,
                data.reaction.channelId
            );

        const reaction = new ForumTopicReactionInfo(data, this.client);
        this.client.emit("forumTopicCommentReactionDelete", reaction);
    }

    public forumTopicCommentUpdate(data: Payload_ForumTopicComment): void {
        void this.___addServerChannel(
            data.serverId,
            data.forumTopicComment.channelId,
            data.forumTopicComment.forumTopicId
        );

        const channel = this.client.servers
            .get(data.serverId)
            ?.channels.get(data.forumTopicComment.channelId) as ForumChannel;
        const cache = channel?.topics
            ?.get(data.forumTopicComment.forumTopicId)
            ?.comments.update(data.forumTopicComment);
        const comment =
            cache ?? new ForumTopicComment(data.forumTopicComment, this.client);

        this.client.emit("forumTopicCommentUpdate", comment);
    }

    public forumTopicCreate(data: Payload_ForumTopic): void {
        void this.___addServerChannel(data.serverId, data.forumTopic.channelId);

        const channel = this.client.servers
            .get(data.serverId)
            ?.channels.get(data.forumTopic.channelId) as ForumChannel;
        const topic =
            channel?.topics?.update(data.forumTopic) ??
            new ForumTopic<ForumChannel>(data.forumTopic, this.client);

        channel?.topics?.add(topic);
        this.client.emit("forumTopicCreate", topic);
    }

    public forumTopicDelete(data: Payload_ForumTopic): void {
        void this.___addServerChannel(data.serverId, data.forumTopic.channelId);

        const channel = this.client.servers
            .get(data.serverId)
            ?.channels.get(data.forumTopic.channelId) as ForumChannel;
        const topic =
            channel?.topics?.update(data.forumTopic) ??
            new ForumTopic<ForumChannel>(data.forumTopic, this.client);

        channel?.topics?.delete(topic.id);
        this.client.emit("forumTopicDelete", topic);
    }

    public forumTopicLock(data: Payload_ForumTopic): void {
        void this.___addServerChannel(data.serverId, data.forumTopic.channelId);

        const channel = this.client.servers
            .get(data.serverId)
            ?.channels.get(data.forumTopic.channelId) as ForumChannel;
        const topic =
            channel?.topics?.update(data.forumTopic) ??
            new ForumTopic<ForumChannel>(data.forumTopic, this.client);

        this.client.emit("forumTopicLock", topic);
    }

    public forumTopicPin(data: Payload_ForumTopic): void {
        void this.___addServerChannel(data.serverId, data.forumTopic.channelId);

        const channel = this.client.servers
            .get(data.serverId)
            ?.channels.get(data.forumTopic.channelId) as ForumChannel;
        const topic =
            channel?.topics?.update(data.forumTopic) ??
            new ForumTopic<ForumChannel>(data.forumTopic, this.client);

        this.client.emit("forumTopicPin", topic);
    }

    public forumTopicReactionCreate(data: Payload_ForumTopicReaction): void {
        if (data.serverId)
            void this.___addServerChannel(
                data.serverId,
                data.reaction.channelId
            );

        const reaction = new ForumTopicReactionInfo(data, this.client);
        this.client.emit("forumTopicReactionCreate", reaction);
    }

    public forumTopicReactionDelete(data: Payload_ForumTopicReaction): void {
        if (data.serverId)
            void this.___addServerChannel(
                data.serverId,
                data.reaction.channelId
            );

        const reaction = new ForumTopicReactionInfo(data, this.client);
        this.client.emit("forumTopicReactionDelete", reaction);
    }

    public forumTopicUnlock(data: Payload_ForumTopic): void {
        void this.___addServerChannel(data.serverId, data.forumTopic.channelId);

        const channel = this.client.servers
            .get(data.serverId)
            ?.channels.get(data.forumTopic.channelId) as ForumChannel;
        const topic =
            channel?.topics?.update(data.forumTopic) ??
            new ForumTopic<ForumChannel>(data.forumTopic, this.client);

        this.client.emit("forumTopicUnlock", topic);
    }

    public forumTopicUnpin(data: Payload_ForumTopic): void {
        void this.___addServerChannel(data.serverId, data.forumTopic.channelId);

        const channel = this.client.servers
            .get(data.serverId)
            ?.channels.get(data.forumTopic.channelId) as ForumChannel;
        const topic =
            channel?.topics?.update(data.forumTopic) ??
            new ForumTopic<ForumChannel>(data.forumTopic, this.client);

        this.client.emit("forumTopicUnpin", topic);
    }

    public forumTopicUpdate(data: Payload_ForumTopic): void {
        void this.___addServerChannel(data.serverId, data.forumTopic.channelId);

        const channel = this.client.servers
            .get(data.serverId)
            ?.channels.get(data.forumTopic.channelId) as ForumChannel;
        const topic =
            channel?.topics?.update(data.forumTopic) ??
            new ForumTopic<ForumChannel>(data.forumTopic, this.client);

        this.client.emit("forumTopicUpdate", topic);
    }

    public listItemComplete(data: Payload_ListItem): void {
        const list = new ListItem(data.listItem, this.client);

        this.client.emit("listItemComplete", list);
    }

    public listItemCreate(data: Payload_ListItem): void {
        const list = new ListItem(data.listItem, this.client);

        this.client.emit("listItemCreate", list);
    }

    public listItemDelete(data: Payload_ListItem): void {
        const list = new ListItem(data.listItem, this.client);

        this.client.emit("listItemDelete", list);
    }

    public listItemUncomplete(data: Payload_ListItem): void {
        const list = new ListItem(data.listItem, this.client);

        this.client.emit("listItemUncomplete", list);
    }

    public listItemUpdate(data: Payload_ListItem): void {
        const list = new ListItem(data.listItem, this.client);

        this.client.emit("listItemUpdate", list);
    }

    public serverChannelCreate(data: Payload_ServerChannel): void {
        void this._addServerChannel(data.serverId, data.channel.id);

        const channel = this.client.util.updateChannel(data.channel);

        this.client.emit("serverChannelCreate", channel);
    }

    public serverChannelDelete(data: Payload_ServerChannel): void {
        const server = this.client.servers.get(data.serverId);
        const channel = this.client.util.updateChannel(data.channel);

        server?.channels.delete(channel.id);
        this.client.emit("serverChannelDelete", channel);
    }

    public serverChannelUpdate(data: Payload_ServerChannel): void {
        void this._addServerChannel(data.serverId, data.channel.id);

        const channel = this.client.util.updateChannel(data.channel);

        this.client.emit("serverChannelUpdate", channel);
    }

    public serverMemberBan(data: Payload_ServerMemberBan): void {
        const member = new ServerMemberBan(
            data.serverMemberBan,
            this.client,
            data.serverId
        );

        this.client.emit("serverMemberBan", member);
    }

    public serverMemberJoin(data: Payload_ServerMemberJoined): void {
        const member = new ServerMember(
            data.member,
            this.client,
            data.serverId
        );

        this.client.emit("serverMemberJoin", member);
    }

    public serverMemberRemove(data: Payload_ServerMemberRemoved): void {
        const member = new ServerMemberRemoveInfo(
            data,
            this.client,
            data.userId
        );

        this.client.emit("serverMemberRemove", member);
    }

    public serverMemberUnban(data: Payload_ServerMemberBan): void {
        const member = new ServerMemberBan(
            data.serverMemberBan,
            this.client,
            data.serverId
        );

        this.client.emit("serverMemberUnban", member);
    }

    public serverMemberUpdate(data: Payload_ServerMemberUpdated): void {
        const member = new ServerMemberUpdateInfo(
            data,
            this.client,
            data.userInfo.id
        );

        this.client.emit("serverMemberUpdate", member);
    }

    public serverRolesUpdate(data: Payload_ServerRolesUpdated): void {
        const member = new ServerMemberUpdateInfo(
            data,
            this.client,
            data.memberRoleIds[0].userId
        );

        this.client.emit("serverRolesUpdate", member);
    }

    public webhookCreate(data: Payload_ServerWebhook): void {
        const webhook = new Webhook(data.webhook, this.client);
        this.client.emit("webhookCreate", webhook);
    }

    public webhookUpdate(data: Payload_ServerWebhook): void {
        const webhook = new Webhook(data.webhook, this.client);
        this.client.emit("webhookUpdate", webhook);
    }
}
