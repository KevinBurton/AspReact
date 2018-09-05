import { startedFilesLoad, getAlfrescoSessionFiles } from '../actions/peerReviewFilesActions';
import { startedReceiveItemShared, requestItemShared } from '../actions/itemSharedActions';
import { startedRefresh, getQvr } from '../actions/qvrActions';
import { startedRefreshEvents, getEvents } from '../actions/speakerManagerActions';
import { getSpeakers } from '../actions/speakerActions';
import { getExternalSpeakers } from '../actions/externalSpeakerActions';
import { Event } from '../models/event';

export const handleLoad = (getState, dispatch) => {
	const state = getState();
	if (state.peerReviewFiles) {
		if (state.peerReviewFiles.shouldLoad) {
			dispatch(startedFilesLoad());
			dispatch(getAlfrescoSessionFiles());
		}
	}
	
	if (state.itemShared) {
		if (state.itemShared.shouldRefresh) {
			dispatch(startedReceiveItemShared());
			dispatch(requestItemShared());
		}
	}

	if (state.qvr) {
		if (state.qvr.shouldRefresh) {
			dispatch(startedRefresh());
			dispatch(getQvr());
		}
    }

    if (state.speakerManager) {
        if (state.speakerManager.shouldRefresh) {
            dispatch(startedRefreshEvents());
            dispatch(getEvents());
            if (state.speakerManager.events) {
                state.speakerManager.events.map((e: Event) =>
                    dispatch(getSpeakers(e.EventId, e.ItemDetailId, e.IsParent)));
                state.speakerManager.events.map((e: Event) =>
                    dispatch(getExternalSpeakers(e.EventId, e.ItemDetailId, e.IsParent)));
                dispatch(startedRefreshEvents());
            }

        }
    }
};
