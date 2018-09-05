import * as React from 'react';
import { connect } from 'react-redux';
import * as ReactDom from 'react-dom';
import * as actions from '../actions/speakerActions';
import SpeakerList from '../components/SpeakerList';

const mapStateToProps = (state) => {

 //   console.log('map state to props EditSpeakerListContainer', state);
	return {
        itemId: state.itemShared.itemId,
        itemSpeakers: state.speaker.speakers,
        speakerRoles: state.speaker.speakerRoles,
        speakerEventId: state.speaker.eventId, 
        refresh: state.speaker.refresh
	};
};

const EditSpeakerListContainer =
    connect(
        mapStateToProps,
        actions
    )(SpeakerList) as React.ClassicComponentClass<any>;



export default EditSpeakerListContainer;
