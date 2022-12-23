import * as packageJson from "../package.json";
import {
    RawServerMemberBan,
    ServerMemberBan,
} from "./structures/ServerMemberBan";
import { RawClientUser } from "./structures/ClientUser";
import { RawServerMember, ServerMember } from "./structures/ServerMember";
import { RawServer, Server } from "./structures/Server";
import { RawServerChannel, ServerChannel } from "./structures/ServerChannel";
import { RawWebhook, Webhook } from "./structures/Webhook";
import {
    CalendarEventRSVP,
    CalendarEventRSVPStatus,
    RawCalendarEventRSVP,
} from "./structures/CalendarEventRSVP";
import { CalendarEvent, RawCalendarEvent } from "./structures/CalendarEvent";
import { CalendarChannel } from "./structures/CalendarChannel";
import { Doc, RawDoc } from "./structures/Doc";
import { DocChannel } from "./structures/DocChannel";
import { TextChannel } from "./structures/TextChannel";
import {
    ChatMessage,
    RawEmote,
    RawChatMessage,
} from "./structures/ChatMessage";
import { ListItem, RawListItem } from "./structures/ListItem";
import {
    ForumTopicComment,
    RawForumTopicComment,
} from "./structures/ForumTopicComment";
import { ForumTopic, RawForumTopic } from "./structures/ForumTopic";
import { ForumChannel } from "./structures/ForumChannel";
import { ChatMessageReactionInfo } from "./structures/ChatMessageReactionInfo";
import { ForumTopicReactionInfo } from "./structures/ForumTopicReactionInfo";
import { ServerMemberRemoveInfo } from "./structures/ServerMemberRemoveInfo";
import { ServerMemberUpdateInfo } from "./structures/ServerMemberUpdateInfo";

export const GatewayVersion = 1;
export const GatewayURL = `wss://www.guilded.gg/websocket/v${GatewayVersion}`;
export const APIURL = `https://www.guilded.gg/api/v${GatewayVersion}`;
export const GatewayEvents = {
    BotServerMembershipCreated: "BotServerMembershipCreated",

    BotServerMembershipDeleted: "BotServerMembershipDeleted",

    CalendarEventCreated: "CalendarEventCreated",

    CalendarEventDeleted: "CalendarEventDeleted",

    CalendarEventRsvpDeleted: "CalendarEventRsvpDeleted",

    CalendarEventRsvpManyUpdated: "CalendarEventRsvpManyUpdated",

    CalendarEventRsvpUpdated: "CalendarEventRsvpUpdated",

    CalendarEventUpdated: "CalendarEventUpdated",

    ChannelMessageReactionCreated: "ChannelMessageReactionCreated",

    ChannelMessageReactionDeleted: "ChannelMessageReactionDeleted",

    ChatMessageCreated: "ChatMessageCreated",

    ChatMessageDeleted: "ChatMessageDeleted",

    ChatMessageUpdated: "ChatMessageUpdated",

    DocCreated: "DocCreated",

    DocDeleted: "DocDeleted",

    DocUpdated: "DocUpdated",

    ForumTopicCommentCreated: "ForumTopicCommentCreated",

    ForumTopicCommentDeleted: "ForumTopicCommentDeleted",

    ForumTopicCommentReactionCreated: "ForumTopicCommentReactionCreated",

    ForumTopicCommentReactionDeleted: "ForumTopicCommentReactionDeleted",

    ForumTopicCommentUpdated: "ForumTopicCommentUpdated",

    ForumTopicCreated: "ForumTopicCreated",

    ForumTopicDeleted: "ForumTopicDeleted",

    ForumTopicLocked: "ForumTopicLocked",

    ForumTopicPinned: "ForumTopicPinned",

    ForumTopicReactionCreated: "ForumTopicReactionCreated",

    ForumTopicReactionDeleted: "ForumTopicReactionDeleted",

    ForumTopicUnlocked: "ForumTopicUnlocked",

    ForumTopicUnpinned: "ForumTopicUnpinned",

    ForumTopicUpdated: "ForumTopicUpdated",

    ListItemCompleted: "ListItemCompleted",

    ListItemCreated: "ListItemCreated",

    ListItemDeleted: "ListItemDeleted",

    ListItemUncompleted: "ListItemUncompleted",

    ListItemUpdated: "ListItemUpdated",

    ServerChannelCreated: "ServerChannelCreated",

    ServerChannelDeleted: "ServerChannelDeleted",

    ServerChannelUpdated: "ServerChannelUpdated",

    ServerMemberBanned: "ServerMemberBanned",

    ServerMemberJoined: "ServerMemberJoined",

    ServerMemberRemoved: "ServerMemberRemoved",

    ServerMemberUnbanned: "ServerMemberUnbanned",

    ServerMemberUpdated: "ServerMemberUpdated",

    ServerRolesUpdated: "ServerRolesUpdated",

    ServerWebhookCreated: "ServerWebhookCreated",

    ServerWebhookUpdated: "ServerWebhookUpdated",
} as const;

