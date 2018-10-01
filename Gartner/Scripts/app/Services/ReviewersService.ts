module Gartner.ReviewersService {
	
	export function getReviewersByItemId(itemId: number): JQueryPromise<Array<IReviewer>> {
		return $.ajax({
			url: "/Reviewers/GetByItemId/" + itemId,
			cache: false,
			error: () => ErrorUtilities.showGeneralError()
		});
	}

	export function getReviewersComboBoxDataSource(itemId:number) {
		return ServiceUtilities.getComboBoxDataSource("/Reviewers/GetNonAuthorEmployees/" + itemId);
	}

	export function save(itemId: number, json: string): JQueryPromise<ErrorResponse> {
		ErrorUtilities.clearErrors();
		return $.ajax(<JQueryAjaxSettings>{
			url: "/Reviewers/Save/" + itemId,
			data: json,
			type: "POST",
			contentType: "application/json",
			cache: false,
			error: () => ErrorUtilities.showGeneralError()
		});		
	}

} 