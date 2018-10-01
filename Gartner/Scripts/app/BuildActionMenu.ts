module Gartner {
	export function buildActionMenu(event) {

		$(".actionMenuTemplateCell").each((i, cell) => {
			eval($(cell).children("script").last().html());
		});

		var rows = event.sender.tbody.children();
		for (var j = 0; j < rows.length; j++) {
			var row = $(rows[j]);
			var dataItem = event.sender.dataItem(row);
			var isDeclined = dataItem.get("IsDeclined");
			if (isDeclined) {
				var cell = row.children().eq(35);
			    cell.children().hide();
			}
		}
	}
} 