export type AnyChannel =
    | CalendarChannel
    | DocChannel
    | ForumChannel
    | ServerChannel
    | TextChannel;
export type AnyPacket = RawPacket | WelcomePacket;
export type AnyReaction = ChatMessageReactionInfo | ForumTopicReactionInfo;
export type AnyServerChannel = Exclude<AnyChannel, ServerChannel>;
export type AnyTextableChannel = TextChannel;
export type ChannelReactionTypes = "ChannelMessage" | "ForumTopic";
export type GATEWAY_EVENTS = typeof GatewayEvents;
export type MessageCategories = "default" | "system";
export type PossiblyUncachedChatMessage =
    | ChatMessage<AnyTextableChannel>
    | {
          channelID: string;
          deletedAt: Date;
          id: string;
          isPrivate?: boolean | null;
          serverID: string;
      };
export type UserTypes = "bot" | "user";
export type ServerChannelCategories =
    | "announcement"
    | "calendar"
    | "chat"
    | "docs"
    | "forums"
    | "list"
    | "media"
    | "scheduling"
    | "stream"
    | "voice";
export type ServerCategories =
    | "clan"
    | "community"
    | "friend"
    | "guild"
    | "organization"
    | "other"
    | "streaming"
    | "team";

export declare interface Mentions {
    channels?: Array<{ id: string }>;
    everyone?: boolean;
    here?: boolean;
    roles?: Array<{ id: number }>;
    users?: Array<{ id: string }>;
}

export interface ChatEmbedOptions {
    author?: EmbedAuthor;
    color?: number;
    description?: string;
    fields?: Array<EmbedField>;
    footer?: EmbedFooter;
    image?: EmbedImage;
    thumbnail?: EmbedImage;
    timestamp?: string;
    title?: string;
    url?: string;
}

export interface EmbedAuthor {
    icon_url?: string;
    name?: string;
    url?: string;
}

export interface EmbedField {
    inline?: boolean;
    name?: string;
    value?: string;
}

export interface EmbedFooter {
    icon_url?: string;
    text?: string;
}

export interface EmbedImage {
    url?: string;
}

export interface ChannelMessageResponse {
    message: RawChatMessage;
}

export interface ChannelMessagesResponse {
    messages: Array<RawChatMessage>;
}

export interface DocBody {
    content: string;
    title: string;
}

export interface DocResponse {
    doc: RawDoc;
}

export interface DocsResponse {
    docs: Array<RawDoc>;
}

export interface CalendarEventBody {
    color?: number;
    description?: string;
    duration?: number;
    isPrivate?: boolean;
    location?: string;
    name: string;
    rsvpLimit?: number;
    startsAt: string;
    url?: string;
}

export interface CalendarEventResponse {
    calendarEvent: RawCalendarEvent;
}

export interface CalendarEventsResponse {
    calendarEvents: Array<RawCalendarEvent>;
}

export interface CalendarEventRSVPBody {
    status: CalendarEventRSVPStatus;
}

export interface CalendarEventRSVPResponse {
    calendarEventRsvp: RawCalendarEventRSVP;
}

export interface CalendarEventRSVPsResponse {
    calendarEventRsvps: Array<RawCalendarEventRSVP>;
}

