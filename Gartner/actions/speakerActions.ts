import * as ajax from '../utils/ajax';
import { addError, addSuccess } from './alertActions';
import { SpeakerRole, Speaker, SpeakersCollection, SpeakerRoleDDL } from '../models/speaker';
import { EventsCollection, Event } from '../models/event';

export const RECEIVE_SPEAKERROLE = 'RECEIVE_SPEAKERROLE';
export const RECEIVE_SPEAKERS = 'RECEIVE_SPEAKERS';
export const SPEAKER_ADDED = 'SPEAKER_ADDED';
export const DELETED_SPEAKER = 'DELETED_SPEAKER';


export const getRoles = () => {
    return (dispatch) => {
        ajax.get<SpeakerRoleDDL>('/api/Speaker/GetRolesDropdownData')
            .then((speakerRoles) => {
                //console.log('actions ajax returned speakeRoles: ', speakerRoles);
                dispatch(receiveRoles(speakerRoles));
            })
            .fail(() => {
                console.log("could not retrieve roles dropdown data");
            });
    };
}

export const receiveRoles = (speakerRoles: SpeakerRoleDDL) => {
    return {
        type: RECEIVE_SPEAKERROLE,
        speakerRoles
    }
}

export const getSpeakers = (eventId: number, itemDetailId: number, isParent: boolean) => {
    return (dispatch, getState) => {
        const state = getState();
        const { itemId } = state.itemShared;

        if (itemDetailId == undefined) {
            itemDetailId = -1;
        }

        ajax.get<SpeakersCollection>(`/api/Speaker/GetSpeakersByItemId/?itemId=${itemId}&eventId=${eventId}&itemDetailId=${itemDetailId}&isParent=${isParent}`)
            .then((speakersCollection) => {
               // console.log('actions ajax returned speakers', speakersCollection);
                dispatch(receiveSpeakers(speakersCollection, eventId));
            })
            .fail(() => {
                console.error("could not retrieve speakers for item");
            })
            ;
    };
};

export const receiveSpeakers = (speakersCollection: SpeakersCollection, eventId: number) => {
  //  console.log('actions receive speakers throw', speakersCollection);

    return {
        type: RECEIVE_SPEAKERS,
        speakersCollection,
        eventId
    }
};


export const removeSpeaker = (speaker: Speaker, eventId: number, itemDetailId: number, isParent: boolean) => {
    return (dispatch, getState) => {
        const state = getState();
        const { itemId } = state.itemShared;

        ajax.post(`/api/Speaker/DeleteSpeakerbySpeakerId?itemId=${itemId}&employeeId=${speaker.EmployeeId
            }&eventId=${eventId}&itemDetailId=${itemDetailId}&isParent=${isParent}`)
            .then(() => {
                dispatch(deletedSpeaker(speaker));
                dispatch(addSuccess('Speaker Adjustments', 'Deleted Speaker Successfully'));
            })
            .fail(() => {
                dispatch(addError('Delete Speaker Fail', 'Unable to delete speaker.'));
            });
    }
}


export const deletedSpeaker = (speaker: Speaker) => {
    return {
        type: DELETED_SPEAKER,
        speaker
    }
}


export const speakerAdded = (speaker: Speaker) => {
    return {
        type: SPEAKER_ADDED,
        speaker

    };
}


export const refreshSpeakers = (eventsCollection: Event[]) => {
    console.log('actions refresh speakers throw', eventsCollection);
    return (dispatch, getState) => {
        eventsCollection.map((e: Event) =>
            getSpeakers(e.EventId, e.ItemDetailId, e.IsParent));
    }

};


export const onSave = (speaker: Speaker, eventId: number, itemDetailId: number, isParent: boolean) => {
    return (dispatch, getState) => {
        const state = getState();
        const { itemId } = state.itemShared;
        let roleId = speaker.RoleId;
        if (!roleId) {
            const { defaultRoleId } = state.itemShared;
            roleId = defaultRoleId;
        }

        ajax.get<SpeakersCollection>(`/api/Speaker/AddSpeakerbySpeakerId?itemId=${itemId}&employeeId=${
            speaker
                .EmployeeId}&speakerRoleId=${roleId}&eventId=${eventId}&itemDetailId=${itemDetailId
            }&isParent=${isParent}`)
            .then((speakersCollection) => {
                dispatch(receiveSpeakers(speakersCollection, eventId));
                dispatch(addSuccess('Speaker Adjustments', 'Added or Changed Speaker Successfully'));
            })
            .fail(response => {
                if (response && response.exceptionMessage) {
                    dispatch(addError('Add Speaker Fail', response.exceptionMessage));
                } else {
                    dispatch(addError('Add Speaker Fail', 'Unable to save speaker.'));
                }

            });
    }

};
