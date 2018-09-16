///<reference path="../../node_modules/@types/node/index.d.ts" />
import {EventEmitter} from 'events';

const instance = new EventEmitter();
Object.freeze(instance);

export default instance as EventEmitter;