export interface ClientEvents {
    botServerMembershipCreate: [server: Server];
    botServerMembershipDelete: [server: Server];
    calendarEventCreate: [calendar: CalendarEvent];
    calendarEventDelete: [calendar: CalendarEvent];
    calendarEventRSVPDelete: [calendar: CalendarEventRSVP];
    calendarEventRSVPUpdate: [calendar: CalendarEventRSVP];
    calendarEventUpdate: [calendar: CalendarEvent];
    channelMessageReactionCreate: [reaction: ChatMessageReactionInfo];
    channelMessageReactionDelete: [reaction: ChatMessageReactionInfo];
    chatMessageCreate: [message: ChatMessage<AnyTextableChannel>];
    chatMessageDelete: [message: PossiblyUncachedChatMessage];
    chatMessageUpdate: [message: ChatMessage<AnyTextableChannel>];
    debug: [message: string];
    docCreate: [doc: Doc];
    docDelete: [doc: Doc];
    docUpdate: [doc: Doc];
    error: [error: Error];
    forumTopicCommentCreate: [comment: ForumTopicComment];
    forumTopicCommentDelete: [comment: ForumTopicComment];
    forumTopicCommentReactionCreate: [reaction: ForumTopicReactionInfo];
    forumTopicCommentReactionDelete: [reaction: ForumTopicReactionInfo];
    forumTopicCommentUpdate: [comment: ForumTopicComment];
    forumTopicCreate: [topic: ForumTopic];
    forumTopicDelete: [topic: ForumTopic];
    forumTopicLock: [topic: ForumTopic];
    forumTopicPin: [topic: ForumTopic];
    forumTopicReactionCreate: [reaction: ForumTopicReactionInfo];
    forumTopicReactionDelete: [reaction: ForumTopicReactionInfo];
    forumTopicUnlock: [topic: ForumTopic];
    forumTopicUnpin: [topic: ForumTopic];
    forumTopicUpdate: [topic: ForumTopic];
    listItemComplete: [list: ListItem];
    listItemCreate: [list: ListItem];
    listItemDelete: [list: ListItem];
    listItemUncomplete: [list: ListItem];
    listItemUpdate: [list: ListItem];
    ready: [];
    serverChannelCreate: [channel: AnyChannel];
    serverChannelDelete: [channel: AnyChannel];
    serverChannelUpdate: [channel: AnyChannel];
    serverMemberBan: [member: ServerMemberBan];
    serverMemberJoin: [member: ServerMember];
    serverMemberRemove: [member: ServerMemberRemoveInfo];
    serverMemberUnban: [member: ServerMemberBan];
    serverMemberUpdate: [member: ServerMemberUpdateInfo];
    serverRolesUpdate: [member: ServerMemberUpdateInfo];
    serverWebhookCreate: [webhook: Webhook];
    serverWebhookUpdate: [webhook: Webhook];
    warn: [message: string];
}

export interface ForumTopicCommentResponse {
    forumTopicComment: RawForumTopicComment;
}

export interface ForumTopicCommentsResponse {
    forumTopicComments: Array<RawForumTopicComment>;
}

export interface ForumTopicResponse {
    forumTopic: RawForumTopic;
}

export interface ForumTopicsResponse {
    forumTopics: Array<RawForumTopic>;
}

export interface Payload_BotServerMembershipCreated {
    createdBy: string;
    server: RawServer;
}

export interface Payload_BotServerMembershipDeleted {
    deletedBy: string;
    server: RawServer;
}

export interface Payload_CalendarEvent {
    calendarEvent: RawCalendarEvent;
    serverId: string;
}

export interface Payload_CalendarEventRSVP {
    calendarEventRsvp: RawCalendarEventRSVP;
    serverId: string;
}

export interface Payload_CalendarEventRSVPManyUpdate {
    calendarEventRsvps: Array<RawCalendarEventRSVP>;
    serverId: string;
}

export interface Payload_ChannelMessageReaction {
    reaction: {
        channelId: string;
        createdBy: string;
        emote: RawEmote;
        messageId: string;
    };
    serverId?: string;
}

export interface Payload_ChatMessage {
    message: RawChatMessage;
    serverId: string;
}

export interface Payload_ChatMessageDeleted {
    message: {
        channelId: string;
        deletedAt: string;
        id: string;
        isPrivate?: boolean;
        serverId?: string;
    };
    serverId: string;
}

export interface Payload_Doc {
    doc: RawDoc;
    serverId: string;
}

