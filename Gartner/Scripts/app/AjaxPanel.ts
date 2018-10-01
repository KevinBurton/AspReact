/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/toastr/toastr.d.ts" />

interface AjaxParams {
	containerId: string;
	editButtonId: string;
	displayModeUrl: string;
	editModeUrl?: string;
	cancelButtonId?: string;
	saveButtonId?: string;
	cancelButtonSelector?: string;
	saveButtonSelector?: string;
	doneEditingButtonId?: string;
	refreshReduxAction?: string;
}

module Gartner {
	
    // todo: change for loops to foreach where appropriate
    export class AjaxPanel {

        private containerId: string;
        private displayModeUrl: string;
        private editModeUrl: string;
        private usingDoneEditing = false;
		private inEditMode = false;
        private refreshReduxAction: string;
        private prevLanguage: string;

        onReady(json: AjaxParams) {
            this.containerId = json.containerId;
            this.displayModeUrl = json.displayModeUrl;
			this.editModeUrl = json.editModeUrl;
	        this.refreshReduxAction = json.refreshReduxAction;

            this.setUpEvents(json);
            this.ajaxifyForms();
            this.prevLanguage = 'en';
        }

        setUpEvents(json: AjaxParams) {
            if (json.editButtonId !== undefined) {
                var editButtonSelector = "[id='" + json.editButtonId + "']";
                $("body").on("click", editButtonSelector, this.changeToEditMode);
            }

            if (json.cancelButtonId !== undefined) {
                var cancelButtonSelector = "[id='" + json.cancelButtonId + "']";
                $("body").on("click", cancelButtonSelector, this.onCancelClick);
            }

			if (json.cancelButtonSelector !== undefined) {
                $("body").on("click", json.cancelButtonSelector, this.onCancelClick);
            }

            if (json.saveButtonId !== undefined) {
                var saveButtonSelector = "[id='" + json.saveButtonId + "']";
                $("body").on("click", saveButtonSelector, this.onSaveClick);
            }

			if (json.saveButtonSelector !== undefined) {
                $("body").on("click", json.saveButtonSelector, this.onSaveClick);
            }

            if (json.doneEditingButtonId !== undefined) {
                var doneEditingButtonSelector = "[id='" + json.doneEditingButtonId + "']";
                $("body").on("click", doneEditingButtonSelector, this.onCancelClick);
                this.usingDoneEditing = true;
            }
        }

		refresh() {
            if (this.inEditMode) {
                this.changeToEditMode();
            } else {
                this.changeToDisplayMode();
			}

			if (this.refreshReduxAction) {
				this.dispatchReduxAction(this.refreshReduxAction);
			}
        }

        changeToEditMode = (event?: JQueryEventObject) => {
            if (event) {
                event.preventDefault();
            }

            this.inEditMode = true;
            this.replaceContainerFromUrlGet(this.editModeUrl);
        }

        changeToDisplayMode = (event?: JQueryEventObject) => {
            if (event) {
                event.preventDefault();
            }

            this.inEditMode = false;
            this.replaceContainerFromUrlGet(this.displayModeUrl);
        }

        onSaveClick = (event: JQueryEventObject) => {
            event.preventDefault();

            var form = $("#" + this.containerId).find("form");
            form.attr("disabled", "disabled");

            if (form.length) {
                this.submitForm(form, () => {
	                this.inEditMode = false;
                });
            }

           
        }
        
        onCancelClick = (event?: JQueryEventObject) => {
            if (event) {
                event.preventDefault();
            }

            this.changeToDisplayMode();
            this.cleanUpStaleErrorMessages();
          
        }

        replaceContainerFromUrlGet(url: string) {
            this.showLoading();
            var options: JQueryAjaxSettings = {
                url: url,
                type: "GET",
                cache: false,
                success: (response) => {
                    if (response.exceptionMessage) {
                        this.showSpecificError(response);
                    }
                    else {
                        this.replaceContainerFromResponse(response);
                    }
                },
                error: () => this.showGeneralError()
            };

            $.ajax(options);
        }

