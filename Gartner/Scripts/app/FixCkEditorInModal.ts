module Gartner {
	export class FixCkEditorInModal {
		onReady() {
			$.fn.modal.Constructor.prototype.enforceFocus = function () {
				var $modalElement = this.$element;
				$(document).on('focusin.modal', e => {
					if ($modalElement[0] !== e.target
						&& !$modalElement.has(e.target).length
						&& $(e.target).parentsUntil('*[role="dialog"]').length === 0) {
						$modalElement.focus();
					}
				});
			};

		}
	}
}