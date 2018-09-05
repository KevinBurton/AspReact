
import { componentData } from '../actions/genericActions';
import { ComponentDescriptor } from '../models/generic';

let eeComponentDescriptor: any = {};
let shouldRefresh: boolean = false;

export const eventEmit = (getState, dispatch) => {
    if (shouldRefresh) {

        dispatch(componentData(eeComponentDescriptor, 'GetData'));

        shouldRefresh = false;
    };
};


export const SetComponentDescriptorRefresh = (componentDescriptor: ComponentDescriptor) => {
    shouldRefresh = true;
    eeComponentDescriptor = componentDescriptor;
};
