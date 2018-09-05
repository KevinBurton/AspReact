import objectAssign from '../utils/objectAssign';
import {
	RECEIVE_ITEM_SHARED,
	BASIC_INFORMATION_SAVED,
	STARTED_RECEIVE_ITEM_SHARED
} from '../actions/itemSharedActions';
import AssociationType from '../enums/AssociationTypeEnum';

const retrieveItem = (state, itemShared) => {
	return objectAssign({}, state, {
		hasNoContent: itemShared.hasNoContent,
		isReadOnly: itemShared.isReadOnly,
		relationshipType: itemShared.relationshipType,
		parentItemId: itemShared.parentItemId,
		parentItemTitle: itemShared.title,
		eventCode: itemShared.eventCode, 
        associationTypeId: itemShared.relationshipTypeId,
        defaultRoleId: itemShared.defaultRoleId
	});
};

const shouldRefresh = (state, shouldRefresh) => objectAssign({}, state, { shouldRefresh });

const getInitialState = () => {
	const itemId = (document.getElementById('itemId') as any).value;

	return {
		itemId: parseInt(itemId),
		shouldRefresh: false,
		isReadOnly: true,
		relationshipType: undefined,
		parentItemId: undefined,
		parentItemTitle: undefined,
        associationTypeId: undefined,
        defaultRoleId: undefined
	};
};

const itemShared = (state = getInitialState(), action) => {
	switch (action.type) {
		case RECEIVE_ITEM_SHARED:
			return retrieveItem(state, action.itemShared);
		case BASIC_INFORMATION_SAVED:
			return shouldRefresh(state, true);
		case STARTED_RECEIVE_ITEM_SHARED:
			return shouldRefresh(state, false);
		default:
			return state;
	}
};

export default itemShared;