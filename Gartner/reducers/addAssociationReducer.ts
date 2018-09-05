import {
	ASSOCIATION_SELECTED,
	PARENT_ITEM_CLEARED,
	PARENT_ITEM_SELECTED,
	IS_SAVING
} from '../actions/addAssociationActions';

import objectAssign from '../utils/objectAssign';
import AssociationType from '../enums/AssociationTypeEnum';

const initialState = {
	isSaving: false,
	parentItemId: undefined,
	selectedAssociation: AssociationType.DirectPickUp
};

const parentItemSelected = (state, parentItemId) => objectAssign({}, state, { parentItemId });
const isSaving = (state, isSaving) => objectAssign({}, state, { isSaving });

const associationSelected = (state, associationType) => {
	return objectAssign({}, state,
	{
		selectedAssociation: associationType
	});
};

const addAssociation = (state = initialState, action) => {
	switch (action.type) {
		case IS_SAVING:
			return isSaving(state, action.isSaving);
		case ASSOCIATION_SELECTED:
			return associationSelected(state, action.association);
		case PARENT_ITEM_CLEARED:
			return parentItemSelected(state, undefined);
		case PARENT_ITEM_SELECTED:
			return parentItemSelected(state, action.parentItemId);
		default:
			return state;
	}
};

export default addAssociation;