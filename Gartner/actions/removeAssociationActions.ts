import * as ajax from '../utils/ajax';
import { addError, addSuccess } from './alertActions';

export const IS_REMOVING = 'IS_REMOVING';

export const isRemoving = (isRemovingAssociation: boolean) => {
	return {
		type: IS_REMOVING,
		isRemovingAssociation
	};
};

export const removeAssociation = () => {
	return (dispatch, getState) => {
		const state = getState();
		const { itemId } = state.itemShared;
		
		dispatch(isRemoving(true));
	    ajax.doDelete(`/api/Relationship/Remove/${itemId}`)
	        .done(() => {
	            dispatch(addSuccess('Remove Association', 'Successfully removed association.'));
	            setTimeout(() => {
	                    window.location.reload(true);
	                },
	                100);
	        })
	        .fail(response => {
	            if (response && response.exceptionMessage) {
	                dispatch(addError('Remove Association', response.exceptionMessage));
	            } else {
	                dispatch(addError('Remove Association', 'Cannot save association.'));
                }
                dispatch(isRemoving(false));
	        });
	};
};
