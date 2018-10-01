interface TitleDescriptionParams {
	gridId: string;
	elementSelector: string;
	max: number;
	showFeedback: boolean;
	guidance?: number;
}

interface JQuery {
	maxlength(options: any): JQuery;	
}

module Gartner {
	export class TitleDescriptionCounts {

		onReady(JSON: TitleDescriptionParams) {
			if (JSON.showFeedback) {
				var maxLengthOptions: any = {
					max: JSON.max,
					showFeedback: JSON.showFeedback,
					feedbackText: "{c} characters entered ( guidance ~" + JSON.guidance + " characters )"
				};
			} else {
				var maxLengthOptions: any = {
					max: JSON.max,
					showFeedback: JSON.showFeedback
				};
			}
			var checkIfGridInitialized = setInterval(() => {
				var grid = $("#" + JSON.gridId).data("kendoGrid");
				if (grid) {
					clearInterval(checkIfGridInitialized);
					grid.bind("edit", (eventArgs) => {
						$(eventArgs.container).find(JSON.elementSelector).maxlength(maxLengthOptions);
					});
				}
			}, 50);
		}	
	}
} 