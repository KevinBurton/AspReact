interface PopoverParams {
	elementId?: string;
	elementIds?: Array<string>;
	contentString: string;
	title: string;
} 

interface JQuery {
	popover(options: any): JQuery;
}

module Gartner {
	export class Popover {
		private contentString: string;
		private title: string;

		onReady(json: PopoverParams) {
			this.contentString = json.contentString;
			this.title = json.title;

			(json.elementIds || [json.elementId]).forEach(this.addPopoverForElement);
		}

		addPopoverForElement = (elementId: string) => {
			$("#" + elementId).popover({
				container: "body",
				content: this.contentString,
				placement: "left",
				title: this.title + "<button type='button' class='close'>&times;</button>",
				html: true
			});

			EventUtilities.addHandlerToBody("click", "#" + elementId, (event) => event.preventDefault());
		}
	}
}