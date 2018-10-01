module Gartner {
	
	export class DemotePrompt {
		private formId: string;

		onReady = () => {
			EventUtilities.addHandlerToBody('click', '.toggle-demote-modal', this.demoteRequested);
			EventUtilities.addHandlerToBody('click', '#demote-modal-submit-button', this.demote);
		};

		demoteRequested = (event: JQueryEventObject) => {
			event.preventDefault();
			const buttonClicked = $(event.target);
			this.formId = buttonClicked.attr('data-form-id');
		}

		demote = (event: JQueryEventObject) => {
			event.preventDefault();
			$(`#${this.formId}`).submit();
		}
	}
}
