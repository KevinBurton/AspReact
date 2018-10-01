import * as React from 'react';
import { connect } from 'react-redux';

import * as actions from '../actions/peerReviewFilesActions';
import PeerReviewFiles from '../components/PeerReviewFiles';

const mapStateToProps = (state) => {
	return {
		presentationFiles: state.peerReviewFiles.presentationFiles,
		supportingFiles: state.peerReviewFiles.supportingFiles
	};
};

const PeerReviewFilesContainer =
	connect(
		mapStateToProps,
		actions
	)(PeerReviewFiles) as () => JSX.Element;

export default PeerReviewFilesContainer;
