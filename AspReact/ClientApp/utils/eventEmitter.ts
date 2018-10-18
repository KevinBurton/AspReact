
import componentData from '../utils/componentData';
import { ComponentDescriptor } from '../models/componentDescriptor';

var EventEmitter = require('wolfy87-eventemitter');

let eventEmitter = new EventEmitter();

var eeComponentDescriptorArray: ComponentDescriptor[] = [];

export default eventEmitter;

export const SetComponentDescriptorRefresh = (componentDescriptor: ComponentDescriptor) => {
  eeComponentDescriptorArray.push(componentDescriptor);
};

export const eventEmit = (_getState: Function, dispatch: Function) => {

    setTimeout(function () {
            var item = eeComponentDescriptorArray.pop();
            while (item) {
                dispatch(componentData(item, 'GetData'));
                item = eeComponentDescriptorArray.pop();
            }
    }, 900);

};
