import GatewayError from "./GatewayError";
import { Client } from "../Client";
import {
    AnyPacket,
    DefaultConfig,
    GatewayOPCodes,
    WebsocketEvents,
    WelcomePacket,
} from "../Constants";
import { RawClientUser } from "../structures/ClientUser";
import { is } from "../utils/Util";
import TypedEmitter from "../utils/TypedEmitter";
import type Pako from "pako";
import { Data } from "ws";
import { WebSocket as WS } from "ws";
/* @ts-ignore */
import type { Inflate } from "zlib-sync";
import assert from "node:assert";

/* eslint-disable no-empty, @typescript-eslint/no-var-requires */
/* @ts-ignore */
let Erlpack: typeof import("erlpack") | undefined;

try {
    Erlpack = require("erlpack");
} catch {}

/* @ts-ignore */
let ZlibSync: typeof import("pako") | typeof import("zlib-sync") | undefined,
    ZlibConstants:
        | typeof import("pako").constants
        /* @ts-ignore */
        | typeof import("zlib-sync")
        | undefined;

try {
    ZlibSync = require("zlib-sync");
    ZlibConstants = require("zlib-sync");
} catch {
    try {
        ZlibSync = require("pako");
        ZlibConstants = require("pako").constants;
    } catch {}
}

/**
 * Represents a websocket connection to the gateway
 */
export class WebSocket extends TypedEmitter<WebsocketEvents> {
    /**
     * The timeout for the connection
     */
    private _connectTimeout: NodeJS.Timeout | null;

    /**
     * The interval for the heartbeat
     */
    private _heartbeatInterval: NodeJS.Timeout | null;

    /**
     * The shared zlib instance (currently not supported)
     */
    private _sharedZLib!: Pako.Inflate | Inflate;

    /**
     * Whether the websocket is alive
     */
    public alive?: boolean;

    /**
     * The client
     */
    public client: Client;

    /**
     * Whether the websocket should compress packets
     */
    public compress: boolean;

    /**
     * Whether the websocket is connected
     */
    public connected: boolean;

    /**
     * The timeout for the connection
     */
    public connectionTimeout: number;

    /**
     * The current reconnect attempt
     */
    public currReconnectAttempt: number;

    /**
     * Whether the websocket is currently reconnecting
     */
    public firstWSMessage: boolean;

    /**
     * The URl of the gateway
     */
    public gatewayURL: string;

    /**
     * The version of the gateway
     */
    public gatewayVersion: string | number;

    /**
     * Whether the websocket has requested a heartbeat
     */
    public heartbeatRequested: boolean;

    /**
     * Whether the websocket has acknowledged the last heartbeat
     */
    public lastHeartbeatAck: boolean;

    /**
     * Last time a heartbeat was received
     */
    public lastHeartbeatReceived: number;

    /**
     * Last time a heartbeat was sent
     */
    public lastHeartbeatSent: number;

    /**
     * The last message ID
     */
    public lastMessageID?: string;

    /**
     * The latency of the websocket
     */
    public latency: number;

    /**
     * Whether the websocket should reconnect
     */
    public reconnect?: boolean;

    /**
     * The limit of reconnect attempts
     */
    public reconnectAttemptLimit?: number;

    /**
     * The interval for reconnecting
     */
    public reconnectInterval: number;

    /**
     * Whether the websocket should replay missed events
     */
    public replayMissedEvents?: boolean;

    /**
     * The client token
     */
    public token: string;

    /**
     * The websocket
     */
    public ws: WS | null;

    /**
     * Create a new Websocket connection
     * @param client The client
     */
    public constructor(client: Client) {
        super();

        Object.defineProperties(this, {
            client: {
                configurable: false,
                enumerable: false,
                value: client,
                writable: false,
            },
            ws: {
                configurable: false,
                enumerable: false,
                value: null,
                writable: true,
            },
        });

        this.token = client.token;
        this.gatewayVersion = DefaultConfig.GuildedAPI.GatewayVersion;
        this.gatewayURL = DefaultConfig.GuildedAPI.GatewayURL;
        this.reconnect = client.options.reconnect ?? true;
        this.reconnectAttemptLimit = client.options.reconnectAttemptLimit ?? 1;
        this.reconnectInterval = 10000;
        this.replayMissedEvents = client.options.replayMissedEvents ?? true;
        this.compress = client.options.compress ?? false;
        this._heartbeatInterval = null;
        this.ws = null;
        this.firstWSMessage = true;
        this.lastMessageID = undefined;
        this.currReconnectAttempt = 0;
        this.alive = false;
        this.latency = 1000;
        this.lastHeartbeatSent = NaN;
        this.lastHeartbeatReceived = NaN;
        this.lastHeartbeatAck = false;
        this.heartbeatRequested = false;
        this.connected = false;
        this.connectionTimeout = 300000;
        this._connectTimeout = null;
    }

    public get replayEventsCondition(): boolean {
        return (
            this.replayMissedEvents === true && this.lastMessageID !== undefined
        );
    }

