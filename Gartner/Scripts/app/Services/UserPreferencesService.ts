module Gartner.UserPreferencesService {
	export function getPreferencesByUserId(id: number): JQueryPromise<IUserPreferences> {
		return $.ajax({
			url: "/UserPreferences/GetByUserId/" + id,
			cache: false,
			error: () => ErrorUtilities.showGeneralError()
		});
	}
	export function savePreferences(id : number , json: string): JQueryPromise<any> {
		ErrorUtilities.clearErrors();
		console.log(json);
		return $.ajax(<JQueryAjaxSettings>{
			url: "/UserPreferences/Upsert/" + id,
			data: json,
			type: "POST",
			contentType: "application/json",
			cache: false,
			error: () => ErrorUtilities.showGeneralError()
		});
	}
}