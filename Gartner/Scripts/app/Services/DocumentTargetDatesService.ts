module Gartner.DocumentTargetDatesService {

	export function save(json): JQueryPromise<any> {
		ErrorUtilities.clearErrors();
		return $.ajax(<JQueryAjaxSettings>{
			url: "/DocumentTargetDates/Save",
			data: json,
			type: "POST",
			contentType: "application/json",
			cache: false,
			error: () => ErrorUtilities.showGeneralError()
		});
	}
	export function getDocumentSubDetailByItemId(itemId: number): JQueryPromise<IDocumentSubDetail> {
		return $.ajax({
			url: "/DocumentTargetDates/GetByItemId/" + itemId,
			cache: false,
			error: () => ErrorUtilities.showGeneralError()
		});
	}
}