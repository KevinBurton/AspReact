module Gartner {

	export interface AjaxDisplayOptions {
		url: string;
		containerId: string;
	}

	export class AjaxDisplay {
		url: string;
		containerId: string;

		onReady(options: AjaxDisplayOptions) {
			this.url = options.url;
			this.containerId = options.containerId;

			this.refresh();
		}

		refresh() {
			//this.showLoading();
			ServiceUtilities.get<string>(this.url)
				.done((response) => {
					$("#" + this.containerId).html(response);
				});
		}

	}

}