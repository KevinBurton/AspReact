import { addError, addSuccess } from './alertActions';
import * as ajax from '../utils/ajax';

export const ASSOCIATION_SELECTED = 'CREATE_SESSION_ASSOCIATION_SELECTED';
export const IS_SAVING = 'CREATE_SESSION_IS_SAVING';

export const onAssociationSelected = (association) => {
    return {
        type: ASSOCIATION_SELECTED,
        association
    };
};

export const onSave = () => {
    return (dispatch, getState) => {
       
        const state = getState();
        const { itemId } = state.itemShared;
        const { selectedAssociation } = state.createSession;
        const json = JSON.stringify({
            RelationshipType: selectedAssociation
        });

        dispatch(isSaving(true));
        ajax.post(`/api/Relationship/CreateChild/${itemId}`, json)
            .done((url: string) => {
                dispatch(addSuccess('Create Session From This', 'Successfully Created!'));
                setTimeout(() => {
                        window.location.href = url;
                    },
                    100);
            })
            .fail(response => {
                if (response && response.exceptionMessage) {
                    dispatch(addError('Create Session From This', response.exceptionMessage));
                } else {
                    dispatch(addError('Create Session From This', 'Cannot Create Session'));
                }
                dispatch(isSaving(false));
            });
    };
};

const isSaving = (isSaving) => {
    return {
        type: IS_SAVING,
        isSaving
    };
};