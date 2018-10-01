module Gartner {

	export interface MakeSubTabActiveParams {
		tabContainerId: string;
		tabId: string;
	}
	
	export class MakeSubTabActive {

		onReady(json: MakeSubTabActiveParams) {
			const tabContainer = $("#" + json.tabContainerId);
			const tab =  tabContainer.find("#" + json.tabId);

		    tab.click();			
		}
	}
} 