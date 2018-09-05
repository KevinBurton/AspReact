import * as React from 'react';
import RatingModal from '../components/QVR/RatingModal';
import * as actions from '../actions/qvrActions';
import { connect } from 'react-redux';
import objectAssign from '../utils/objectAssign';

import {Modal} from '../models/qvr';

const canSaveModal = (state, commentIsRequired, reasonIsRequired): boolean => {
	const {
		isOpen,
		currentReviewer,
		rating,
		comment,
		reasonId,
		isSaving,
		hasNoPeerReviewProvided
	} = state.qvr.modal as Modal;

	if (currentReviewer) {
		if (commentIsRequired && !comment) {
			return false;
		}
		if (reasonIsRequired && (reasonId === undefined || reasonId === null)) {
			return false;
		}
		if (!hasNoPeerReviewProvided && !rating) {
			return false;
		}
	}

	return isOpen && !!currentReviewer && !isSaving;
};

const mapStateToProps = (state, ownProps) => {
	const {
		isOpen,
		currentReviewer,
		isSaving,
		reasons,
		rating,
		reasonId,
		hasNoPeerReviewProvided,
		comment
	 } = state.qvr.modal as Modal;

	const commentIsRequired = !hasNoPeerReviewProvided ? !rating || rating <= 2 : false;
	const reasonIsRequired = hasNoPeerReviewProvided;

	return objectAssign({}, ownProps, {
		isOpen,
		isSaving,
		reviewer: currentReviewer,
		reasons,
		rating,
		reasonId,
		comment,
		hasNoPeerReviewProvided,
		commentIsRequired,
		reasonIsRequired,
		canSaveModal: canSaveModal(state, commentIsRequired, reasonIsRequired)
	});
};

const Container =
	connect(
		mapStateToProps,
		actions
	)(RatingModal) as React.ClassicComponentClass<any>;

export default Container;
