module Gartner.SupportTeamService {

	export function save(itemId: number,  supportTeamViewModel: ISupportTeamViewModel): JQueryPromise<string> {
		
		return ServiceUtilities.post("/SupportTeam/Upsert/" + itemId, JSON.stringify(supportTeamViewModel));
	}
	export function getSupporTeamsByItemId(itemId: number): JQueryPromise<ISupportTeamViewModel> {
		return $.ajax({
			url: "/SupportTeam/GetByItemId/" + itemId,
			cache: false,
			error: () => ErrorUtilities.showGeneralError()
		});
	}
} 