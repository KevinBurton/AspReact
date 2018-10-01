import * as ajax from '../utils/ajax';
import { addError, addSuccess } from './alertActions';
import { TrackScScore, SpeakerScore, SessionCategoryScore, EventOverviewCollections } from '../models/eov';

export const RECEIVE_SCORE = 'RECEIVE_SCORE';
export const EVENT_SPKSCORE_CHANGED = 'EVENT_SPKSCORE_CHANGED';
export const CANCEL_CHANGE = 'CANCEL_CHANGE';
export const EVENT_SCSCORE_CHANGED = 'EVENT_SCSCORE_CHANGED';
export const EVENT_TSCSCORE_CHANGED = 'EVENT_TSCSCORE_CHANGED';


export const getEventOverview = () => {
	return (dispatch, getState) => {
		const state = getState();
		var eventId: number = state.eventId;
		ajax.get<EventOverviewCollections>(`/api/EventOverviewDetails/GetEventOverViewDetails?eventId=${eventId}`)
			.then((eventOverviewCollections: EventOverviewCollections) => {
				dispatch(receiveScore(eventOverviewCollections));
		});
	};
};

export const receiveScore = (eventOverviewCollections: EventOverviewCollections) => {
	return {
		type: RECEIVE_SCORE,
		eventOverviewCollections
	}
}


export const saveScores = () => {
	return (dispatch, getState) => {
		const state = getState();
		var eventId: number = state.eventId;
		var employeeId: number = Gartner.loggedInUserInformation.userId;

		var eventOverviewCollections: EventOverviewCollections = {
			EventSpeakerScoreCollection: state.speakerScoreCollection,
			EventSessionCategoryCollection: state.sessionCategoryCollection,
			EventTrackScScoreCollection: state.trackScCollection
		};
		
		const json = JSON.stringify(eventOverviewCollections);
		
		ajax.post(`/api/EventOverviewDetails/SaveEventOverViewDetails?eventId=${eventId}&employeeId=${employeeId}`, json)
			.done(() => {
				dispatch(addSuccess('Event Overview', 'Successfully Saved.'));
				
			})
			.fail(response => {
				if (response && response.exceptionMessage) {
					dispatch(addError('Event Overview', response.exceptionMessage));
				} else {
					dispatch(addError('Event Overview', 'Cannot save Event Overview.'));
				}
			});
	};
};

export const valueChange = (e: any, speakerScore :SpeakerScore) => {
	return {
		type: EVENT_SPKSCORE_CHANGED,
		e,
		speakerScore
	};
}

export const tscValueChange = (e: any, tscScore: TrackScScore) => {
	return {

		type: EVENT_TSCSCORE_CHANGED,
		e,
		tscScore

	};
}

export const scValueChange = (e: any, categoryScore: SessionCategoryScore) => {

	return {
		type: EVENT_SCSCORE_CHANGED,
		e, 
		categoryScore
	}
}

export const cancelChangeTest = () => {
	return {
		type: CANCEL_CHANGE
	};
}

export const cancelChange = () => {
	return (dispatch, getState) => {
		const state = getState();
		var eventId: number = state.eventId;
		ajax.get<EventOverviewCollections>(`/api/EventOverviewDetails/GetEventOverViewDetails?eventId=${eventId}`)
			.then((eventOverviewCollections: EventOverviewCollections) => {
				dispatch(receiveScore(eventOverviewCollections));
			});
	};
}