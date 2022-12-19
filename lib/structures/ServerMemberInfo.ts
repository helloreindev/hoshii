import { Client } from "../Client";
import { ServerMember } from "./ServerMember";
import { Server } from "./Server";
import {
    Payload_ServerMemberRemoved,
    Payload_ServerMemberUpdated,
    Payload_ServerRolesUpdated,
} from "../Constants";

export abstract class ServerMemberInfo {
    public client: Client;

    public memberID: string;

    public serverID: string;

    public constructor(
        data:
            | Payload_ServerMemberRemoved
            | Payload_ServerMemberUpdated
            | Payload_ServerRolesUpdated,
        client: Client,
        memberID: string
    ) {
        this.client = client;
        this.memberID = memberID;
        this.serverID = data.serverId;
    }

    get member(): ServerMember | Promise<ServerMember> {
        return (
            this.client.servers
                .get(this.serverID)
                ?.members.get(this.memberID) ??
            this.client.getServerMember(this.serverID, this.memberID)
        );
    }

    get server(): Server | Promise<Server> {
        return (
            this.client.servers.get(this.serverID) ??
            this.client.getServer(this.serverID)
        );
    }
}
