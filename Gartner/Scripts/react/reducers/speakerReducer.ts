import objectAssign from '../utils/objectAssign';
import { Speaker, SpeakerRoleOption } from '../models/speaker';
import { Event, EventsCollection } from '../models/event';

import {
    RECEIVE_SPEAKERROLE,
    RECEIVE_SPEAKERS,
    SPEAKER_ADDED,
    DELETED_SPEAKER
} from '../actions/speakerActions';


interface State {
    speakers: Array<Speaker>;
    speakerRoles: Array<SpeakerRoleOption>;
    refresh: boolean;
}

const initialState: State = {
    speakers: [],
    speakerRoles: [],
    refresh: false
};

const speakerAdded = (state: State, speaker: Speaker) => {
    return objectAssign({},
        state,
        {
            length: state.speakers.push(speaker)
        });
};

const speakerDeleted = (state: State, speaker: Speaker) => {
    return objectAssign({},
        state,
        {
            speakers: state.speakers.filter(s => s.Id !== speaker.Id)
        });
};

const shouldRefresh = (state: State, should: boolean) => objectAssign({}, state, { shouldRefresh: should });


const speaker = (state: State = initialState, action) => {
    switch (action.type) {
        case RECEIVE_SPEAKERS:

         //   console.log('reducer speakers', action.speakersCollection);

            const convertedJSONstring = JSON.stringify(action.speakersCollection);

            const newObject = JSON.parse(convertedJSONstring);
           
            return objectAssign({}, state, {
                speakers: newObject,
                refresh: true
            });

        case DELETED_SPEAKER:
            return speakerDeleted(state, action.speaker);

        case SPEAKER_ADDED:
            return speakerAdded(state, action.speaker);

        case RECEIVE_SPEAKERROLE:
            return objectAssign({}, state, {
                speakerRoles: action.speakerRoles,
                refresh: true
            });

    }
    return state;
};

export default speaker;