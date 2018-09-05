import { clearAlerts } from '../actions/alertActions';
import AlertType from '../enums/AlertTypeEnum';

declare const toastr;

var errorToastrOptions: ToastrOptions = {
	closeButton: false,
	debug: false,
	newestOnTop: true,
	progressBar: false,
	positionClass: "toast-top-right",
	preventDuplicates: false,
	onclick: null,
	showDuration: 300,
	hideDuration: 300,
	timeOut: 0,
	extendedTimeOut: 0,
	showEasing: "swing",
	hideEasing: "linear",
	showMethod: "fadeIn",
	hideMethod: "fadeOut"
};

const showErrors = (alerts: any[]) => {
	toastr.clear();
	alerts.forEach(alert => {
		let method: string;
		let options: ToastrOptions = undefined;
		switch(alert.alertType) {
			case AlertType.Error:
				method = 'error';
				options = errorToastrOptions;
				break;
			case AlertType.Success:
			default:
				method = 'success';
				break;
		}

		toastr[method](alert.message, alert.title, options);
	});
};

let currentState: any = {};
export const checkForErrorsHandler = (getState, dispatch) => {
	const state = getState();
	const previousState = currentState;
	currentState = state;

    console.log(state);
	
	if (previousState.alerts !== currentState.alerts) {
		if (currentState.alerts.length > 0) {
			showErrors(currentState.alerts);
			dispatch(clearAlerts());
		}
	}
};