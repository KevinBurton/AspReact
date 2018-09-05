import * as React from 'react';
import { connect } from 'react-redux';
import * as ReactDom from 'react-dom';
import * as actions from '../actions/externalSpeakerActions';
import ExternalSpeakerList from '../components/ExternalSpeakerList';

const mapStateToProps = (state) => {
 //   console.log('map state to props EditExternalSpeakerListContainer', state);
	return {
        itemId: state.itemShared.itemId,
        itemExternalSpeakers: state.externalSpeaker.externalSpeakers
	};
};

const EditExternalSpeakerListContainer =
    connect(
        mapStateToProps,
        actions
    )(ExternalSpeakerList) as React.ClassicComponentClass<any>;



export default EditExternalSpeakerListContainer;
