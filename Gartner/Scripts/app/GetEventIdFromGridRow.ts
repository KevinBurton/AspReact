module Gartner {
	export function getEventIdFromGridRow() {
		var input = $("#Track");

		var row = input.closest("tr");
		var grid = input.closest("[data-role=grid]").data("kendoGrid");
		var dataItem = <any>grid.dataItem(row);

		return { eventId: dataItem.Track.EventId }
	}
} 