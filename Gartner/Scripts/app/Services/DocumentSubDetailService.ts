module Gartner.DocumentSubDetailService {

	export function save(json): JQueryPromise<any> {
		ErrorUtilities.clearErrors();
		return $.ajax(<JQueryAjaxSettings>{
			url: "/DocumentSubDetail/Save",
			data: json,
			type: "POST",
			contentType: "application/json",
			cache: false,
			error: () => ErrorUtilities.showGeneralError()
		});
	}
	export function getDocumentSubDetailByItemId(itemId: number): JQueryPromise<IDocumentSubDetail> {
		return $.ajax({
			url: "/DocumentSubDetail/GetByItemId/" + itemId,
			cache: false,
			error: () => ErrorUtilities.showGeneralError()
		});
	}

	export function getContentTypeByItemId(itemId: number): JQueryPromise<Array<IContentTypeView>> {
		return $.ajax({
			url: "/DocumentSubDetail/GetContentTypeByDocumentId/" + itemId,
			cache: false,
			error: () => ErrorUtilities.showGeneralError()
		});
	}

	export function getSubContentTypeByContentId(contentId: number, itemId: number): JQueryPromise<Array<IContentTypeView>> {
		return $.ajax({
			url: "/DocumentSubDetail/GetContentSubTypeByContentId?contentId=" + contentId + "&itemId=" + itemId,
			cache: false,
			error: () => ErrorUtilities.showGeneralError()
		});
	}
}