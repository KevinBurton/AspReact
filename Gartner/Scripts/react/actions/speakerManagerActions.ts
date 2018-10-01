import * as ajax from '../utils/ajax';
import { addError, addSuccess } from './alertActions';
import { Event, EventsCollection } from '../models/event';

export const RECEIVE_EVENTS = 'RECEIVE_EVENTS';
export const STARTED_REFRESH_EVENTS = 'STARTED_REFRESH_EVENTS';
export const REFRESH_EVENTS = 'REFRESH_EVENTS';

export const getEvents = () => {
    return (dispatch, getState) => {
        const state = getState();
        const { itemId } = state.itemShared;

        ajax.get<EventsCollection>(`/api/Event/GetEventsByItemId/?itemId=${itemId}`)
            .then((eventsCollection) => {
              //  console.log('actions ajax returned events', eventsCollection);
                dispatch(receiveEvents(eventsCollection));
            })
            .fail(() => {
                console.error("could not retrieve events for item");
            });
    };
};

export const startedRefreshEvents = () => {
    return {
        type: STARTED_REFRESH_EVENTS
    }
}

export const receiveEvents = (eventsCollection: EventsCollection) => {
  //  console.log('actions receive events throw', eventsCollection);

    return {
        type: RECEIVE_EVENTS,
        eventsCollection
    }
};



