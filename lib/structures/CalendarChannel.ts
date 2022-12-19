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

export class CalendarChannel extends ServerChannel {
    public scheduledEvents: TypedCollection<
        number,
        RawCalendarEvent,
        CalendarEvent
    >;

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
