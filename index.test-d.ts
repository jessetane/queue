import { expectType } from 'tsd-check';
import Queue, { Options, QueueWorker, QueueWorkerCallback } from '.'

expectType<Options>({});
expectType<Options>({ concurrency: 0 });
expectType<Options>({ timeout: 0 });
expectType<Options>({ autostart: true });
expectType<Options>({ results: [0, 'a', true, undefined, NaN] });

expectType<QueueWorker>(() => undefined);
expectType<QueueWorker>((callback: QueueWorkerCallback) => undefined);

function withTimeout() { }
withTimeout.timeout = 1;

expectType<QueueWorker>(withTimeout);

expectType<QueueWorkerCallback>(() => undefined);
expectType<QueueWorkerCallback>((data: Error) => undefined);
expectType<QueueWorkerCallback>((error: Error) => undefined);
expectType<QueueWorkerCallback>((error: Error, data: Object) => undefined);

expectType<Queue>(Queue());
expectType<Queue>(Queue({}));
expectType<Queue>(Queue({ concurrency: 0, timeout: 0, autostart: true, results: [] }));
expectType<Queue>(new Queue());
expectType<Queue>(new Queue({}));
expectType<Queue>(new Queue({ concurrency: 0, timeout: 0, autostart: true, results: [] }));

const q: Queue = Queue();

expectType<Queue>(q);
expectType<number>(q.push(() => { }));
expectType<number>(q.unshift(() => { }));
expectType<Queue>(q.splice(0));
expectType<Queue>(q.splice(0, 0, () => undefined));
expectType<QueueWorker>(q.pop());
expectType<QueueWorker>(q.shift());
expectType<Queue>(q.slice());
expectType<Queue>(q.slice(0));
expectType<Queue>(q.slice(0, 0));
expectType<Queue>(q.reverse());
expectType<number>(q.indexOf(() => { }));
expectType<number>(q.indexOf(() => { }, 0));
expectType<number>(q.lastIndexOf(() => { }));
expectType<number>(q.lastIndexOf(() => { }, 0));
expectType<void>(q.start());
expectType<void>(q.stop());
expectType<void>(q.end());
