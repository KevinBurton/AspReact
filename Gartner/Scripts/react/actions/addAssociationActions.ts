import { addError, addSuccess } from './alertActions';
import * as ajax from '../utils/ajax';

export const ASSOCIATION_SELECTED = 'ADD_ASSOCATION_ASSOCIATION_SELECTED';
export const PARENT_ITEM_CLEARED = 'PARENT_ITEM_CLEARED';
export const PARENT_ITEM_SELECTED = 'PARENT_ITEM_SELECTED';
export const IS_SAVING = 'ADD_ASSOCATION_IS_SAVING';

export const onAssociationSelected = (association) => {
	return {
		type: ASSOCIATION_SELECTED,
		association
	};
};

export const parentItemCleared = (): any => {
	return {
		type: PARENT_ITEM_SELECTED
	};
};

export const onParentItemSelected = (parentItemId: string): any => {
	if (parentItemId) {
		return {
			type: PARENT_ITEM_SELECTED,
			parentItemId: parseInt(parentItemId)
		};
	} else {
		return parentItemCleared();
	}
};

export const onSave = () => {
	return (dispatch, getState) => {
		const state = getState();
		const { itemId } = state.itemShared;
		const { selectedAssociation, parentItemId } = state.addAssociation;
		const json = JSON.stringify({
			ParentItemId: parentItemId,
			RelationshipType: selectedAssociation
		});

		dispatch(isSaving(true));
		ajax.post(`/api/Relationship/Add/${itemId}`, json)
			.done(() => {
				dispatch(addSuccess('Add Association', 'Successfully Saved!'));
				setTimeout(() => {
					window.location.reload(true);
				}, 100);
			})
			.fail(response => {
				if (response && response.exceptionMessage) {
					dispatch(addError('Add Association', response.exceptionMessage));
				} else {
					dispatch(addError('Add Association', 'Cannot save association'));
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