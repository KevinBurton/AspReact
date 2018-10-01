import {
	ASSOCIATION_SELECTED,
	IS_SAVING
} from '../actions/changeAssociationActions';
import objectAssign from '../utils/objectAssign';
import AssociationType from '../enums/AssociationTypeEnum';
import { RECEIVE_ITEM_SHARED } from '../actions/itemSharedActions';

const initialState = {
	parentItemTitle:undefined,
	savedAssociation: undefined,
	selectedAssociation: undefined
};

const associationReceived = (state, itemShared) => {
	return objectAssign({}, state,
		{
			parentItemTitle: itemShared.parentItemTitle,
			savedAssociation: itemShared.relationshipTypeId,
			selectedAssociation: itemShared.relationshipTypeId
		});
};

const associationChanged = (state, associationType) => {
	return objectAssign({}, state,
		{
			selectedAssociation: associationType
		});
};

const isSaving = (state, isSaving) => objectAssign({}, state, { isSaving });

const changeAssociation = (state = initialState, action) => {
	switch (action.type) {
		case RECEIVE_ITEM_SHARED:
			return associationReceived(state, action.itemShared);
		case ASSOCIATION_SELECTED:
			return associationChanged(state, action.association);
		case IS_SAVING:
			return isSaving(state, action.isSaving);
		default:
			return state;
	}
};

export default changeAssociation;