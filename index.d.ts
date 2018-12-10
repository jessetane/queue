// Type definitions for Queue 4.5.1
// Project: https://github.com/jessetane/queue
// Definitions by: Alex Miller <https://github.com/codex->

import { EventEmitter } from "events";

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

export class Queue extends EventEmitter {
    /**
     * Max number of jobs the queue should process concurrently
     */
    public concurrency: number

    /**
     * Milliseconds to wait for a job to execute its callback.
     */
    public timeout: number

    /**
     * Ensures the queue is always running if jobs are available.
     */
    public autostart: boolean;

    /**
     * An array to set job callback arguments on.
     */
    public results: any[] | null;

    /**
     * Jobs pending + jobs to process.
     */
    public readonly length: number

    /**
     * Adds one or more elements to the end of the Queue and returns the new length of the Queue.
     *
     * @param workers New workers of the Queue.
     */
    public push(...workers: QueueWorker[]): number;

    /**
     * Adds one or more elements to the front of the Queue and returns the new length of the Queue.
     *
     * @param workers Workers to insert at the start of the Queue.
     */
    public unshift(...workers: QueueWorker[]): number;

    /**
     * Adds and/or removes elements from the queue.
     *
     * @param start The zero-based location in the Queue from which to start removing elements.
     * @param deleteCount The number of elements to remove.
     */
    public splice(start: number, deleteCount?: number): Queue;

    /**
     * Adds and/or removes elements from the queue.
     *
     * @param start The zero-based location in the Queue from which to start removing elements.
     * @param deleteCount The number of elements to remove.
     * @param workers Workers to insert into the Queue in place of the deleted elements.
     */
    public splice(start: number, deleteCount: number, ...workers: QueueWorker[]): Queue;

    /**
     * Removes the last element from the Queue and returns that element.
     */
    public pop(): QueueWorker | undefined;

    /**
     * Removes the first element from the Queue and returns that element.
     */
    public shift(): QueueWorker | undefined;

    /**
     * Extracts a section of the Queue and returns Queue.
     *
     * @param start The beginning of the specified portion of the Queue.
     * @param end The end of the specified portion of the Queue.
     */
    public slice(start?: number, end?: number): Queue;

    /**
     * Reverses the order of the elements of the Queue in place
     */
    public reverse(): Queue;

    /**
     * Returns the first (least) index of an element within the Queue equal to the specified value, or -1 if none is found.
     *
     * @param searchElement The value to locate in the Queue.
     * @param fromIndex The Queue index at which to begin the search. If omitted, the search starts at index 0.
     */
    public indexOf(searchElement: QueueWorker, fromIndex?: number): number;

    /**
     * Returns the last (greatest) index of an element within the Queue equal to the specified value, or -1 if none is found.
     *
     * @param searchElement The value to locate in the Queue.
     * @param fromIndex The Queue index at which to begin the search. If omitted, the search starts at the last index in the Queue.
     */
    public lastIndexOf(searchElement: QueueWorker, fromIndex?: number): number;

    /**
     * Starts the queue.
     *
     * @param callback Callback to be called when the queue empties or when an error occurs.
     */
    public start(callback?: (error?: Error) => void): void;

    /**
     * Stops the queue.
     */
    public stop(): void;

    /**
     * Stop and empty the queue immediately.
     *
     * @param error error of why the stop has occurred, to be passed to start callback if supplied.
     */
    public end(error?: Error): void;
}

export interface QueueWorker {
    (callback?: QueueWorkerCallback): void
}

export interface QueueWorkerCallback {
    (error?: Error, data?: Object): void;
}

/**
 * Creates a new Queue instance.
 */
declare function queue(options?: Options): Queue;

export default queue;
