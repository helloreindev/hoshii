import { Base, BaseData } from "./Base";
import { Client } from "../Client";
import { ServerMember } from "./ServerMember";
import { Server } from "./Server";
import { RawUser, RawUserSummary, User } from "./User";

export interface MemberBan {
    bannedBy: string;
    createdAt: Date | null;
    reason?: string;
}

export interface ServerMemberBanData extends BaseData<string> {
    ban: MemberBan;
    serverID: string;
}

export interface RawServerMemberBan {
    createdAt: string;
    createdBy: string;
    reason?: string;
    user: RawUserSummary;
}

export class ServerMemberBan extends Base<string> {
    public ban: MemberBan;

    public member: ServerMember | null;

    public serverID: string;

    public user: User;

    public constructor(
        data: RawServerMemberBan,
        client: Client,
        serverID: string
    ) {
        super(data.user.id, client);

        this.ban = {
            bannedBy: data.createdBy,
            createdAt: data.createdAt ? new Date(data.createdAt) : null,
            reason: data.reason,
        };
        this.member =
            client.servers.get(serverID)?.members.get(data.user.id) ?? null;
        this.user =
            client.users.update(data.user) ??
            new User(data.user as RawUser, client);
        this.serverID = serverID;

        this.update(data);
    }

    public get server(): Server | Promise<Server> {
        return (
            this.client.servers.get(this.serverID) ??
            this.client.getServer(this.serverID)
        );
    }

    public override toJSON(): ServerMemberBanData {
        return {
            ...super.toJSON(),
            ban: this.ban,
            serverID: this.serverID,
        };
    }

    protected override update(data: RawServerMemberBan): void {
        if (data.createdAt !== undefined) {
            this.ban.createdAt = new Date(data.createdAt);
        }

        if (data.createdBy !== undefined) {
            this.ban.bannedBy = data.createdBy;
        }

        if (data.reason !== undefined) {
            this.ban.reason = data.reason;
        }

        if (data.user !== undefined) {
            this.user = this.client.users.update(data.user);
        }
    }
}