    /**
     * Connect to the websocket
     * @returns {void | Error}
     */
    public connect(): void | Error {
        if (this.ws && this.ws.readyState !== WS.CLOSED) {
            this.client.emit(
                "error",
                new Error(
                    "Calling connect while an existing connection is already established."
                )
            );
            return;
        }

        this.currReconnectAttempt++;
        this.initialise();
    }

    /**
     * Disconnect from the websocket
     * @param reconnect Whether the websocket should reconnect
     * @param error The error that caused the disconnect
     */
    public disconnect(reconnect = this.reconnect, error?: Error): void {
        this.ws?.close();
        this.alive = false;
        this.connected = false;

        if (this._heartbeatInterval) {
            clearInterval(this._heartbeatInterval);
            this._heartbeatInterval = null;
        }

        if (this.ws?.readyState !== WS.CLOSED) {
            this.ws?.removeAllListeners();

            try {
                if (reconnect) {
                    if (this.ws?.readyState !== WS.OPEN) {
                        this.ws?.close(4999, "Hoshii: Reconnect");
                    } else {
                        this.client.emit("debug", "Terminating websocket");
                        this.ws.terminate();
                    }
                } else {
                    this.ws?.close(1000, "Hoshii: Normal Close");
                }
            } catch (err) {
                this.client.emit("error", err as Error);
            }
        }

        if (error) {
            if (
                error instanceof GatewayError &&
                [1001, 1006].includes(error.code)
            ) {
                this.client.emit("debug", error.message);
            } else {
                this.client.emit("error", error);
            }
        }

        this.ws = null;
        this.reset();

        this.emit("disconnect", error as Error);

        if (
            this.currReconnectAttempt >= (this.reconnectAttemptLimit as number)
        ) {
            this.client.emit(
                "debug",
                `Automatically invalidating session due to excessive resume attempts | Attempt ${this.currReconnectAttempt}`
            );
        }

        if (reconnect) {
            if (this.lastMessageID) {
                this.client.emit(
                    "debug",
                    `Immediately reconnecting for potential resume | Attempt ${this.currReconnectAttempt}`
                );
                this.connect();
            } else {
                this.client.emit(
                    "debug",
                    `Queueing reconnect in ${this.reconnectInterval}ms | Attempt ${this.currReconnectAttempt}`
                );
                setTimeout(() => {
                    this.connect();
                }, this.reconnectInterval);
                this.reconnectInterval = Math.min(
                    Math.round(
                        this.reconnectInterval * (Math.random() * 2 + 1)
                    ),
                    30000
                );
            }
        } else {
            this.hardReset();
        }
    }

    public hardReset(): void {
        this.reset();
        this.token = this.client.token;
        this.gatewayVersion = DefaultConfig.GuildedAPI.GatewayVersion;
        this.gatewayURL = DefaultConfig.GuildedAPI.GatewayURL;
        this.reconnect = this.client.options.reconnect ?? true;
        this.reconnectAttemptLimit =
            this.client.options.reconnectAttemptLimit ?? 1;
        this.replayMissedEvents =
            this.client.options.replayMissedEvents ?? true;
        this._heartbeatInterval = null;

        this.ws = null;
        this.firstWSMessage = true;
        this.lastMessageID = undefined;
        this.currReconnectAttempt = 0;

        this.alive = false;
        this.latency = Infinity;
        this.lastHeartbeatSent = NaN;
        this.lastHeartbeatReceived = NaN;
        this.lastHeartbeatAck = false;
        this.heartbeatRequested = false;
        this.connectionTimeout = 30000;
        this._connectTimeout = null;
    }

    private heartbeat(): void | boolean {
        if (this.heartbeatRequested) {
            if (!this.lastHeartbeatAck) {
                this.lastHeartbeatAck = false;
                return this.client.emit(
                    "error",
                    new Error(
                        "Server didn't acknowledge the previous heartbeat, possible lost connection."
                    )
                );
            }

            this.heartbeatRequested = false;
        } else {
            this.client.emit("debug", "Heartbeat Requested");
            this.ws?.ping();
            this.heartbeatRequested = true;
            this.lastHeartbeatAck = false;
        }
    }

    private initialise(): void {
        if (!this.token)
            return this.disconnect(false, new Error("Invalid Token."));

        if (this.compress) {
            if (!ZlibSync) {
                throw new Error(
                    "Unable to use compress without the pako or zlib-sync module."
                );
            }

            this.client.emit(
                "debug",
                "Initialising zlib-sync-based compression"
            );
            this._sharedZLib = new ZlibSync.Inflate({ chunkSize: 128 * 1024 });
        }

        const wsoptions = {
            headers: { Authorization: `Bearer ${this.client.token}` },
            protocol: "HTTPS",
        };
        if (this.replayEventsCondition)
            Object.assign(wsoptions.headers, {
                "guilded-last-message-id": this.lastMessageID,
            });
        this.ws = new WS(this.gatewayURL, wsoptions);

        this.ws.on("open", this.onSocketOpen.bind(this));
        this.ws.on("close", this.onSocketClose.bind(this));
        this.ws.on("ping", this.onSocketPing.bind(this));
        this.ws.on("pong", this.onSocketPong.bind(this));

        this.ws.on("message", (args: string) => {
            if (this.firstWSMessage === true) {
                this.firstWSMessage = false;
            }

            this.onSocketMessage(args);
        });

        this.ws.on("error", (err: Error) => {
            this.onSocketError.bind(this)(err as Error);
            console.error("GATEWAY ERR: Couldn't connect to Guilded.");
        });

        this._connectTimeout = setTimeout(() => {
            if (!this.connected) {
                this.disconnect(undefined, new Error("Connection timeout."));
            }
        }, this.connectionTimeout);
    }

