import { Client } from "../Client";
import { Payload_ServerMemberRemoved } from "../Constants";
import { ServerMemberInfo } from "./ServerMemberInfo";

export class ServerMemberRemoveInfo extends ServerMemberInfo {
    public isBan?: boolean;

    public isKick?: boolean;

    public constructor(
        data: Payload_ServerMemberRemoved,
        client: Client,
        memberID: string
    ) {
        super(data, client, memberID);

        this.isBan = data.isBan;
        this.isKick = data.isKick;
    }
}
