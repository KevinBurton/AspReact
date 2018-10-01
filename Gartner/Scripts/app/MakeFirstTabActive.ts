module Gartner {

	export interface MakeFirstTabActiveParams {
		tabContainerId: string;
		useHashFirst: boolean;
	}
	
	export class MakeFirstTabActive {

		tabContainer: JQuery;
		useHashFirst: boolean;
		
		onReady(json: MakeFirstTabActiveParams) {
			this.tabContainer = $("#" + json.tabContainerId);
			this.useHashFirst = json.useHashFirst;

			$(window).on("hashchange", this.selectHashTabOrFirst);

			this.selectHashTabOrFirst();
		}

		selectHashTabOrFirst = () => {
			var tab: JQuery;

			if (this.useHashFirst && window.location.hash) {
				tab = this.tabContainer.find("ul li a[href='" + window.location.hash + "']");
			}

			if(tab === undefined || tab === null || tab.length === 0) {
				tab = this.tabContainer.find("ul li:first a");
			}

            setTimeout(() => tab.click(), 50);
			window.scrollTo(0, 0);
        }
    }
} 