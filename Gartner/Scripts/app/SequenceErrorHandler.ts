/// <reference path="../typings/jquery/jquery.d.ts" />

interface SequenceErrorHandlerParams {
	errorContainerId: string;
	saveButtonClass: string;
}

module Gartner {

	export class SequenceErrorHandler {
			
		private errorContainer: JQuery;	

		onReady(json: SequenceErrorHandlerParams) {
			this.errorContainer = $("#" + json.errorContainerId);
			$("body").on("click", "." + json.saveButtonClass, this.clearErrors);
		}

		clearErrors = () => {
			this.errorContainer.html("");
		}

	}

	export function handleSequenceError(errorContainerId: string) {
		var container = $("#" + errorContainerId);
		var exists = container.find(".alert").length > 0;
		if (!exists) {
			var message = "Your sequences were not saved. Make sure they're all Integers.";

			var dismissButton = $("<button>")
				.attr("type", "button")
				.addClass("close")
				.attr("data-dismiss", "alert")
				.attr("aria-label", "Close")
				.html("<span aria-hidden='true'>&times;</span>");

			var alertMessage = $("<span><strong>Warning!</strong> " + message + "</span>");

			var alert = $("<div>")
				.addClass("alert alert-warning alert-dismissible")
				.attr("role", "alert")
				.append(dismissButton)
				.append(alertMessage);

			alert.appendTo(container);
		}
	}
} 