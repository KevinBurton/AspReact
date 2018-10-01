module Gartner {

	var saveInProgress = false;
	export function saveGrid(gridName: string) {
		if (!saveInProgress) {

			saveInProgress = true;
			showLoadingIndicatorInGrid(`${gridName}`);
            var dataSource = $(`#${gridName}`).data("kendoGrid").dataSource;
            try {
                setTimeout(() => {
                        dataSource.sync();

                        setTimeout(() => {
								$(`#${gridName}`).data("kendoGrid").dataSource.read();
                                $(`#${gridName}`).data("kendoGrid").refresh();
                                dataSource.fetch(() => {
                                    this.saveInProgress = false;
									showLoadingIndicatorInGrid(`${gridName}`, false);
                                });
                                
                            },
                            2000);
                        saveInProgress = false;
                    },
                    5);
            } catch (exception) {
				showLoadingIndicatorInGrid(`${gridName}`, false);
                this.saveInProgress = false;
            }
		}
	};

	export function getRatingDisplayValue(value) {
		if (value === null || value == undefined || value.Id === null || value.LikeDescription === null) {
			return "<span class='text-muted'>Select...</span><span class='caret'></span>";
		} else {
			return value.LikeDescription;
		}
	}
	export function showLoadingIndicatorInGrid(gridName: string, show: boolean = true) {
		var kendoGrid = $("#" + gridName);
		kendo.ui.progress(kendoGrid, show);
		}
   
}