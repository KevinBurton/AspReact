import * as ajax from '../utils/ajax';
import { addError, addSuccess } from './alertActions';
import { ExternalSpeaker, ExternalSpeakersCollection} from '../models/externalSpeaker';

export const RECEIVE_EXTERNAL_SPEAKERS = 'RECEIVE_EXTERNAL_SPEAKERS';
export const EXTERNAL_SPEAKER_ADDED = 'EXTERNAL_SPEAKER_ADDED';
export const DELETED_EXTERNAL_SPEAKER = 'DELETED_EXTERNAL_SPEAKER';
export const REFRESH_EXTERNAL_SPEAKERS = 'REFRESH_SPEAKERS';

export const getExternalSpeakers = (eventId: number, itemDetailId: number, isParent: boolean) => {
    return (dispatch, getState) => {
        const state = getState();
        const { itemId } = state.itemShared;

        if (itemDetailId == undefined) {
            itemDetailId = -1;
        }

        ajax.get<ExternalSpeakersCollection>(`/api/ExternalSpeaker/GetExternalSpeakersByItemId/?itemId=${itemId}&eventId=${eventId}&itemDetailId=${itemDetailId}&isParent=${isParent}`)
            .then((externalSpeakersCollection) => {
               // console.log('actions ajax returned proposed external speakers', externalSpeakersCollection);
                dispatch(receiveExternalSpeakers(externalSpeakersCollection));
            })
            .fail(() => {
                console.error("could not retrieve proposed external speakers for item");
            })
            ;
    };
};

export const receiveExternalSpeakers = (externalSpeakersCollection: ExternalSpeakersCollection) => {
   // console.log('actions receive proposed external speakers throw', externalSpeakersCollection);

    return {
        type: RECEIVE_EXTERNAL_SPEAKERS,
        externalSpeakersCollection
    }
};

export const removeExternalSpeaker = (externalSpeaker: ExternalSpeaker, eventId: number, itemDetailId:number, isParent: boolean) => {
    return (dispatch, getState) => {
        const state = getState();
        const { itemId } = state.itemShared;

        ajax.post(`/api/ExternalSpeaker/DeleteExternalSpeakerbySpeakerId?itemId=${itemId}&employeeId=${externalSpeaker.Id}&eventId=${eventId}&itemDetailId=${itemDetailId}&isParent=${isParent}&nonEmployeeName=${externalSpeaker.NonEmployeeName}`)
            .then(() => {
                dispatch(deletedExternalSpeaker(externalSpeaker));
                dispatch(addSuccess('Speaker Adjustments', 'Deleted Proposed External Speaker Successfully'));
            })
            .fail(() => {
                dispatch(addError('Delete Proposed External Speaker Fail', 'Unable to delete proposed external speaker.'));
            })
            ;
    };
};

export const deletedExternalSpeaker = (externalSpeaker: ExternalSpeaker) => {
    return {
        type: DELETED_EXTERNAL_SPEAKER,
        externalSpeaker
    }
}; 

export const externalSpeakerAdded = (externalSpeaker: ExternalSpeaker) => {
    return {
        type: EXTERNAL_SPEAKER_ADDED,
        externalSpeaker
    };
};


export const saveExternalSpeaker = (nonEmployeeName: string, eventId: number, itemDetailId:number, isParent:boolean) => {
    return (dispatch, getState) => {
        const state = getState();
        const { itemId } = state.itemShared;

        ajax.get<ExternalSpeakersCollection>(`/api/ExternalSpeaker/AddExternalSpeakerbySpeakerId?itemId=${itemId}&nonEmployeeName=${nonEmployeeName}&eventId=${eventId}&itemDetailId=${itemDetailId}&isParent=${isParent}`)
            .then((externalSpeakersCollection) => {
                dispatch(receiveExternalSpeakers(externalSpeakersCollection));
                dispatch(addSuccess('Speaker Adjustments', 'Added or Changed Proposed External Speaker Successfully'));
            })
            .fail(response => {
                if (response && response.exceptionMessage) {
                    dispatch(addError('Add Proposed External Speaker Fail', response.exceptionMessage));
                } else {
                    dispatch(addError('Add Proposed External Speaker Fail', 'Unable to save proposed external speaker.'));
                }
            });
    };
}; 

