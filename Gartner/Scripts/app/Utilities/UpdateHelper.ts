module Gartner.UpdateHelper {
	export function updateAjaxPanels(sectionsToUpdate: Array<string>)  {
		var ajaxPanels: Array<AjaxPanel> = Gartner.allInstancesOfUniqueIds(sectionsToUpdate, "AjaxPanel");
		ajaxPanels.forEach(ajaxPanel => ajaxPanel.refresh());
	}
} 