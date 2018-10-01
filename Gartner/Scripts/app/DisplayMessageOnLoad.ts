/// <reference path="../typings/toastr/toastr.d.ts" />

interface DisplayMessage {
	message: string;
	messageType: string;
	errors: Array<string>;
}

module Gartner {
	export class DisplayMessageOnLoad {
		onReady(displayMessage: DisplayMessage) {
			if (displayMessage.message && displayMessage.messageType) {
				const errorDisplay = displayMessage.errors.join('<br>');

				if (errorDisplay) {
					ErrorUtilities.showErrorMessage(errorDisplay, displayMessage.message);
				} else {
					toastr[displayMessage.messageType]('', displayMessage.message);
				}
			}
		}
	}
}