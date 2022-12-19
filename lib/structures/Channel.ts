import { Base, BaseData } from "./Base";
import { Client } from "../Client";
import { CalendarChannel } from "./CalendarChannel";
import {
    RawServerChannel,
    ServerChannel,
    ServerChannelEditOptions,
} from "./ServerChannel";
import { AnyChannel, ServerChannelCategories } from "../Constants";
import { DocChannel } from "./DocChannel";
import { ForumChannel } from "./ForumChannel";
import { TextChannel } from "./TextChannel";

export interface ChannelData extends BaseData<string> {
    name: string | null;
    type: ServerChannelCategories;
}

export class Channel extends Base<string> {
    public name: string | null;

    public type: ServerChannelCategories;

    public constructor(data: RawServerChannel, client: Client) {
        super(data.id, client);

        this.name = data.name;
        this.type = data.type;
    }

    /**
     * Deletes the channel
     * @returns {Promise<void>}
     */
    public delete(): Promise<void> {
        return this.client.deleteServerChannel(this.id);
    }

    /**
     * Edits the channel
     * @param options The options to edit the channel with
     * @param options The options to edit the channel with
     * @param options.isPublic Whether the channel is public or not
     * @param options.name The name of the channel
     * @param options.topic The topic of the channel
     * @returns {Promise<Channel>}
     */
    public edit(options: ServerChannelEditOptions): Promise<Channel> {
        return this.client.editServerChannel(this.id, options);
    }

    public static from<T extends AnyChannel = AnyChannel>(
        data: RawServerChannel,
        client: Client
    ): T {
        switch (data.type) {
            case "announcement":
                return new ServerChannel(data, client) as T;
            case "calendar":
                return new CalendarChannel(data, client) as T;
            case "chat":
                return new TextChannel(data, client) as T;
            case "docs":
                return new DocChannel(data, client) as T;
            case "forums":
                return new ForumChannel(data, client) as T;
            case "list":
                return new ServerChannel(data, client) as T;
            case "media":
                return new ServerChannel(data, client) as T;
            case "scheduling":
                return new ServerChannel(data, client) as T;
            case "stream":
                return new ServerChannel(data, client) as T;
            case "voice":
                return new ServerChannel(data, client) as T;
            default:
                return new Channel(data, client) as T;
        }
    }

    public override toJSON(): ChannelData {
        return {
            ...super.toJSON(),
            name: this.name,
            type: this.type,
        };
    }
}
