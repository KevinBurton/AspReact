module Gartner {

	export class ToggleShowDeclinedItems {

		private gridSelector: string;
		private toggleCheckBoxSelector: string;
		private firstLoad: boolean;
		private gridDataSource: kendo.data.DataSource;
		private notDeclinedFilter = { field: "IsDeclined", operator: "neq", value: ApprovalAction.Declined };

		onReady = (json: { gridSelector: string, toggleSelector: string }) => {
			this.gridSelector = json.gridSelector;
			this.toggleCheckBoxSelector = json.toggleSelector;
			this.firstLoad = true;

			var getGridInterval = setInterval(() => {
				var grid = $(this.gridSelector).data("kendoGrid");
				if (grid !== undefined && grid != null) {
					this.gridDataSource = grid.dataSource;
					grid.bind("dataBound", () => {
						if (this.firstLoad) {
							this.toggleDeclined();
							this.firstLoad = false;
						}
					});
					clearInterval(getGridInterval);
				}
			}, 100);

			$("body").on("change", this.toggleCheckBoxSelector, this.toggleDeclined);
		};

		toggleDeclined = () => {
			var currFilters = getCurrentFilters(this.gridDataSource);
			if (currFilters != null) {
				var filterIndex = currFilters.indexOf(this.notDeclinedFilter);

				if (filterIndex !== -1) {
					currFilters.splice(filterIndex, 1);
				} else {
					currFilters.push(this.notDeclinedFilter);
				}
			} else {
				currFilters = [this.notDeclinedFilter];
			}
			this.gridDataSource.filter(currFilters);
		};
	}
}