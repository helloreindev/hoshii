import { Client } from "../Client";
import { AnyChannel } from "../Constants";
import { Channel } from "../structures/Channel";
import { ForumChannel } from "../structures/ForumChannel";
import { ForumTopic, RawForumTopic } from "../structures/ForumTopic";
import { RawServerMember, ServerMember } from "../structures/ServerMember";
import { RawServer, Server } from "../structures/Server";
import { RawServerChannel } from "../structures/ServerChannel";
import { RawUser, User } from "../structures/User";

/**
 * A utility class
 */
export class Util {
    /**
     * The client
     */
    private _client: Client;

    /**
     * Create a new Util
     * @param client The client
     */
    public constructor(client: Client) {
        this._client = client;
    }

    /**
     * Update a channel
     * @param data The channel data
     * @returns {T}
     */
    public updateChannel<T extends AnyChannel = AnyChannel>(
        data: RawServerChannel
    ): T {
        if (data.serverId) {
            const server = this._client.servers.get(data.serverId);

            if (server) {
                const channel = server.channels.has(data.id)
                    ? server.channels.update(data)
                    : server.channels.add(
                          Channel.from<AnyChannel>(data, this._client)
                      );

                return channel as T;
            }
        }
    }

    /**
     * Update a forum topic
     * @param data The forum topic data
     * @returns {ForumTopic<ForumChannel>}
     */
    public updateForumTopic(data: RawForumTopic): ForumTopic<ForumChannel> {
        if (data.serverId) {
            const server = this._client.servers.get(data.serverId);
            const channel = server?.channels.get(
                data.channelId
            ) as ForumChannel;

            if (server && channel) {
                const topic = channel.topics.has(data.id)
                    ? channel.topics.update(data)
                    : channel.topics.add(new ForumTopic(data, this._client));

                return topic;
            }
        }

        return new ForumTopic(data, this._client);
    }

    /**
     * Update a member
     * @param serverID The ID of the server
     * @param memberID The ID of the member
     * @param member The raw data of the member
     * @returns {ServerMember}
     */
    public updateMember(
        serverID: string,
        memberID: string,
        member: RawServerMember
    ): ServerMember {
        const server = this._client.servers.get(serverID);

        if (server && this._client.user?.id === memberID) {
            if (server["_clientMember"]) {
                server["_clientMember"]["update"](member);
            } else {
                server["_clientMember"] = server.members.update(
                    { ...member, id: memberID },
                    serverID
                );
            }

            return server["_clientMember"];
        }

        return server
            ? server.members.update({ ...member, id: memberID }, serverID)
            : new ServerMember({ ...member }, this._client, serverID);
    }

    /**
     * Update a server
     * @param data The raw data of the server
     * @returns {Server}
     */
    public updateServer(data: RawServer): Server {
        if (!data.id) {
            return this._client.servers.has(data.id)
                ? this._client.servers.update(data)
                : this._client.servers.add(new Server(data, this._client));
        }

        return new Server(data, this._client);
    }

    /**
     * Update a user
     * @param data The raw data of the user
     * @returns {User}
     */
    public updateUser(data: RawUser): User {
        return this._client.users.has(data.id)
            ? this._client.users.update(data)
            : this._client.users.add(new User(data, this._client));
    }
}

/**
 * Check whether an item is of a certain type
 * @param input The item to return true for
 * @returns {boolean}
 */
export function is<T>(input: unknown): input is T {
    return true;
}
