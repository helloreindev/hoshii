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

export interface CalendarEventFilter {
    after?: string;
    before?: string;
    limit?: number;
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

export interface CalendarEventOptions {
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

/**
 * Represents a calendar event
 */
export class CalendarEvent extends Base<number> {
    /**
     * The cancellation information of the event
     */
    public cancellation: CalendarEventCancellation | null;

    /**
     * The ID of the channel the event is in
     */
    public channelID: string;

    /**
     * The colour of the event
     */
    public color: number | null;

    /**
     * The date the event was created at
     */
    public createdAt: Date | null;

    /**
     * The ID of the user who created the event
     */
    public createdBy: string;

    /**
     * The raw data of the event
     */
    public data: RawCalendarEvent;

    /**
     * The description of the event
     */
    public description: string | null;

    /**
     * The duration of the event in minutes
     */
    public duration: number;

    /**
     * Whether the event is private
     */
    public isPrivate: boolean;

    /**
     * The location of the event
     */
    public location: string | null;

    /**
     * The mentions of the event
     */
    public mentions: Mentions | null;

    /**
     * The name of the event
     */
    public name: string;

    /**
     * The RSVP limit of the event
     */
    public rsvpLimit: number | null;

    /**
     * A collection of cached RSVPs
     */
    public rsvps: TypedCollection<
        number,
        RawCalendarEventRSVP,
        CalendarEventRSVP
    >;

    /**
     * The ID of the server the event is in
     */
    public serverID: string;

    /**
     * The date the event starts at
     */
    public startsAt: Date | null;

    /**
     * The URL of the event
     */
    public url: string | null;

    /**
     * Create a new CalendarEvent
     * @param data The raw data of the event
     * @param client The client
     */
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

    /**
     * The owner of the event
     */
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
     * Delete the calendar event
     * @returns {Promise<void>}
     */
    public delete(): Promise<void> {
        return this.client.deleteCalendarEvent(this.channelID, this.id);
    }

    /**
     * Edit the calendar event
     * @param options The options to edit the calendar event with
     * @returns {Promise<CalendarEvent>}
     */
    public edit(options: CalendarEventOptions): Promise<CalendarEvent> {
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
