interface JQuery {
    maxlength(options: any): JQuery;
}

module Gartner.MaxLengthUtility {
	export function add(elementId: string, showFeedback: boolean, guidance: number, max: number) {
		$("#" + elementId).maxlength({
			max: max,
			showFeedback: showFeedback,
			feedbackText: (showFeedback) ? "{c} characters entered ( guidance ~" + guidance + " characters )" : undefined
		});
	}
}