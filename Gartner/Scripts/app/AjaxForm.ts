interface JQuery {
	modal(action: string): JQuery;
}

module Gartner {

	export class AjaxForm {

		private form: JQuery;

		onReady(json: { formId: string }) {
			this.form = $("#" + json.formId);
			this.form.on("submit", this.formSubmit);
		}

		formSubmit = (event: JQueryEventObject) => {
			event.preventDefault();

			this.cleanUpStaleErrorMessages();
            this.setFormEnabled(false);

			var options: JQueryAjaxSettings = {
                url: this.form.attr("action"),
                data: this.form.serialize(),
                type: this.form.attr("method") || "POST",
                cache: false,
                success: (response) => {
                    if (response.exceptionMessage) {
                        this.showSpecificError(response);
                    } else {
						this.showOptionalSuccessMessage();
                        this.updateOtherSections();
						this.closeModal();
                    }
                },
                error: () => {
                    this.showGeneralError();
                },
				complete: () => {
                    this.setFormEnabled(true);
				}
            };

            $.ajax(options);
		}

		setFormEnabled(enabled: boolean) {
            var buttons = this.form.find("button, input[type='submit']");
            for (var i = 0; i < buttons.length; i++) {
                if (enabled) {
					$(buttons[i]).removeAttr("disabled");
                } else {
                    $(buttons[i]).attr("disabled", "disabled");
                }
            }
        }

		updateOtherSections = () => {
			var sectionIds: Array<string> = (this.form.attr("data-update-other-sections") || "").split(",");

            var ajaxPanels: Array<AjaxPanel> = Gartner.allInstancesOfUniqueIds(sectionIds, "AjaxPanel");
            ajaxPanels.forEach((ajaxPanel) => ajaxPanel.refresh());
		}

		closeModal = () => {
			var modal = this.form.parents(".modal");
			if (modal.length > 0) {
				$(modal[0]).modal("hide");
			}
		}

		showGeneralError = () => {
            this.cleanUpStaleErrorMessages();

            toastr.error("Something went wrong", "Oops!");
        }

		cleanUpStaleErrorMessages() {
            toastr.clear();
        }

		showOptionalSuccessMessage() {
			if (this.form && this.form.attr("data-success-message")) {
				toastr.clear();
				toastr.success(this.form.attr("data-success-message"));
			}
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
        }

	}

} 