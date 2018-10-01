
import { componentData } from '../actions/genericActions';
import { ComponentDescriptor } from '../models/generic';

var eeComponentDescriptorArray = [];
let shouldRefresh: boolean = false;

export const eventEmit = (_getState, dispatch) => {

    setTimeout(function () {
        if (shouldRefresh) {

            var item = eeComponentDescriptorArray.pop();
            while (item) {
                dispatch(componentData(item, 'GetData'));
                item = eeComponentDescriptorArray.pop();
            }

            shouldRefresh = false;
        };
    }, 900);


};


export const SetComponentDescriptorRefresh = (componentDescriptor: ComponentDescriptor) => {
    shouldRefresh = true;
    eeComponentDescriptorArray.push(componentDescriptor);
};
