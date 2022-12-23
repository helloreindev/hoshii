export interface BucketOptions {
    latencyRef?: LatencyReference;
    reservedTokens?: number;
}

export interface LatencyReference {
    latency: number;
}

/**
 * A utility class for queueing requests
 */
export default class Bucket {
    /**
     * The queue of functions to be executed
     */
    private _queue: Array<{ func(): void; priority: boolean }> = [];

    /**
     * The interval to wait between clearing used tokens
     */
    public interval: number;

    /**
     * Timestamp of last token clearing
     */
    public lastReset: number;

    /**
     * Timetamp of last token consumption
     */
    public lastSend: number;

    /**
     * A reference to the latency of the client
     */
    public latencyRef: LatencyReference;

    /**
     * The number of reserved tokens
     */
    public reservedTokens: number;

    /**
     * The timeout for the next token clearing
     */
    public timeout: NodeJS.Timeout | null;

    /**
     * The maximum number of tokens per interval
     */
    public tokenLimit: number;

    /**
     * The number of tokens has been consumed
     */
    public tokens: number;

    /**
     * Create a new bucket
     * @param tokenLimit The maximum number of tokens per interval
     * @param interval The interval to wait between clearing used tokens
     * @param options The options for the bucket
     */
    public constructor(
        tokenLimit: number,
        interval: number,
        options?: BucketOptions
    ) {
        this.tokenLimit = tokenLimit;
        this.interval = interval;
        this.latencyRef = options?.latencyRef ?? { latency: 0 };
        this.lastReset = this.tokens = this.lastSend = 0;
        this.reservedTokens = options?.reservedTokens ?? 0;
        this.timeout = null;
    }

    private check(): void {
        if (this.timeout || this._queue.length === 0) {
            return;
        }

        if (
            this.lastReset +
                this.interval +
                this.tokenLimit * this.latencyRef.latency <
            Date.now()
        ) {
            this.lastReset = Date.now();
            this.tokens = Math.max(0, this.tokens - this.tokenLimit);
        }

        let val: number;
        let tokensAvailable = this.tokens < this.tokenLimit;
        let unreservedTokensAvailable =
            this.tokens < this.tokenLimit - this.reservedTokens;

        while (
            this._queue.length !== 0 &&
            (unreservedTokensAvailable ||
                (tokensAvailable && this._queue[0].priority))
        ) {
            this.tokens++;
            tokensAvailable = this.tokens < this.tokenLimit;
            unreservedTokensAvailable =
                this.tokens < this.tokenLimit - this.reservedTokens;
            const item = this._queue.shift();
            val = this.latencyRef.latency - Date.now() + this.lastSend;

            if (this.latencyRef.latency === 0 || val <= 0) {
                item!.func();
                this.lastSend = Date.now();
            } else {
                setTimeout(() => {
                    item!.func();
                }, val);
                this.lastSend = Date.now() + val;
            }
        }

        if (this._queue.length !== 0 && !this.timeout) {
            this.timeout = setTimeout(
                () => {
                    this.timeout = null;
                    this.check();
                },
                this.tokens < this.tokenLimit
                    ? this.latencyRef.latency
                    : Math.max(
                          0,
                          this.lastReset +
                              this.interval +
                              this.tokenLimit * this.latencyRef.latency -
                              Date.now()
                      )
            );
        }
    }

    /**
     * Queue an item to be executed in the Bucket
     * @param func The function to queue
     * @param priority If true, the item will be added to the front of the queue
     */
    public queue(func: () => void, priority = false): void {
        if (priority) {
            this._queue.unshift({ func, priority });
        } else {
            this._queue.push({ func, priority });
        }

        this.check();
    }
}
