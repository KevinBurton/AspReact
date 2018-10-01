import objectAssign from '../utils/objectAssign';
import { RECEIVE_SCORE, CANCEL_CHANGE, EVENT_SPKSCORE_CHANGED, EVENT_SCSCORE_CHANGED, EVENT_TSCSCORE_CHANGED } from '../actions/eventOverviewActions';
import {  TrackScScore, SpeakerScore, SessionCategoryScore, EventOverviewCollections} from '../models/eov';
import Eov = require("../models/eov");

interface State {
	speakerScoreCollection: Array<SpeakerScore>;
	sessionCategoryCollection: Array<SessionCategoryScore>;
	trackScCollection: TrackScScore[][];
	eventId : number;
}

const getInitialState = () => {
	const eventId = (document.getElementById('eventId') as any).value;
	return {
		eventId: parseInt(eventId as string),
		speakerScoreCollection: new Array<SpeakerScore>(),
		sessionCategoryCollection: new Array<SessionCategoryScore>(),
		trackScCollection: new Array<TrackScScore[]>()
	};
};

const speakerScoreChanged = (state: State, e: any, speakerScore: SpeakerScore) => {

	speakerScore.SpeakerCount = (e.target.value === null || e.target.value === undefined || e.target.value === '') ? 0 : e.target.value;

	return objectAssign({},
		state,
		{
			speakerScoreCollection: state.speakerScoreCollection.map(speakerScores => {
				if (speakerScores.RegionId === speakerScore.RegionId) {
					return objectAssign({},
						speakerScores, speakerScore
						);
				}

				return speakerScores;
			})
		});
}

const categoryScoreChanged = (state: State, e: any, categoryScore: SessionCategoryScore) => {
	
	categoryScore.SessionCategoryCount = (e.target.value === null || e.target.value === undefined || e.target.value === '') ? 0 : e.target.value;

	return objectAssign({},
		state,
		{
			sessionCategoryCollection: state.sessionCategoryCollection.map(categoryScores => {
				if (categoryScores.SessionCategoryId === categoryScore.SessionCategoryId) {
					return objectAssign({},
						categoryScores, categoryScore
					);
				}

				return categoryScores;
			})
		});
}


const trackScScoreChanged = (state: State, e: any, trackScScore: TrackScScore) => {

	trackScScore.SessionCategoryCount = (e.target.value === null || e.target.value === undefined || e.target.value === '') ? 0 : e.target.value;

	return objectAssign({},
		state,
		{
			trackScCollection: state.trackScCollection.map(trackScScores => {
				trackScScores.map((currentScore) => {
					if (currentScore.TrackId === trackScScore.TrackId &&
						currentScore.SessionCategoryId === trackScScore.SessionCategoryId)
						{
							return objectAssign(
									{},
									currentScore,
									trackScScore
								);
						}
					return currentScore;
				});
				return  trackScScores;
			})
		});
}

const eventOverview = (state: State = getInitialState(), action) => {
	switch (action.type) {
		case RECEIVE_SCORE:
			return objectAssign({},
				state,
				{
					speakerScoreCollection: state.speakerScoreCollection = action.eventOverviewCollections.EventSpeakerScoreCollection
					
				},
			    {
					sessionCategoryCollection: state.sessionCategoryCollection = action.eventOverviewCollections.EventSessionCategoryCollection
				},
				{
					trackScCollection : state.trackScCollection = action.eventOverviewCollections.EventTrackScScoreCollection
				}
				);

		case EVENT_SPKSCORE_CHANGED :
			return speakerScoreChanged(state, action.e, action.speakerScore);

		case EVENT_SCSCORE_CHANGED:
			return categoryScoreChanged(state, action.e, action.categoryScore);

		case EVENT_TSCSCORE_CHANGED:
			return trackScScoreChanged(state, action.e, action.tscScore);

		case CANCEL_CHANGE:
			
		default:
			return state;
	}
};

export default eventOverview;