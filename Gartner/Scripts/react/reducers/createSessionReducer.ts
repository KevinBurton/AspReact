import {
    ASSOCIATION_SELECTED, 
    IS_SAVING
} from '../actions/createSessionFromThisActions';

import objectAssign from '../utils/objectAssign';
import AssociationType from '../enums/AssociationTypeEnum';

const initialState = {
    parentItemId: undefined,
    selectedAssociation: AssociationType.DirectPickUp, 
    isSaving: false
};

const associationSelected = (state, associationType) => {
    return objectAssign({}, state,
        {
            selectedAssociation: associationType
        });
};

const isSaving = (state, isSaving) => objectAssign({}, state, { isSaving });

const CreateSessionFromThis = (state = initialState, action) => {
    switch (action.type) {
        case ASSOCIATION_SELECTED:
            return associationSelected(state, action.association);
        case IS_SAVING:
            return isSaving(state, action.isSaving);
        default:
            return state;
    }
};

export default CreateSessionFromThis;