export interface Payload_ForumTopic {
    forumTopic: RawForumTopic;
    serverId: string;
}

export interface Payload_ForumTopicReaction {
    reaction: {
        channelId: string;
        createdBy: string;
        emote: RawEmote;
        forumTopicId: number;
    };
    serverId?: string;
}

export interface Payload_ForumTopicComment {
    forumTopicComment: RawForumTopicComment;
    serverId: string;
}

export interface Payload_ForumTopicCommentReaction {
    reaction: {
        channelId: string;
        createdBy: string;
        emote: RawEmote;
        forumTopicCommentId: number;
        forumTopicId: number;
    };
    serverId?: string;
}

export interface Payload_ListItem {
    listItem: RawListItem;
    serverId: string;
}

export interface Payload_ServerChannel {
    channel: RawServerChannel;
    serverId: string;
}

export interface Payload_ServerMemberBan {
    serverId: string;
    serverMemberBan: RawServerMemberBan;
}

export interface Payload_ServerMemberJoined {
    member: RawServerMember;
    serverId: string;
}

export interface Payload_ServerMemberRemoved {
    isBan?: boolean;
    isKick?: boolean;
    serverId: string;
    userId: string;
}

export interface Payload_ServerMemberUpdated {
    serverId: string;
    userInfo: {
        id: string;
        nickname?: string;
    };
}

export interface Payload_ServerRolesUpdated {
    memberRoleIds: Array<{
        roleIds: Array<number>;
        userId: string;
    }>;
    serverId: string;
}

export interface Payload_ServerWebhook {
    serverId: string;
    webhook: RawWebhook;
}

export interface ListItemBody {
    message: string;
    note?: {
        content: string;
    };
}

export interface ListItemResponse {
    listItem: RawListItem;
}

export interface ListItemsResponse {
    listItems: Array<RawListItem>;
}

export interface RawPacket {
    d: object | null;
    op: GatewayOPCodes;
    s: string | null;
    t: string | null;
}

export interface ServerBanResponse {
    serverMemberBan: RawServerMemberBan;
}

export interface ServerChannelBody {
    isPublic?: boolean;
    name?: string;
    topic?: string;
}

export interface ServerChannelResponse {
    channel: RawServerChannel;
}

export interface ServerMemberResponse {
    member: RawServerMember;
}

export interface ServerMembersResponse {
    members: Array<RawServerMember>;
}

export interface ServerMemberSocialLinkResponse {
    socialLink: SocialLinkResponse;
}

export interface ServerMemberXPBody {
    amount: number;
    total: number;
}

export interface ServerMemberXPResponse {
    total: number;
}

export interface ServerResponse {
    server: RawServer;
}

export interface ServerWebhookBody {
    channelId: string;
    name: string;
}

export interface ServerWebhookQuery {
    channelId: string;
}

export interface ServerWebhookResponse {
    webhook: RawWebhook;
}

export interface ServerWebhooksResponse {
    webhooks: Array<RawWebhook>;
}

export interface SocialLink {
    handle: string;
    serviceID: string;
    type: string;
}

export interface SocialLinkResponse {
    handle?: string;
    serviceId: string;
    type: string;
}

export interface WelcomePacket {
    d: RawClientUser;
    op: GatewayOPCodes;
    s: string | null;
    t: string | null;
}

export interface WebsocketEvents {
    GATEWAY_PACKET: [packet: AnyPacket];
    GATEWAY_PARSED_PACKET: [type: string | null, data: object];
    GATEWAY_UNKNOWN_PACKET: [message: string, packet: AnyPacket];
    GATEWAY_WELCOME: [data: RawClientUser];
    GATEWAY_WELCOME_PACKET: [packet: WelcomePacket];
    debug: [message: string | object];
    disconnect: [error: Error];
    error: [error: Error];
    exit: [message: string | Error];
}

export enum GatewayOPCodes {
    Event = 0,
    Welcome = 1,
    Resume = 2,
    Failure = 8,
    Success = 9,
}

export const DefaultConfig = {
    GuildedAPI: {
        APIURL,
        GatewayURL,
        GatewayVersion,
    },
    NodeJSVersion: process.version,
    branch: "Master",
    name: "Hoshii",
    version: packageJson.version,
};
