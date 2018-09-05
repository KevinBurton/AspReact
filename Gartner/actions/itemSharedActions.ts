import * as ajax from '../utils/ajax';

export const STARTED_RECEIVE_ITEM_SHARED = 'STARTED_RECEIVE_ITEM_SHARED';
export const RECEIVE_ITEM_SHARED = 'RECEIVE_ITEM_SHARED';
export const BASIC_INFORMATION_SAVED = 'BASIC_INFORMATION_SAVED';

export const requestItemShared = () => {
	return (dispatch, getState) => {
		const state = getState();
		const { itemId } = state.itemShared;

		ajax.get(`/api/Item/GetItemShared/${itemId}`)
			.done((itemShared) => {
				dispatch(receiveItemShared(itemShared));
			})
			.fail(() => {
				console.error("could not retrieve item shared");
			});
	};
};

export const receiveItemShared = (itemShared) => {
	return {
		type: RECEIVE_ITEM_SHARED,
		itemShared
	};
};

export const startedReceiveItemShared = () => {
	return {
		type: STARTED_RECEIVE_ITEM_SHARED
	};
};