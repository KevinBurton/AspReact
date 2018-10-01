import objectAssign from '../utils/objectAssign';
import {
	DISCUSSIONS_LOADED,
	FAILED_TO_RECEIVE_ALFRESCO_FILES,
	RETRIEVED_ALFRESCO_FILES,
	STARTED_FILES_LOAD
} from '../actions/peerReviewFilesActions';

const initialState = {
	presentationFiles: [],
	shouldLoad: false,
	supportingFiles: []
};

const handleRetrievedAlfrescoFiles = (state: any, action: any) => {
	const { presentationFiles, supportingFiles } = action;

	return (presentationFiles.length > 0 || supportingFiles.length > 0)
		? objectAssign({}, state, { presentationFiles, supportingFiles })
		: state;
};

const peerReviewFiles = (state = initialState, action) => {
	switch (action.type) {
		case DISCUSSIONS_LOADED:
			return objectAssign({}, state, { shouldLoad: true });
		case FAILED_TO_RECEIVE_ALFRESCO_FILES:
			return state;
		case RETRIEVED_ALFRESCO_FILES:
			return handleRetrievedAlfrescoFiles(state, action);
		case STARTED_FILES_LOAD:
			return objectAssign({}, state, { shouldLoad: false });
		default:
			return state;
	}
};

export default peerReviewFiles;
