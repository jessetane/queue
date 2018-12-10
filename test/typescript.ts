// Compilation test covers possible parameters etc., not real code!

import Queue, { Options, QueueWorker } from '../';

// region interface QueueWorker
var worker: QueueWorker
// (cb?:(err?: Error, data?: Object)  => void):void
worker = function (cb) {
	cb();
	cb(new Error(''));
	cb(new Error(''), {});
};
// endregion interface QueueWorker

// region interface Options
var qOpts1: Options = {
	concurrency: 1,
	timeout: 10
};
var qOpts2: Options = {
	concurrency: 1
};
var qOpts3: Options = {
	timeout: 10
};
var qOpts4: Options = {};
// endregion interface Options

// region interface Queue

// (opts?: Options): Queue
var q: Queue;
q = new Queue(qOpts1);
q = new Queue(qOpts2);
q = new Queue(qOpts3);
q = new Queue(qOpts4);
q = Queue(qOpts1);
q = Queue(qOpts2);
q = Queue(qOpts3);
q = Queue(qOpts4);
q = Queue();

//push(...worker: QueueWorker[]):number
var count: number;
count = q.push(worker);
count = q.push(worker, worker);

// start(callback?:(error?:Error) => void):void
var callback: (error?: Error) => void;
callback = function () { };
callback = function (err) { };
q.start();
q.start(callback);

// on(event:string, listener: (...args: any[]) => void)): void
q.on('someevent', (data: Object | Error | QueueWorker, job: QueueWorker) => { });

// stop(): void
q.stop();

// end(error?: Error): void
q.end();
q.end(new Error('some Error'));

// unshift(...worker: QueueWorker[]): number
var myNumber: number;
myNumber = q.unshift(worker);
myNumber = q.unshift(worker, worker);

// splice(start: number, deleteCount?: number): Queue
var _q: Queue;
_q = q.splice(0, 1);
_q = q.splice(0, 1, worker);
_q = q.splice(0, 1, worker, worker);

var myWorker: QueueWorker | void;

// pop(): QueueWorker | undefined;
myWorker = q.pop();
q.pop();

// shift(): QueueWorker | undefined;
myWorker = q.shift();
q.shift();

// slice(start?: number, end?: number): Queue;
_q = q.slice(0, 5);
_q = q.slice(0);

// reverse(): Queue;
_q = q.reverse();

// indexOf(searchElement: QueueWorker, fromIndex?: number): number;
myNumber = q.indexOf(worker);
myNumber = q.indexOf(worker, 5);

// lastIndexOf(searchElement: QueueWorker, fromIndex?: number): number;
myNumber = q.lastIndexOf(worker);
myNumber = q.lastIndexOf(worker, 5);

// concurrency: number
q.concurrency = myNumber;
myNumber = q.concurrency;

// timeout: number
q.timeout = myNumber;
myNumber = q.timeout;

// length: number
myNumber = q.length;
