import AlertType from '../enums/AlertTypeEnum';

export const CLEAR_ALERTS = 'CLEAR_ALERTS';
export const ADD_ALERT = 'ADD_ALERT';

export const clearAlerts = () => {
	return {
		type: CLEAR_ALERTS
	}
};

export const addError = (title: string, message: string) => {
	return {
		type: ADD_ALERT,
		alertType: AlertType.Error,
		title,
		message
	}
};

export const addSuccess = (title: string, message: string) => {
	return {
		type: ADD_ALERT,
		alertType: AlertType.Success,
		title,
		message
	}
};