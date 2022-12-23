import { Client } from "../Client";
import { RawUser, RawUserSummary, User, UserData } from "./User";
import { SocialLink } from "../Constants";
import { Server } from "./Server";

export interface RawServerMember {
    isOwner: boolean;
    joinedAt: string;
    nickname?: string;
    roleIds: Array<number>;
    user: RawUser;
}

export interface RawServerMemberSummary {
    roleIds: Array<number>;
    user: RawUserSummary;
}

export interface ServerMemberData extends UserData {
    isOwner: boolean;
    joinedAt: Date | null;
    nickname: string | null;
    roleIds: Array<number> | null;
    serverID: string;
}

export interface ServerMemberEditOptions {
    nickname: string | null;
}

export class ServerMember extends User {
    /**
     * The raw data of the member
     */
    private _data: RawServerMember;

    /**
     * Whether the member is the owner of the server
     */
    public isOwner: boolean;

    /**
     * The date the member joined the server
     */
    public joinedAt: Date | null;

    /**
     * The nickname of the member
     */
    public nickname: string | null;

    /**
     * An array of role IDs the member has
     */
    public roleIDs: Array<number> | null;

    /**
     * The ID of the server the member is in
     */
    public serverID: string;

    /**
     * Create a new ServerMember
     * @param data The raw data of the member
     * @param client The client
     * @param serverID The ID of the server the member is in
     */
    public constructor(
        data: RawServerMember,
        client: Client,
        serverID: string
    ) {
        super(data.user, client);

        this._data = data;
        this.serverID = serverID;
        this.isOwner = data.isOwner;
        this.joinedAt = data.joinedAt ? new Date(data.joinedAt) : null;
        this.nickname = data.nickname ?? null;
        this.roleIDs = data.roleIds ?? null;

        this.update(data);
    }

    /**
     * The server the member is in
     */
    public get server(): Server | Promise<Server> {
        return (
            this.client.servers.get(this.serverID) ??
            this.client.getServer(this.serverID)
        );
    }

    /**
     * The user data of the member
     */
    public get user(): User {
        if (this.client.users.get(this.id)) {
            return this.client.users.update(this._data.user);
        } else {
            const user = new User(this._data.user, this.client);

            this.client.users.add(user);

            return user;
        }
    }

    /**
     * Add a member to a group
     * @param groupID The ID of the group
     * @returns {Promise<void>}
     */
    public addGroup(groupID: string): Promise<void> {
        return this.client.addServerMemberGroup(groupID, this.id);
    }

    /**
     * Add a role to a member
     * @param roleID The ID of the role
     * @returns {Promise<void>}
     */
    public addRole(roleID: number): Promise<void> {
        return this.client.addServerMemberRole(this.serverID, this.id, roleID);
    }

    /**
     * Award the member the built-in XP system
     * @param amount The amount of XP to award
     * @returns {Promise<number>}
     */
    public award(amount: number): Promise<number> {
        return this.client.awardServerMember(this.serverID, this.id, amount);
    }

    /**
     * Create a ban for the member
     * @param reason The reason for the ban
     */
    public createBan(reason?: string) {
        return this.client.createServerMemberBan(
            this.serverID,
            this.id,
            reason
        );
    }

    /**
     * Edit the member
     * @param options The options to edit the member with
     * @returns {Promise<void>}
     */
    public edit(options: ServerMemberEditOptions): Promise<void> {
        return this.client.editServerMember(this.serverID, this.id, options);
    }

    /**
     * Get the social link of the member
     * @param socialMediaName The name of the social media
     * @returns {Promise<SocialLink>}
     */
    public getSocialLink(socialMediaName: string): Promise<SocialLink> {
        return this.client.getServerMemberSocialLink(
            this.serverID,
            this.id,
            socialMediaName
        );
    }

    /**
     * Remove the member from the server
     * @returns {Promise<void>}
     */
    public remove(): Promise<void> {
        return this.client.removeServerMember(this.serverID, this.id);
    }

    /**
     * Remove a member ban
     * @returns {Promise<void>}
     */
    public removeBan(): Promise<void> {
        return this.client.removeServerMemberBan(this.serverID, this.id);
    }

    /**
     * Remove a member from a group
     * @param groupID The ID of the group
     * @returns {Promise<void>}
     */
    public removeGroup(groupID: string): Promise<void> {
        return this.client.removeServerMemberGroup(groupID, this.id);
    }

    /**
     * Remove a role from a member
     * @param roleID The ID of the role
     * @returns {Promise<void>}
     */
    public removeRole(roleID: number): Promise<void> {
        return this.client.removeServerMemberRole(
            this.serverID,
            this.id,
            roleID
        );
    }

    /**
     * Set the member XP using the built-in XP system
     * @param total The total XP to set
     * @returns {Promise<number>}
     */
    public setXP(total: number): Promise<number> {
        return this.client.setServerMemberXP(this.serverID, this.id, total);
    }

    public override toJSON(): ServerMemberData {
        return {
            ...super.toJSON(),
            isOwner: this.isOwner,
            joinedAt: this.joinedAt,
            nickname: this.nickname,
            roleIds: this.roleIDs,
            serverID: this.serverID,
        };
    }

    protected override update(data: RawServerMember): void {
        if (data.isOwner) {
            this.isOwner = data.isOwner;
        }

        if (data.joinedAt) {
            this.joinedAt = new Date(data.joinedAt);
        }

        if (data.nickname) {
            this.nickname = data.nickname;
        }

        if (data.roleIds) {
            this.roleIDs = data.roleIds;
        }

        if (data.user !== undefined) {
            super.update(data.user);
            this.client.users.update(data.user);
        }
    }
}
