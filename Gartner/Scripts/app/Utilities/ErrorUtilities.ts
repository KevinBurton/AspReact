/// <reference path="../../typings/toastr/toastr.d.ts" />

module Gartner.ErrorUtilities {
	
	var toastrOptions: ToastrOptions = {
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

	export var clearErrors = () => {
		toastr.clear();
	};

	export var showGeneralError = () => {
		showErrorMessage("Oops!", "Something went wrong");
	}

	export var showErrorFromResponse = (response) => {
		showErrorMessage(response.errorSource + " Failed", response.exceptionMessage);
	}

	export var showErrorMessage = (title: string, message: string) => {
		clearErrors();
		toastr.error(message, title, toastrOptions);
	}

} 