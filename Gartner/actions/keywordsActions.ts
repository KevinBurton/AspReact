import * as ajax from '../utils/ajax';
import { addError } from './alertActions';

export const IS_EDITING = 'KEYWORDS_IS_EDITING';
export const IS_SAVING = 'KEYWORDS_IS_SAVING';
export const SET_KEYWORDS = 'SET_KEYWORDS';

export const onSave = (keywords: string) => {
	return (dispatch, getState) => {
		const state = getState();
		const { itemId } = state.itemShared;
		const json = JSON.stringify({ keywords });

		dispatch(setIsSaving(true));
		ajax.post(`/api/ItemKeywords/${itemId}`, json)
			.done(() => {
				dispatch(setKeywords(keywords));
				dispatch(setIsEditing(false));
			})
			.fail(() => {
				dispatch(addError('Hashtags', 'Cannot save hashtags'));
			})
			.always(() => {
				dispatch(setIsSaving(false));
			});
	}
};

export const setIsSaving = (isSaving: boolean) => {
	return {
		type: IS_SAVING,
		isSaving
	}
};

export const getKeywords = () => {
	return (dispatch, getState) => {
		const state = getState();
		const { itemId } = state.itemShared;

		ajax.get<string>(`/api/ItemKeywords/${itemId}`)
			.then((keywords) => {
				dispatch(setKeywords(keywords));
			});
	};
};

export const setKeywords = (keywords: string) => {
	return {
		type: SET_KEYWORDS,
		keywords
	};
};

export const onCancel = () => {
	return setIsEditing(false);
};

export const onEdit = () => {
	return setIsEditing(true);
};

export const setIsEditing = (isEditing: boolean) => {
	return {
		type: IS_EDITING,
		isEditing
	};
};