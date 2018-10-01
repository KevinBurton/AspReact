import * as React from 'react';
import { connect } from 'react-redux';
import * as ReactDom from 'react-dom';
import * as actions from '../actions/speakerManagerActions';
import EventTitle from '../components/EventTitle';

const mapStateToProps = (state) => {

  //  console.log('map state to props EventTitleContainer', state);
	return {
        itemId: state.itemShared.itemId,
        itemEvents: state.event.events
	};
};

const EventTitleContainer =
    connect(
        mapStateToProps,
        actions
    )(EventTitle) as React.ClassicComponentClass<any>;



export default EventTitleContainer;
