import type { LatencyRef } from "../rest/RequestHandler";

/**
 * A sequential bucket for ratelimits
 */
export default class SequentialBucket {
    /**
     * The queue of functions to be executed
     */
    private _queue: Array<(cd: () => void) => void>;

    /**
     * Timestamp of last token consumption
     */
    public last: number;

    /**
     * A reference to the latency of the client
     */
    public latencyRef: LatencyRef;

    /**
     * The maximum number of tokens per interval
     */
    public limit: number;

    /**
     * Whether the queue is currently being processed
     */
    public processing: NodeJS.Timeout | boolean;

    /**
     * The number of tokens that remains
     */
    public remaining: number;

    /**
     * Timestamp of next reset
     */
    public reset: number;

    public constructor(limit: number, latencyRef: LatencyRef) {
        this._queue = [];
        this.limit = this.remaining = limit;
        this.latencyRef = latencyRef;
        this.last = this.reset = 0;
        this.processing = false;
    }

    private check(force = false): void {
        if (this._queue.length === 0) {
            if (this.processing) {
                if (typeof this.processing !== "boolean") {
                    clearTimeout(this.processing);
                }

                this.processing = false;
            }

            return;
        }

        if (this.processing && !force) {
            return;
        }

        const now = Date.now();
        const offset = this.latencyRef.latency;

        if (!this.reset || this.reset < now - offset) {
            this.reset = now - offset;
            this.remaining = this.limit;
        }

        this.last = now;

        if (this.remaining <= 0) {
            this.processing = setTimeout(() => {
                this.processing = false;
                this.check(true);
            }, Math.max(0, (this.reset ?? 0) - now + offset) + 1);
            return;
        }

        --this.remaining;
        this.processing = true;
        this._queue.shift()!(() => {
            if (this._queue.length !== 0) {
                this.check(true);
            } else {
                this.processing = false;
            }
        });
    }

    /**
     * Queue an item to be executed in the Bucket
     * @param func The function to queue
     * @param priority If true, the item will be added to the front of the queue
     */
    public queue(func: (cb: () => void) => void, priority = false): void {
        if (priority) {
            this._queue.unshift(func);
        } else {
            this._queue.push(func);
        }

        this.check();
    }
}