    private onPacket(packet: AnyPacket): void {
        if (packet.s) this.lastMessageID = packet.s;

        switch (packet.op) {
            case GatewayOPCodes.Event: {
                this.emit(
                    "GATEWAY_PARSED_PACKET",
                    packet.t,
                    packet.d as object
                );
                this.emit("GATEWAY_PACKET", packet);
                break;
            }

            case GatewayOPCodes.Welcome: {
                if (!packet.d)
                    throw new Error("WSERR: Couldn't get packet data.");
                if (!packet.d["heartbeatIntervalMs" as keyof object])
                    throw new Error(
                        "WSERR: Couldn't get the heartbeat interval."
                    );

                if (this._connectTimeout) {
                    clearInterval(this._connectTimeout);
                }

                this._heartbeatInterval = setInterval(
                    () => this.heartbeat(),
                    packet.d["heartbeatIntervalMs" as keyof object] as number
                );
                this.emit("GATEWAY_WELCOME", packet.d as RawClientUser);
                this.emit("GATEWAY_WELCOME_PACKET", packet as WelcomePacket);
                this.connected = true;
                break;
            }

            case GatewayOPCodes.Resume: {
                this.lastMessageID = undefined;
                break;
            }

            default: {
                this.emit(
                    "GATEWAY_UNKNOWN_PACKET",
                    "??UNKNOWN OPCODE??",
                    packet
                );
                break;
            }
        }
    }

    private onSocketClose(code: number, r: Buffer): void {
        const reason = r.toString();
        let reconnect: boolean | undefined;
        let err: Error | undefined;
        this.alive = false;

        if (code) {
            this.client.emit(
                "debug",
                `${
                    code === 1000 ? "Clean" : "Unclean"
                } WS close: ${code}: ${reason}`
            );

            switch (code) {
                case 1006: {
                    err = new GatewayError("Connection lost", code);
                    break;
                }

                default: {
                    err = new GatewayError(reason, code);
                    break;
                }
            }

            this.disconnect(reconnect, err);
        }
    }

    private onSocketError(error: Error): void {
        this.client.emit("error", error);
        this.emit("error", error);
        this.emit("exit", error);
        this.alive = false;
        return void 0;
    }

    private onSocketMessage(data: Data): void | undefined {
        if (typeof data === "string") {
            data = Buffer.from(data);
        }

        try {
            if (data instanceof ArrayBuffer) {
                if (this.compress || Erlpack) {
                    data = Buffer.from(data);
                }
            } else if (Array.isArray(data)) {
                data = Buffer.concat(data);
            }

            assert(is<Buffer>(data));

            if (this.compress) {
                if (
                    data.length >= 4 &&
                    data.readUInt32BE(data.length - 4) === 0x30307d7d
                ) {
                    this._sharedZLib.push(data, ZlibConstants!.Z_SYNC_FLUSH);

                    if (this._sharedZLib.err) {
                        this.client.emit(
                            "error",
                            new Error(
                                `ZLib ERROR ${this._sharedZLib.err}: ${
                                    this._sharedZLib.msg ?? ""
                                }`
                            )
                        );
                        return;
                    }

                    data = Buffer.from(this._sharedZLib.result ?? "");
                    return this.onPacket(
                        (Erlpack
                            ? Erlpack.unpack(data as Buffer)
                            : JSON.parse(data.toString())) as AnyPacket
                    );
                } else {
                    this._sharedZLib.push(data, false);
                }
            } else if (Erlpack) {
                return this.onPacket(Erlpack.unpack(data) as AnyPacket);
            } else {
                return this.onPacket(JSON.parse(data.toString()) as AnyPacket);
            }
        } catch (err) {
            this.client.emit("error", err as Error);
        }
    }

    private onSocketOpen(): void {
        this.alive = true;
        this.emit("debug", "Socket connection is open");
    }

    private onSocketPing(): void {
        this.ws!.ping();
        this.lastHeartbeatSent = Date.now();
    }

    private onSocketPong(): void {
        this.client.emit("debug", "Heartbeat Acknowledged");
        this.latency = this.lastHeartbeatSent - Date.now();
        this.lastHeartbeatAck = true;
    }

    public reset(): void {
        this.ws = null;
        this.firstWSMessage = true;
        this.lastMessageID = undefined;
        this.currReconnectAttempt = 0;

        this.alive = false;
        this.latency = Infinity;
        this.lastHeartbeatSent = NaN;
        this.lastHeartbeatReceived = NaN;
        this.lastHeartbeatAck = false;
        this.heartbeatRequested = false;
        this.connectionTimeout = 30000;
        this._connectTimeout = null;
    }
}
