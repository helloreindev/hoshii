import { Base, BaseData } from "./Base";
import { Client } from "../Client";
import {
    CalendarEventRSVP,
    CalendarEventRSVPData,
    RawCalendarEventRSVP,
} from "./CalendarEventRSVP";
import { Mentions } from "../Constants";
import TypedCollection from "../utils/TypedCollection";
import { ServerMember } from "./ServerMember";
import { User } from "./User";

export interface CalendarEventCancellation {
    createdBy?: string;
    description?: string;
}

export interface CalendarEventData extends BaseData<number> {
    cancellation: CalendarEventCancellation | null;
    channelID: string;
    color: number | null;
    createdAt: Date | null;
    createdBy: string;
    data: RawCalendarEvent;
    description: string | null;
    duration: number;
    isPrivate: boolean;
    location: string | null;
    mentions: Mentions | null;
    name: string;
    rsvpLimit: number | null;
    rsvps: Array<CalendarEventRSVPData>;
    serverID: string;
    startsAt: Date | null;
    url: string | null;
}

export interface CalendarEventEditOptions {
    color?: number;
    decsription?: string;
    duration?: number;
    isPrivate?: boolean;
    location?: string;
    name?: string;
    rsvpLimit?: number;
    startsAt?: string;
    url?: string;
}

export interface RawCalendarEvent {
    cancellation: CalendarEventCancellation;
    channelId: string;
    color?: number;
    createdAt: string;
    createdBy: string;
    description?: string;
    duration?: number;
    id: number;
    isPrivate?: boolean;
    location?: string;
    mentions?: Mentions;
    name: string;
    rsvpLimit?: number;
    serverId: string;
    startsAt: string;
    url?: string;
}

export class CalendarEvent extends Base<number> {
    public cancellation: CalendarEventCancellation | null;

    public channelID: string;

    public color: number | null;

    public createdAt: Date | null;

    public createdBy: string;

    public data: RawCalendarEvent;

    public description: string | null;

    public duration: number;

    public isPrivate: boolean;

    public location: string | null;

    public mentions: Mentions | null;

    public name: string;

    public rsvpLimit: number | null;

    public rsvps: TypedCollection<
        number,
        RawCalendarEventRSVP,
        CalendarEventRSVP
    >;

    public serverID: string;

    public startsAt: Date | null;

    public url: string | null;

    public constructor(data: RawCalendarEvent, client: Client) {
        super(data.id, client);

        this.cancellation = data.cancellation;
        this.channelID = data.channelId;
        this.color = data.color ?? null;
        this.createdAt = data.createdAt ? new Date(data.createdAt) : null;
        this.createdBy = data.createdBy;
        this.data = data;
        this.description = data.description ?? null;
        this.duration = data.duration ?? 0;
        this.isPrivate = data.isPrivate ?? false;
        this.location = data.location ?? null;
        this.mentions = data.mentions ?? null;
        this.name = data.name;
        this.rsvpLimit = data.rsvpLimit ?? null;
        this.rsvps = new TypedCollection(
            CalendarEventRSVP,
            client,
            client.options.collectionLimits?.scheduledEventsRSVPS
        );
        this.serverID = data.serverId;
        this.startsAt = data.startsAt ? new Date(data.startsAt) : null;
        this.url = data.url ?? null;

        this.update(data);
    }

    public get owner():
        | ServerMember
        | User
        | Promise<ServerMember>
        | undefined {
        const server = this.client.servers.get(this.serverID);

        if (server?.members.get(this.createdBy) && this.createdBy) {
            return server?.members.get(this.createdBy);
        } else if (this.client.users.get(this.createdBy) && this.createdBy) {
            this.client.users.get(this.createdBy);
        } else if (this.createdBy && this.serverID) {
            return this.client.getServerMember(this.serverID, this.createdBy);
        }
    }

    /**
     * Deletes the calendar event
     * @returns {Promise<void>}
     */
    public delete(): Promise<void> {
        return this.client.deleteCalendarEvent(this.channelID, this.id);
    }

    /**
     * Edits the calendar event
     * @param options The options to edit the calendar event with
     * @returns {Promise<CalendarEvent>}
     */
    public edit(options: CalendarEventEditOptions): Promise<CalendarEvent> {
        return this.client.editCalendarEvent(this.channelID, this.id, options);
    }

    public override toJSON(): CalendarEventData {
        return {
            ...super.toJSON(),
            cancellation: this.cancellation,
            channelID: this.channelID,
            color: this.color,
            createdAt: this.createdAt,
            createdBy: this.createdBy,
            data: this.data,
            description: this.description,
            duration: this.duration,
            isPrivate: this.isPrivate,
            location: this.location,
            mentions: this.mentions,
            name: this.name,
            rsvpLimit: this.rsvpLimit,
            rsvps: this.rsvps.map((rsvp) => rsvp.toJSON()),
            serverID: this.serverID,
            startsAt: this.startsAt,
            url: this.url,
        };
    }

    protected override update(data: RawCalendarEvent): void {
        if (data.cancellation) {
            this.cancellation = data.cancellation;
        }

        if (data.color) {
            this.color = data.color;
        }

        if (data.createdAt) {
            this.createdAt = new Date(data.createdAt);
        }

        if (data.createdBy) {
            this.createdBy = data.createdBy;
        }

        if (data.description) {
            this.description = data.description;
        }

        if (data.duration) {
            this.duration = data.duration;
        }

        if (data.id) {
            this.id = data.id;
        }

        if (data.isPrivate) {
            this.isPrivate = data.isPrivate;
        }

        if (data.location) {
            this.location = data.location;
        }

        if (data.mentions) {
            this.mentions = data.mentions;
        }

        if (data.name) {
            this.name = data.name;
        }

        if (data.rsvpLimit) {
            this.rsvpLimit = data.rsvpLimit;
        }

        if (data.serverId) {
            this.serverID = data.serverId;
        }

        if (data.startsAt) {
            this.startsAt = new Date(data.startsAt);
        }

        if (data.url) {
            this.url = data.url;
        }
    }
}
