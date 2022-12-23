import { Base, BaseData } from "./Base";
import { Client } from "../Client";
import { User } from "./User";
import { AnyChannel, ServerCategories } from "../Constants";
import { RawServerChannel, ServerChannel } from "./ServerChannel";
import { RawServerMember, ServerMember } from "./ServerMember";
import TypedCollection from "../utils/TypedCollection";
import { ServerMemberBan } from "./ServerMemberBan";

export interface RawServer {
    about?: string;
    avatar?: string;
    banner?: string;
    createdAt: string;
    defaultChannelId?: string;
    id: string;
    isVerified?: boolean;
    name: string;
    ownerId: string;
    timezone?: string;
    type?: ServerCategories;
    url?: string;
}

export interface ServerData extends BaseData<string> {
    about?: string;
    avatar?: string;
    banner?: string;
    createdAt: Date;
    defaultChannelID?: string;
    isVerified: boolean;
    name: string;
    ownerID: string;
    timezone?: string;
    type?: ServerCategories;
    url?: string;
}

/**
 * Represents a server
 */
export class Server extends Base<string> {
    /**
     * The client member of the server
     */
    private _clientMember?: ServerMember;

    /**
     * The about info of the server
     */
    public about?: string;

    /**
     * The avatar of the server
     */
    public avatar?: string;

    /**
     * The banner of the server
     */
    public banner?: string;

    /**
     * A collection of cached channels
     */
    public channels: TypedCollection<string, RawServerChannel, AnyChannel>;

    /**
     * The date the server was created at
     */
    public creaetdAt: Date;

    /**
     * The ID of the default channel
     */
    public defaultChannelID?: string;

    /**
     * Whether the server is verified
     */
    public isVerified: boolean;

    /**
     * A collection of cached server members
     */
    public members: TypedCollection<
        string,
        RawServerMember,
        ServerMember,
        [serverID: string]
    >;

    /**
     * The name of the server
     */
    public name: string;

    /**
     * The ID of the owner of the server
     */
    public ownerID: string;

    /**
     * The timezone of the server
     */
    public timezone?: string;

    /**
     * The type of the server
     */
    public type?: ServerCategories;

    /**
     * The URL of the server
     */
    public url?: string;

    /**
     * Create a new Server
     * @param data The raw data of the server
     * @param client The client
     */
    public constructor(data: RawServer, client: Client) {
        super(data.id, client);

        this.about = data.about;
        this.avatar = data.avatar ?? null;
        this.banner = data.banner ?? null;
        this.channels = new TypedCollection(ServerChannel, client);
        this.creaetdAt = new Date(data.createdAt);
        this.defaultChannelID = data.defaultChannelId;
        this.isVerified = data.isVerified ?? false;
        this.members = new TypedCollection(ServerMember, client);
        this.name = data.name;
        this.ownerID = data.ownerId;
        this.timezone = data.timezone;
        this.type = data.type;

        this.update(data);
    }

    /**
     * The owner of the server
     */
    public get owner(): ServerMember | User | Promise<ServerMember> {
        return (
            this.client.servers.get(this.id)?.members.get(this.ownerID) ??
            this.client.users.get(this.ownerID) ??
            this.client.getServerMember(this.id, this.ownerID)
        );
    }

    /**
     * Create a member ban
     * @param memberID The ID of the member
     * @param reason The reason for the ban
     * @returns {Promise<ServerMemberBan>}
     */
    public createMemberBan(
        memberID: string,
        reason?: string
    ): Promise<ServerMemberBan> {
        return this.client.createServerMemberBan(this.id, memberID, reason);
    }

    /**
     * Remove a member ban
     * @param memberID The ID of the member
     * @returns {Promise<void>}
     */
    public removeMemberBan(memberID: string): Promise<void> {
        return this.client.removeServerMemberBan(this.id, memberID);
    }

    public override toJSON(): ServerData {
        return {
            ...super.toJSON(),
            about: this.about,
            avatar: this.avatar,
            banner: this.banner,
            createdAt: this.creaetdAt,
            defaultChannelID: this.defaultChannelID,
            isVerified: this.isVerified,
            name: this.name,
            ownerID: this.ownerID,
            timezone: this.timezone,
            type: this.type,
            url: this.url,
        };
    }

    protected override update(data: RawServer): void {
        if (data.about !== undefined) {
            this.about = data.about;
        }

        if (data.avatar !== undefined) {
            this.avatar = data.avatar;
        }

        if (data.banner !== undefined) {
            this.banner = data.banner;
        }

        if (data.createdAt !== undefined) {
            this.creaetdAt = new Date(data.createdAt);
        }

        if (data.defaultChannelId !== undefined) {
            this.defaultChannelID = data.defaultChannelId;
        }

        if (data.id !== undefined) {
            this.id = data.id;
        }

        if (data.isVerified !== undefined) {
            this.isVerified = data.isVerified;
        }

        if (data.name !== undefined) {
            this.name = data.name;
        }

        if (data.ownerId !== undefined) {
            this.ownerID = data.ownerId;
        }

        if (data.timezone !== undefined) {
            this.timezone = data.timezone;
        }

        if (data.type !== undefined) {
            this.type = data.type;
        }

        if (data.url !== undefined) {
            this.url = data.url;
        }
    }
}
