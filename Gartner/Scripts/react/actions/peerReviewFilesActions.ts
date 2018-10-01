import * as ajax from '../utils/ajax';
import { addError } from './alertActions';
import { SessionFileProps } from '../components/SessionFile';

export const DISCUSSIONS_LOADED = 'DISCUSSIONS_LOADED';
export const FAILED_TO_RECEIVE_ALFRESCO_FILES = 'FAILED_TO_RECEIVE_ALFRESCO_FILES';
export const RETRIEVED_ALFRESCO_FILES = 'RETRIEVED_ALFRESCO_FILES';
export const STARTED_FILES_LOAD = 'STARTED_FILES_LOAD';

export const failedToRetrieveAlfrescoFiles = () => {
	return {
		type: FAILED_TO_RECEIVE_ALFRESCO_FILES
	};
};

export const onRetrieveAlfrescoSessionFiles = (presentationFiles: SessionFileProps[], supportingFiles: SessionFileProps[]) => {
	return {
		type: RETRIEVED_ALFRESCO_FILES,
		presentationFiles,
		supportingFiles
	};
};

export const startedFilesLoad = () => {
	return {
		type: STARTED_FILES_LOAD
	}
};

export const getAlfrescoSessionFiles = () => {
	return (dispatch, getState) => {
		
		const state = getState();
		const { itemId } = state.itemShared;

		ajax.get<any>(`/api/PresentationFiles/ConferenceSessionChildren?itemId=${itemId}&folderPath=For Presentation`)
			.done(response => {
				const { itemHasSessionFolder, presentationFiles, supportingFiles} = response;
				if (itemHasSessionFolder) {
					dispatch(onRetrieveAlfrescoSessionFiles(presentationFiles, supportingFiles));
				}
				else {
					dispatch(failedToRetrieveAlfrescoFiles());
				}
			})
			.fail(() => {
				dispatch(failedToRetrieveAlfrescoFiles());
			});
	};
};
