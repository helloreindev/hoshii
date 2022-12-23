import { Client } from "../Client";
import { Payload_ServerMemberRemoved } from "../Constants";
import { ServerMemberInfo } from "./ServerMemberInfo";

/**
 * Represents a server member remove info
 */
export class ServerMemberRemoveInfo extends ServerMemberInfo {
    /**
     * Whether the member was banned
     */
    public isBan?: boolean;

    /**
     * Whether the member was kicked
     */
    public isKick?: boolean;

    /**
     * Create a new ServerMemberRemoveInfo
     * @param data The payload data of the member
     * @param client The client
     * @param memberID The ID of the member
     */
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
