
import objectAssign from '../utils/objectAssign';
import * as ajax from '../utils/ajax';
import { Something, GenericCollection } from '../models/generic';

var EventEmitter = require('wolfy87-eventemitter');

import {
    RECEIVE_DATA,
    REFRESH_GENERIC_DATA,
    STARTED_REFRESH_GENERIC_DATA, 
    RECEIVE_TITLE_DATA,
    RECEIVE_BASE_DATA,
    RECEIVE_COMPONENT_DATA,
    UPDATE_STATE
} from '../actions/genericActions';

interface State {
    itemId: number;
    shouldRefresh: boolean;
    eventEmitter: Object;
    myCollection: Array<Something>;
}

const getInitialState = () => {
    const itemId = (document.getElementById('itemId') as any).value;

    return {
        itemId: parseInt(itemId),
        shouldRefresh: false,
        eventEmitter: new EventEmitter(),
        myCollection: []
    };
};

const shouldRefresh = (state: State, should: boolean) => objectAssign({}, state, { shouldRefresh: should });

const something = (state = getInitialState(), action) => {
    switch (action.type) {

        case RECEIVE_DATA:

            return objectAssign({}, state, {
                myCollection: action.genericCollection
            });

        case RECEIVE_COMPONENT_DATA:
            if (action.componentDescriptor.returnObjectIndexed) {
                return objectAssign({},
                    state,
                    {
                        [action.componentDescriptor.name]: action.newObject[0]
                    });
            } else {
                return objectAssign({},
                    state,
                    {
                        [action.componentDescriptor.name]: action.newObject
                    });
            }

        case STARTED_REFRESH_GENERIC_DATA:
            return shouldRefresh(state, false);

        case REFRESH_GENERIC_DATA:
            
            return shouldRefresh(state, true);

        case UPDATE_STATE:
            
   
            const convertedJSONstring = JSON.stringify(state);
            const newObject = JSON.parse(convertedJSONstring);
            newObject[action.componentDescriptor.name][action.id].Value = action.value;
            return newObject;
    }

    console.log('Reducer state: ', state);
    return state;
};

export default something;
