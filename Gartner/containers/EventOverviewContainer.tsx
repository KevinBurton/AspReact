import * as React from 'react';
import { EventOverview } from '../components/Event/EventOverview';
import { connect } from 'react-redux';
import * as actions from '../actions/eventOverviewActions';

const mapStateToProps = (state) => {
	return {
		eventId: state.eventId,
		speakerScoreCollection: state.speakerScoreCollection,
		sessionCategoryCollection: state.sessionCategoryCollection,
		trackScCollection: state.trackScCollection
	};
};

const EventOverviewContainer =
	connect(
		mapStateToProps,
		actions
	)(EventOverview) as React.ClassicComponentClass<any>;

export default EventOverviewContainer;