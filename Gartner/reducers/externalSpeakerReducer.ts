import objectAssign from '../utils/objectAssign';
import { ExternalSpeaker } from '../models/externalSpeaker';

import {
    RECEIVE_EXTERNAL_SPEAKERS,
    EXTERNAL_SPEAKER_ADDED,
    DELETED_EXTERNAL_SPEAKER

} from '../actions/externalSpeakerActions';

interface State {
    externalSpeakers: Array<ExternalSpeaker>;
}

const initialState: State = {
    externalSpeakers: []
};

const externalSpeakerAdded = (state: State, externalSpeaker: ExternalSpeaker) => {
    return objectAssign({},
        state,
        {
            length: state.externalSpeakers.push(externalSpeaker)
        });

};

const externalSpeakerDeleted = (state: State, externalSpeaker: ExternalSpeaker) => {
    return objectAssign({},
        state,
        {
            externalSpeakers: state.externalSpeakers.filter(s => s.Id !== externalSpeaker.Id)
        });
}; 

const externalSpeaker = (state: State = initialState, action) => {
	switch (action.type) {
        case RECEIVE_EXTERNAL_SPEAKERS:
          
        //    console.log('reducer external speakers', action.externalSpeakersCollection);
         
            return objectAssign({}, state, {
                externalSpeakers: action.externalSpeakersCollection
            });

        case DELETED_EXTERNAL_SPEAKER:
            return externalSpeakerDeleted(state, action.externalSpeaker); 

        case EXTERNAL_SPEAKER_ADDED:
            return externalSpeakerAdded(state, action.externalSpeaker);

	}
	return state;
};

export default externalSpeaker;
