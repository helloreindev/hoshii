export const HTTPMethods = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;

export type HTTPMethod = typeof HTTPMethods[number];

export const Channels = () => "/channels";
export const Channel = (channelID: string) => `/channels/${channelID}`;
export const ChannelDocs = (channelID: string) => `/channels/${channelID}/docs`;
export const ChannelDoc = (channelID: string, docID: number) =>
    `/channels/${channelID}/docs/${docID}`;
export const ChannelEvents = (channelID: string) =>
    `channels/${channelID}/events`;
export const ChannelEvent = (channelID: string, eventID: number) =>
    `channels/${channelID}/events/${eventID}`;
export const ChannelEventRSVP = (
    channelID: string,
    eventID: number,
    memberID: string
) => `/channels/${channelID}/events/${eventID}/rsvps/${memberID}`;
export const ChannelEventRSVPS = (channelID: string, eventID: number) =>
    `/channels/${channelID}/events/${eventID}/rsvps`;
export const ChannelMessages = (channelID: string) =>
    `/channels/${channelID}/messages`;
export const ChannelMessage = (channelID: string, messageID: string) =>
    `/channels/${channelID}/messages/${messageID}`;
export const ChannelMessageContentEmote = (
    channelID: string,
    contentID: string,
    emoteID: number
) => `/channels/${channelID}/content/${contentID}/emotes/${emoteID}`;

export const ForumTopics = (channelID: string) =>
    `/channels/${channelID}/topics`;
export const ForumTopic = (channelID: string, topicID: number) =>
    `/channels/${channelID}/topics/${topicID}`;
export const ForumTopicPin = (channelID: string, topicID: number) =>
    `/channels/${channelID}/topics/${topicID}/pin`;
export const ForumTopicLock = (channelID: string, topicID: number) =>
    `/channels/${channelID}/topics/${topicID}/lock`;
export const ForumTopicEmote = (
    channelID: string,
    topicID: number,
    emoteID: number
) => `/channels/${channelID}/topics/${topicID}/emotes/${emoteID}`;
export const ForumTopicComments = (channelID: string, topicID: number) =>
    `/channels/${channelID}/topics/${topicID}/comments`;
export const ForumTopicComment = (
    channelID: string,
    topicID: number,
    commentID: number
) => `/channels/${channelID}/topics/${topicID}/comments/${commentID}`;
export const ForumTopicCommentEmote = (
    channelID: string,
    topicID: number,
    commentID: number,
    emoteID: number
) =>
    `/channels/${channelID}/topics/${topicID}/comments/${commentID}/emotes/${emoteID}`;

export const Server = (serverID: string) => `/servers/${serverID}`;
export const ServerBan = (serverID: string, memberID: string) =>
    `/servers/${serverID}/bans/${memberID}`;
export const ServerBans = (serverID: string) => `/servers/${serverID}/bans`;
export const ServerGroupMember = (groupID: string, memberID: string) =>
    `/groups/${groupID}/members/${memberID}`;
export const ServerGroupMembers = (groupID: string) =>
    `/groups/${groupID}/members`;
export const ServerGroup = (groupID: string) => `/groups/${groupID}`;
export const ServerMember = (serverID: string, memberID: string) =>
    `/servers/${serverID}/members/${memberID}`;
export const ServerMembers = (serverID: string) =>
    `/servers/${serverID}/members`;
export const ServerMemberNickname = (serverID: string, memberID: string) =>
    `/servers/${serverID}/members/${memberID}/nickname`;
export const ServerMemberRole = (
    serverID: string,
    memberID: string,
    roleID: number
) => `/servers/${serverID}/members/${memberID}/roles/${roleID}`;
export const ServerMemberRoles = (serverID: string, memberID: string) =>
    `/servers/${serverID}/members/${memberID}/roles`;
export const ServerMemberRoleXP = (serverID: string, roleID: number) =>
    `/servers/${serverID}/roles/${roleID}/xp`;
export const ServerMemberSocials = (
    serverID: string,
    memberID: string,
    type: string
) => `/servers/${serverID}/members/${memberID}/social-links/${type}`;
export const ServerMemberXP = (serverID: string, memberID: string) =>
    `/servers/${serverID}/members/${memberID}/xp`;
export const ServerWebhooks = (serverID: string) =>
    `/servers/${serverID}/webhooks`;
export const ServerWebhook = (serverID: string, webhookID: string) =>
    `/servers/${serverID}/webhooks/${webhookID}`;

export const User = (userID: string) => `/users/${userID}`;

export const ListItems = (channelID: string) => `/channels/${channelID}/items`;
export const ListItem = (channelID: string, itemID: string) =>
    `/channels/${channelID}/items/${itemID}`;
export const ListItemComplete = (channelID: string, itemID: string) =>
    `/channels/${channelID}/items/${itemID}/complete`;
