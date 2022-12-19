import { Client } from "../Client";
import {
    Payload_ServerMemberUpdated,
    Payload_ServerRolesUpdated,
} from "../Constants";
import { ServerMemberInfo } from "./ServerMemberInfo";

export class ServerMemberUpdateInfo extends ServerMemberInfo {
    public oldRoles: Array<number> | null;

    public roleIDs: Array<number> | null;

    public updatedNickname: string | null;

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
