import { addError, addSuccess } from './alertActions';
import * as ajax from '../utils/ajax';

export const ASSOCIATION_SELECTED = 'CHANGE_ASSOCIATION_ASSOCIATION_SELECTED';
export const IS_SAVING = 'CHANGE_ASSOCATION_IS_SAVING';

export const onAssociationSelected = (association) => {
	return {
		type: ASSOCIATION_SELECTED,
		association
	}
};

export const onSave = () => {
	return (dispatch, getState) => {
		const state = getState();
		const { itemId } = state.itemShared;
		const { selectedAssociation } = state.changeAssociation;
		const json = JSON.stringify({
			RelationshipType: selectedAssociation
		});

		dispatch(isSaving(true));
	    ajax.post(`/api/Relationship/Change/${itemId}`, json)
	        .done(() => {
	            dispatch(addSuccess('Change Association', 'Successfully Saved!'));
	            setTimeout(() => {
	                    window.location.reload(true);
	                },
	                100);
	        })
	        .fail(response => {
	            if (response && response.exceptionMessage) {
	                dispatch(addError('Change Association', response.exceptionMessage));
	            } else {
	                dispatch(addError('Change Association', 'Cannot save association'));
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