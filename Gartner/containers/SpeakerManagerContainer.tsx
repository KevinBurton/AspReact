import * as React from 'react';
import { connect } from 'react-redux';
import * as ReactDom from 'react-dom';
import * as actions from '../actions/speakerManagerActions';
import SpeakerManager from '../components/SpeakerManager';

const mapStateToProps = (state) => {

  //  console.log('map state to props SpeakerManagerContainer', state);
	return {
        itemId: state.itemShared.itemId,
        itemEvents: state.speakerManager.events
	};
};

const SpeakerManagerContainer =
    connect(
        mapStateToProps,
        actions
    )(SpeakerManager) as React.ClassicComponentClass<any>;



export default SpeakerManagerContainer;
