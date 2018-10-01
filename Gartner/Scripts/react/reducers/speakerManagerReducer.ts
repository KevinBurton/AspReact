import objectAssign from '../utils/objectAssign';
import * as ajax from '../utils/ajax';
import { Event, EventsCollection } from '../models/event';

import {
    RECEIVE_EVENTS,
    REFRESH_EVENTS, 
    STARTED_REFRESH_EVENTS
} from '../actions/speakerManagerActions';

interface State {
    events: Array<Event>;
    shouldRefresh: boolean;
}

const initialState: State = {
    shouldRefresh: false,
    events: []
};

const shouldRefresh = (state: State, should: boolean) => objectAssign({}, state, { shouldRefresh: should });

const event = (state: State = initialState, action) => {
	switch (action.type) {
        case RECEIVE_EVENTS:
        //    console.log('reducer events', action.eventsCollection);
         
            return objectAssign({}, state, {
                events: action.eventsCollection
            });

        case STARTED_REFRESH_EVENTS:
            return shouldRefresh(state, false);

        case REFRESH_EVENTS:
            return shouldRefresh(state, true);
	}
	return state;
};

export default event;
