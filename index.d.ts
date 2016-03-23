// TypeScript definition for queue
// Provided by Hendrik 'Xendo' Meyer <https://github.com/butterkekstorte>
// Licensed the same as the library itself

export function queue(opts?:queue.IQueueOptions):queue.IQueue
export module queue {


    export interface IQueueOptions {
        concurrency?:number
        timeout?:number
    }

    export interface IQueueWorker {
        (cb?:(err?:Error, data?:Object)  => void):void
    }

    export interface IQueue {
        push(...worker:IQueueWorker[]):number
        start(callback?:(error?:Error) => void):void
        on(event:string, callback:(data:Function) => void):void
        stop():void
        end(error?:Error):void
        unshift(...worker:IQueueWorker[]):number
        splice(index:number, deleteHowMany:number, ...worker:IQueueWorker[]):IQueue
        pop():IQueueWorker|void
        shift():IQueueWorker|void
        slice(begin:number, end?:number):IQueue
        reverse():IQueue
        indexOf(searchElement:IQueueWorker, fromIndex?:number):number
        lastIndexOf(searchElement:IQueueWorker, fromIndex?:number):number
        concurrency:number
        timeout:number
        length:number
        on(event:string, callback:IQueueEventCallback):void
    }

    export interface IQueueEventCallback {
        (callback?:(data?:Object|Error|IQueueWorker, job?:IQueueWorker) => void):void
    }
}
