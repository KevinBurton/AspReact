import * as React from 'react';
import { connect } from 'react-redux';

import ViewBackups from '../components/ViewBackups';

const getBackupsFromDictionary = (employeeId, dict) => {
	if (dict[employeeId]) {
		return dict[employeeId];
	}

	return [];
};

const mapStateToProps = (state) => {
	const {
		currentReviewerEmployeeId,
		currentReviewerName,
		backupReviewersDictionary
	} = state.backupReviewers;

	return {
		itemId: state.itemShared.itemId,
		currentReviewerName,
		backups: getBackupsFromDictionary(currentReviewerEmployeeId, backupReviewersDictionary)
	};
};

const ViewBackupsContainer =
	connect(
		mapStateToProps
	)(ViewBackups) as () => JSX.Element;

export default ViewBackupsContainer;