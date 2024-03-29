// Type definitions for Queue
// Project: https://github.com/jessetane/queue
// Definitions by: Alex Miller <https://github.com/codex->
// Additions by Maksim Lavrenyuk <https://github.com/MaksimLavrenyuk>



type EventsMap = {
    end: { error?: Error }
    error: { error: Error, job: QueueWorker }
    timeout: { next: (err?: Error, ...result: any[]) => void, job: QueueWorker }
    success: { result: any[] }
    start: { job?: QueueWorker }
}

export class QueueEvent<Name extends keyof EventsMap, Detail extends EventsMap[Name]> extends Event {
    readonly detail: Detail
    constructor(name: Name, detail: Detail)
}


type EventListenerOrEventListenerObject<Event extends QueueEvent<keyof EventsMap, EventsMap[keyof EventsMap]>> = (event: Event) => void | {
    handleEvent(Event: Event): void;
};


export interface Options {
    /**
     * Max number of jobs the queue should process concurrently.
     *
     * @default Infinity
     */
    concurrency?: number;

    /**
     * Milliseconds to wait for a job to execute its callback.
     *
     * @default 0
     */
    timeout?: number;

    /**
     * Ensures the queue is always running if jobs are available. Useful in situations where you are using a queue only for concurrency control.
     *
     * @default false
     */
    autostart?: boolean;

    /**
     * An array to set job callback arguments on.
     *
     * @default null
     */
    results?: any[];
}

export default class Queue extends EventTarget {
    constructor(options?: Options)

    /**
     * Max number of jobs the queue should process concurrently.
     */
    concurrency: number;

    /**
     * Milliseconds to wait for a job to execute its callback.
     */
    timeout: number;

    /**
     * Ensures the queue is always running if jobs are available.
     */
    autostart: boolean;

    /**
     * An array to set job callback arguments on.
     */
    results: any[] | null;

    /**
     * Jobs pending + jobs to process.
     */
    readonly length: number;

    /**
     * Adds one or more elements to the end of the Queue and returns the new length of the Queue.
     *
     * @param workers New workers of the Queue.
     */
    push(...workers: QueueWorker[]): number;

    /**
     * Adds one or more elements to the front of the Queue and returns the new length of the Queue.
     *
     * @param workers Workers to insert at the start of the Queue.
     */
    unshift(...workers: QueueWorker[]): number;

    /**
     * Adds and/or removes elements from the queue.
     *
     * @param start The zero-based location in the Queue from which to start removing elements.
     * @param deleteCount The number of elements to remove.
     */
    splice(start: number, deleteCount?: number): Queue;

    /**
     * Adds and/or removes elements from the queue.
     *
     * @param start The zero-based location in the Queue from which to start removing elements.
     * @param deleteCount The number of elements to remove.
     * @param workers Workers to insert into the Queue in place of the deleted elements.
     */
    splice(start: number, deleteCount: number, ...workers: QueueWorker[]): Queue;

    /**
     * Removes the last element from the Queue and returns that element.
     */
    pop(): QueueWorker | undefined;

    /**
     * Removes the first element from the Queue and returns that element.
     */
    shift(): QueueWorker | undefined;

    /**
     * Extracts a section of the Queue and returns Queue.
     *
     * @param start The beginning of the specified portion of the Queue.
     * @param end The end of the specified portion of the Queue.
     */
    slice(start?: number, end?: number): Queue;

    /**
     * Reverses the order of the elements of the Queue in place.
     */
    reverse(): Queue;

    /**
     * Returns the first (least) index of an element within the Queue equal to the specified value, or -1 if none is found.
     *
     * @param searchElement The value to locate in the Queue.
     * @param fromIndex The Queue index at which to begin the search. If omitted, the search starts at index 0.
     */
    indexOf(searchElement: QueueWorker, fromIndex?: number): number;

    /**
     * Returns the last (greatest) index of an element within the Queue equal to the specified value, or -1 if none is found.
     *
     * @param searchElement The value to locate in the Queue.
     * @param fromIndex The Queue index at which to begin the search. If omitted, the search starts at the last index in the Queue.
     */
    lastIndexOf(searchElement: QueueWorker, fromIndex?: number): number;

    /**
     * Starts the queue.
     *
     * @param callback Callback to be called when the queue empties or when an error occurs.
     */
    start(callback: (error?: Error, results?: any[] | null) => void): void;

    start(): Promise<{ error?: Error, results?: any[] | null }>;

    start(): void;

    /**
     * Stops the queue.
     */
    stop(): void;

    /**
     * Stop and empty the queue immediately.
     *
     * @param error error of why the stop has occurred, to be passed to start callback if supplied.
     */
    end(error?: Error): void;

    addEventListener<Event extends keyof EventsMap>(name: Event, callback: EventListenerOrEventListenerObject<QueueEvent<Event, EventsMap[Event]>>, options?: AddEventListenerOptions | boolean): void;

    dispatchEvent<Event extends keyof EventsMap>(event: QueueEvent<Event, EventsMap[Event]>): boolean;

    removeEventListener<Event extends keyof EventsMap>(name: Event, callback: EventListenerOrEventListenerObject<QueueEvent<Event, EventsMap[Event]>>, options?: EventListenerOptions | boolean): void;
}

export interface QueueWorker {
    (callback?: QueueWorkerCallback): void | Promise<any>;

    /**
     * Override queue timeout.
     */
    timeout?: number;
    /**
     *  If the QueueWorker returns a promise, it will be moved to this field.
     *  This can be useful when tracking timeout events
     */
    promise?: Promise<any>
}

export interface QueueWorkerCallback {
    (error?: Error, data?: Object): void;
}
