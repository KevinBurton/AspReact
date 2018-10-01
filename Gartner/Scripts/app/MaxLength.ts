interface MaxLengthParams {
	elementId: string;
    max: number;
    showFeedback: boolean;
    guidance?: number;
    appendTitleHelp: boolean;
}

interface JQuery {
    maxlength(options: any): JQuery;
}

module Gartner {
    export class MaxLength {

        onReady(JSON: MaxLengthParams) {          
			if (JSON.showFeedback) {
				var maxLengthOptions: any = {
					max: JSON.max,
					showFeedback: JSON.showFeedback,
                    feedbackText: (JSON.appendTitleHelp) ? "{c} characters entered ( guidance ~" + JSON.guidance + " characters": "{c} characters entered ( guidance ~" + JSON.guidance + " characters )"
				};
			} else {
				var maxLengthOptions: any = {
					max: JSON.max,
					showFeedback: JSON.showFeedback
				};
			}
            $("#" + JSON.elementId).maxlength(maxLengthOptions);
		}
	}
}