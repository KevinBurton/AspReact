import { IS_EDITING, SET_KEYWORDS, IS_SAVING } from '../actions/keywordsActions';
import objectAssign from '../utils/objectAssign';

const isEditing = (state, isEditing) => {
	const nextState = objectAssign({}, state, {
		isEditing
	});

	return nextState;
};

const isSaving = (state, isSaving) => {
	const nextState = objectAssign({}, state, {
		isSaving
	});

	return nextState;
};

const setKeywords = (state, keywords) => {
	const nextState = objectAssign({}, state, {
		keywords: keywords || ''
	});

	return nextState;
};

const initialState = {
	isEditing: false,
	isSaving: false,
	keywords: ''
};

const keywords = (state = initialState, action) => {
	switch (action.type) {
		case IS_EDITING:
			return isEditing(state, action.isEditing);
		case SET_KEYWORDS:
			return setKeywords(state, action.keywords);
		case IS_SAVING:
			return isSaving(state, action.isSaving);
		default:
			return state;
	}
};

export default keywords;