        submitForm(form: JQuery, cb?: any) {
            this.showLoading();
            this.toggleFormButtons(form);
            this.cleanUpStaleErrorMessages();

            var options: JQueryAjaxSettings = {
                url: form.attr("action"),
                data: form.serialize(),
                type: form.attr("method") || "POST",
                cache: false,
                success: (response) => {
                    if (response.exceptionMessage) {
                        this.showSpecificError(response, form);
                    } else {
	                    this.showOptionalSuccessMessage(form);
                        this.replaceContainerFromResponse(response, form.attr("data-replace"));
                        this.clearFields(form);
                        this.updateOtherSections(form);
                        this.sendReduxAction(form);
						if (cb) {
							cb();
						}
                    }
                },
                error: () => {
                    this.showGeneralError();
                    this.toggleFormButtons(form, false);
                }
            };

            $.ajax(options);
        }

        toggleFormButtons(form: JQuery, disableFormButtons: boolean = true) {
            var buttons = form.find("button, input[type='submit']");
            for (var i = 0; i < buttons.length; i++) {
                if (disableFormButtons) {
                    $(buttons[i]).attr("disabled", "disabled");
                } else {
                    $(buttons[i]).removeAttr("disabled");
                }
            }
        }

        clearFields(form: JQuery) {
            if (form.attr("data-clear-kendocombobox")) {
                $("#" + form.attr("data-clear-kendocombobox")).data("kendoComboBox").text("");
            }

            if (form.attr("data-clear-element")) {
                $("#" + form.attr("data-clear-element")).val("");
            }
        }

        updateOtherSections(form: JQuery) {
            var sectionIds: Array<string> = (form.attr("data-update-other-sections") || "").split(",");

            var ajaxPanels: Array<AjaxPanel> = Gartner.allInstancesOfUniqueIds(sectionIds, "AjaxPanel");
            ajaxPanels.forEach((ajaxPanel) => ajaxPanel.refresh());
        }

		sendReduxAction(form: JQuery) {
			const action = form.attr("data-redux-action");

			if (action) {
				this.dispatchReduxAction(action);
			}
		}

		dispatchReduxAction(actionType: string) {
			(window as any).store.dispatch({ type: actionType });
		}

        replaceContainerFromResponse = (response, dataReplaceContainerId?: string) => {
            var toReplace;
            if (dataReplaceContainerId) {
                toReplace = $("#" + dataReplaceContainerId);
                this.showLoading(false);
            } else {
                toReplace = $("#" + this.containerId);
            }

            toReplace.replaceWith(response);
            this.ajaxifyForms();
        }

        showLoading = (show: boolean = true) => {
            var container = $("#" + this.containerId);

            if (show) {
                var position = container.position();

                var top = position.top + (container.height() / 2);
                var left = position.left + (container.width() / 2) - 16; //16 for gif loader size

                var loadingDisplay = $("<span/>")
                    .addClass("panel-loading")
                    .css("top", top + "px")
                    .css("left", left + "px")
                    .fadeIn();

                $("#" + this.containerId).append(loadingDisplay);

	            var largerLoading = container.hasClass("larger-loading");

				var width = container.width();
				var height = container.height();
				if (largerLoading) {
					width += 30;
					height += 30;
				}

                var grayedOut = $("<div>")
                    .addClass("panel-loading-bg")
                    .css("top", position.top + "px")
                    .css("left", position.left + "px")
                    .css("width", width + "px")
                    .css("height", height + "px")
                    .fadeIn();

                $("#" + this.containerId).append(grayedOut);

            } else {
                container.find(".panel-loading").remove();
                container.find(".panel-loading-bg").remove();
            }
        }

        ajaxifyForms() {
            var forms: any = $("#" + this.containerId).find("form");
            for (var i = 0, len = forms.length; i < len; i++) {
                $(forms[i]).off("submit").on("submit", this.onFormSubmit);
            }
        }

        onFormSubmit = (event: JQueryEventObject) => {
            event.preventDefault();

            this.submitForm($(event.target));
        }

        showGeneralError = () => {
            this.cleanUpStaleErrorMessages();

            toastr.error("Something went wrong", "Oops!");
            this.showLoading(false);
        }

        showSpecificError = (response, form?: JQuery) => {
            if (form && form.attr("data-refresh-on-fail")) {
	            this.refresh();
            }

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
            this.showLoading(false);
            if (form) {
                this.toggleFormButtons(form, false);
            }
        }

        cleanUpStaleErrorMessages() {
            toastr.clear();
        }


		showOptionalSuccessMessage(form: JQuery) {
			if (form && form.attr("data-success-message")) {
				toastr.success(form.attr("data-success-message"));
			}	
		}
    }
}