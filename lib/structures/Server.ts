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

export class Server extends Base<string> {
    private _clientMember?: ServerMember;

    public about?: string;

    public avatar?: string;

    public banner?: string;

    public channels: TypedCollection<string, RawServerChannel, AnyChannel>;

    public creaetdAt: Date;

    public defaultChannelID?: string;

    public isVerified: boolean;

    public members: TypedCollection<
        string,
        RawServerMember,
        ServerMember,
        [serverID: string]
    >;

    public name: string;

    public ownerID: string;

    public timezone?: string;

    public type?: ServerCategories;

    public url?: string;

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
