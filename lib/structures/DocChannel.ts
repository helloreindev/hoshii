import { Client } from "../Client";
import { Doc, DocData, RawDoc } from "./Doc";
import {
    RawServerChannel,
    ServerChannel,
    ServerChannelData,
} from "./ServerChannel";
import TypedCollection from "../utils/TypedCollection";

export interface DocChannelData extends ServerChannelData {
    docs: Array<DocData>;
}

/**
 * Represents a doc channel
 */
export class DocChannel extends ServerChannel {
    /**
     * A collection of cached docs
     */
    public docs: TypedCollection<number, RawDoc, Doc>;

    /**
     * Create a new DocChannel
     * @param data The raw data of the channel
     * @param client The client
     */
    public constructor(data: RawServerChannel, client: Client) {
        super(data, client);

        this.docs = new TypedCollection(
            Doc,
            client,
            client.options.collectionLimits?.docs
        );

        this.update(data);
    }

    public override toJSON(): DocChannelData {
        return {
            ...super.toJSON(),
            docs: this.docs.map((doc) => doc.toJSON()),
        };
    }
}
