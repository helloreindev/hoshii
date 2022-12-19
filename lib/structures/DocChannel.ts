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

export class DocChannel extends ServerChannel {
    public docs: TypedCollection<number, RawDoc, Doc>;

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
