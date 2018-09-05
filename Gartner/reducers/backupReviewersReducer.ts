import objectAssign from '../utils/objectAssign';

import {
	RECEIVE_REVIEWER_BACKUPS,
	SELECT_REVIEWER_FOR_VIEW_BACKUPS
} from '../actions/viewBackupsActions';

import { BackupReviewersDictionary } from '../models/backupReviewer';

export interface BackupReviewersState {
	backupReviewersDictionary: BackupReviewersDictionary;
	currentReviewerEmployeeId?: number;
	currentReviewerName?: string;
}

const initialState: BackupReviewersState = {
	backupReviewersDictionary: {}
};

const backupReviewers = (state = initialState, action: any) => {
	switch(action.type) {
		case RECEIVE_REVIEWER_BACKUPS:
			return objectAssign({}, state, {
				 backupReviewersDictionary: action.backups
			});
		case SELECT_REVIEWER_FOR_VIEW_BACKUPS:
			return objectAssign({}, state, {
				currentReviewerEmployeeId: action.employeeId,
				currentReviewerName: action.employeeName
			});
	}

	return state;
};

export default backupReviewers;