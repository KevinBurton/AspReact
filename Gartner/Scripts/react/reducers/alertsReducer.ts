import { CLEAR_ALERTS, ADD_ALERT } from '../actions/alertActions';

const addAlert = (state, { alertType, title, message }) => {
	const newAlert = { alertType, title, message };

	return state.concat([newAlert]);
};

const alerts = (state: any[] = [], action) => {
	switch (action.type) {
		case CLEAR_ALERTS:
			return [];
		case ADD_ALERT:
			return addAlert(state, action);
		default:
			return state;
	}
};

export default alerts;