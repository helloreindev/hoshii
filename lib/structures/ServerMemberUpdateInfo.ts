import { Client } from "../Client";
import {
    Payload_ServerMemberUpdated,
    Payload_ServerRolesUpdated,
} from "../Constants";
import { ServerMemberInfo } from "./ServerMemberInfo";

/**
 * Represents a server member update info
 */
export class ServerMemberUpdateInfo extends ServerMemberInfo {
    /**
     * An array of old roles IDs the member had
     */
    public oldRoles: Array<number> | null;

    /**
     * An array of new roles IDs the member has
     */
    public roleIDs: Array<number> | null;

    /**
     * The updated nickname of the member
     */
    public updatedNickname: string | null;

    /**
     * Create a new ServerMemberUpdateInfo
     * @param data The payload data of the member
     * @param client The client
     * @param memberID The ID of the member
     */
    public constructor(
        data: Payload_ServerMemberUpdated | Payload_ServerRolesUpdated,
        client: Client,
        memberID: string
    ) {
        super(data, client, memberID);

        this.oldRoles =
            this.client.servers.get(this.serverID)?.members.get(this.memberID)
                ?.roleIDs ?? null;
        this.roleIDs =
            (data as Payload_ServerRolesUpdated)?.memberRoleIds?.[0]?.roleIds ??
            null;
        this.updatedNickname =
            (data as Payload_ServerMemberUpdated)?.userInfo?.nickname ?? null;
    }
}
