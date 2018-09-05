import { combineReducers } from 'redux';
import keywords from './keywordsReducer';
import itemShared from './itemSharedReducer';
import alerts from './alertsReducer';
import addAssociation from './addAssociationReducer';
import changeAssociation from './changeAssociationReducer';
import createSession from './createSessionReducer';
import peerReviewFiles from './peerReviewFilesReducer';
import removeAssociation from './removeAssociationReducer';
import backupReviewers from './backupReviewersReducer';
import qvr from './qvrReducer';
import speaker from './speakerReducer';
import externalSpeaker from './externalSpeakerReducer';
import speakerManager from  './speakerManagerReducer';

export default combineReducers({
	keywords,
	itemShared,
	alerts,
	addAssociation,
	changeAssociation,
	createSession,
	peerReviewFiles,
	removeAssociation,
	backupReviewers,
    qvr, 
    speaker,
    externalSpeaker,
    speakerManager
});