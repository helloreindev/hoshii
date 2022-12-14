import { Base, BaseData } from "./Base";
import { Client } from "../Client";

export type CalendarEventRSVPStatus =
    | "declined"
    | "going"
    | "invited"
    | "maybe"
    | "not responded"
    | "waitlisted";

export interface CalendarEventRSVPData extends BaseData<number> {
    channelID: string;
    createdAt: Date | null;
    createdBy: string;
    serverID: string;
    status: CalendarEventRSVPStatus;
    updatedAt: Date | null;
    updatedBy: string | null;
    userID: string;
}

export interface CalendarEventRSVPEditOptions {
    status: CalendarEventRSVPStatus;
}

export interface RawCalendarEventRSVP {
    calendarEventId: number;
    channelId: string;
    createdAt: string;
    createdBy: string;
    serverId: string;
    status: CalendarEventRSVPStatus;
    updatedAt: string;
    updatedBy: string;
    userId: string;
}

/**
 * Represents a calendar event RSVP
 */
export class CalendarEventRSVP extends Base<number> {
    /**
     * The ID of the channel the calendar event is in
     */
    public channelID: string;

    /**
     * The date the calendar event RSVP was created at
     */
    public createdAt: Date | null;

    /**
     * The ID of the user that created the calendar event RSVP
     */
    public createdBy: string | null;

    /**
     * The ID of the server the calendar event is in
     */
    public serverID: string;

    /**
     * The status of the calendar event RSVP
     */
    public status: CalendarEventRSVPStatus;

    /**
     * The date the calendar event RSVP was updated at
     */
    public updatedAt: Date | null;

    /**
     * The ID of the user that updated the calendar event RSVP
     */
    public updatedBy: string | null;

    /**
     * The ID of the user
     */
    public userID: string;

    /**
     * Create a new CalendarEventRSVP
     * @param data The raw data for the calendar event RSVP
     * @param client The client
     */
    public constructor(data: RawCalendarEventRSVP, client: Client) {
        super(data.calendarEventId, client);

        this.channelID = data.channelId;
        this.createdAt = data.createdAt ? new Date(data.createdAt) : null;
        this.createdBy = data.createdBy ?? null;
        this.serverID = data.serverId;
        this.status = data.status;
        this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : null;
        this.updatedBy = data.updatedBy ?? null;
        this.userID = data.userId;

        this.update(data);
    }

    /**
     * Delete the calendar event RSVP
     * @returns {Promise<void>}
     */
    public delete(): Promise<void> {
        return this.client.deleteCalendarEventRSVP(
            this.channelID,
            this.id,
            this.userID
        );
    }

    /**
     * Edit the calendar event RSVP
     * @param options The options to edit the calendar event RSVP with
     * @returns {Promise<CalendarEventRSVP>}
     */
    public edit(
        options: CalendarEventRSVPEditOptions
    ): Promise<CalendarEventRSVP> {
        return this.client.editCalendarEventRSVP(
            this.channelID,
            this.id,
            this.userID,
            options
        );
    }

    public override toJSON(): CalendarEventRSVPData {
        return {
            ...super.toJSON(),
            channelID: this.channelID,
            createdAt: this.createdAt,
            createdBy: this.createdBy,
            serverID: this.serverID,
            status: this.status,
            updatedAt: this.updatedAt,
            updatedBy: this.updatedBy,
            userID: this.userID,
        };
    }

    protected override update(data: RawCalendarEventRSVP): void {
        if (data.calendarEventId !== undefined) {
            this.id = data.calendarEventId;
        }

        if (data.channelId !== undefined) {
            this.channelID = data.channelId;
        }

        if (data.createdAt !== undefined) {
            this.createdAt = data.createdAt ? new Date(data.createdAt) : null;
        }

        if (data.createdBy !== undefined) {
            this.createdBy = data.createdBy ?? null;
        }

        if (data.serverId !== undefined) {
            this.serverID = data.serverId;
        }

        if (data.status !== undefined) {
            this.status = data.status;
        }

        if (data.updatedAt !== undefined) {
            this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : null;
        }

        if (data.updatedBy !== undefined) {
            this.updatedBy = data.updatedBy ?? null;
        }

        if (data.userId !== undefined) {
            this.userID = data.userId;
        }
    }
}
