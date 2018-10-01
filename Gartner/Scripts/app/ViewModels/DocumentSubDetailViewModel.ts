/// <reference path="../utilities/eventutilities.ts" />
/// <reference path="../utilities/errorutilities.ts" />
/// <reference path="../interfaces/IDocumentSubDetail.ts" />

module Gartner {

	export class DocumentSubDetailViewModel {
		private itemId: number;
		private modalSelector = "#editAgendaDetails-modal";

		private shown = ko.observable<boolean>(false);
		private showCloseWarning = ko.observable<boolean>(false);
		private showTabWarning = ko.observable<boolean>(false);

		private currentTabHref = ko.observable<string>("#agendaTab");
		private newTabHref = ko.observable<string>("");

		onReady(json: { itemId: number; sectionsToUpdateOnSave: Array<string> }) {
			this.itemId = json.itemId;

			//$(".editDocumentDetail")
			//	.click(() => {
			//		this.showModal();
			//	});
			EventUtilities.addHandlerToBody("click", ".editDocumentDetail", this.showModal);

			ko.applyBindings(this, $(this.modalSelector)[0]);
		}


		showModal = (event?: JQueryEventObject) => {
			if (event) {
				event.preventDefault();
			}

			this.shown(true);
			$(this.modalSelector).modal("show");

		}

		cancel = () => {
			this.shown(false);
			this.showCloseWarning(false);
			this.showTabWarning(false);
			$(this.modalSelector).modal("hide");
		}

        tabClicked = (tab: string) => {
			this.newTabHref(tab);

			if (this.currentTabHref() === tab) {
				this.alertNoClicked();
				return false;
			}
			if (tab === "#contentTypeTab") {
				$('edit-content-types').trigger('reloadContentTypeInformation');
			}
			this.showTabWarning(true);
			this.showCloseWarning(false);
			return false;
		}

        closeModalButtonClicked = () => {
			this.showCloseWarning(true);
			this.showTabWarning(false);
			return false;
		}

        alertNoClicked = () => {
			var currentTabId = this.currentTabHref() + "Pill";
			var newTabId = this.newTabHref() + "Pill";
			$(currentTabId).addClass("active");
			$(newTabId).removeClass("active");

			this.showCloseWarning(false);
			this.showTabWarning(false);
		}

        alertYesClicked = () => {
			this.currentTabHref(this.newTabHref());
			this.showCloseWarning(false);
			this.showTabWarning(false);
		}
	}
}