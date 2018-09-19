///<reference path="../../node_modules/@types/node/index.d.ts" />
import {EventEmitter} from 'events';

const eventEmitter = new EventEmitter();
Object.freeze(eventEmitter);

export default eventEmitter;
