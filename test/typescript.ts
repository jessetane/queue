// Compilation test covers possible parameters etc., not real code!

import queue, { Queue, Options, QueueWorker } from '../';

// region interface QueueWorker
var worker: QueueWorker
// (cb?:(err?:Error, data?:Object)  => void):void
worker = function (cb) {
	cb();
	cb(new Error(''));
	cb(new Error(''), {});
};
// endregion interface QueueWorker

// region interface IQueueOptions
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
// endregion interface IQueueOptions

// region interface IQueue

// (opts?:IQueueOptions): IQueue
var q: Queue;
q = queue(qOpts1);
q = queue(qOpts2);
q = queue(qOpts3);
q = queue(qOpts4);
q = queue();

//push(...worker:QueueWorker[]):number
var count: number;
count = q.push(worker);
count = q.push(worker, worker);

// start(callback?:(error?:Error) => void):void
var callback: (error?: Error) => void;
callback = function () { };
callback = function (err) { };
q.start();
q.start(callback);

// on(event:string, callback:IQueueEventCallback):void
q.on('someevent', (data: Object | Error | QueueWorker, job: QueueWorker) => { });

// stop():void
q.stop();

// end(error?:Error):void
q.end();
q.end(new Error('some Error'));

// unshift(...worker:QueueWorker[]):number
var myNumber: number;
myNumber = q.unshift(worker);
myNumber = q.unshift(worker, worker);

// splice(index:number, deleteHowMany:number, ...worker:QueueWorker[]):IQueue
var _q: Queue;
_q = q.splice(0, 1);
_q = q.splice(0, 1, worker);
_q = q.splice(0, 1, worker, worker);

var myWorker: QueueWorker | void;

// pop():QueueWorker|void
myWorker = q.pop();
q.pop();

// shift():QueueWorker|void
myWorker = q.shift();
q.shift();

// slice(begin:number, end?:number):IQueue
_q = q.slice(0, 5);
_q = q.slice(0);

// reverse():IQueue
_q = q.reverse();

// indexOf(searchElement:QueueWorker, fromIndex?:number):number
myNumber = q.indexOf(worker);
myNumber = q.indexOf(worker, 5);

// lastIndexOf(searchElement:QueueWorker, fromIndex?:number):number
myNumber = q.lastIndexOf(worker);
myNumber = q.lastIndexOf(worker, 5);

// concurrency:number
q.concurrency = myNumber;
myNumber = q.concurrency;

// timeout:number
q.timeout = myNumber;
myNumber = q.timeout;

// length:number
myNumber = q.length;
