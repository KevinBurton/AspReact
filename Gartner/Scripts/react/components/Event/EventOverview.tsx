import * as React from 'react';
import objectAssign from '../../utils/objectAssign';
import Form = require("../Form");
import { SpeakerScore, SessionCategoryScore, TrackScScore, EventOverviewCollections } from '../../models/eov';
import SpeakerBudget from './SpeakerBudget';
import SessionCategoryBudget from './SessionCategoryBudget';
import TrackBudget from './TrackBudget';


export interface EventOverviewProps {
	speakerScoreCollection?: Array<SpeakerScore>;
	sessionCategoryCollection?: Array<SessionCategoryScore>;
	trackScCollection?: TrackScScore[][];
	valueChange: (score: number, speakerScore: SpeakerScore) => void;
	scValueChange: (categoryCount: number, sessionCategoryScore: SessionCategoryScore) => void;
	tscValueChange: (categoryCount: number, trackScScore: TrackScScore ) => void;
	saveScores: () => void;
	cancelChange: () => void;
}

export const EventOverview = React.createClass<EventOverviewProps, any>({
	
	render() {
		
	return (
			<div>
				<p className="text-right">
				<button type="button" className="btn btn-sm btn-secondary" onClick={this.props.cancelChange}>Cancel</button>
					<button type="button" className="btn btn-sm btn-primary mrr" onClick={this.props.saveScores}>Save</button>
				</p>
				<h3>Speaker Allocation</h3>
				<SpeakerBudget speakerScoreCollection={this.props.speakerScoreCollection} valueChange={this.props.valueChange} /> 
				<h3>Session Category Allocation</h3>
				<SessionCategoryBudget sessionCategoryCollection={this.props.sessionCategoryCollection} scValueChange={this.props.scValueChange} />
				<h3>Track Allocation</h3>
				<TrackBudget trackScCollection={this.props.trackScCollection} tscValueChange={this.props.tscValueChange} /> 
				<p className="text-right">
				<button type="button" className="btn btn-sm btn-secondary" onClick={this.props.cancelChange}>Cancel</button>
					<button type="button" className="btn btn-sm btn-primary mrr" onClick={this.props.saveScores}>Save</button>
				</p>
			</div>
		);
	}
});

export default EventOverview;