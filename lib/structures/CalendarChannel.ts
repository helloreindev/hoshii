import { Client } from "../Client";
import {
    CalendarEvent,
    CalendarEventData,
    RawCalendarEvent,
} from "./CalendarEvent";
import {
    ServerChannel,
    ServerChannelData,
    RawServerChannel,
} from "./ServerChannel";
import TypedCollection from "../utils/TypedCollection";

export interface CalendarChannelData extends ServerChannelData {
    scheduledEvents: Array<CalendarEventData>;
}

/**
 * Represents a calendar channel
 */
export class CalendarChannel extends ServerChannel {
    /**
     * A collection of cached scheduled events
     */
    public scheduledEvents: TypedCollection<
        number,
        RawCalendarEvent,
        CalendarEvent
    >;

    /**
     * Create a new CalendarChannel
     * @param data The raw data of the channel
     * @param client The client
     */
    public constructor(data: RawServerChannel, client: Client) {
        super(data, client);

        this.scheduledEvents = new TypedCollection(
            CalendarEvent,
            client,
            client.options.collectionLimits?.scheduledEvents
        );

        this.update(data);
    }

    public override toJSON(): CalendarChannelData {
        return {
            ...super.toJSON(),
            scheduledEvents: this.scheduledEvents.map((event) =>
                event.toJSON()
            ),
        };
    }
}
