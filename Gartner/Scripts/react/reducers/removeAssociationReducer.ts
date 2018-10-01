import objectAssign from '../utils/objectAssign';
import { IS_REMOVING } from '../actions/removeAssociationActions';

const initialState = {
	isRemovingAssociation: false
};

const removeAssociation = (state = initialState, action) => {
	switch (action.type) {
		case IS_REMOVING:
			return objectAssign({}, state, { isRemovingAssociation: action.isRemovingAssociation });
		default:
			return state;
	}
};

export default removeAssociation;
