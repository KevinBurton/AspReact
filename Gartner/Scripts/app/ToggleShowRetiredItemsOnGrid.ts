module Gartner {

	export class ToggleShowRetiredItemsOnGrid {

		private gridSelector: string;
        private toggleCheckBoxSelector: string;
        private firstLoad: boolean;
        private gridDataSource: kendo.data.DataSource;
        private showRetiredFilter = { field: "ShowRetired", operator: "eq", value: true };

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
        }

        getCurrentFilters = () => {
            if (this.gridDataSource.filter() == null) {
                return null;
            } else {
                return this.gridDataSource.filter().filters;
            }
        }
        
        toggleDeclined = () => {
            var currFilters = this.getCurrentFilters();
            if ($(this.toggleCheckBoxSelector).is(':checked')) {
                if (currFilters != null) {
                    currFilters.push(this.showRetiredFilter);
                } else {
                    currFilters = [this.showRetiredFilter];
                }
            } else {
                if (currFilters != null) {
                    var filterIndex = currFilters.indexOf(this.showRetiredFilter);
                    if (filterIndex !== -1) {
                        currFilters.splice(filterIndex, 1);
                    }
                }
            }
            this.gridDataSource.filter(currFilters);
        }
	}
}