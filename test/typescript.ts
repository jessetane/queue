// Compilation test covers possible parameters etc., not real code!

import {IQueue, IQueueEventCallback, IQueueOptions, IQueueWorker} from '../';
declare var require;
var queue: IQueue = require('../');

// region interface IQueueEventCallback
var eventCallback: IQueueEventCallback;
// (data?:Object|Error|IQueueWorker, job?:IQueueWorker):void
eventCallback = function(){};
eventCallback = function(data){};
eventCallback = function(data, job){};
eventCallback = function(data, job: IQueueWorker){};
eventCallback = function(data:Object, job: IQueueWorker){};
eventCallback = function(data:Error, job: IQueueWorker){};
eventCallback = function(data:IQueueWorker, job: IQueueWorker){};
eventCallback = function(data:Object|Error|IQueueWorker, job: IQueueWorker){};
// endregion interface IQueueEventCallback

// region interface IQueueWorker
var worker:IQueueWorker
// (cb?:(err?:Error, data?:Object)  => void):void
worker = function (cb){
	cb();
	cb(new Error(''));
	cb(new Error(''), {});
};
// endregion interface IQueueWorker

// region interface IQueueOptions
var qOpts1:IQueueOptions = {
	concurrency: 1,
	timeout: 10
};
var qOpts2:IQueueOptions = {
	concurrency: 1
};
var qOpts3:IQueueOptions = {
	timeout: 10
};
var qOpts4:IQueueOptions = {};
// endregion interface IQueueOptions

// region interface IQueue

// (opts?:IQueueOptions): IQueue
var q:IQueue;
q = queue(qOpts1);
q = queue(qOpts2);
q = queue(qOpts3);
q = queue(qOpts4);
q = queue();

//push(...worker:IQueueWorker[]):number
var count: number;
count = q.push(worker);
count = q.push(worker, worker);

// start(callback?:(error?:Error) => void):void
var callback:(error?:Error) => void;
callback = function(){};
callback = function(err){};
q.start();
q.start(callback);

// on(event:string, callback:IQueueEventCallback):void
q.on('someevent', eventCallback);

// stop():void
q.stop();

// end(error?:Error):void
q.end();
q.end(new Error('some Error'));

// unshift(...worker:IQueueWorker[]):number
var myNumber: number;
myNumber = q.unshift(worker);
myNumber = q.unshift(worker, worker);

// splice(index:number, deleteHowMany:number, ...worker:IQueueWorker[]):IQueue
var _q:IQueue;
_q = q.splice(0,1);
_q = q.splice(0,1,worker);
_q = q.splice(0,1,worker,worker);

var myWorker:IQueueWorker|void;

// pop():IQueueWorker|void
myWorker = q. pop();
q.pop();

// shift():IQueueWorker|void
myWorker = q.shift();
q.shift();

// slice(begin:number, end?:number):IQueue
_q = q.slice(0,5);
_q = q.slice(0);

// reverse():IQueue
_q = q.reverse();

// indexOf(searchElement:IQueueWorker, fromIndex?:number):number
myNumber = q.indexOf(worker);
myNumber = q.indexOf(worker, 5);

// lastIndexOf(searchElement:IQueueWorker, fromIndex?:number):number
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