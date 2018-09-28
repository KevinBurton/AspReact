import * as ajax from '../utils/ajax';
import { addError, addSuccess } from './alertActions';
import AlertType from '../enums/AlertTypeEnum';
import { BaseData, Something, GenericCollection, ComponentDescriptor, newClass } from '../models/generic';
import objectAssign from '../utils/objectAssign';

export const RECEIVE_DATA = 'RECEIVE_DATA';
export const STARTED_REFRESH_GENERIC_DATA = 'STARTED_REFRESH_GENERIC_DATA';
export const REFRESH_GENERIC_DATA = 'REFRESH_GENERIC_DATA';
export const RECEIVE_TITLE_DATA = 'RECEIVE_TITLE_DATA';
export const RECEIVE_BASE_DATA = 'RECEIVE_BASE_DATA';
export const RECEIVE_COMPONENT_DATA = 'RECEIVE_COMPONENT_DATA';
export const UPDATE_STATE = 'UPDATE_STATE';
export const UPDATE_DATA_DICTIONARY = 'UPDATE_DATA_DICTIONARY';



export const componentData = (componentDescriptor: ComponentDescriptor, operation: string) => {
    return (dispatch, getState) => {
        const state = getState();
        const { itemId } = state;
        if (operation === '') { operation = 'GetData' }

        var dictionary = componentDescriptor.dataDictionary;
        var s = ''; // 'ID=' + itemId + ',';

        for (var i in dictionary) {
            if (dictionary.hasOwnProperty(i)) {
                s = s + i + '=' + dictionary[i] + ',';
            }
        }

        s = s.substr(0, s.length - 1);
        console.log(componentDescriptor.name, s);
        ajax.get<any>(`/api/GenericDataHandler/ComponentData/?componentName=${componentDescriptor.name}&operation=${operation}&passedInData=${s}`)
            .then((newObject) => {
                var combinedObject: Object = newObject.ObjectToReturn;
                if (newObject.FailureList) {
                    if (!(Object.keys(newObject.FailureList).length === 0 && newObject.constructor === Object)) {
                        for (var j = 0; j < newObject.FailureList.length; j++) {
                            toastr.error(newObject.FailureList[j].Text);
                        }
                    }
                }
                if (newObject.DataList) {
                    if (!(Object.keys(newObject.DataList).length === 0 && newObject.constructor === Object)) {
                        combinedObject = objectAssign({}, newObject.ObjectToReturn[0], {
                            DataList: newObject.DataList
                        })
                    };

                }

                if (!(Object.keys(newObject).length === 0 && newObject.constructor === Object)) {
                    dispatch(receiveComponentData(combinedObject, componentDescriptor));
                    componentDescriptor.onComponentOperationComplete && componentDescriptor.onComponentOperationComplete();
                }

            })
            .fail(() => {
                console.error("could not retrieve data for item id ");
            });
    };
};

export const updateState = (componentDescriptor: ComponentDescriptor, id: string, value: string) => {
    const stateFunc = '(objectAssign.default({}, state, { ' + id + ': \'' + value + '\' });)';
    return (dispatch) => {
        dispatch(reloadState(componentDescriptor, id, value));
    }
}

export const reloadState = (componentDescriptor: ComponentDescriptor, id: string, value: string) => {
    return {
        type: UPDATE_STATE,
        componentDescriptor,
        id,
        value
    }
}

export const updateDictionary = (dictionary: string[]) => {
    return {
        type: UPDATE_DATA_DICTIONARY,
        dictionary
    }
}

export const refresh = () => {

    return {
        type: REFRESH_GENERIC_DATA
    }
}

export const startedRefreshGeneric = () => {
    return {
        type: STARTED_REFRESH_GENERIC_DATA
    }
}



export const receiveComponentData = (newObject: any, componentDescriptor: ComponentDescriptor) => {
    return {
        type: RECEIVE_COMPONENT_DATA,
        componentDescriptor,
        newObject
    }

};
