interface GridActionParams {
    gridId: string;
	actionCssClass: string;
    baseUrl: string;
    hlcUrl: string;
} 

module Gartner {
	
	export class GridAction {
        private hlcUrl: string;
		private baseUrl: string;
        private gridId: string;
		
		onReady(json: GridActionParams) {
			this.baseUrl = json.baseUrl;
            this.hlcUrl = json.hlcUrl;
            this.gridId = json.gridId;

			this.setupActionEvent(json.actionCssClass);
		}		

		setupActionEvent(actionCssClass: string) {
			var selectorWithinGrid = "#{0} .{1}"
				.replace("{0}", this.gridId)
				.replace("{1}", actionCssClass);

			$("body").on("click", selectorWithinGrid, this.onAction);
		}

		onAction = (event: JQueryEventObject) => {
			event.preventDefault();
			var clickedAction = $(event.target);

            this.cleanUpStaleErrorMessages();
			this.showLoadingIndicatorInGrid(false);
			this.showLoadingIndicatorInGrid();

            var options: JQueryAjaxSettings;
            var itemId = clickedAction.attr("data-id");
            if (itemId) {
                options = {
                    url: this.baseUrl + "/" + clickedAction.attr("data-id"),
                    type: "POST",
                    success: (response) => {
                        if (response.exceptionMessage) {
                            this.showSpecificError(response);
                        } else {
                            setTimeout(() => {
                                $("#" + this.gridId).data("kendoGrid").dataSource.read();
                            }, 10);
                            if (response.successMessage) {
                                this.showOptionalSuccessMessage(response);
                            }
                        }
                    },
                    error: () => {
                        this.showGeneralError();
                    },
                    complete: () => {
                        this.showLoadingIndicatorInGrid(false);
                    }
                };
            } else {
                itemId = clickedAction.attr("data-hlc-id");
                if (itemId) {
                    options = {
                        url: this.hlcUrl + '/?componentName=HlcItemStatusDates&operation=Promote&passedInData=ItemId=' + itemId + ',EmployeeId=UseModifiedByUserId,ItemStatusDateTypeId=3',
                        type: 'GET',
                        success: (response) => {
                            if (response.exceptionMessage) {
                                this.showSpecificError(response);
                            } else {
                                setTimeout(() => {
                                    $("#" + this.gridId).data("kendoGrid").dataSource.read();
                                }, 10);
                                if (response.successMessage) {
                                    this.showOptionalSuccessMessage(response);
                                }
                            }
                        },
                    error: () => {
                            this.showGeneralError();
                        },
                    complete: () => {
                            this.showLoadingIndicatorInGrid(false);
                        }
                    };
                }
            } 
			$.ajax(options);
        }

        showOptionalSuccessMessage(response) {
            toastr.clear();
            toastr.success(response.successMessage);
        }

        showSpecificError = (response) => {
            var toastrOptions: ToastrOptions = {
                closeButton: false,
                debug: false,
                newestOnTop: true,
                progressBar: false,
                positionClass: "toast-top-right",
                preventDuplicates: false,
                onclick: null,
                showDuration: 300,
                hideDuration: 300,
                timeOut: 0,
                extendedTimeOut: 0,
                showEasing: "swing",
                hideEasing: "linear",
                showMethod: "fadeIn",
                hideMethod: "fadeOut"
            };

            toastr.error(response.exceptionMessage, response.errorSource + " Failed", toastrOptions);
            this.showLoadingIndicatorInGrid(false);
        }

        cleanUpStaleErrorMessages() {
            toastr.clear();
        }

        showGeneralError = () => {
            this.cleanUpStaleErrorMessages();

            toastr.error("Something went wrong", "Oops!");
            this.showLoadingIndicatorInGrid(false);
        }

		showLoadingIndicatorInGrid(show: boolean = true) {
			var kendoGrid = $("#" + this.gridId);
			kendo.ui.progress(kendoGrid, show);
        }

	}

}