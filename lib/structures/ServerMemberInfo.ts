import { Client } from "../Client";
import { ServerMember } from "./ServerMember";
import { Server } from "./Server";
import {
    Payload_ServerMemberRemoved,
    Payload_ServerMemberUpdated,
    Payload_ServerRolesUpdated,
} from "../Constants";

/**
 * Represents a server member info
 */
export abstract class ServerMemberInfo {
    /**
     * The client
     */
    public client: Client;

    /**
     * The ID of the member
     */
    public memberID: string;

    /**
     * The ID of the server the member is in
     */
    public serverID: string;

    /**
     * Create a new ServerMemberInfo
     * @param data The raw data of the member
     * @param client The client
     * @param memberID The ID of the member
     */
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

    /**
     * The member
     */
    get member(): ServerMember | Promise<ServerMember> {
        return (
            this.client.servers
                .get(this.serverID)
                ?.members.get(this.memberID) ??
            this.client.getServerMember(this.serverID, this.memberID)
        );
    }

    /**
     * The server the member is in
     */
    get server(): Server | Promise<Server> {
        return (
            this.client.servers.get(this.serverID) ??
            this.client.getServer(this.serverID)
        );
    }
}
