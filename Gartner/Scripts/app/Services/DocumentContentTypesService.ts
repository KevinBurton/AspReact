module Gartner.DocumentContentTypesService {

	export function save(json): JQueryPromise<any> {
		ErrorUtilities.clearErrors();
		return $.ajax(<JQueryAjaxSettings>{
			url: "/DocumentContentTypes/Save",
			data: json,
			type: "POST",
			contentType: "application/json",
			cache: false,
			error: () => ErrorUtilities.showGeneralError()
		});
	}
	export function getDocumentSubDetailByItemId(itemId: number): JQueryPromise<IDocumentSubDetail> {
		return $.ajax({
			url: "/DocumentContentTypes/GetByItemId/" + itemId,
			cache: false,
			error: () => ErrorUtilities.showGeneralError()
		});
	}

	export function getContentTypeByItemId(itemId: number): JQueryPromise<Array<IContentTypeView>> {
		return $.ajax({
			url: "/DocumentContentTypes/GetContentTypeByDocumentId/" + itemId,
			cache: false,
			error: () => ErrorUtilities.showGeneralError()
		});
	}

	export function getSubContentTypeByContentId(contentId: number, itemId: number): JQueryPromise<Array<IContentTypeView>> {
		return $.ajax({
			url: "/DocumentContentTypes/GetContentSubTypeByContentId?contentId=" + contentId + "&itemId=" + itemId,
			cache: false,
			error: () => ErrorUtilities.showGeneralError()
		});
	}
}