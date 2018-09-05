import * as React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/createSessionFromThisActions';
import createSessionFromThisModal from '../components/createSessionFromThisModal';

const mapStateToProps = (state) => {
	return {
		selectedAssociation: state.createSession.selectedAssociation,
		parentItemTitle: state.itemShared.parentItemTitle,
		eventCode: state.itemShared.eventCode, 
		itemHasNoContent: state.itemShared.hasNoContent,
		itemId: state.itemShared.itemId,
		isSaving: state.createSession.isSaving
	};
};

const createSessionFromThisModalContainer =
	connect(
		mapStateToProps,
		actions
	)(createSessionFromThisModal) as () => JSX.Element;

export default createSessionFromThisModalContainer;
