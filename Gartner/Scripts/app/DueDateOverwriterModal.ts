/// <reference path="../typings/kendo-ui/kendo-ui.d.ts" />

interface DueDateOverwriterModalParams {
	editButtonId: string;
	itemStatus: number;
	title: string;
	currentValue: string;

}

interface JQuery {
	kendoDatePicker(options: any): JQuery;
}

module Gartner {
	export class DueDateOverwriterModal {

		private currentValue: string;
		private title: string;
		private itemStatus: number;

		onReady(JSON: DueDateOverwriterModalParams) {
			if (JSON.editButtonId) {
				$("#" + JSON.editButtonId).on("click", this.populateFields);
			}
					
			this.currentValue = JSON.currentValue;
			this.title = JSON.title;
			this.itemStatus = JSON.itemStatus;
		}

		populateFields = () => {
			$("#planned-date").kendoDatePicker({
				format: "dd MMMM yyyy",
				parseFormats: ["MMMM yyyy"],
				value: this.currentValue
			});

			$("#plannedDateLabel").text("Edit " + this.title + " Planned Date");
			$("#plannedItemStatus").attr("value", this.itemStatus.toString());
		}
	}
}